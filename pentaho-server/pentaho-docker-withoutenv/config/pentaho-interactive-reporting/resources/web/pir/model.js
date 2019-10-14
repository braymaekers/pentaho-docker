/*!
 * HITACHI VANTARA PROPRIETARY AND CONFIDENTIAL
 *
 * Copyright 2002 - 2017 Hitachi Vantara. All rights reserved.
 *
 * NOTICE: All information including source code contained herein is, and
 * remains the sole property of Hitachi Vantara and its licensors. The intellectual
 * and technical concepts contained herein are proprietary and confidential
 * to, and are trade secrets of Hitachi Vantara and may be covered by U.S. and foreign
 * patents, or patents in process, and are protected by trade secret and
 * copyright laws. The receipt or possession of this source code and/or related
 * information does not convey or imply any rights to reproduce, disclose or
 * distribute its contents, or to manufacture, use, or sell anything that it
 * may describe, in whole or in part. Any reproduction, modification, distribution,
 * or public display of this information without the express written authorization
 * from Hitachi Vantara is strictly prohibited and in violation of applicable laws and
 * international treaties. Access to the source code contained herein is strictly
 * prohibited to anyone except those individuals and entities who have executed
 * confidentiality and non-disclosure agreements or other agreements with Hitachi Vantara,
 * explicitly covering such access.
 */

