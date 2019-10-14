define("pentaho/analyzer/cv_base",["dojo/_base/declare","dojo/on","dojo/query","dijit/Menu","dijit/Dialog","dojo/ready","dojo/_base/lang","dojo/html","dojo/dom"],function(e,t,i,n,o,r,a,s,d){
a.mixin(window.cv,{prefs:{suppressMsg:{},fadeTime:250,wipeTime:250,isDebug:0,
skipDirtyAlert:!1},defaultNS:"http://www.pentaho.com",contextPath:"",
dojoWidgets:{},helpTopics:{},helpWin:null,securityToken:null,
nsResolver:function(e){return"http://www.pentaho.com"},getFieldHelp:null,
getActiveReport:null,init:function(){var e=d.byId("stok")
;e&&(cv.securityToken=e.value);var t=!1;try{
t=window.parent&&window.parent.PentahoMobile}catch(e){}
console_enabled||t||(document.getElementsByTagName("body")[0].className+=" pentaho-page-background")
}}),cv.extension=cv.extension||{},r(cv.init),dojoConfig.bindEncoding="utf8"
;var l=window.cvConst={dndObjectTypes:{gem:"G"},dndSourceTypes:{fieldList:"F",
layoutPanel:"B",reportArea:"R"}};l.dndTypes={
gemFromFieldList:l.dndObjectTypes.gem+l.dndSourceTypes.fieldList,
gemFromLayoutPanel:l.dndObjectTypes.gem+l.dndSourceTypes.layoutPanel,
gemFromReportArea:l.dndObjectTypes.gem+l.dndSourceTypes.reportArea}
}),define("pentaho/analyzer/cv_util",["dojo/_base/declare","dojo/_base/array","dojo/on","dojo/query","dojo/_base/lang","dijit/popup","dojo/dom-class","dojo/window","dojo/dom-style","dijit/registry","dojo/html","dojo/dom","dojo/topic","dojo/parser","dojox/fx","dojo/dnd/Manager","dojo/dnd/common","dojo/dom-geometry","dojox/xml/parser","dijit/MenuItem","dijit/MenuSeparator","dojo/dnd/Avatar","dijit/BackgroundIframe","dojo/has","dojo/sniff","dijit/PopupMenuItem","dijit/Tooltip","dijit/layout/TabController","dojo/cache","dojo/regexp","dijit/layout/_TabContainerBase","dijit/layout/TabContainer","dijit/DialogUnderlay","./cv_base","./visual/utils","dojo/string","dojo/request","pentaho/common/Messages"],function(declare,array,on,query,lang,popup,domClass,domWindow,style,registry,html,dom,topic,parser,fx,ManagerClass,dnd,geometry,xmlParser,MenuItem,MenuSeparator,Avatar,BackgroundIframe,has,sniff,PopupMenuItem,Tooltip,TabController,cache,regexp,_TabContainerBase,TabContainer,DialogUnderlay,_cv_base,localVisualUtils,_string,request,messages){
var Manager=ManagerClass.manager();cv.util={initDojoWidget:null,
alertErrorOnPageOpen:function(e,t){alert(e),t&&(window.location=t)},
delayThese:function(e,t,i,n){if(!e.length)return void("function"==typeof n&&n())
;void 0===i&&"number"==typeof t?(i=t,
t=function(){}):t||(t=function(){},i||(i=0)),setTimeout(function(){
e.shift()(),t(),cv.util.delayThese(e,t,i,n)},i)},checkNumber:function(e){
return""!==e&&!isNaN(Number(e))},checkPositiveInteger:function(e){
if(!cv.util.checkNumber(e))return!1;var t=parseInt(e)
;return!(t<=0||t!=parseFloat(e))},escapeHtml:function(e,t){
return e=e.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;"),
t||(e=e.replace(/'/gm,"&#39;")),e},escapeJavaScript:function(e){
return e.replace(/(["'\f\b\n\t\r])/gm,"\\$1")},getAttribute:function(e,t){
return e.getAttribute(t)},isValidElementName:function(e,t,i){var n=['"',"\\"]
;if(void 0===t&&(t=!1),
null==e||void 0===e)return messages.getString("dlgPropertiesBlankNameError")
;e=e.toLowerCase();var o=e
;if(""===(e=e.trim()))return messages.getString("dlgPropertiesBlankNameError")
;e=o;var r,a=cv.getFieldHelp()
;if(a.selectedMenuField&&(r=a.selectedMenuField.textContent.toLowerCase()),
i.length>0)for(p=0;p<=i.length-1;p++){
var s=i[p].getElementsByTagName("presentationFieldHelp")[0].getAttribute("displayLabel"),d=s.toLowerCase(),l=i[p].getAttribute("measureName"),c=l
;if(l=l?l.toLowerCase():l,(e===d||e===l)&&(t||d!==r)){
var u=i[p].getElementsByTagName("presentationFieldHelp")[0].getAttribute("hidden").toLowerCase()
;return u&&"true"===u?e===l?messages.getString("dlgPropertiesHiddenDuplicateNameRenamedError",[c,s]):messages.getString("dlgPropertiesHiddenDuplicateNameError"):e===l?messages.getString("dlgPropertiesDuplicateNameRenamedError",[c,s]):messages.getString("dlgPropertiesDuplicateNameError")
}}
for(var p=0;p<=e.length;p++)for(var g in n)if(e.charAt(p)===n[g])return messages.getString("dlgPropertiesInvalidCharacters")
;return!0},isValidMeasureName:function(e,t){var i=cv.getFieldHelp()
;return this.isValidElementName(e,t,i.getMeasureList())},
isValidAttributeName:function(e,t){
var i=cv.getFieldHelp(),n=i.selectedMenuField.getAttribute("formula"),o=i.get(n).getAttribute("hierarchy"),r=i.getHierarchyLevels(o)
;return this.isValidElementName(e,t,r)},
convertReportCalcMeasureToModel:function(e,t){
for(var i="[Measures].["+t+"]",n=cv.getFieldHelp().manager.report,o=n.reportDoc,r=o.getMetrics("EXPRESSION"),a=0;a<r.length;a++){
var s=r[a];if(s.getAttribute("id")===e){var d="measures"
;null!==s.getAttribute("gembarId")&&(d=s.getAttribute("gembarId"))
;var l=n.api.report.getLayoutFields(d),c=l.indexOf(e)
;-1!==c&&(n.api.report.removeLayoutField(d,e),
n.api.report.addLayoutField(d,i,c))}}this.updateMeasureReferences(e,t)},
updateMeasureReferences:function(e,t){var i="[Measures].["+t+"]";if(e!==i){
var n=cv.getFieldHelp().manager.report,o=xmlParser.innerXML(n.reportDoc.getReportNode())
;o=o.replace(new RegExp(regexp.escapeString(e),"g"),i);var r=cv.parseXML(o);try{
n.openReport(r.documentElement)}catch(e){n.history.current().exec(!0)}}},
createCalcMeasureAnnotation:function(e,t,i,n,o,r,a,s){var d={name:e,caption:i,
description:n,formatCategory:o,formatScale:r,calculateSubtotals:a,formula:t,
dimension:"Measures",createdInline:!0}
;this._createGenericCalcMeasureAnnotation(d,"CREATE_CALCULATED_MEMBER")},
createUpdateCalcMeasureAnnotation:function(e,t,i,n,o,r,a,s,d){var l={
originalName:e,name:t,caption:n,description:o,formatCategory:r,formatScale:a,
calculateSubtotals:s,formula:i,dimension:"Measures",createdInline:!0}
;this._createGenericCalcMeasureAnnotation(l,"UPDATE_CALCULATED_MEMBER")},
_createGenericCalcMeasureAnnotation:function(e,t){
var i=cv.getFieldHelp().manager.report,n={properties:e,source:{cube:i.cube},
type:t};i.modelAnnotations.push(n)},createShowHideFieldAnnotation:function(e){
var t=cv.getFieldHelp().manager.report,i=!this.isHiddenField(e),n=e.getAttribute("formula"),o=cv.getFieldHelp().get(n),r=t.api.util.parseMDXExpression(n)
;if("attributeHelp"===o.nodeName){
var a=o.getAttribute("hierarchy").replace(/[\[\]]/g,""),s=o.getAttribute("dimension").replace(/[\[\]]/g,"")
;0===a.indexOf(s+".")&&(a=a.substring(s.length+1));var d={properties:{name:r,
visible:!i,hierarchy:a,dimension:s},source:{cube:t.cube},
type:"SHOW_HIDE_ATTRIBUTE"}}else var d={properties:{name:r,visible:!i},source:{
cube:t.cube},type:"SHOW_HIDE_MEASURE"};t.modelAnnotations.push(d)
;var l=t.manager.updateCatalog(!0)
;if(void 0!==l)return t.modelAnnotations.pop(),void console.log(l)
;for(var c=[],u=cv.getActiveReport().reportDoc.getDrillColumns(),p=0;p<u.length;p++){
var g=cv.textContent(u[p])
;g!==n?(c[g]=!0,"true"==cv.util.getAttribute(u[p],"hidden")&&(c[g]=!1)):c[g]=!i}
if(cv.getActiveReport().reportDoc.replaceDrillColumns(c),i){
var m=this.findContainingGemBar(t,n)
;null!==m&&t.api.report.removeLayoutField(m,n),
t.history.add(new cv.ReportState("actionHideField",n))
}else t.history.add(new cv.ReportState("actionShowField",n))
;t.api.operation.refreshReport()},substituteParams:function(e,t){
var i="object"==typeof t?t:cv.util.toArray(arguments,1)
;return e.replace(/\%\{(\w+)\}/g,function(e,t){
if(void 0!==i[t]&&null!=i[t])return i[t];throw"Substitution not found: "+t})},
toArray:function(e,t){for(var i=[],n=t||0;n<e.length;n++)i.push(e[n]);return i},
summary:function(e,t){
return!t||e.length<=t?e:e.substring(0,t).replace(/\.+$/,"")+"..."},
sanitizeJSONString:function(e){if(!e)return null;var t=e
;return t=t.replace(/\/\*[\s\S]*\*\//,"")},connectPopupMenu:function(e,t){
for(var i=0;t&&i<t.length;++i){var n=t[i],o=this.getDojoWidget(n.id)
;o&&(on(o,"click",lang.hitch(n.src?n.src:e,n.handler)),on(o,"click",function(){
popup.close()}),n.disabled&&o.setDisabled(!0))}},showPopupMenu:function(e,t,i){
t+=7,i+=7;var n=(domWindow.getBox().w,domWindow.getBox().h)
;if(cv.api.event._emitBuildMenu(e,t,i)){popup.open({popup:e,x:t,y:i
}),i+e.domNode.offsetHeight>n&&(i=n-e.domNode.offsetHeight-30,popup.open({
popup:e,x:t,y:i}));var o=on(e,"blur",function(){popup.close(),o.remove()})
;e.focus()}},disableMenuItems:function(e,t){this.resetContextMenuItems(e)
;for(var i=cv.getFieldHelp(),n=t.getAttribute("formula"),o=this.isHiddenField(t),r=e.getChildren(),a=0;a<r.length;a++){
var s=r[a].id
;"cmdHideField"===s?cv.util.setMenuItem(r[a],o?"checked":"none"):"cmdFieldAbout"!==s&&o?cv.util.setMenuItem(r[a],null,"disabled"):cv.util.setMenuItem(r[a],null,"active")
}var d=i.getModelInfoValue(n,"InlineCreatedInline")
;if(d=d&&"true"===d.trim(),t.classList.contains("measure"))for(var l="true"===i.get(n,"calculated"),r=e.getChildren(),a=0;a<r.length;a++){
var s=r[a].id
;l?this._doesMenuItemApply(r[a],["calculated measure"])||this.hide(s):d||this._doesMenuItemApply(r[a],["measure"])||this.hide(s)
}else for(var r=e.getChildren(),a=0;a<r.length;a++)this._doesMenuItemApply(r[a],["level"])||this.hide(r[a].id)
},_doesMenuItemApply:function(e,t){if(e&&e.appliesTo){t.push("all");var n=!1
;for(i in t)n=n||array.indexOf(e.appliesTo,t[i])>=0;return n}return!1},
resetContextMenuItems:function(e){
for(var t=e.getChildren(),i=0;i<t.length;i++)this.show(t[i].domNode)},
destroyDojoWidgets:function(){for(var e in cv.dojoWidgets)try{
cv.dojoWidgets[e]&&cv.dojoWidgets[e].destroy(!0)}catch(e){}},
disconnectPopupMenu:function(e,t){for(var i=0;t&&i<t.length;++i){
this.getDojoWidget(t[i].id)}},displayWidget:function(e,t){
if(this.getDojoWidget(e)){var i=this.getDojoWidget(e).domNode
;i&&(t?style.set(i,"display",""):style.set(i,"display","none"))}},
getAncestorByClass:function(e,t){for(;e&&!domClass.contains(e,t);)e=e.parentNode
;return e},getFirstChildByClass:function(e,t){var i=query(" ."+t,e)
;if(void 0!==i&&i.length>0)return i[0]},getAncestorByTag:function(e,t){
for(t=t.toLowerCase();e;){if(e.tagName&&e.tagName.toLowerCase()==t)return e
;e=e.parentNode}return null},getDojoWidget:function(id){
if(cv.dojoWidgets[id])return cv.dojoWidgets[id];var wi=registry.byId(id)
;if(!wi){if(!(wi=dom.byId(id)))return null
;wi=parser.instantiate([wi]),wi=wi&&wi.length>0?wi[0]:null}
if(wi)with(this.initDojoWidget&&this.initDojoWidget(wi),
cv.dojoWidgets[id]=wi,wi.domNode.style)zIndex=1002;return wi},
stopDrag:function(){
domClass.remove(win.body(),["dojoDndCopy","dojoDndMove"]),array.forEach(this.events,function(e){
e.remove()}),this.events=[],this.avatar&&this.avatar.destroy(),this.avatar=null,
this.source=this.target=null,this.nodes=[],topic.publish("/dnd/cancel")},
helpdialog:null,getHelp:function(e){
if(lang.isObject(e)&&e.target&&(e=e.target.id),
e&&"null"!=e?e.indexOf(".html")<0&&(e=cv.helpTopics&&cv.helpTopics[e]?cv.helpTopics[e]:""):e="",
e=cv.contextPath+"help/topic.html?"+e,
window.location.search&&window.location.search.indexOf("embeddedHelp=true")>-1)return null==this.helpDialog&&(this.helpDialog=new cv.HelpDialog,
this.helpDialog.init()),void this.helpDialog.showDlg(e);var t=domWindow.getBox()
;cv.helpWin&&!cv.helpWin.closed&&cv.helpWin.close()
;var i=window.open(e,"helpWnd","height="+.8*t.h+",width="+.8*t.w+",menubar=0,status=0,toolbar=0,location=0,resizable=1")
;i&&(cv.helpWin=i),i.focus()},getSelectionList:function(e){
for(var t=e.getElementsByTagName("INPUT"),i=[],n=t.length,o=0;o<n;++o)t[o].checked&&i.push(t[o].name)
;return 0==i.length&&(i=null),i},hide:function(){
for(var e=0;e<arguments.length;++e)domClass.add(dom.byId(arguments[e]),"hidden")
},disableTextSelection:function(e){e.onselectstart=function(){return!1
},style.set(e,{"-moz-user-select":"-moz-none","-khtml-user-select":"none",
"-webkit-user-select":"none","user-select":"none"})},
initDivButton:function(e,t,i){
"string"==typeof e&&(e=dom.byId(e)),e&&(on(e,"mouseover",lang.hitch(this,"_divButtonActive")),
on(e,"mousedown",lang.hitch(this,"_divButtonPressed")),
on(e,"mouseout",lang.hitch(this,"_divButtonInactive")),
on(e,"click",lang.hitch(this,"_divButtonInactive")),
t?on(e,"click",lang.hitch(t,i)):i&&on(e,"click",i),
cv.util.disableTextSelection(e))},isHidden:function(e){
return domClass.contains(dom.byId(e),"hidden")},isHiddenField:function(e){
return domClass.contains(e,"hiddenField")||domClass.contains(e,"disabled")},
gravity:function(node,e){node=dom.byId(node);var mouse={y:e.clientY,x:e.clientX
},bb=geometry.position(node),nodecenterx=bb.x+bb.w/2,nodecentery=bb.y+bb.h/2
;with(cv.util.gravity)return(mouse.x<nodecenterx?WEST:EAST)|(mouse.y<nodecentery?NORTH:SOUTH)
},overElement:function(e,t){if(!e)return!1;var i;switch(t.type){case"mouseout":
case"mouseleave":if(t.target==e)return!1;break;default:if(t.target==e)return!0}
if("AREA"==e.tagName&&"RECT"==e.getAttribute("shape").toUpperCase()){
var n=e.coords.split(","),o=query("img[usemap='#"+e.parentNode.getAttribute("name")+"']")[0]
;i=geometry.position(o,!0),
i.x+=parseInt(n[0]),i.y+=parseInt(n[1]),i.h+=parseInt(n[4])-parseInt(n[1]),
i.w+=parseInt(n[3])-parseInt(n[0])}else i=geometry.position(e,!0)
;var r=t.clientX,a=t.clientY;return!(r>i.x+i.w||r<i.x||a>i.y+i.h||a<i.y)},
setButtonDisabled:function(e,t){if(e&&t!=e.disabled){if("IMG"==e.tagName){
var i=e.src.indexOf(".png")>-1?".png":".gif"
;e.src=t?e.src.replace(i,"_disabled"+i):e.src.replace("_disabled"+i,i)
}else t?domClass.add(e,"disabled"):domClass.remove(e,"disabled");e.disabled=t}},
_divButtonActive:function(e){
e.target.disabled||domClass.add(this.getAncestorByClass(e.target,"reportBtn"),"btnActive")
},_divButtonInactive:function(e){
var t=this.getAncestorByClass(e.target,"reportBtn")
;domClass.remove(t,"btnActive")},_divButtonPressed:function(e){e.target.disabled
},onToggleSectionCheckbox:function(e){e.target.checked?fx.wipeIn({
duration:cv.prefs.wipeTime,node:e.target.id+"DIV"}).play():fx.wipeOut({
duration:cv.prefs.wipeTime,node:e.target.id+"DIV"}).play()},
parseMDXExpression:function(e,t){var i=e.lastIndexOf("].[");if(-1==i)return""
;e=e.substring(i);var n=/\]\.\[(.+)\]$/,o=n.exec(e);if(!o)return"";var r=o[1]
;return r=r.replace("]]","]"),
"#null"==r?cvCatalog.attributeNullValue:r.search(/\S/)<0?cvCatalog.attributeBlankValue:t?cv.util.escapeHtml(r):r
},parseAjaxMsg:function(e){if("string"==typeof e){
if(e.indexOf('<form name="login"')>0){var t={loginCallback:function(){
cv.getActiveReport()&&cv.getActiveReport().refreshReport()}}
;if(console_enabled&&window.parent.authenticate)return window.parent.authenticate(t),
"sessionExpired"
;cv.getActiveReport()&&(cv.getActiveReport().setReportPropsDirty(!1),
cv.getActiveReport().history.setSaved()),window.location.reload()}
var i=e.indexOf("<message");if(i<0)return;var n=e.indexOf("</message>");if(n<0){
if((n=e.indexOf("/>",i))<0)return;n+=2}else n+=10
;e=cv.parseXML(e.substring(i,n)),cv.setDomDefaultNamespace(e)}
if(lang.isObject(e)&&e.documentElement&&"message"==e.documentElement.tagName){
for(var o=(e.documentElement.getAttribute("id"),
e.documentElement.attributes),r={},a=0;a<o.length;++a){var s=o.item(a)
;s.name&&(r[s.name]=s.value)}
var d=e.documentElement.selectSingleNode("cv:selectionItems")
;return null!=d&&cv.getActiveReport().reportDoc.replaceSelectionItems(d.cloneNode(!0)),
r}return null},parseURLQuery:function(e){
if(e||(e=window.location.search),0==e.length)return null
;for(var t=e.substring(1).split("&"),i={},n=0;n<t.length;++n){
var o=t[n].indexOf("=")
;o>0&&(i[t[n].substring(0,o)]=decodeURIComponent(t[n].substring(o+1)))}return i
},getURLQueryValue:function(e,t){var i=this.parseURLQuery(t);return i?i[e]:null
},removeNode:function(e){e&&e.parentNode&&e.parentNode.removeChild(e)},
setCommonMsgTooltip:function(e){if(e){
var t=this.getDojoWidget("commonMsgTooltip");t&&(t.domNode.innerHTML=e)}},
setDivActive:function(e,t){
t?domClass.add(e,"active"):domClass.remove(e,"active")},
setHelpTopics:function(e){for(var t=0;t<e.length;++t){
var i="string"==typeof e[t]?dom.byId(e[t]):e[t]
;i&&(on(i,"click",lang.hitch(this,"getHelp")),cv.helpTopics[e[t]]=e[++t])}},
setMenuItem:function(e,t,i){if("string"==typeof e&&(e=this.getDojoWidget(e)),e){
if(t){var n=e.iconNode
;t&&"checked"==t?(domClass.remove(n,"dijitNoIcon unchecked"),
domClass.add(n,"checked")):(domClass.remove(n,"dijitNoIcon checked"),
domClass.add(n,"unchecked"))}i&&e.setDisabled&&e.set("disabled","disabled"==i)}
},setSectionCollapsed:function(e){var t=!0,i=dom.byId(e)
;i&&("checkbox"==i.type?i.checked=!1:"IMG"==i.tagName&&(this.hide(i.id+"DIV"),
i.name="closed",
i.src=i.src.replace(/opened\./,"closed."),t=!1)),t&&dojox.fx.wipeOut({
duration:0,node:dom.byId(e+"DIV")}).play()},show:function(){
for(var e=0;e<arguments.length;++e)arguments[e].tagName?domClass.remove(arguments[e],"hidden"):domClass.remove(dom.byId(arguments[e]),"hidden")
},updateMenuItemCaption:function(e,t,i){var n=this.getDojoWidget(e)
;n&&(t=cvCatalog[t],i&&(t=cv.util.substituteParams(t,i)),n.setLabel(t))},
TRACE:function(e){if(!(cv.prefs.isDebug<2))try{
if("_INIT"==e)this.TRACEWIN=window.open("","cvtrace","resizable=1,scrollbars=1"),
this.TRACEWIN.document.open(),
this.TRACEWIN.document.writeln("<b>INITIALIZE ClearView JS Trace</b><p>");else if("_EXIT"==e)this.TRACEWIN.document.writeln("<b>EXIT ClearView JS Trace</b>"),
this.TRACEWIN.document.close(),
this.TRACEWIN.close();else if("_START"==e)this.TSBASE=this.TSSTART=new Date,
this.TRACEWIN.document.writeln("<b>Start Profiling at: "+this.TSSTART+"</b><br>");else if("_END"==e)this.TRACEWIN.document.writeln("<b>Finish Profiling - Total: "+(new Date-this.TSSTART)+" ms</b><p>");else if("_CLEAR"==e)this.TRACEWIN.document.clear();else{
var t=new Date
;this.TRACEWIN.document.writeln("&nbsp;&nbsp;&nbsp;&nbsp;"+e+": "+(t-this.TSBASE)+" ms<br>"),
this.TSBASE=new Date}}catch(e){}},createEvent:function(e){var t=new Object
;return t.target=e,
t.clientX=0,t.clientY=0,t.stopPropagation=function(){},t.preventDefault=function(){},
t},convertStringtoDate:function(e){return new Date(Date.parse(e))},
formatDateString:function(e){
var t=this.convertStringtoDate(e),i=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],n=i[t.getMonth()],o=t.getDate(),r=t.getFullYear(),a=t.toLocaleTimeString()
;return 0==a.indexOf("0")&&(a=a.substring(1)),n+" "+o+", "+r+" "+a},
goToURL:function(e){try{var t=e.href.lastIndexOf("#")
;-1!=t&&(e.href=e.href.substring(0,t)),window.location=e}catch(e){
if(!(has("ie")&&e.message.indexOf("Unspecified error")>-1))throw e}},
selectByValue:function(e,t){
for(var i=0;i<e.length;i++)e.options[i].selected=e.options[i].value==t},
addChartMenuItems:function(e){
var t=this,i=cv.api.ui._visualRegistry.getAllByCategory(),n=cv.vizApiVersion,o=[],r=0
;return i.forEach(function(i){var a=i.models
;r>0&&a.length>0&&e.addChild(new MenuSeparator({id:"menu-item100000"+r
})),r++,a.forEach(function(i){
var r=i.type,a=null!=r.v2Spec,s=localVisualUtils.getVizOptionsAnnotation(r.id),d=s&&s.isStockVisualization,l=a&&2===n,c=!a&&n>=3,u=(a?r.v2Id:r.id)+"",p=r.label+""
;(l||c||!d)&&o.push(t._createChartMenuItem(e,u,p))})}),o},
_createChartMenuItem:function(e,t,i){var n={id:t,label:i,customType:!0
},o=new MenuItem(n)
;return domClass.remove(o.iconNode,"dijitNoIcon"),domClass.add(o.iconNode,"unchecked"),
e.addChild(o),o},clearCache:function(e,t,i,n){var o=this
;request(cv.contextPath+"service/ajax/clearCache",{method:"POST",data:{
catalog:dom.byId("REPORT_catalog").value,time:(new Date).getTime()},sync:!0
}).then(function(r){
"true"==r?(n||o.showStatus("infoCacheCleared","Info",e),t&&t()):(n||o.showStatus("errorClearCache","Error",e),
i&&i())},function(t){n||o.showStatus("errorClearCache","Error",e),i&&i()
},function(e){})},showStatus:function(e,t,i){var n=cvCatalog[e]
;n||(n=e),cv.isMobile()?i.rptDlg.showConfirm(n):console_enabled&&window.parent.mantle_showMessage?window.parent.mantle_showMessage(t,n):alert(n)
},isShowing:function(e){var t=dom.byId(e)
;return!!t&&(0!=parseInt(t.style.width)&&"none"!=t.style.display&&"none"!=style.getComputedStyle(t).display)
},_sendRequest:function(e,t){return request(e,t)},
saveReport:function(e,t,i,n,o,r){
if(void 0!==r&&null!=r||(r=!1),e.modelAnnotations.length)return e.pendingSaveParams.reportAction=t,
e.pendingSaveParams.reportName=i,
e.pendingSaveParams.reportPath=n,e.pendingSaveParams.reportErrorCallback=o,
e.pendingSaveParams.suppressSuccessNotification=r,
cv.rptEditor.saveModifiedModel(),!1;console.log("now saving report")
;var a=!0,s={action:t,name:_string.trim(i),path:n};e.saveUIAttributes()
;var d=e.reportDoc.getUIAttributes()
;return d.setAttribute("showFieldList",this.isShowing("fieldListWrapper")?"true":"false"),
d.setAttribute("showFieldLayout",this.isShowing("layoutPanelWrapper")?"true":"false"),
d.setAttribute("showFilterPanel","filterPane"==e.topPaneId?"true":"false"),
d.setAttribute("fieldListView",e.manager.fieldHelp.currentView),
s.reportXML=e.getReportXml(),
s.time=(new Date).getTime(),this._sendRequest(cv.contextPath+"service/ajax/saveReport",{
data:s,sync:!0,headers:{"Content-Encoding":"utf8"},method:"POST"
}).then(function(t){t=cv.parseXML(t),cv.setDomDefaultNamespace(t)
;var i=t.documentElement
;if("success"!=i.getAttribute("type"))a=!1,"function"==typeof o?o():"object"==typeof o&&o.error();else{
e.reportDoc.replaceStorageNode(i.selectSingleNode("cv:commonStorageAttributes"))
;var n=e.reportDoc.getReportProperty("name")
;e.setReportName(n),document.title=n,
e.setReportPropsDirty(!1),e.history.setSaved(),
console_enabled&&window.parent.mantle_showMessage||r||e.manager.showStatus("successSaveReport","Info"),
"object"==typeof o&&o.success()}},function(t){
e.manager.showStatus("errorSaveReport","Error")},function(e){}),a},
updateCatalog:function(e,t,i,n){var o=cv.io.getFieldHelpXml(t.catalog,t.cube,n)
;try{o=dojo.fromJson(o)}catch(e){o={status:"EXCEPTION"}}
if("SUCCESS"!=o.status)return!e&&this.showStatus(o.message,"Error"),
void 0==o.message?"":o.message;i.updateXml(o.fieldHelpXml)},
onToggleAutoRefresh:function(e,t,i){var n=!cv.prefs.autoRefresh
;t.setAutoRefresh(n,i),n&&!t.history.isStateRefreshed()&&t.refreshReport(!0)},
findContainingGemBar:function(e,t){var i=e.api.ui.listGembarIds();for(idx in i){
var n=i[idx],o=e.api.report.getLayoutFields(n)
;if(-1!=array.indexOf(o,t))return n}return null}
},cv.util.gravity.NORTH=1,cv.util.gravity.SOUTH=2,
cv.util.gravity.EAST=4,cv.util.gravity.WEST=8,declare("cv.Collapsible",null,{
constructor:function(e,t,i,n,o){
this.header=e,this.body=t,this.cssOpen=n||"folderClose",
this.cssClose=o||"folderOpen",
this.isOpen=1==i,this.setState(this.isOpen,!0),cv.util.disableTextSelection(e),
on(e,"click",lang.hitch(this,"onClickHeader"))},onClickHeader:function(e){
this.animation&&"playing"==this.animation.status()||(this.isOpen=!this.isOpen,
this.setState(this.isOpen,!0)),e&&e.stopPropagation()},setState:function(e,t){
e?(domClass.remove(this.header,this.cssOpen),
domClass.add(this.header,this.cssClose),
t?(this.body.style.display="block",this.animation=null):this.animation=fx.wipeIn({
duration:cv.prefs.wipeTime,node:this.body
}).play()):(domClass.remove(this.header,this.cssClose),
domClass.add(this.header,this.cssOpen),
t?(this.body.style.display="none",this.animation=null):this.animation=fx.wipeOut({
duration:cv.prefs.wipeTime,node:this.body}).play())}
}),declare("cv.dnd.Avatar",[Avatar],{constructor:function(e,t){
this.manager=e,this.node=t},update:function(){}
}),declare("cv.dnd.Manager",[ManagerClass],{opacity:.8,
startDrag:function(e,t,i){
t&&0!=t.length&&(cv.util.isHiddenField(t[0])||cv.getActiveReport().isResizing||cv.api.event.isEventDisabled("dragAndDrop")||cv.getActiveReport().isEditDisabled()||this.inherited(arguments))
},makeAvatar:function(){var formula=this.nodes[0].getAttribute("formula"),node
;if(formula){node=document.createElement("DIV");var dragClass
;if(domClass.contains(this.nodes[0],"filterItem")||domClass.contains(this.nodes[0],"filterGroup")){
if(dragClass="filterDragObject",
0==this.nodes[0].id.indexOf("filter_metric"))node.innerHTML=cvCatalog.filterMetric;else{
var spans=this.nodes[0].getElementsByTagName("span")
;node.innerHTML=cv.textContent(spans[0])}
node.setAttribute("formula",this.nodes[0].id)
}else dragClass=cv.getFieldHelp().isAttribute(formula)?"attributeDragObject":"metricDragObject",
node.innerHTML=cv.util.escapeHtml(cv.textContent(this.nodes[0])),
node.setAttribute("formula",formula)
;domClass.add(node,"commonDragObject"),dragClass&&domClass.add(node,dragClass),
this.opacity<1&&style.set(node,"opacity",this.opacity)}else if("DB"==this.type){
node=document.createElement("DIV");var box=geometry.position(this.nodes[0])
;with(node.style)border="2px dashed black",
height=box.h+"px",width=box.w+"px",backgroundColor="silver"
;this.opacity<1&&style.set(node,"opacity",this.opacity)}else{
node=this.nodes[0].cloneNode(!0),
this.dragClass&&domClass.add(node,this.dragClass),
this.opacity<1&&style.set(node,"opacity",this.opacity)
;var ltn=node.tagName.toLowerCase(),isTr="tr"==ltn;if(isTr||"tbody"==ltn){
var doc=this.nodes[0].ownerDocument,table=doc.createElement("table");if(isTr){
var tbody=doc.createElement("tbody")
;table.appendChild(tbody),tbody.appendChild(node)}else table.appendChild(node)
;for(var tmpSrcTr=isTr?this.nodes[0]:this.nodes[0].firstChild,tmpDstTr=isTr?node:node.firstChild,domTds=tdp.childNodes,cloneTds=tmpDstTr.childNodes,i=0;i<domTds.length;i++)cloneTds[i]&&cloneTds[i].style&&(cloneTds[i].style.width=geometry.getContentBox(domTds[i]).w+"px")
;node=table}}if(has("ie")<7&&this.createIframe){
with(node.style)top="0px",left="0px";var outer=document.createElement("div")
;outer.appendChild(node),
this.bgIframe=new BackgroundIframe(outer),outer.appendChild(this.bgIframe.iframe),
node=outer}
return node.style.zIndex=999,node.style.position="absolute",new cv.dnd.Avatar(dnd._manager,node)
}}),dnd._manager=new cv.dnd.Manager,lang.extend(MenuItem,{onClick:function(){
popup.close()}}),lang.extend(_TabContainerBase,{_setupChild:function(e){
this.inherited("_setupChild",arguments)}})
}),define("pentaho/analyzer/analyzer-selectSchema",["./cv_base","./cv_util"],function(){
"use strict"});