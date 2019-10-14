define("pentaho/analyzer/cv_api_report_util",["dojo/_base/lang"],function(e){
return function(t){var r={_BasicOptionType:function(e){
this.type=e,this.validateValue=function(e,r){
r&&typeof r===this.type.toLowerCase()||t.log.error(i._errors.INVALID_OPTION_VALUE_TYPE(e,r,this.type),!0)
}},_StringOptionType:function(){this.base=r._BasicOptionType,this.base("String")
},_BooleanOptionType:function(){
this.type="Boolean",this.validateValue=function(e,r){
"boolean"!=typeof r&&"true"!==r&&"false"!==r&&t.log.error(i._errors.INVALID_OPTION_VALUE_TYPE(e,r,this.type),!0)
}},_DoubleOptionType:function(){
this.type="Double",this.validateValue=function(e,r){
/^\-?(\d+|\d+\.\d*|\.\d+)$/.test(r)||t.log.error(i._errors.INVALID_OPTION_VALUE_TYPE(e,r,this.type),!0)
}},_IntegerOptionType:function(){
this.type="Integer",this.validateValue=function(e,r){
/^\d+$/.test(r)||t.log.error(i._errors.INVALID_OPTION_VALUE_TYPE(e,r,this.type),!0)
}},_HexOptionType:function(){this.type="Hex",this.validateValue=function(e,r){
/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(r)||t.log.error(i._errors.INVALID_OPTION_VALUE_TYPE(e,r,this.type),!0)
}},_ArrayOptionType:function(){
this.type="Array",this.validateValue=function(e,r){
Array.isArray||(Array.isArray=function(e){
return"[object Array]"===Object.prototype.toString.call(e)
}),Array.isArray(r)||t.log.error(i._errors.INVALID_OPTION_VALUE_TYPE(e,r,this.type),!0)
}},_FunctionOptionType:function(){
this.type="Function",this.validateValue=function(r,n){
e.isFunction(n)||t.log.error(i._errors.INVALID_OPTION_VALUE_TYPE(r,n,this.type),!0)
}},_BasicOption:function(e){
this.name=e.name,this.type=e.type,this.expectedValues=e.expectedValues,
this.postValidateAction=e.postValidateAction,
this.validateValue=void 0!==e.validateValue?e.validateValue:function(e){
return this.expectedValues&&-1==this.expectedValues.indexOf(e)?t.log.error(i._errors.INVALID_OPTION_VALUE(this.name,e,this.expectedValues),!0):!this.expectedValues&&this.type&&this.type.validateValue(this.name,e),
this.postValidateAction?this.postValidateAction(e):e}},_FieldOption:function(e){
this.base=r._BasicOption,
this.base(e),this.appliedTo=e.appliedTo,this.getFieldOptionHandler=void 0!==e.getFieldOptionHandler?e.getFieldOptionHandler:function(e,r,n){
var o=null,a=e.getNode(r)
;return a?o=a.getAttribute(this.name):t.log.warn(i._errors.NODE_NOT_FOUND(n)),o
},
this.setFieldOptionHandler=void 0!==e.setFieldOptionHandler?e.setFieldOptionHandler:function(e,r,n,o){
var a=e.getNode(r)
;a?a.setAttribute(this.name,o):t.log.warn(i._errors.NODE_NOT_FOUND(n))}},
_FormatFieldOption:function(e){
e.appliedTo="measure",e.setFieldOptionHandler=function(e,r,n,o){
var a=e.getNode(r);if(a){var s={};s[this.name]=o,e.setNumberFormat(a,s)
}else t.log.warn(i._errors.NODE_NOT_FOUND(n))
},this.base=r._FieldOption,this.base(e)},_MeasureBooleanFieldOption:function(e){
e.type=new r._BooleanOptionType,
e.appliedTo="measure",this.base=r._FieldOption,this.base(e)},
_ReportOption:function(e){
e.type||(e.type=new r._BooleanOptionType),this.base=r._BasicOption,this.base(e),
this.getReportOptionHandler=void 0!==e.getReportOptionHandler?e.getReportOptionHandler:function(e){
return e.reportDoc.getReportOption(this.name)
},this.setReportOptionHandler=void 0!==e.setReportOptionHandler?e.setReportOptionHandler:function(e,t){
e.reportDoc.setReportOption(this.name,t)}},_ChartOption:function(e){
this.base=r._BasicOption,
this.base(e),this.getChartOptionHandler=void 0!==e.getChartOptionHandler?e.getChartOptionHandler:function(e){
return e.reportDoc.getChartOption(this.name)
},this.setChartOptionHandler=void 0!==e.setChartOptionHandler?e.setChartOptionHandler:function(e,t){
e.reportDoc.setChartOption(this.name,t)}}},i={_errors:{
INVALID_OPTION_NAME:function(e,t){
return"Unexpected option '"+e+"'. One of the following are acceptable values: "+t
},INVALID_OPTION_VALUE:function(e,t,r){
return"Unexpected value '"+t+"' for option '"+e+"'. One of the following are acceptable values: "+r
},INVALID_OPTION_VALUE_TYPE:function(e,t,r){
return"Unexpected value '"+t+"' for option '"+e+"'. Must be type "+r},
NODE_NOT_FOUND:function(e){return"Node was not found for formula '"+e+"'."},
WRONG_NESTED_OBJECT:"Nested object must have 'name' property."},_fieldOptions:{
label:new r._FieldOption({name:"label",type:new r._StringOptionType,
setFieldOptionHandler:function(e,r,n,o){var a=e.getNode(r)
;a?e.updateDisplayLabel(a,o):t.log.warn(i._errors.NODE_NOT_FOUND(n))}}),
sortOrderEnum:new r._FieldOption({name:"sortOrderEnum",
expectedValues:["NONE","ASC","DESC"]}),
showAggregate:new r._MeasureBooleanFieldOption({name:"showAggregate"}),
showSum:new r._MeasureBooleanFieldOption({name:"showSum"}),
showAverage:new r._MeasureBooleanFieldOption({name:"showAverage"}),
showMin:new r._MeasureBooleanFieldOption({name:"showMin"}),
showMax:new r._MeasureBooleanFieldOption({name:"showMax"}),
formatShortcut:new r._FormatFieldOption({name:"formatShortcut",
expectedValues:["NONE","COLOR_SCALE_G_Y_R","COLOR_SCALE_R_Y_G","COLOR_SCALE_B_Y_R","COLOR_SCALE_R_Y_B","TREND_ARROW_GR","TREND_ARROW_RG","DATA_BAR_RED","DATA_BAR_GREEN","DATA_BAR_BLUE"]
}),formatCategory:new r._FormatFieldOption({name:"formatCategory",
expectedValues:["Default","General Number","Currency ($)","Percentage (%)","Expression"]
}),formatScale:new r._FormatFieldOption({name:"formatScale",
expectedValues:["0","1","2","3","4","5","6","7","8","9","10"]}),
formatExpression:new r._FormatFieldOption({name:"formatExpression",
type:new r._StringOptionType}),currencySymbol:new r._FormatFieldOption({
name:"currencySymbol",type:new r._StringOptionType}),
showSubtotal:new r._FieldOption({name:"showSubtotal",appliedTo:"attribute",
type:new r._BooleanOptionType})},_reportOptions:{
showRowGrandTotal:new r._ReportOption({name:"showRowGrandTotal"}),
showColumnGrandTotal:new r._ReportOption({name:"showColumnGrandTotal"}),
useNonVisualTotals:new r._ReportOption({name:"useNonVisualTotals"}),
showEmptyCells:new r._ReportOption({name:"showEmptyCells"}),
showEmptyEnum:new r._ReportOption({name:"showEmptyEnum",
type:new r._StringOptionType,
expectedValues:["SHOW_MEASURE","SHOW_CALCULATED_MEASURE","SHOW_EMPTY"]}),
showDrillLinks:new r._ReportOption({name:"showDrillLinks"}),
autoRefresh:new r._ReportOption({name:"autoRefresh",
setReportOptionHandler:function(e,t){
(!0===t||"true"===t)!==cv.prefs.autoRefresh&&e.manager.onToggleAutoRefresh()}}),
freezeColumns:new r._ReportOption({name:"freezeColumns"}),
freezeRows:new r._ReportOption({name:"freezeRows"}),
catalog:new r._ReportOption({name:"catalog",type:new r._StringOptionType}),
cube:new r._ReportOption({name:"cube",type:new r._StringOptionType}),
cellLimit:new r._ReportOption({name:"cellLimit",type:new r._IntegerOptionType})
},_chartOptions:{legendPosition:new r._ChartOption({name:"legendPosition",
expectedValues:["TOP","RIGHT","BOTTOM","LEFT"]}),showLegend:new r._ChartOption({
name:"showLegend",type:new r._BooleanOptionType}),autoRange:new r._ChartOption({
name:"autoRange",type:new r._BooleanOptionType}),
valueAxisLowerLimit:new r._ChartOption({name:"valueAxisLowerLimit",
type:new r._DoubleOptionType}),valueAxisUpperLimit:new r._ChartOption({
name:"valueAxisUpperLimit",type:new r._DoubleOptionType}),
displayUnits:new r._ChartOption({name:"displayUnits",
expectedValues:["UNITS_0","UNITS_2","UNITS_3","UNITS_4","UNITS_5","UNITS_6"]}),
autoRangeSecondary:new r._ChartOption({name:"autoRangeSecondary",
type:new r._BooleanOptionType}),
valueAxisLowerLimitSecondary:new r._ChartOption({
name:"valueAxisLowerLimitSecondary",type:new r._DoubleOptionType}),
valueAxisUpperLimitSecondary:new r._ChartOption({
name:"valueAxisUpperLimitSecondary",type:new r._DoubleOptionType}),
displayUnitsSecondary:new r._ChartOption({name:"displayUnitsSecondary",
expectedValues:["UNITS_0","UNITS_2","UNITS_3","UNITS_4","UNITS_5","UNITS_6"]}),
maxValues:new r._ChartOption({name:"maxValues",type:new r._IntegerOptionType,
postValidateAction:function(e){
var r=t.report._getReport()._getVizApplicationSpec().maxValues
;return t.util._findClosestValueFromArray(r,e)}}),
backgroundColor:new r._ChartOption({name:"backgroundColor",
type:new r._HexOptionType}),labelColor:new r._ChartOption({name:"labelColor",
type:new r._HexOptionType}),labelSize:new r._ChartOption({name:"labelSize",
type:new r._IntegerOptionType,postValidateAction:function(e){
return t.util._findClosestValueFromArray([7,8,9,10,11,12,14,16,18,20,24,28,32,36,40],e)
}}),backgroundFill:new r._ChartOption({name:"backgroundFill",
expectedValues:["NONE","SOLID","GRADIENT"]}),
maxChartsPerRow:new r._ChartOption({name:"maxChartsPerRow",
type:new r._IntegerOptionType,postValidateAction:function(e){
return t.util._findClosestValueFromArray([1,2,3,4,5],e)}}),
multiChartRangeScope:new r._ChartOption({name:"multiChartRangeScope",
expectedValues:["GLOBAL","CELL"]}),emptyCellMode:new r._ChartOption({
name:"emptyCellMode",expectedValues:["GAP","ZERO","LINEAR"]}),
sizeByNegativesMode:new r._ChartOption({name:"sizeByNegativesMode",
expectedValues:["NEG_LOWEST","USE_ABS"]}),
backgroundColorEnd:new r._ChartOption({name:"backgroundColorEnd",
type:new r._HexOptionType}),labelStyle:new r._ChartOption({name:"labelStyle",
expectedValues:["PLAIN","BOLD","ITALIC"]}),
legendBackgroundColor:new r._ChartOption({name:"legendBackgroundColor",
type:new r._HexOptionType}),legendSize:new r._ChartOption({name:"legendSize",
type:new r._IntegerOptionType,postValidateAction:function(e){
return t.util._findClosestValueFromArray([7,8,9,10,11,12,14,16,18,20,24,28,32,36,40],e)
}}),legendColor:new r._ChartOption({name:"legendColor",type:new r._HexOptionType
}),legendStyle:new r._ChartOption({name:"legendStyle",
expectedValues:["PLAIN","BOLD","ITALIC"]}),labelFontFamily:new r._ChartOption({
name:"labelFontFamily",type:new r._StringOptionType}),
legendFontFamily:new r._ChartOption({name:"legendFontFamily",
type:new r._StringOptionType})}},n={_getNestedObjectByName:function(e,n){
(new r._StringOptionType).validateValue("name",n);var o=[];for(var a in e){
var s=e[a]
;if(s.name||t.log.error(i._errors.WRONG_NESTED_OBJECT,!0),s.name==n)return s
;o.push(s.name)}t.log.error(i._errors.INVALID_OPTION_NAME(n,o),!0)},
_addHistory:function(e,t){
t.history.add(new cv.ReportState(e)),t.setReportPropsDirty(!0)}}
;this.types=r,this.constants=i,this.utilities=n}
}),define("pentaho/analyzer/cv_api_report",["dojox/collections/Dictionary","dojox/xml/parser","dojo/query","dojo/dom-construct","dojo/_base/event","./cv_api_report_util"],function(e,t,r,i,n,o){
return function(t,a){
this._apiReportUtil=new o(t),this._attachedReport=a,this._query=function(e,t){
return r(e,t)},this._isValidGembarId=function(e){
var r=t.ui.listGembarIds(),i=r.indexOf(e)>-1
;return i||t.log.error(this._errors.INVALID_GEMBARID(e,r),!0),i
},this._isValidGembarType=function(e,t){
var r=!1,i=cv.getFieldHelp(),n="NUMBER"===i.get(t,"type"),o=!n,a=o&&i.hasStartDateTimeKey(t),s=this._getReport(),l=s.vizModelAdapter,u=l.$type.get(e,!0)
;if(null!==u&&l.$type.isVisualRole(u)&&(o&&u.hasAnyCategoricalModes||n&&u.hasAnyModes({
isContinuous:!0,elementDataType:"number"})||a&&u.hasAnyModes({isContinuous:!0,
elementDataType:"date"}))){
r=s.findGemsByGembarId(u.name).length<u.fields.countRangeOn(l,{
ignoreCurrentMode:!0}).max}return r},this._isValidField=function(e,t){
return this._isValidGembarType(e,t)&&this._getReport().validateField(t)&&this._getReport().checkDuplicateGem(t,!0)
},this._insertFieldFromFormula=function(e,r,i,n){
if(!this._isValidField(e,r))return void t.log.error(this._errors.INVALID_FORMULA(e,r))
;var o=this._getReport(),a={formula:r},s=void 0===n?-1:n
;o.insertField(e,i,s,a,!0)},this._isValidVizId=function(e){
if("pivot"===e)return!0;var r=t.ui.listVizIds(),i=r.indexOf(e)>-1
;return i||t.log.error(this._errors.INVALID_VIZ_ID(e,r),!0),i},this._errors={
INVALID_GEMBARID:function(e,t){
return"'"+e+"' is an invalid gembarId. Valid values for current visualization are "+t
},
INVALID_GEMBAR_ORDINAL:"Gembar Ordinal must be a number and greater than or equal to -1",
NO_REPORT_SET:"There is no valid report set to the report editor",
INVALID_FORMULAS_TYPE_ARRAY:"'formulas' must be an Array. e.g. ['[TYPE].[VALUE1]', '[TYPE].[VALUE2]']",
INVALID_FORMULA:function(e,t){
return"'"+t+"' is an invalid formula for gembar '"+e+"'"},
INVALID_VIZ_ID:function(e,t){
return"'"+e+"' is not a registered visualization id. Valid values for are "+t},
INVALID_CATALOG_OR_CUBE:function(e,t){
return"Catalog: '"+e+"' or Cube: '"+t+"' is invalid."},
INVALID_FIELD:function(e){return"'"+e+"' is an invalid formula."},
EMPTY_CELLS_FOR_LINK:function(e){
return"The cells are not present in the page to have the field link set on them for formula '"+e+"'."
},
INVALID_VIZ_FOR_SETTING_LINK:"The API 'setFieldLink' is available for only 'pivot' vizualization.",
INVALID_OPER_REPORT_ATTACHED:"The API object is already attached to another report instance.",
DEPRECATED_SHOW_EMPTY:"'showEmptyCells' report option is being deprecated for 'showEmptyEnum'. Please refer to Analyzer's API documentation for further explanation."
},this._attachReport=function(e){if(this._attachedReport){
if(this._attachedReport!==e)throw new Error(this._errors.INVALID_OPER_REPORT_ATTACHED)
}else this._attachedReport=e},this._getReport=function(){
var e=this._attachedReport
;return void 0===e&&(e="undefined"==typeof cv?e:cv.getActiveReport()),
e||t.log.warn(this._errors.NO_REPORT_SET),e
},this._validateParamsForSetFieldLink=function(e,r,i){var n=!0
;return(new this._apiReportUtil.types._StringOptionType).validateValue("formula",e),
i.validateField(e)||t.log.error(this._errors.INVALID_FIELD(e),!0),
(new this._apiReportUtil.types._FunctionOptionType).validateValue("callback",r),
"pivot"!==this.getVizId()&&(t.log.warn(this._errors.INVALID_VIZ_FOR_SETTING_LINK),
n=!1),n},this.getLayoutFields=function(e){var t=[],r=this._getReport()
;if(r&&this._isValidGembarId(e)){r.findGemsByGembarId(e).forEach(function(e){
t.push(e.getFormula())})}return t},this.setLayoutFields=function(e,t){
var r=this._getReport();if(r&&this._isValidGembarId(e)){
if((new this._apiReportUtil.types._ArrayOptionType).validateValue("formulas",t),
t.length>0){var i=r.findGemsByGembarId(e);i.forEach(function(e){
r.removeGem(e,!0,null,!0)},this)
;for(var n=0;n<t.length;++n)this._insertFieldFromFormula(e,t[n],0,-1)
;r.findGemsByGembarId(e).length<=0&&i.forEach(function(t){
this._insertFieldFromFormula(e,t.getFormula(),0,-1)},this)}}
},this.addLayoutField=function(e,r,i){var n=this._getReport()
;if(n&&this._isValidGembarId(e)){var o=n.findGemsByGembarId(e)
;"number"!=typeof i||i<-1?t.log.error(this._errors.INVALID_GEMBAR_ORDINAL,!0):(-1===i||i>o.length)&&(i=o.length)
;for(var a=-1,s=0;s<o.length;s++){o[s].getFormula()===r&&(a=s)}
this._insertFieldFromFormula(e,r,i,a)}},this.removeLayoutField=function(e,t){
var r=this._getReport();if(r&&this._isValidGembarId(e)){
r.findGemsByGembarId(e).forEach(function(e){
e.getFormula()===t&&r.removeGem(e,!0,null,!0)})}},this.getName=function(){
var e=null,t=this._getReport()
;return t&&t.reportDoc&&(e=t.reportDoc.getReportProperty("name")),e
},this.getPath=function(){var e=null,t=this._getReport()
;return t&&t.reportDoc&&(e=t.reportDoc.getReportProperty("folder")),e
},this.getNumericFilters=function(){var e={filters:{}},t=this._getReport()
;if(!t)return e;var r=t.reportDoc;if(!r)return e;var i=r.getMetricFilter()
;if(i&&i.conditions&&i.formula){var n=i.formula;if(e.filters[n]=[],i.rank){
var o={}
;o.count=i.rank.count,o.formula=i.rank.formula,o.operator=i.rank.type,e.filters[n].push(o)
}for(var a=0;a<i.conditions.length;a++){var o={},s=i.conditions[a]
;o.operator=s.operator,
o.formula=s.formula,o.op1=s.op1,o.op2=s.op2,e.filters[n].push(o)}}return e
},this.setNumericFilters=function(e,t){var r=this._getReport();if(r){
var i=r.reportDoc;if(i){
(new this._apiReportUtil.types._StringOptionType).validateValue("level",e)
;(new this._apiReportUtil.types._ArrayOptionType).validateValue("filterItems",t)
;var n={type:"FILTER_METRIC"};n.conditions=[],n.formula=e
;for(var o=0;o<t.length;o++){var a=t[o],s=a.operator
;if("TOP"==s||"BOTTOM"==s||"TOP_BOTTOM"==s)n.rank={},
n.rank.type=s,n.rank.formula=a.formula,n.rank.count=a.count;else{var l={}
;l.formula=a.formula,
l.op1=a.op1,l.op2=a.op2,l.operator=a.operator,n.conditions.push(l)}}
var u=i.getMetricFilter()
;n.old=u?u.formula:e,i.updateFilter(n),r.populateFilters(),
this._apiReportUtil.utilities._addHistory("API numeric filter on "+e,r)}}
},this.getSelectionFilters=function(){var e={selectionFilters:[]
},t=this._getReport();if(!t)return e;var r=t.reportDoc;if(!r)return e
;for(var i=r.getSelectionFilters(),n=[],o=0;o<i.length;o++){
var a=r.getSelectionFilterProps(i[o]);n.push(a)}for(var o=0;o<n.length;o++){
var s=n[o].op,l=[],u=n[o].members;if(u){for(var p=0;p<u.length;p++){var d={
formula:u[p].formula,member:u[p].member};l.push(d)}var a={operator:s,members:l}
;e.selectionFilters.push(a)}}return e},this.addSelectionFilter=function(e){
var t=this._getReport();if(t){var r=t.reportDoc;if(r){for(var i={op:e.operator,
members:[]},n="",o=0;o<e.members.length;o++){var a=e.members[o]
;o<e.members.length-1?n+=a.formula+", ":n+=a.formula;var s={formula:a.formula,
member:a.member};i.members.push(s)}
r.addSelectionFilter(i),this._apiReportUtil.utilities._addHistory(n,t)}}
},this.addSelectionFilters=function(e){var t=this._getReport();if(t){
if(t.reportDoc)for(var r=0;r<e.length;r++)this.addSelectionFilter(e[r])}
},this.removeSelectionFilters=function(e){var t=this._getReport()
;t&&(t.removeSelectionFilters(e),
this._apiReportUtil.utilities._addHistory("API remove selection filters",t))
},this.getFilters=function(){var e={filters:{}},t=this._getReport()
;if(!t)return e;var r=t.reportDoc;if(!r)return e
;for(var i={},n=r.getChildMembers("filters"),o=[],a=0;a<n.length;a++){
var s=r.getFilterProps(n[a]);o.push(s)}for(var a=0;a<o.length;a++){
var l=o[a].formula,u=[]
;if(o[a].predicates)for(var p=o[a].predicates.getValueList(),d=0;d<p.length;d++){
for(var c=0;c<p[d].length;c++){
var h=[],_={},f=p[d][c].op,m=p[d][c].op1,v=p[d][c].op2
;_.operator=f,m&&(_.op1=m),
v&&(_.op2=v),p[d][c].parameterName&&(_.parameterName=p[d][c].parameterName),
h="CONTAIN"==f||"NOT_CONTAIN"==f?p[d][c].exp:p[d][c].members,
_.members=h,u.push(_)}i[l]=u}}return e.filters=i,e
},this.setFilters=function(t,r,i){var n=this._getReport();if(n){
var o=n.reportDoc;if(o){
(new this._apiReportUtil.types._StringOptionType).validateValue("level",t)
;(new this._apiReportUtil.types._ArrayOptionType).validateValue("filterItems",r)
;for(var a={formula:t,predicates:new e},s="",l=0;l<r.length;l++){var u=r[l]
;l<r.length-1?s+=u.parameterName+", ":s+=u.parameterName;var p={op:u.operator,
members:u.members,parameterName:u.parameterName}
;u.op1&&(p.op1=u.op1),u.op2&&(p.op2=u.op2),
"CONTAIN"!=p.op&&"NOT_CONTAIN"!=p.op||(p.exp=u.members,
p.containsRegExp=u.containsRegExp,delete p.members),a.predicates.add(l,[p])}
o.updateFilter(a,i),
n.populateFilters(),this._apiReportUtil.utilities._addHistory(s,n)}}
},this.removeFilters=function(e){var t=this._getReport()
;t&&(t.removeFilter("filter_"+e+"_99",!0),
this._apiReportUtil.utilities._addHistory("API remove filter on "+e,t))
},this.removeNumericFilters=function(){var e=this._getReport()
;e&&(e.removeFilter("filter_metric_0",!0),
this._apiReportUtil.utilities._addHistory("API remove filter",e))
},this.getVizId=function(){var e=this._getReport()
;if(e)return"PIVOT"==e.getReportFormat()?"pivot":e.reportDoc.getChartOption("customChartType")
},this.setVizId=function(e){t.util._validateModeForAPI(arguments.callee)
;var r=this._getReport()
;r&&this._isValidVizId(e)&&("pivot"===e?r._initDisplay("PIVOT"):r._initDisplay("JSON","CUSTOM",e))
},this.getFieldOption=function(e,t){var r=null,i=this._getReport()
;if(!i||!i.reportDoc)return r
;var n=new this._apiReportUtil.types._StringOptionType
;n.validateValue("formula",e),n.validateValue("name",t)
;var o=this._apiReportUtil.utilities._getNestedObjectByName(this._apiReportUtil.constants._fieldOptions,t)
;switch(t){case"label":
r=o.getFieldOptionHandler(i.reportDoc,"cv:report//*[@formula='"+e+"']/cv:displayLabels/cv:displayLabel",e)
;break;case"formatCategory":case"formatScale":case"formatShortcut":
case"currencySymbol":
r=o.getFieldOptionHandler(i.reportDoc,"cv:report//*[@formula='"+e+"']/cv:numberFormat",e)
;break;case"formatExpression":
r=o.getFieldOptionHandler(i.reportDoc,"cv:report//*[@formula='"+e+"']/cv:numberFormat/cv:formatExpression",e)
;break;default:
r=o.getFieldOptionHandler(i.reportDoc,"cv:report//*[@formula='"+e+"']",e)}
return r},this.setFieldOption=function(e,t,r){var i=this._getReport()
;if(i&&i.reportDoc){var n=new this._apiReportUtil.types._StringOptionType
;n.validateValue("formula",e),n.validateValue("name",t)
;var o=this._apiReportUtil.utilities._getNestedObjectByName(this._apiReportUtil.constants._fieldOptions,t),a=o.validateValue(r)
;switch(o.appliedTo){case"measure":
o.setFieldOptionHandler(i.reportDoc,"cv:report/cv:measures/cv:measure[@formula='"+e+"']",e,a)
;break;case"attribute":
o.setFieldOptionHandler(i.reportDoc,"cv:report//cv:attribute[@formula='"+e+"']",e,a)
;break;default:
o.setFieldOptionHandler(i.reportDoc,"cv:report//*[@formula='"+e+"']",e,a)}}
},this.isDirty=function(){var e=this._getReport();if(e)return e.isDirty()
},this.isNew=function(){var e=this._getReport()
;if(e&&e.reportDoc)return e.reportDoc.isNew()},this.getReportOption=function(e){
var t=this._getReport();if(t&&t.reportDoc){
return this._apiReportUtil.utilities._getNestedObjectByName(this._apiReportUtil.constants._reportOptions,e).getReportOptionHandler(t)
}},this.setReportOption=function(e,r){var i=this._getReport()
;if(i&&i.reportDoc){
"showEmptyCells"===e&&(t.log.warn(this._errors.DEPRECATED_SHOW_EMPTY),
e="showEmptyEnum",
r=!0===r||"true"===r.toLowerCase()?"SHOW_EMPTY":"SHOW_MEASURE"),
t.util._validateModeForAPI(arguments.callee)
;var n=this._apiReportUtil.utilities._getNestedObjectByName(this._apiReportUtil.constants._reportOptions,e),o=n.validateValue(r)
;n.setReportOptionHandler(i,o)}},this.getChartOption=function(e){
var t=this._getReport();if(t&&t.reportDoc){
return this._apiReportUtil.utilities._getNestedObjectByName(this._apiReportUtil.constants._chartOptions,e).getChartOptionHandler(t)
}},this.setChartOption=function(e,r){var i=this._getReport();if(i&&i.reportDoc){
t.util._validateModeForAPI(arguments.callee)
;var n=this._apiReportUtil.utilities._getNestedObjectByName(this._apiReportUtil.constants._chartOptions,e),o=n.validateValue(r)
;n.setChartOptionHandler(i,o)}},this.setDatasource=function(e,r){
var i=this._getReport();if(i&&i.reportDoc&&(i.catalog!=e||i.cube!=r)){
i.catalog=e,i.cube=r;var n=i.manager.updateCatalog(!0)
;void 0!==n&&(i.catalog=this.getReportOption("catalog"),
i.cube=this.getReportOption("cube"),
0==n.length&&(n=this._errors.INVALID_CATALOG_OR_CUBE(e,r)),
t.log.error(n,!0)),this.setReportOption("cube",i.cube),
this.setReportOption("catalog",i.catalog),i.openReport(void 0,!0)}
},this.setFieldLink=function(e,r){var o=this._getReport()
;if(o&&this._validateParamsForSetFieldLink(e,r,o)){var a=!0
;if(o.byClass("pivotTable")){var s=o.buildFilterActionContext(),l=function(e){
var a,l=this._query("a",e)
;if(l.length>0)a=l[0];else for(var u,p=e.firstChild.childNodes,d=0;u=p[d];d++)if("#text"==u.nodeName){
a=u;break}if(a){var c=i.create("a",{
innerHTML:a.textContent||a.innerText||a.nodeValue,href:"javascript:;"})
;i.place(c,a,"replace");var h=o.buildCellActionContext(e),_=function(e){
r(cv.api,h,s),n.stop(e)}
;t.event._eventListenerUtil.addEventListener(c,"click",_,!1)}
},u=this._query('td[type="measure"][ctx*="'+e+'"]',o.reportHeaders.columnHeaderContainer)
;if(u.length>0){var p=u[0].parentNode,d="";u.forEach(function(e,t,r){
var i=[].indexOf.call(p.children,e)
;d+='td[type="cell"][colindex="'+i+'"]',t!==u.length-1&&(d+=",")
}),u.forEach(l,this),
this._query(d,o.reportHeaders.dataContainer).forEach(l,this),a=!1}else{
var d='td[type="member"][ctx*="'+e+'"]',c=this._query(d,o.reportHeaders.rowLabelContainer)
;c.forEach(l,this);var h=this._query(d,o.reportHeaders.columnHeaderContainer)
;h.forEach(l,this),a=0===c.length&&0===h.length}}
a&&t.log.warn(this._errors.EMPTY_CELLS_FOR_LINK(e))}
},this.buildFilterActionContext=function(){var e={},t=this._getReport()
;return t&&(e=t.buildFilterActionContext()),e
},this.buildCellActionContext=function(e){var t={},r=this._getReport()
;return r&&(t=r.buildCellActionContext(e)),t}}
}),define("pentaho/analyzer/cv_api_operation",["./cv_api_report_util"],function(e){
return function(t){
this._apiReportUtil=new e(t),this._cutStrByRegexp=function(e,t){
var r=e.search(t);return-1!=r&&(e=e.substring(0,r)),e
},this.refreshReport=function(){var e=t.report._getReport()
;e&&(e.refreshReport(!0),e.populateFilters())
},this.getDropTarget=function(e,r,i){var n=t.report._getReport()
;if(void 0===n)return null
;this.filterCountLabel||(this.filterCountLabel=n.byId("FilterCountLabel")),
this.filterPaneToggle||(this.filterPaneToggle=n.byId("FilterPaneToggle"))
;var o=function(e){return{clientX:e.x,clientY:e.y,anchor:{
getAttribute:function(){return e.formula}}}},a=function(e,t){return{
dropTarget:e,domNodes:t,onGet:function(){},onShowDropIndicator:function(e){
this.dropTarget._showDropIndicator()},onClearDropIndicator:function(e){
this.dropTarget._clearDropIndicator()},onDrop:function(e){var t=o(e)
;this.dropTarget.onDrop(t),this.dropTarget._afterDrop(e.formula)}}},s={
reportArea:{dropTarget:n.dropTargets.reportArea,
domNodes:[n.dropTargets.reportArea.node],_setDragEvent:function(e){
this.dropTarget.lastDragEvent=o(e)},onShowDropIndicator:function(e){
this._setDragEvent(e),this.dropTarget.calculateBoxes()
;var t=n.manager.fieldHelp,r=t.isAttribute(e.formula)?"attribute":"measure"
;this.dropTarget._showDropIndicator(this.dropTarget.lastDragEvent,r)},
onClearDropIndicator:function(e){this.dropTarget._clearDropIndicator()},
onGet:function(){this.dropTarget.calculateBoxes(!0)},onDrop:function(e){
this._setDragEvent(e)
;var t=n.manager.fieldHelp,r=t.isAttribute(e.formula)?"attribute":"measure"
;this.dropTarget._onDrop(e.formula,r)}},
filters:a(n.dropTargets.filters,[n.dropTargets.filters.filterPane]),
filterPaneTitle:a(n.dropTargets.filterPaneTitle,[n.dropTargets.filterPaneTitle.filterPane,this.filterCountLabel,this.filterPaneToggle])
},l=dijit.byId("layoutPanel");if(l)for(var u in l.propUIs){var p=l.propUIs[u]
;p.dropZone&&(s[p.id]={dropTarget:p.dropZone,domNodes:[p.domNode],
onGet:function(){this.dropInfo=null},onShowDropIndicator:function(e){
if(this.dropTarget.accept[cvConst.dndTypes.gemFromFieldList]){
this.dropTarget.gemBar._showOver()
;var t=o(e),r=this.dropTarget._showDropIndicator(t);r&&(this.dropInfo=r)}},
onClearDropIndicator:function(e){
this.dropTarget.gemBar._hideOver(),this.dropTarget._hideDropIndicator()},
onDrop:function(e){this.dropInfo||(this.dropInfo={before:!1,anchor:null})
;var t={scope:n,f:n.emitDropEvent}
;this.dropTarget._onDrop(e.formula,cvConst.dndTypes.gemFromFieldList,e.formula,this.dropTarget.gemBar,this.dropInfo.before,this.dropInfo.anchor,this.dropTarget.node,t)
}})}var d={source:{formula:i,x:e,y:r},target:null};for(var c in s){
var h=s[c],_=h.domNodes;for(var f in _){var m=_[f]
;if(t.ui._withinDomNode(e,r,m))return d.target=h,h.onGet(d.source),d}}
return null},this.completeDrop=function(e){e.target.onDrop(e.source)
},this.showDropTargetIndicator=function(e){
e.target.onShowDropIndicator(e.source)
},this.clearDropTargetIndicator=function(e){
e.target.onClearDropIndicator(e.source)},this.clearCache=function(e,r,i){
var n=t.report._getReport();n&&cv.util.clearCache(n,e,r,i)
},this.undo=function(){var e=t.report._getReport();e&&e.history.undo()
},this.redo=function(){var e=t.report._getReport();e&&e.history.redo()
},this.resetReport=function(){var e=t.report._getReport();if(e){
var r=e.history.getSaved();e.history.setTo(r),e.history.current().back()}
},this.saveReport=function(e,r,i,n,o){var a=t.report._getReport();if(a){
var s=new this._apiReportUtil.types._StringOptionType;s.validateValue("name",e),
s.validateValue("path",r)
;e=this._cutStrByRegexp(e,/\.xanalyzer$/),r=this._cutStrByRegexp(r,/\/[^\/]*\.xanalyzer$/)+"/"+e+".xanalyzer"
;var l={success:function(){"function"==typeof i&&i.apply(arguments)},
error:function(){"function"==typeof n&&n.apply(arguments)}}
;cv.util.saveReport(a,"saveAs",e,r,l,!!o)}}}
}),define("pentaho/analyzer/AnalyzerEvented",["dojo/Evented","dojo/_base/declare"],function(e,t){
return t([e],{constructor:function(e){
this.stopImmediatePropagation=!1,this.preventDefault=!1,
this.config=e,this.disabledEvents={}},_on:function(e,t,r){
if(this.stopImmediatePropagation)return void(this.config&&this.config.onPropagationStopped&&this.config.onPropagationStopped(t,e))
;if(!this.isEventDisabled(t)){e.stopPropagation||(e.stopPropagation=function(){
console.log("Stop Propagation is not implemented by dojo unless you implement a parent/child structure.")
});var i=this
;e.stopImmediatePropagation||(e.stopImmediatePropagation=function(){
i.stopImmediatePropagation=!0}),e.preventDefault||(e.preventDefault=function(){
i.preventDefault=!0
}),r.call(this,e),this.config&&this.config.onListenerExecuted&&this.config.onListenerExecuted(t,e)
}},on:function(e,t){var r=this,i=t;return arguments[1]=function(t){
r._on.call(r,t,e,i)},this.inherited(arguments)},emit:function(e,t){
return this.stopImmediatePropagation=!1,
this.preventDefault=!1,this.inherited(arguments),!this.preventDefault&&t},
isEventDisabled:function(e){
return!(!this.disabledEvents||!e)&&(!(!0!==this.disabledEvents.tableDoubleClick||!e.match(/doubleclick|dblclick/i))||void 0!==this.disabledEvents[e]&&this.disabledEvents[e])
}})}),define("pentaho/analyzer/EventListenerUtil",[],function(){
return function(){function e(e,n,o,l){var u="on"+n,p=e
;p._listener=p._listener||{},
p._listener[n]=p._listener[n]||t(),0==p._listener[n][a].length&&0==p._listener[n][s].length&&(p._listener[u]=function(e){
var t={},o=e.srcElement;for(var a in e)t[a]=e[a]
;t.currentTarget=p,t.target=o,t.nativeEvent=e,t.preventDefault=function(){
this.nativeEvent.returnValue=!1},t.stopPropagation=function(){
this.nativeEvent.cancelBubble=!0};for(var s=[];o;)s.unshift(o),o=o.parentNode
;r(p,n,s,e,t),i(p,n,s,e,t),e.cancelBubble=!0
},p.attachEvent(u,p._listener[u])),p._listener[n][l?a:s].push(o)}function t(){
var e={};return e[a]=[],e[s]=[],e}function r(e,t,r,i,o){
for(var s,l=0;(s=r[l])&&!i.cancelBubble;l++)n(e,t,a,s,i,o)}
function i(e,t,r,i,o){
for(var a,l=r.length-1;(a=r[l])&&!i.cancelBubble;l--)n(e,t,s,a,i,o)}
function n(e,t,r,i,n,o){
if(i._listener&&i._listener[t])for(var a,s=0;(a=i._listener[t][r][s])&&!n.cancelBubble;s++)a.call(e,o)
}function o(e,r,i,n){var o="on"+r,l=e
;l._listener=l._listener||{},l._listener[r]=l._listener[r]||t()
;for(var u,p=l._listener[r][n?a:s],d=p.length-1;u=p[d];d--)u===i&&p.splice(d,1)
;0==l._listener[r][a].length&&0==l._listener[r][s].length&&l.detachEvent(o,l._listener[o])
}var a="capturing",s="bubbling";this.addEventListener=function(t,r,i,n){
t.addEventListener?t.addEventListener(r,i,n):e(t,r,i,n)
},this.removeEventListener=function(e,t,r,i){
e.removeEventListener?e.removeEventListener(t,r,i):o(e,t,r,i)}}
}),define("pentaho/analyzer/cv_api_event",["./AnalyzerEvented","./EventListenerUtil"],function(e,t){
return function(r){var i=this
;this._eventListenerUtil=new t,this._eventedHelper=new e({
onPropagationStopped:function(e,t){r.log.info(i._infoMsgs.EVENT_SKIPPED(e))}
}),this._availableActions=["actionAddLevel","actionAddMeasure","actionMoveLevel","actionMoveMeasure","actionRemoveLevel","actionRemoveMeasure"],
this._infoMsgs={EVENT_REGISTERED:function(e){return"["+e+"] event registered"},
EVENT_EXECUTED:function(e){return"["+e+"] event executed"},
EVENT_SKIPPED:function(e){
return"["+e+"] event skipped by stopImmediatePropagation"}
},this._availableMenuIds=["fieldViewMenu","fieldListMenu","moreActionsMenu","attributePopMenu","propPopMenu","measurePopMenu","filterPopMenu","grandTotalPopMenu","actionsMenu","memberPopMenu","cellPopMenu"],
this._on=function(e,t){var n=this._eventedHelper.on(e,function(n){
n.args[0].hasOwnProperty("args")&&n.args[0].hasOwnProperty("bubbles")?n.args[0]=n:n.args.unshift(n)
;try{t.apply(i._eventedHelper,n.args),r.log.info(i._infoMsgs.EVENT_EXECUTED(e))
}catch(n){r.log.error(n)}})
;return r.log.info(this._infoMsgs.EVENT_REGISTERED(e)),n
},this._emit=function(e){return this._eventedHelper.emit(e,{bubbles:!0,
cancelable:!0,args:Array.prototype.slice.call(arguments,1)})
},this.registerInitListener=function(e){return this._on("init",e)
},this.registerTableClickListener=function(e){return this._on("tableClick",e)
},this.registerTableContextMenuListener=function(e){
return this._on("tableContextMenu",e)},this.registerRenderListener=function(e){
return this._on("render",e)},this.registerActionEventListener=function(e){
return this._on("actionEvent",e)},this.registerDropEventListener=function(e){
return this._on("drop",e)},this._emitActionEvent=function(e){var t=!0
;return this._availableActions.indexOf(e.action)>-1&&(t=this._emit("actionEvent",r,e.action,e.actionCtx)),
t},this.registerChartSelectItemsListener=function(e){
return this._on("chartSelectItems",e)
},this.registerChartDoubleClickListener=function(e){
return this._on("chartDoubleClick",e)
},this.registerTableDoubleClickListener=function(e){
return this._on("tableDoubleClick",e)
},this.registerTableMouseOverListener=function(e){
return this._on("tableMouseOver",e)
},this.registerTableMouseMoveListener=function(e){
return this._on("tableMouseMove",e)},this.registerBuildMenuListener=function(e){
return this._on("buildMenu",e)},this._emitBuildMenu=function(e,t,i){var n=!0
;return this._availableMenuIds.indexOf(e.id)>-1&&(n=this._emit("buildMenu",r,e.id,e,t,i)),
n},this.registerDragEventListener=function(e){return this._on("drag",e)
},this.registerPreExecutionListener=function(e){
return this._on("preExecution",e)
},this.registerPostExecutionListener=function(e){
return this._on("postExecution",e)},this.disableDragAndDrop=function(e){
this._eventedHelper.disabledEvents.dragAndDrop=JSON.parse(e)
},this.disableTableDoubleClick=function(e){
this._eventedHelper.disabledEvents.tableDoubleClick=JSON.parse(e),
this._showDisabledEventTitle(this._eventedHelper.disabledEvents.tableDoubleClick,'td[type="member"] div[enabledeventtitle]'),
this._showDisabledEventTitle(this._eventedHelper.disabledEvents.tableDoubleClick,'td[type="member"][enabledeventtitle]')
},this.disableTableContextMenu=function(e){
this._eventedHelper.disabledEvents.tableContextMenu=JSON.parse(e)
},this.isEventDisabled=function(e){return this._eventedHelper.isEventDisabled(e)
},this._showDisabledEventTitle=function(e,t){
for(var r=document.querySelectorAll(t),i=0;i<r.length;i++){var n=r[i]
;e&&n.hasAttribute("disabledeventtitle")?n.setAttribute("title",n.getAttribute("disabledeventtitle")):!e&&n.hasAttribute("enabledEventTitle")&&n.setAttribute("title",n.getAttribute("enabledeventtitle"))
}}}
}),define("pentaho/analyzer/cv_api_util",["./cv_api_report_util","dojo/request"],function(e,t){
return function(r){
this._apiReportUtil=new e(r),this._validateUrlParamItem=function(e,t){
var i=void 0!==t.urlParams&&t.urlParams.length>0
;return!i||t.handler&&t.handlerScope?i&&"function"!=typeof t.handler&&(r.log.warn(this._errorMessages.INVALID_HANDLER_FOR_URL_PARAM(e)),
i=!1):(r.log.warn(this._errorMessages.INVALID_PARAM_HANDLER(e)),i=!1),i
},this._errorMessages={INVALID_PARAM_HANDLER:function(e){
return"Function handler is not set for API '"+e+"'."},
INVALID_HANDLER_FOR_URL_PARAM:function(e){
return"API '"+e+"' has an invalid function handler."},
INVALID_URL_PARAM_FOR_MODE:function(e,t,r){
return"API '"+e+"' is not allowed for the current report mode '"+t+"'. The valid mode is '"+r+"'."
}},this._functions={setVizId:{urlParams:[{name:"vizId"}],
handler:r.report.setVizId,handlerScope:r.report},setReportOption:{urlParams:[{
name:"showRowGrandTotal",args:["showRowGrandTotal"]},{
name:"showColumnGrandTotal",args:["showColumnGrandTotal"]},{
name:"useNonVisualTotals",args:["useNonVisualTotals"]},{name:"showEmptyCells",
args:["showEmptyCells"]},{name:"showDrillLinks",args:["showDrillLinks"]},{
name:"autoRefresh",args:["autoRefresh"]},{name:"freezeColumns",
args:["freezeColumns"]},{name:"freezeRows",args:["freezeRows"]}],
handler:r.report.setReportOption,handlerScope:r.report},setChartOption:{
urlParams:[{name:"legendPosition",args:["legendPosition"]},{name:"showLegend",
args:["showLegend"]},{name:"autoRange",args:["autoRange"]},{
name:"valueAxisLowerLimit",args:["valueAxisLowerLimit"]},{
name:"valueAxisUpperLimit",args:["valueAxisUpperLimit"]},{name:"displayUnits",
args:["displayUnits"]},{name:"autoRangeSecondary",args:["autoRangeSecondary"]},{
name:"valueAxisLowerLimitSecondary",args:["valueAxisLowerLimitSecondary"]},{
name:"valueAxisUpperLimitSecondary",args:["valueAxisUpperLimitSecondary"]},{
name:"displayUnitsSecondary",args:["displayUnitsSecondary"]},{name:"maxValues",
args:["maxValues"]},{name:"backgroundColor",args:["backgroundColor"]},{
name:"labelColor",args:["labelColor"]},{name:"labelSize",args:["labelSize"]},{
name:"backgroundFill",args:["backgroundFill"]},{name:"maxChartsPerRow",
args:["maxChartsPerRow"]},{name:"multiChartRangeScope",
args:["multiChartRangeScope"]},{name:"emptyCellMode",args:["emptyCellMode"]},{
name:"sizeByNegativesMode",args:["sizeByNegativesMode"]},{
name:"backgroundColorEnd",args:["backgroundColorEnd"]},{name:"labelStyle",
args:["labelStyle"]},{name:"legendBackgroundColor",
args:["legendBackgroundColor"]},{name:"legendSize",args:["legendSize"]},{
name:"legendColor",args:["legendColor"]},{name:"legendStyle",
args:["legendStyle"]},{name:"labelFontFamily",args:["labelFontFamily"]},{
name:"legendFontFamily",args:["legendFontFamily"]}],
handler:r.report.setChartOption,handlerScope:r.report},showFieldList:{
urlParams:[{name:"showFieldList"}],handler:r.ui.showFieldList,handlerScope:r.ui,
mode:"EDIT"},showFieldLayout:{urlParams:[{name:"showFieldLayout"}],
handler:r.ui.showFieldLayout,handlerScope:r.ui,mode:"EDIT"},removeHeaderBar:{
urlParams:[{name:"removeHeaderBar"}],handler:r.ui.removeHeaderBar,
handlerScope:r.ui},disableFilterPanel:{urlParams:[{name:"disableFilterPanel"}],
handler:r.ui.disableFilterPanel,handlerScope:r.ui},showFilterPanel:{urlParams:[{
name:"showFilterPanel"}],handler:r.ui.showFilterPanel,handlerScope:r.ui},
removeFieldList:{urlParams:[{name:"removeFieldList"}],
handler:r.ui.removeFieldList,handlerScope:r.ui,mode:"EDIT"},removeFieldLayout:{
urlParams:[{name:"removeFieldLayout"}],handler:r.ui.removeFieldLayout,
handlerScope:r.ui,mode:"EDIT"},setFieldListView:{urlParams:[{
name:"fieldListView"}],handler:r.ui.setFieldListView,handlerScope:r.ui,
mode:"EDIT"},showRepositoryButtons:{urlParams:[{name:"showRepositoryButtons"}],
handler:r.ui.showRepositoryButtons,handlerScope:r.ui,mode:"EDIT"},
removeUndoButton:{urlParams:[{name:"removeUndoButton"}],
handler:r.ui.removeUndoButton,handlerScope:r.ui,mode:"EDIT"},removeRedoButton:{
urlParams:[{name:"removeRedoButton"}],handler:r.ui.removeRedoButton,
handlerScope:r.ui,mode:"EDIT"},removeMainToolbar:{urlParams:[{
name:"removeMainToolbar"}],handler:r.ui.removeMainToolbar,handlerScope:r.ui,
mode:"EDIT"},removeReportActions:{urlParams:[{name:"removeReportActions"}],
handler:r.ui.removeReportActions,handlerScope:r.ui,mode:"VIEW"},
disableTableDoubleClick:{urlParams:[{name:"disableTableDoubleClick"}],
handler:r.event.disableTableDoubleClick,handlerScope:r.event},
disableTableContextMenu:{urlParams:[{name:"disableTableContextMenu"}],
handler:r.event.disableTableContextMenu,handlerScope:r.event},
disableDragAndDrop:{urlParams:[{name:"disableDragAndDrop"}],
handler:r.event.disableDragAndDrop,handlerScope:r.event},isFromTransformation:{
urlParams:[{name:"isFromTransformation"}],handler:r.ui.setIsFromTransformation,
handlerScope:r.ui}},this.parseMDXExpression=function(e,t){
return(new this._apiReportUtil.types._StringOptionType).validateValue("formula",e),
cv.util.parseMDXExpression(e,t)},this._applyUrlParameters=function(){
for(param in this._functions){var e=this._functions[param];try{
if(this._validateUrlParamItem(param,e))for(var t,i=0;t=e.urlParams[i];i++){
var n=cv.util.getURLQueryValue(t.name);if(n){var o=t.args?t.args:[]
;o.push(n),e.handler.apply(e.handlerScope,o)}}}catch(e){r.log.error(e)}}
},this._validateModeForAPI=function(e){var t=!0,i=r.ui.getMode()
;for(param in this._functions){var n=this._functions[param];if(n.handler===e){
t=void 0===n.mode||n.mode===i,
t||r.log.error(this._errorMessages.INVALID_URL_PARAM_FOR_MODE(param,i,n.mode),!0)
;break}}return t},this._findClosestValueFromArray=function(e,t){var r=t;if(e){
var i=Math.max.apply(null,e);t>i&&(i=t);for(var n=0;n<e.length;n++){
var o=Math.abs(t-e[n]);o<i&&(i=o,r=e[n])}}return r
},this._hasInlineModelingPermission=function(){
return"false"!==cv.util.getURLQueryValue("hasInlineModelingPermission")&&this._hasManageDatasourcePermission()
},this._hasManageDatasourcePermission=function(){var e={},r=null
;return e.time=(new Date).getTime(),
t(CONTEXT_PATH+"api/authorization/action/isauthorized?authAction=org.pentaho.platform.dataaccess.datasource.security.manage",{
data:e,sync:!0,headers:{"Content-Encoding":"utf8",
"Content-Type":"application/json"},method:"GET",preventCache:!0
}).then(function(e){r=e},function(e){}),"true"===r}}
}),define("pentaho/analyzer/visual/registry.legacy",["pentaho/module/metaService","pentaho/util/object","pentaho/visual/KeyTypes","dojo/_base/lang"],function(e,t,r,i){
"use strict";function n(e){return e&&e.indexOf("/")<0?v+e:e}function o(e){
return i.clone(e.type.v2Spec)}function a(e,t,r){if(!t)return Promise.resolve()
;var i=t.map(function(e){return e.menuOrdinal||(e.menuOrdinal=1e4),f(e,r)})
;i.sort(function(e,t){return e.menuOrdinal-t.menuOrdinal})
;var n=null,o=i.map(function(t){
return n&&!0!==t.menuSeparator||(n=t.type),t._category=n,l(e,t,r)})
;return Promise.all(o)}function s(e){return-1!==e.type.id.indexOf(v)}
function l(t,r,i){var n=p(r,i),o=u(r,i),a={};return a[n.id]={base:t.type.id,
annotations:{"pentaho/analyzer/visual/Options":o},value:function(e){
return t.extend({$type:n}).configure({$type:e.config})}
},e.configure(a).get(n.id).loadAsync()}function u(e,t){
var r={},i=e.dataReqs&&e.dataReqs[0]
;return r.showOptionsButton=i&&i.reqs.filter(function(e){
return!(!e.ui||"button"!==e.ui.type)&&"optionsBtn"===e.id
}).length>0,r.selectionMaxCount=+t["filter.selection.max.count"]||500,
e.maxValues&&(r.maxValues=e.maxValues),
i&&(i.drillOrder&&(r.drillOrder=i.drillOrder),
i.hyperlinkOrder&&(r.hyperlinkOrder=i.hyperlinkOrder)),
e.keepLevelOnDrilldown&&(r.keepLevelOnDrilldown=e.keepLevelOnDrilldown),r}
function p(e,t){var i=n(e.id),o=e.dataReqs&&e.dataReqs[0],a=e.args||{},s={
index:-1,name:"",ordinal:0},l=!1,u=o&&o.reqs.filter(function(e){
return!(e.ui&&"button"===e.ui.type)}).map(function(e,t){var r=c(e,a,s,t)
;return!l&&e.dataStructure&&d(r)&&(l=!0),r
}),p=e.visualKeyType||(l?r.dataOrdinal:r.dataKey);return{id:i,v2Spec:e,
v2Id:e.id,label:e.name||e.id,category:e._category,description:e.name||e.id,
ordinal:e.menuOrdinal||1e4,visualKeyType:p,props:u||[]}}function d(e){
switch(e.modes.length){case 0:return!1;case 1:var t=e.modes[0].dataType
;return"list"===t||"element"===t;default:return!0}}function c(e,t,r,i){
return e.dataStructure?h(e,i):_(e,t,r)}function h(e,r){
var i,n=[],o=e.dataTypeAllowMultiple,a=null==e.allowMultiple||!!e.allowMultiple,s=e.dataType||"string",l=/\bstring\b/.test(s),u=/\bnumber\b/.test(s)
;return o?(!l&&u||(i=t.getOwn(o,"string",a),n.push(i?{dataType:["string"]}:{
dataType:"string"})),u&&(i=t.getOwn(o,"number",a),n.push(i?{dataType:["number"]
}:{dataType:"number"}))):(i=a,l&&u?n.push(i?{dataType:"list"}:{
dataType:"element"}):l||!u?n.push(i?{dataType:["string"]}:{dataType:"string"
}):u&&n.push(i?{dataType:["number"]}:{dataType:"number"})),{name:e.id,
label:e.caption,ordinal:r,base:"pentaho/visual/role/Property",modes:n,fields:{
isRequired:!!e.required},v2Spec:e}}function _(e,t,r){var i=e.ui||{},n=t[e.id]
;void 0===n&&void 0===(n=e.value)&&(n=null);var o;switch(e.dataType){
case"string":case"number":case"boolean":case"date":o=e.dataType;break;default:
o="string"}var a,s=e.values;if(s){var l=i.labels;a=s.map(function(e,t){return{
v:e,f:l&&t<l.length?l[t]:String(e)}})}
(r.index<0||e.ui.seperator)&&(r.name="category"+ ++r.index),r.ordinal++;var u={
name:e.id,label:i.caption,category:r.name,ordinal:r.ordinal,valueType:o,
defaultValue:n,v2Spec:e};return"checkbox"===i.type&&(u.application={
checkedLabel:null!=i.caption?i.label:null}),a&&(u.domain=a),u}function f(e,r){
var n=i.clone(e),o=r["viz."+n.id+".maxValues"];if(o){var a=m(o);n.maxValues=a}
n.maxValues||(n.maxValues=[100,150,200,250]),n.args||(n.args={})
;var s="viz."+n.id+".args.";t.eachOwn(r,function(e,t){if(-1!==t.indexOf(s)){
var r=t.substr(s.length);n.args[r]=e}})
;var l=+r["filter.selection.max.count"]||500
;return n.args["filter.selection.max.count"]=l,n}function m(e){
return e?e.split(/\s*,\s*/).map(function(e){return parseInt(e,10)
}):[100,150,200,250]}var v="pentaho/visual/models/legacy/";return{toId:n,
create:o,isLegacyViz:s,importLegacyVisualizations:a,
_convertLegacyVisualization:p,_getOptionsAnnotationSpec:u,
_convertLegacyDataReq:c}
}),define("pentaho/analyzer/visual/dataFilterUtils",["pentaho/data/filter/False"],function(e){
"use strict";function t(e){if(!e)return[];var t=[];switch(e=e.toDnf(),e.kind){
case"false":break;case"or":e.operands.each(function(e){t.push(r(e))});break
;default:t.push(r(e))}return t}function r(e){var t;switch(e.kind){case"isEqual":
return{type:"row",rowId:[e.property],rowItem:[e.value]};case"and":
return t=i(),e.operands.each(function(e){var i=r(e)
;i&&(t.rowId.push.apply(t.rowId,i.rowId),
t.rowItem.push.apply(t.rowItem,i.rowItem))}),t;default:
throw new Error("Not Implemented")}}function i(e,t){return{type:"row",
rowId:null==e?[]:[e],rowItem:null==t?[]:[t]}}function n(t,r){if(null==r)return t
;var i=e.instance;if(0===r.length)return i;var n={}
;return r.forEach(function(e){n[e]=1}),(o(t,n)||i).toDnf()}function o(e,t){
if(e.isTerminal){return e.isProperty&&!a(t,e.property)?null:e}
if("not"===e.kind){var r=o(e.operand,t);return r?r.negate():null}var i=[]
;return e.operands.each(function(e){var r=o(e,t);r&&i.push(r)
}),i.length?new e.constructor({operands:i}):null}function a(e,t){
return Object.prototype.hasOwnProperty.call(e,t)}function s(e,t,r,i){if(-1!==e){
var n=t.toDnf();if("or"===n.kind){var o=n.operands,a=o.count;if(a>e){
for(var s=i||0,l=[],u=0,p=[],d=0,c=0;c!==a;++c){var h=o.at(c),_=h.$contentKey
;if(s>0&&null!=r[_]?(l.push(h),
++u,--s):(p.push(h),++d),u>=e||0===s&&u+d>=e)break}var f=l
;u<e&&f.push.apply(l,p.slice(0,e-u));return n.$type.create({operands:f})}}}
return t}return{toAnalyzerSelectionFormat:t,restrictFilter:n,limitSelection:s}
}),
define("pentaho/analyzer/visual/Application",["pentaho/module!_","pentaho/visual/Application","./dataFilterUtils"],function(e,t,r){
"use strict";return t.extend({$type:{id:e.id},constructor:function(e){
this.base(e),this.cv=e&&e.cv},getDoubleClickTooltip:function(e){
var t=this.cv.getActiveReport(),i=t._vizModelAdapter._convertFilterToExternal(e),n=t._restrictFilterToDrillOrder(i),o=r.toAnalyzerSelectionFormat(n)
;return t.getDoubleClickTooltip(o&&o[0])}}).configure({$type:e.config})
}),define("pentaho/analyzer/visual/OptionsAnnotation",["module","pentaho/module/Annotation"],function(e,t){
"use strict";var r=[100,150,200,250],i=t.extend(e.id,{constructor:function(e,t){
this.base(e),this._init(t||{})},__maxValues:r,get maxValues(){
return this.__maxValues},__hyperlinkOrder:null,get hyperlinkOrder(){
return this.__hyperlinkOrder},__drillOrder:null,get drillOrder(){
return this.__drillOrder},__keepLevelOnDrilldown:null,
get keepLevelOnDrilldown(){return this.__keepLevelOnDrilldown},
__showOptionsButton:null,get showOptionsButton(){return this.__showOptionsButton
},__filterSelectionMaxCount:500,get filterSelectionMaxCount(){
return this.__filterSelectionMaxCount},__selectionRestriction:null,
get selectionRestriction(){return this.__selectionRestriction},
__generateOptionsFromAnalyzerState:null,get generateOptionsFromAnalyzerState(){
return this.__generateOptionsFromAnalyzerState},__willOverflow:null,
get willOverflow(){return this.__willOverflow},__isStockVisualization:!1,
get isStockVisualization(){return this.__isStockVisualization},
_init:function(e){
null!=e.maxValues&&(this.__maxValues=e.maxValues),null!=e.hyperlinkOrder&&(this.__hyperlinkOrder=e.hyperlinkOrder),
null!=e.drillOrder&&(this.__drillOrder=e.drillOrder),
null!=e.keepLevelOnDrilldown&&(this.__keepLevelOnDrilldown=e.keepLevelOnDrilldown),
null!=e.showOptionsButton&&(this.__showOptionsButton=e.showOptionsButton),
null!=e.filterSelectionMaxCount&&(this.__filterSelectionMaxCount=e.filterSelectionMaxCount),
null!=e.selectionRestriction&&(this.__selectionRestriction=e.selectionRestriction),
null!=e.generateOptionsFromAnalyzerState&&(this.__generateOptionsFromAnalyzerState=e.generateOptionsFromAnalyzerState),
null!=e.willOverflow&&(this.__willOverflow=e.willOverflow),
null!=e.isStockVisualization&&(this.__isStockVisualization=e.isStockVisualization)
}},{get id(){return e.id},createAsync:function(e,t){var r=e.ancestor||null
;return null!==r&&r.hasAnnotation(i,{inherit:!0})?r.getAnnotationAsync(i,{
inherit:!0}).then(function(r){var n=Object.create(r);return i.call(n,e,t),n
}):Promise.resolve(new i(e,t))}});return i
}),define("pentaho/analyzer/visual/utils",["pentaho/module/metaService","./OptionsAnnotation","pentaho/visual/role/util","pentaho/util/object"],function(e,t,r,i){
function n(e,t,i,n,s,l,u){
var p=a[n],d=p(o(e),s,l),c=e.createSchemaDataTable(d),h=c.model.attributes,_=h[h.length-1].name,f=r.testAddFieldAtAutoPosition(t,i,_,{
alternateData:c});return null!==f&&(null==u||f.mode.isContinuous===u)}
function o(e){for(var t=0;e.gemList.contains("__field_temp"+t);)t++
;return"__field_temp"+t}var a={stringAttribute:function(e,t,r){return{name:e,
type:"string",isKey:!0,hierarchyName:t,hierarchyOrdinal:r}},
dateAttribute:function(e,t,r){return{name:e,type:"string",isKey:!0,
hierarchyName:t,hierarchyOrdinal:r,p:{EntityWithTimeIntervalKey:{
duration:"month",isStartDateTimeProvided:!0}}}},numberAttribute:function(e,t,r){
return{name:e,type:"string",isKey:!0,hierarchyName:t,hierarchyOrdinal:r,p:{
EntityWithNumberKey:{isNumberProvided:!0}}}},numberMeasure:function(e){return{
name:e,type:"number",isKey:!1}}};return{testAddKnownFieldKinds:function(e,t,i){
var o=r.getRoleFirstHierarchy(t,i),a=o&&r.getHierarchyNextOrdinal(t,o),s=n(e,t,i,"stringAttribute",o,a,!1),l=n(e,t,i,"dateAttribute",o,a,!0),u=n(e,t,i,"numberAttribute",o,a,!0),p=n(e,t,i,"numberMeasure",null,null,null)
;return{stringAttribute:s,dateAttribute:l,numberAttribute:u,attribute:s||u||l,
numberMeasure:p}},getVizOptionsAnnotation:function(r,n){
if(!r)throw error.argRequired("vizTypeId");var o=e.get(r,{createIfUndefined:!0})
;return n=i.assignOwn({inherit:!0},n),o.getAnnotation(t,n)}}
}),define("pentaho/analyzer/visual/registry",["pentaho/lang/Base","pentaho/environment","pentaho/module/service","pentaho/module/metaService","pentaho/config/service","pentaho/util/object","pentaho/util/fun","pentaho/util/requireJS","./registry.legacy","./Application","./utils"],function(e,t,r,i,n,o,a,s,l){
"use strict";function u(e,t){var r=e.type,i=t.type
;return a.compare(r.ordinal||1/0,i.ordinal||1/0)||a.compare(r.label,i.label)}
function p(e){return e?e.split(/\s*,\s*/).map(function(e){return parseInt(e,10)
}):v.slice()}function d(e,t){var r=c(e,t);return r.select.annotation=_,r}
function c(e,t){return{priority:-1,select:{application:t,module:e},apply:{
props:{}}}}function h(){
return!this.rows.hasFields&&!this.columns.hasFields&&!this.measures.hasFields}
var _="pentaho/analyzer/visual/Options",f="pentaho/visual/Model",m=500,v=[100,150,200,250],g=/^viz\.(.+?)\.args.(.+?)$/,y=/^viz\.(.+?)\.maxValues$/
;return e.extend({constructor:function(){
this._isLoaded=!1,this.__loadedPromise=null,
this.__allModels=null,this.__allModelsById=null},loadAsync:function(){
var e=this.__loadedPromise
;return null===e&&(this._createConfiguration(cv.analyzerProperties),
this.__loadedPromise=e=this.__getModelsAsync().then(this.__setModules.bind(this))),
e},__getModelsAsync:function(){return s.promise(f).then(function(e){
return Promise.all([s.promise("pentaho/visual/ModelAdapter"),this._registerPivotTableAsync(e,cvCatalog),l.importLegacyVisualizations(e,cv.pentahoVisualizations,cv.analyzerProperties)])
}.bind(this)).then(function(){return r.getSubtypesOfAsync(f)})},
__setModules:function(e){var t=this.__allModelsById=Object.create(null)
;return this.__allModels=e.filter(function(e){
return!e.type.isAbstract&&(t[e.type.id]=e,!0)}),this._isLoaded=!0,this},
get isLoaded(){return this._isLoaded},_assertLoaded:function(){
if(!this.isLoaded)throw new Error("Visualization registry is not yet loaded")},
isLegacyViz:function(e){return l.isLegacyViz(e)},get:function(e){
return this._assertLoaded(),e=l.toId(e),o.getOwn(this.__allModelsById,e,null)},
create:function(e,t){return this.isLegacyViz(e)?l.create(e):new e(t)},
getAll:function(){return this._assertLoaded(),this.__allModels.slice()},
getAllByCategory:function(){var e=this.getAll(),t={};e.forEach(function(e){
var r=e.type;if(r.isBrowsable){var i=r.category,n=o.getOwn(t,i);n||(t[i]=n={
category:i,models:[]}),n.models.push(e)}}),o.eachOwn(t,function(e){
e.models.sort(u)});var r=[],i={};return o.eachOwn(t,function(e){
i[e.category]=e.models.reduce(function(e,t){var r=t.type.ordinal
;return null==r?e:e<r?e:r},1/0),r.push(e)}),r.sort(function(e,t){
var r=i[e.category],n=i[t.category];return a.compare(r,n)}),r},
_registerPivotTableAsync:function(e,t){var r=l.toId("analyzer_PIVOT"),n={}
;return n[r]={base:f,annotations:{"pentaho/analyzer/visual/Options":{
showOptionsButton:!0}},value:function(r){return e.extend({$type:{id:r.id,
v2Spec:{},v2Id:"analyzer_PIVOT",label:"Pivot Table",category:"pivot",
description:"Analyzer Pivot Table",ordinal:1e4,isBrowsable:!1,props:[{
name:"rows",ordinal:1,label:t.dropZoneLabels_PIVOT_ROW,
base:"pentaho/visual/role/Property",modes:[{dataType:["string"]}],fields:{
isRequired:h}},{name:"columns",ordinal:2,label:t.dropZoneLabels_PIVOT_COL,
base:"pentaho/visual/role/Property",modes:[{dataType:["string"]}],fields:{
isRequired:h}},{name:"measures",ordinal:3,label:t.dropZoneLabels_PIVOT_NUM,
base:"pentaho/visual/role/Property",modes:[{dataType:["number"]}],fields:{
isRequired:h}}]}}).configure({$type:r.config})}
},i.configure(n).get(r).loadAsync()},_createConfiguration:function(e){
function r(e){e=l.toId(e);var t=e+"-"+_,r=o.getOwn(n,t)
;return r||(n[t]=r=d(e,s),a.push(r)),r}function i(e){e=l.toId(e)
;var t=o.getOwn(n,e);return t||(n[e]=t=c(e,s),a.push(t)),t}
var n={},a=[],s=t.application;!function(){var t=r(f),i=t.apply
;i.maxValues=p(),i.filterSelectionMaxCount=+e["filter.selection.max.count"]||m
;var n=e["chart.options.keepLevelOnDrilldown"]
;"string"==typeof n&&(n="true"===n),i.keepLevelOnDrilldown=!!n}(),function(){
for(var t in e)if(o.hasOwn(e,t)){var n,a=e[t]
;(n=g.exec(t))?i(n[1]).apply.props[n[2]]={defaultValue:a
}:(n=y.exec(t))&&(r(n[1]).apply.maxValues=p(a))}}(),this._addConfiguration({
rules:a})},_addConfiguration:function(e){n.add(e)}})
}),define("pentaho/analyzer/cv_api_ui",["dojo/dom-construct","dijit/registry","dojo/dom-class","dojo/dom","dojo/query","dojo/dom-geometry","./cv_api_report_util","./visual/registry"],function(e,t,r,i,n,o,a,s){
return function(l){
this._visualRegistry=new s,this._apiReportUtil=new a(l),this._msgs={
UNSUPPORTED_VIEW:function(e){
return"View: '"+e+"' is not a supported field list view"}
},this._query=function(e,t){return n(e,t)},this._makeVisible=function(e){var t=e
;return(new this._apiReportUtil.types._BooleanOptionType).validateValue("makeVisible",t),
"string"==typeof e&&(t="true"===t),t
},this._destroyWidgetsAndRefreshLayout=function(r){r.forEach(e.destroy)
;var i=t.byId("borderContainer");i&&i.layout()
},this._destroySeparatorIfEmptyPanel=function(t){var r=i.byId(t);if(r){
0==this._query(".reportBtn",r).length&&this._query(".separator",r).forEach(e.destroy)
}},this._isRemovable=function(e){return void 0===e||!0===e||"true"===e
},this._withinDomNode=function(e,t,r){var i=o.position(r)
;return e>=i.x&&t>=i.y&&e<=i.x+i.w&&t<=i.y+i.h
},this.isFromTransformation=!1,this.getMode=function(){
var e=l.report._getReport();if(e)return e.mode
},this.showFieldLayout=function(e){var t=l.report._getReport();if(t){
l.util._validateModeForAPI(arguments.callee),e=this._makeVisible(e)
;cv.util.isShowing("layoutPanelWrapper")!=e&&t.onToggleReportPane("cmdLayout")}
},this.showFilterPanel=function(e){var t=l.report._getReport();if(t){
l.util._validateModeForAPI(arguments.callee),e=this._makeVisible(e)
;cv.util.isShowing(t.id+"Filter")!=e&&t.onToggleReportPane("cmdFilters")}
},this.listVizIds=function(){
for(var e,t=["pivot"],r=this._visualRegistry.getAll(),i=0;e=r[i];i++){
var n=e.type
;"pentaho/visual/models/legacy/analyzer_PIVOT"!==n.id&&t.push(n.v2Spec?n.v2Id:n.id)
}return t},this.listGembarIds=function(){var e=[],t=l.report._getReport()
;return t&&null!==t._vizModelAdapter&&t._vizModelAdapter.$type.eachVisualRole(function(t){
e.push(t.name)}),e},this.removeFieldList=function(e){
l.util._validateModeForAPI(arguments.callee),
this._isRemovable(e)&&(this._destroyWidgetsAndRefreshLayout(["fieldListWrapper","fieldListWrapper_splitter","cmdFields"]),
this._destroySeparatorIfEmptyPanel("layoutButtonsPanel"))
},this.removeHeaderBar=function(e){var t=l.report._getReport()
;t&&this._isRemovable(e)&&("EDIT"==this.getMode()?this._destroyWidgetsAndRefreshLayout([t.id+"Filter",t.id+"ReportSummary","cmdFilters"]):"VIEW"==this.getMode()&&this._destroyWidgetsAndRefreshLayout([t.id+"Filter",t.id+"ReportSummary",t.id+"CmdActions",t.id+"ReportName"]))
},this.disableFilterPanel=function(e){var t=l.report._getReport()
;t&&(l.util._validateModeForAPI(arguments.callee),
this._isRemovable(e)&&(this._destroyWidgetsAndRefreshLayout([t.id+"Filter",t.id+"FilterPaneTitle","cmdFilters"]),
this._destroySeparatorIfEmptyPanel("layoutButtonsPanel")))
},this.removeUndoButton=function(e){
l.util._validateModeForAPI(arguments.callee),
this._isRemovable(e)&&(this._destroyWidgetsAndRefreshLayout(["cmdUndoPanel"]),
this._destroySeparatorIfEmptyPanel("historyButtonsPanel"))
},this.removeFieldLayout=function(e){
if(l.util._validateModeForAPI(arguments.callee),this._isRemovable(e)){
this._destroyWidgetsAndRefreshLayout(["layoutPanelWrapper","layoutPanelWrapper_splitter","cmdLayout"]),
this._destroySeparatorIfEmptyPanel("layoutButtonsPanel")
;var t=l.report._getReport();if(!t)return;t.manager.layoutPanel.topic.remove()}
},this.removeRedoButton=function(e){
l.util._validateModeForAPI(arguments.callee),
this._isRemovable(e)&&(this._destroyWidgetsAndRefreshLayout(["cmdRedoPanel"]),
this._destroySeparatorIfEmptyPanel("historyButtonsPanel"))
},this.removeMainToolbar=function(e){
l.util._validateModeForAPI(arguments.callee),
this._isRemovable(e)&&this._destroyWidgetsAndRefreshLayout(["reportBtns"])
},this.setFieldListView=function(e){var t=l.report._getReport();if(t){
l.util._validateModeForAPI(arguments.callee);var r={CATEGORY:"CMDVIEWCATEGORY",
NAME:"CMDVIEWNAME",TYPE:"CMDVIEWTYPE",SCHEMA:"CMDVIEWSCHEMA"}
;r.hasOwnProperty(e)||l.log.error(this._msgs.UNSUPPORTED_VIEW(e),!0),
t.manager.fieldHelp.sortFields(r[e])}},this.showRepositoryButtons=function(e){
if(l.report._getReport()){
l.util._validateModeForAPI(arguments.callee),e=this._makeVisible(e)
;var t=i.byId("repositoryButtonsPanel"),n=cv.util.isShowing("repositoryButtonsPanel")
;t&&n!=e&&r.toggle(t,"hidden")}},this.removeReportActions=function(e){
var t=l.report._getReport();if(t&&(l.util._validateModeForAPI(arguments.callee),
this._isRemovable(e))){var r=t.id+"ReportFormatCmdDiv"
;this._destroyWidgetsAndRefreshLayout([r])}},this.showFieldList=function(e){
var t=l.report._getReport();if(t){
l.util._validateModeForAPI(arguments.callee),e=this._makeVisible(e)
;cv.util.isShowing("fieldListWrapper")!=e&&t.onToggleReportPane("cmdFields")}
},this.setIsFromTransformation=function(e){this.isFromTransformation=e}}
}),define("pentaho/analyzer/API",["./cv_api_report","./cv_api_operation","./cv_api_event","./cv_api_util","./cv_api_ui"],function(e,t,r,i,n){
return function(o){
this.report=new e(this,o),this.ui=new n(this),this.operation=new t(this),
this.properties={},this.event=new r(this),this.util=new i(this);var a=this
;this.log={_showStatus:function(e,t){
a.report._getReport().manager.showStatus(e,t)},info:function(e,t){
t&&this._showStatus(e,"INFO"),console.log("INFO: "+e)},warn:function(e,t){
t&&this._showStatus(e,"WARNING"),console.log("WARNING: "+e)},
error:function(e,t,r){if(r&&this._showStatus(e,"ERROR"),t)throw e
;console.log("ERROR: "+e)}},this.event.registerRenderListener(function(e,t,r){
t.event._showDisabledEventTitle(t.event.isEventDisabled("tableDoubleClick"),'td[type="member"] div[enabledeventtitle]'),
t.event._showDisabledEventTitle(t.event.isEventDisabled("tableDoubleClick"),'td[type="member"][enabledeventtitle]')
})}});