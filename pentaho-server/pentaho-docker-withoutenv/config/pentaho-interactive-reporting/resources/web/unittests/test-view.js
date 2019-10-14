/*!
 * HITACHI VANTARA PROPRIETARY AND CONFIDENTIAL
 *
 * Copyright 2002 - 2018 Hitachi Vantara. All rights reserved.
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

/*
    This is the test view class
*/

pentaho.pir.view = function() {
    this.reportContent = null;
    this.lastMessageBoxTitle = null;
    this.lastMessageBoxComment = null;
    this.lastReportContent = null;
    this.pageNumberControl = {
        reset : function() {},
        setPageCount : function() {}
    };
}

pentaho.pir.view.prototype.initControlPanel = function() {
}

pentaho.pir.view.prototype.enableAdminOptions = function() {
}

pentaho.pir.view.prototype.init = function() {
}

pentaho.pir.view.prototype.updateTemplateCtrl = function( templates ) {
}

pentaho.pir.view.prototype.showSelectModel = function() {
}

pentaho.pir.view.prototype.updateFromState = function() {
}

pentaho.pir.view.prototype.setModelList = function(list) {
}

pentaho.pir.view.prototype.showModelElements = function(elements) {
}

pentaho.pir.view.prototype.setReportContent = function(content) {
    this.reportContent = content;
}

pentaho.pir.view.prototype.setReportError = function(content) {
    alert('Error\n\n'+content);
}

pentaho.pir.view.prototype.addBusy = function() {
}

pentaho.pir.view.prototype.removeBusy = function() {
}

pentaho.pir.view.prototype.showGlassPane = function() {
}

pentaho.pir.view.prototype.hideGlassPane = function() {
}

pentaho.pir.view.prototype.updatePageFormatCtrl = function() {
}

pentaho.pir.view.prototype.getLocaleString = function(id) {
    return "string "+id;
}

pentaho.pir.view.prototype.showMessageBox = function(comment, title, p1, p2, p3, p4) {
    this.lastMessageBoxTitle = title;
    this.lastMessageBoxComment = comment;
//    alert(comment);
}

pentaho.pir.view.prototype.setReportContent = function(content) {
    this.lastReportContent = content;
}

pentaho.pir.view.prototype.rgb = function(r,g,b) {

    var hex = '#';
    var c1 = r.toString(16);
    var c2 = g.toString(16);
    var c3 = b.toString(16);
    hex += c1.length<2 ? '0'+c1 : c1;
    hex += c2.length<2 ? '0'+c2 : c2;
    hex += c3.length<2 ? '0'+c3 : c3;
    return hex;
}

pentaho.pir.view.prototype.modelSelectDialog = {
    hide: function() {}
}

pentaho.pir.view.prototype.getUrlParameters = function() {
    return this.urlParameters || {};
}

pentaho.pir.view.prototype.promptPanel = {
    paramDefn: {},
    getParameterValues: function() { return {}; }
}

pentaho.pir.view.prototype.refreshParameterPanel = function() {
    // Skip refreshing the parameter panel and just refresh the controller. This is what happens when the parameters are valid.
    controller.refresh();
}

pentaho.pir.view.prototype.isShowTemplatePickerOpen = function() {
}

pentaho.pir.view.prototype.showTemplatePicker = function() {
}

require(['common-ui/prompting/WidgetBuilder'], function(WidgetBuilder) {
    // Dummy WidgetBuilder for pentaho.pir.controller
    WidgetBuilder = {
        mapping: {}
    }
});

// Mock Text Formatter
var jsTextFormatter = {
    createFormatter: function() {}
}

pentaho.pir.view.prototype.prepareAdvancedFilters = function() {
}

pentaho.pir.view.prototype.showAll = function() {
}

pentaho.pir.view.prototype.addFilterToRoot = function() {
}