define(["dojo/_base/declare", "dojo/on", "dojo/query", "dojo/_base/lang", "dojo/_base/array", "dojo/string", "pentaho/common/Messages"],
    function(declare, on, query, lang, array, string, messages){


/*
    This is the base model class
*/
pentaho.pir.model = function() {
    this.defaultReportTitle  = "My Report Title";
    this.defaultReportFooter = "My Report Footer";
    this.defaultTopLeftHeader = "Top Left";
    this.defaultTopRightHeader = "Top Right";
    this.defaultBottomLeftFooter = "Bottom Left";
    this.defaultBottomRightFooter = "Bottom Right";
    this.defaultGroupTotalsLabel = "Summary";
    this.itemFunctionClassnameBase = "org.pentaho.reporting.engine.classic.core.function.";
    this.itemAvgFunctionName = "ItemAvgFunction";
    this.itemCountFunctionName = "ItemCountFunction";
    this.itemCountDistinctFunctionName = "CountDistinctFunction";
    this.itemMinFunctionName = "ItemMinFunction";
    this.itemMaxFunctionName = "ItemMaxFunction";
    this.itemSumFunctionName = "ItemSumFunction";
    this.defaultDataSourceName = "default";
}

pentaho.pir.model.prototype.init = function() {
    this.report = this.createReport();
}

pentaho.pir.model.prototype.createReport = function() {

    var report = {
        "class":"com.pentaho.iadhoc.model.ThinSpecification",
        "marginTop":-1,
        "marginRight":-1,
        "marginBottom":-1,
        "marginLeft":-1,
        "columnFooter":null,
        "columnHeader":null,
        "dataSources":[],
        "queryTimeout":0,
        "queryLimit":0,
        "fields":[],
		"filters":[],
        "groups":[],
		"parameters":[],
        "groupSorts":[],
        "fieldSorts":[],
        "reportFooters":[],
        "reportTitles":[this.createLabel(this.defaultReportTitle)],
        "sourceReport":null,
        "templateName":"",
		"pageFormat":null,
		"orientation":-1,
        "watermark":null,
        "pageHeaders":[],
        "pageFooters":[],
        "disableDistinct":false,
        "version": 2
    };
    
    return report;    
}

pentaho.pir.model.prototype.createPmdDataSource = function(name, domain, model, xmi, queryString) {
    return {
        "class": "com.pentaho.iadhoc.model.ThinPmdDataSource",
        "name": name,
        "domainId": domain,
        "modelId": model,
        "xmi": xmi,
        "query": queryString,
        "queryless": false
    }
}

/**
 * Necessary to convert arrays coming from GWT objects so json.stringify will serialize them properly.
 */
pentaho.pir.model.prototype.convertGwtArray = function(arry) {
    // dojo.isArray(array) returns false for arrays returned by the GWT-based Filter Dialog
    if ($.isArray(arry)) {
        var arr = [];
        array.forEach(arry, function (v) {
           arr.push(this.convertGwtArray(v)); 
        }, this);
        return arr;
    } else {
        return arry;
    }
}


pentaho.pir.model.prototype.ILLEGAL_PARAMETER_NAMES = ["jsset", "command", "model", "solution", "path", "file", "replace", "filepath"];
pentaho.pir.model.prototype.getUniqueParameterName = function(report, name) {
    var idx = array.indexOf(this.ILLEGAL_PARAMETER_NAMES, name);

    var findNext = function(report, name, startIdx) {
        if (startIdx == 1) {
            // Skip over 1 so we don't end up with names like "parameter1"
            return findNext(report, name, startIdx + 1);
        }
        var suffix = startIdx > 0 ? startIdx : ''; // no suffix when we're starting
        var newName = name + suffix;
        array.some(report.parameters, function(param) {
            if (param.name === newName) {
                // This name is taken, try the next.
                newName = findNext(report, name, startIdx + 1);
                return true; // break
    }
        });
        return newName;
    }

    // Start at 2 if our name is an illegal one, otherwise start looking for other parameters with the requested name
    return findNext(report, name, idx > -1 ? 2 : 0);
}

pentaho.pir.model.prototype.createParameter = function(columnId, valueType, name) {
    var uniqueName = model.getUniqueParameterName(model.report, name);
    return {
        "class":"com.pentaho.iadhoc.model.ThinListParameter",
        "columnId": columnId,
        "name": uniqueName,
        "label": uniqueName,
        "defaultValue": null,
        "valueType": valueType,
        "type": "dropdown",
        "multiSelect": false,
        "strict": true,
        "autoFillSelection": true,
        // Datasource properties
        "keyColumn": columnId,
        "textColumn": columnId,
        "query": undefined,
        "attributes": {
            "validx": "0",
            "lblidx": "0",
            "jsMql": undefined
        }

    }
}

pentaho.pir.model.prototype.createSimpleParameter = function(columnId, filter, valueType) {
    var uniqueName = model.getUniqueParameterName(model.report, string.trim(filter.title));

    return {
        "class":"com.pentaho.iadhoc.model.ThinParameter",
        "columnId": columnId,
        "name": uniqueName, // use the title instead of the name so users can reference it in their report with $(name)
        "label": filter.showTitle ? uniqueName : "",
        "defaultValue": filter.defaultValue.length == 0 ? null : this.convertGwtArray(filter.defaultValue),
        "valueType": valueType,
        "type": this.convertFilterTypeToReportingParameterType(filter.type),
        "dataFormat": filter.dateFormat
    }
}

pentaho.pir.model.prototype.filterTypeToReportingPromptType = {
    'select': 'dropdown',
    'selectMultiComponent': 'list',
    'radioComponent': 'radio',
    'checkComponent': 'checkbox',
    'multiButtonComponent': 'togglebutton',
    'textInputComponent': 'textbox',
    'dateInputComponent': 'datepicker'
}
pentaho.pir.model.prototype.convertFilterTypeToReportingParameterType = function(type) {
    var reportingType = this.filterTypeToReportingPromptType[type];
    if (reportingType == 'undefined') {
        reportingType = 'textbox'; // default type
        if (console) {
            console.log('unknown filter type: ' + type + '. Defaulting to ' + reportingType);
        }
    }
    return reportingType;
}

pentaho.pir.model.prototype.createStaticDataSource = function(name, values, columnNames) {
    if (columnNames == undefined) {
        columnNames = ['Key', 'Value'];
    }
    return {
        'class': 'com.pentaho.iadhoc.model.ThinStaticDataSource',
        'name': name,
        'values': this.convertGwtArray(values),
        'columnNames': this.convertGwtArray(columnNames)
    }
}

pentaho.pir.model.prototype.createSort = function( ) {
    var sort = {
        "class":"com.pentaho.iadhoc.model.ThinSorts",
        "field":null,
        "direction":null
    };
    return sort;
}

pentaho.pir.model.prototype.createLabel = function( text ) {
    var label = {
        "class":"com.pentaho.iadhoc.model.ThinLabel",
        "format":null,
        "value":text
    }
    return label;
}

pentaho.pir.model.prototype.createFormat = function() {

    var format = {
    "backgroundColorStr":null,
    "class":"com.pentaho.iadhoc.model.ThinFormat",
    "fontBold":null,
    "fontColorStr":null,
    "fontItalic":null,
    "fontName":null,
    "fontSize":null,
    "fontStrikethrough":null,
    "fontUnderline":null,
    "horizontalAlignmentName":null,
    "verticalAlignmentName":null
    };
    return format;
}

pentaho.pir.model.prototype.cloneFormat = function(orig) {

    var format = this.createFormat();
    format.backgroundColorStr = orig.backgroundColorStr;
    format.fontBold = orig.fontBold;
    format.fontColorStr = orig.fontColorStr;
    format.fontItalic = orig.fontItalic;
    format.fontName = orig.fontName;
    format.fontSize = orig.fontSize;
    format.fontStrikethrough = orig.fontStrikethrough;
    format.fontUnderline = orig.fontUnderline;
    format.horizontalAlignmentName = orig.horizontalAlignmentName;
    format.verticalAlignmentName = orig.verticalAlignmentName;    
    return format;
}

pentaho.pir.model.prototype.createField = function( fieldName, fieldDisplayName ) {

    var field = {       
        "class":"com.pentaho.iadhoc.model.ThinDetailField",
        "fieldTypeHint":null,
        "itemFormat":this.createFormat(),
        "headerFormat":this.createFormat(),
		"reportSummaryFormat":this.createFormat(),
		"reportSummaryDataFormat":null,
		"reportSummaryLabel":" ",
        "nullString":" ", // Prevent nulls from not properly spanning columns in middle of report
        "displayName":fieldDisplayName,
        "field":fieldName,
        "fieldAggregation":null,
        "aggregationFunctionClassname":null,
        "dataFormat":null,
        "width":null
    }
    return field;
}

pentaho.pir.model.prototype.createGroup = function( fieldName, fieldDisplayName ) {

    var group = {       
        "class":"com.pentaho.iadhoc.model.ThinGroupDefinition",
        "nullString":" ",
        "displayName":fieldDisplayName,
        "field":fieldName,
        "dataFormat":null,
        "headerFormat":this.createFormat(),
        "headerLabel":null,
        "summaryFormats":[],
        "footerFormat":this.createFormat(),
        "groupName": fieldName,
        "groupTotalsLabel": this.defaultGroupTotalsLabel,
        "groupTypeStr" : "RELATIONAL",
        "totalsHorizontalAlignmentStr" : "RIGHT",
        "formattingSetManually" : false
    }
    return group;
}

pentaho.pir.model.prototype.createFilter = function(columnId, defAgg) {
  var filter = {
    "class":"com.pentaho.iadhoc.model.ThinFilter",
    "mqlCondition":null,
    "column":columnId,
    "value":null,
    "combinationType":pentaho.pda.Column.OPERATOR_TYPES.AND,
    "operator":pentaho.pda.Column.CONDITION_TYPES.EQUAL,
    "selectedAggType": defAgg
  }
  return filter;
}

pentaho.pir.model.prototype.createMqlFilter = function(mqlCondition) {
  var filter = {
    "class":"com.pentaho.iadhoc.model.ThinFilter",
    "mqlCondition":mqlCondition,
    "combinationType":pentaho.pda.Column.OPERATOR_TYPES.AND
  }
  return filter;
}

pentaho.pir.model.prototype.createSummaryFormat = function(groupName, fieldName) {
    var summaryFormat = {
        "class":"com.pentaho.iadhoc.model.ThinSummaryFormat",
        "group":groupName,
        "field":fieldName,
        "label":null,
        "dataFormat":null,
        "format":this.createFormat()
    };
    return summaryFormat;
}
      });