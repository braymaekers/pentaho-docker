/*!
 * HITACHI VANTARA PROPRIETARY AND CONFIDENTIAL
 *
 * Copyright 2002 - 2019 Hitachi Vantara. All rights reserved.
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
define(
  ["dojo/on", "dojo/query", "dojo/_base/lang", "dijit/layout/TabContainer", "dijit/layout/ContentPane",
    "dijit/registry", "dojo/dnd/Avatar", "dojo/topic", "dojo/dom", "dojo/dom-style",
    "dojo/dnd/Manager", "dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", "dijit/CheckedMenuItem",
    "dojo/dom-geometry", "dojo/dnd/Source", "dojo/dnd/Target", "dojo/parser", "dojo/store/Observable", "dojo/aspect",
    "pentaho/common/ExpressionTree", "dojo/has", "dojo/sniff", "dojo/json", "dijit/Tooltip", "dojo/string",
    "dojo/_base/window", "dojo/window", "dojo/keys", "dojo/store/Memory", "dojo/dom-attr",
    "pentaho/common/GlassPane", "dojo/_base/event", "dojo/touch",
    "common-ui/prompting/api/PromptingAPI", "amd!cdf/lib/jquery.blockUI",
    'common-ui/underscore', "cdf/dashboard/Utils"
  ],
  function(on, query, lang, TabContainer, ContentPane, registry, Avatar, topic, dom, style, ManagerClass,
    array, domClass, construct, CheckedMenuItem, geometry, Source, Target, parser, Observable, aspect, ExpressionTree,
    has, sniff, json, Tooltip, string, baseWin, win, keys, Memory, attr, GlassPane, event, touch,
    PromptingAPI, $, _, Utils) {


window.registry = registry;

var _api; // Initialized when view is created

/*
 This is the base controller class
 */
pentaho.pir.view = function() {
  this.sidePanelOpen = true;
  this.dragging = false;
  this.reportConnectionHandles = [];
  this.modelSelectDialog = registry.byId("modelSelectDialog");
  this.pageSetupDialog = registry.byId("pageSetupDialog");
  this.messageBox = registry.byId("messageBoxDialog");
  this.toolbar1BoldBtn = registry.byId("toolbar1.bold");
  this.toolbar1ItalicBtn = registry.byId("toolbar1.italic");
  this.toolbar1AlignLeftBtn = registry.byId("toolbar1.alignLeft");
  this.toolbar1AlignCenterBtn = registry.byId("toolbar1.alignCenter");
  this.toolbar1AlignRightBtn = registry.byId("toolbar1.alignRight");
  this.toolbar1NewBtn = registry.byId("toolbar1.new");
  this.toolbar1OpenBtn = registry.byId("toolbar1.open");
  this.toolbar1SaveBtn = registry.byId("toolbar1.save");
  this.toolbar1SaveAsBtn = registry.byId("toolbar1.saveAs");
  this.toolbar1EditBtn = registry.byId("toolbar1.edit");
  this.toolbar1UndoBtn = registry.byId("toolbar1.undo");
  this.toolbar1RedoBtn = registry.byId("toolbar1.redo");
  this.pageNumberControl = registry.byId("pageNumberControl");
  this.toolbar1ForeColorBtn = registry.byId("toolbar1.foreColorBtn");
  this.toolbar1BackColorBtn = registry.byId("toolbar1.backColorBtn");
  this.toolbar1SelectAllBtn = registry.byId("toolbar1.selectAll");
  this.toolbar1DeleteBtn = registry.byId("toolbar1.delete");
  this.toolbar1CopyBtn = registry.byId("toolbar1.copy");
  this.toolbar1PasteBtn = registry.byId("toolbar1.paste");
  this.toolbar1FilterToggle = registry.byId("toolbar1.filterToggle");
  this.toolbar1LayoutToggle = registry.byId("toolbar1.layoutToggle");
  this.toolbar1ParameterToggle = registry.byId("toolbar1.parameterToggle");
  this.toolbar1ClearCache = registry.byId("toolbar1.clearCache");
  this.toolbarSpinner = registry.byId("toolbar1.spinner");
  this.toolbar1exportPDF = registry.byId("toolbar1.exportPDF");
  this.toolbar1exportExcel = registry.byId("toolbar1.exportExcel");
  this.toolbar1exportExcel2007 = registry.byId("toolbar1.exportExcel2007");
  this.toolbar1exportCSV = registry.byId("toolbar1.exportCSV");
  this.toolbar1exportHTML = registry.byId("toolbar1.exportHTML");
  this.toolbarExportBtn = registry.byId("toolbar1.exportReportButton");
  this.rptMenuSortAscOption = registry.byId("rpt-menu-sort-asc");
  this.rptMenuSortDescOption = registry.byId("rpt-menu-sort-desc");
  this.rptMenuSortNoneOption = registry.byId("rpt-menu-sort-none");
  this.rptMenuSummary = registry.byId("summarysubmenu");
  this.rptMenuSummaryAvg = registry.byId("rpt-menu-summary-avg");
  this.rptMenuSummaryMin = registry.byId("rpt-menu-summary-min");
  this.rptMenuSummaryMax = registry.byId("rpt-menu-summary-max");
  this.rptMenuSummarySum = registry.byId("rpt-menu-summary-sum");
  this.rptMenuSummaryCount = registry.byId("rpt-menu-summary-count");
  this.rptMenuSummaryCountDistinct = registry.byId("rpt-menu-summary-count-distinct");
  this.rptMenuSummaryNone = registry.byId("rpt-menu-summary-none");
  this.rptMenuAggSubmenuOpt = registry.byId("aggsubmenuopt");
  this.rptMenuAggSubmenu = registry.byId("aggsubmenu");
  this.rptMenuAggNone = registry.byId("rpt-menu-agg-none");
  this.rptMenuMoveLeft = registry.byId("rpt-menu-move-left");
  this.rptMenuMoveRight = registry.byId("rpt-menu-move-right");
  this.dataTab = registry.byId("datatab");
  this.propertiesTab = registry.byId("propertiestab");
  this.generalTab = registry.byId("generaltab");
  this.sortSubMenu = registry.byId("sortsubmenu");
  this.removeSubMenu = registry.byId("removesubmenu");
  this.moveLeftOpt = registry.byId("rpt-menu-move-left");
  this.moveRightOpt = registry.byId("rpt-menu-move-right");
  this.moveSubMenu = registry.byId("movesubmenu");
  this.messageBoxCallback1 = null;
  this.messageBoxCallback2 = null;
  this.fullToolbar = true;
  this.toolbarCoreOnly = true;
  this.foreColorPicker = registry.byId('foreColorPicker');
  this.backColorPicker = registry.byId('backColorPicker');
  this.fieldAddColumnOpt = registry.byId("fieldAddColumn");
  this.fieldAddGroupOpt = registry.byId("fieldAddGroup");
  this.fieldFilterOpt = registry.byId("fieldFilter");
  this.glassPane = new GlassPane();
  this.adminReportModelOpt = registry.byId("adminReportModel");
  this.adminQueryOpt = registry.byId("adminQuery");
  this.adminSQLOpt = registry.byId("adminSQL");
  this.adminVersionOpt = registry.byId("adminVersion");

  this.labelsEditDialog = registry.byId("labelseditdialog");
  this.labelEditButton = registry.byId("labelEditButton");
  this.labelsEditboxDiv = dom.byId('labelseditboxdiv');
  this.labelsEditbox = dom.byId('labelseditbox');
  this.labelEditChangeActive = false;

  this.usedColors = {};
  this.menuDiv = dom.byId('menu-container');
  this.fontList1 = registry.byId('fontlist1');
  this.fontSizeList1 = registry.byId('fontsize1');
  this.menuButton = registry.byId('rpt-menu-button');
  this.menuImageButton = dom.byId('rpt-menu-image-button');
  this.menuButton.showLabel=false;
  this.selectedSort = -1;
  this.selectedItems = [];
  this.selectedColor = null;
  this.selectedBackgroundColor = null;
  this.selectedBorder = '1px dashed #000';
  this.mouseOverBorder = '1px dotted white';
  this.mouseOverCursor = 'move';
  this.mouseOverBackgroundImage = 'url(resources/web/images/bg.png)';
  this.selectedBackgroundImage = 'url(resources/web/images/bg2.png)';
  this.selectedBackgroundRepeat = 'repeat';
  this.mouseOver = {};
  this.columnHeaderIdBase = 'rpt-column-header-';
  this.columnValueIdBase = 'rpt-column-value-';
  this.groupHeaderIdBase = 'rpt-group-header-label-';
  this.groupDndSourceBase = 'group-dnd-source-';
  this.groupSummaryIdBase = 'rpt-group-footer-summary-';
  this.reportSummaryIdBase = 'rpt-report-footer-summary-';
  this.columnBlockIdBase = 'column-block-';
  this.reportContentDiv = dom.byId('reportContent');
  this.reportControlPanel = dom.byId('reportControlPanel');
  this.dragSpan = dom.byId('dragspan');
  this.glassPaneStack = 0;
  this.canResize = false;
  this.currentForeColor = null;
  this.currentBackColor = null;
  this.currentFont = null;
  this.currentFontSize = null;
  this.busyStack = 0;
  this.showColorPicker = false;
  this.dndZones = [];
  this.dndTargets= [];
  this.columnPanels = [];
  this.dragLeftArrow = null;
  this.flagsDisplayed = false;
  this.flags = [];
  this.TipsStartupSettings = 'pir_tips_on_startup';
  this.showMenuButtons = true;
  this.menuButtonsStartupSettings = 'pir_menu_buttons';
  this.controlsShown = false;
  this.dataAccessLoaded = false;

  this.formatBuffer = null;
  this.dataFormatBuffer = null;

  // setup the aggregation menu options
  this.fieldAggOptionMap = {};

  this.trashcan = dom.byId("trash-dnd-target");

  this.filterDialog = registry.byId("filterDialog");

  this.filterIndicator = registry.byId("filterToolbarIndicator");
  this.fieldList = registry.byId("fieldlist");

  this.advancedFilterWidget = registry.byId("advancedFilterWidget");
  this.advancedFilterLink = dom.byId("advancedFilterLink");
  this.applyFilterButton = dom.byId("applyFilterButton");

  this.editMode = null;

  // advanced filter data structure
  this.filterStore = new Observable(new pentaho.pir.AdvancedFilterStore());

  Avatar.prototype._generateText = function(){ return ""; };

  _api = new PromptingAPI('promptPanelContainer');

  this._createPromptPanelFetchCallback = _.once(function(paramDefn) {
    this.promptApi.ui.setBlockUiOptions({
      message: '',
      overlayCSS: {
        backgroundColor: '#000000',
        opacity: 0.6,
        cursor: 'wait'
      }
    });

    this.promptApi.event.submit(function() {
      // Do not track changes made from the parameter panel
      controller.startUndo();
      this.refresh();
    }.bind(this));

    this.promptApi.event.afterUpdate(function(){
      if (view.hasVisibleParameters(model.report)) {
        domClass.add("parameterPanelHint", "hidden");
      } else {
        domClass.remove("parameterPanelHint", "hidden");
      }
      view.resize();
    });
    this.promptApi.operation.init();
  });
}

/**
 * Gets the prompt api instance
 *
 * @type string
 * @readonly
 */
Object.defineProperty(pentaho.pir.view.prototype, "promptApi", { get: function() { return _api; }});

/**
 * Gets a property value from the state object in the Prompting API.
 *
 * @param prop The property which value to fetch.
 *
 * @private
 */
pentaho.pir.view.prototype._getStateProperty = function(prop) {
  if (controller.isParamDefnInitialized()) {
    return this.promptApi.operation.state()[prop];
  }
  return null;
}

pentaho.pir.view.prototype.showInvalidFilterMessage = function() {
  // Ask the user to delete the prompt by changing the parameter name
  view.showMessageBox(
    view.getLocaleString("InvalidFilterErrorMessage"),
    view.getLocaleString('InvalidFilterErrorTitle'),
    view.getLocaleString('Ok_txt'));
}

pentaho.pir.view.prototype.refresh = function() {
  if (typeof controller.cancelCurrentAsyncJob !== 'undefined') {
    controller.cancelCurrentAsyncJob();
  }
  controller.refresh();
}

pentaho.pir.view.prototype.addBusy = function() {
  this.busyStack++;
  this.toolbarSpinner.set('disabled', false);
}

pentaho.pir.view.prototype.removeBusy = function() {
  if (this.busyStack > 0) {
    this.busyStack--;
  }
  if (this.busyStack == 0) {
    this.toolbarSpinner.set('disabled', true);
  }
}

pentaho.pir.view.prototype.setupDojoList = function( listId, messageBase ) {
  var list = registry.byId(listId);

  // remove existing options
  for(var idx=list.getOptions().length-1; idx>=0; idx--){
    list.removeOption(idx);
  }

  var idx = 1;
  var opts = [];
  while(true && list) {
    var valueKey = messageBase+'_'+idx;
    var value = this.getLocaleString(messageBase+'_'+idx);
    var label = this.getLocaleString(messageBase+'_LABEL_'+idx);
    if( value == valueKey ) {
      break;
    }
    var opt = {
      value: value,
      label: label ? label : value };

    var opt2 = list._getMenuItemForOption(opt);

    opts.push(opt);
    idx++;
  }
  list.addOption(opts);

}

pentaho.pir.view.prototype.localizeCtrl = function(key, text) {

  var prop = null;
  var e = null;
  var id = null;
  if(key.indexOf('_label') == key.length-6 ) {
    id = key.substr(0, key.length-6);
    prop = 'label';
  }
  else if(key.indexOf('_title') == key.length-6 ) {
    id = key.substr(0, key.length-6);
    prop = 'title';
  }
  else if(key.indexOf('_content') == key.length-8 ) {
    id = key.substr(0, key.length-8);
    prop = 'inner';
  }
  else if(key.indexOf('_legend') == key.length-7 ) {
    id = key.substr(0, key.length-7);
    prop = 'legend';
  }
  if(id != null) {
    if(this[id]) {
      e = this[id];
    } else {
      e = registry.byId(id);
      if(!e) {
        e = dom.byId(id);
      }
    }
  }
  var index = -1;
  if(!e) {
    // see if there are indexed items
    e = dom.byId(id+'1');
    if(e) {
      index = 1;
    }
  }
  while(e && prop) {
    if(prop == 'inner') {
      e.innerHTML = text;
    }
    else if(prop == 'legend') {
      // this is for field set legends
      if (e.firstElementChild === undefined) {
        var child = e.firstChild;
        while (child) {
          if (child.nodeType == 1 /*Node.ELEMENT_NODE*/) {
            child.innerHTML = text;
            break;
          }
          child = child.nextSibling;
        }
      }
      else {
        e.firstElementChild.innerHTML = text;
      }
    }
    else if(prop == 'label' && e.setLabel) {
      // this is for Dojo menu items
      e.setLabel(text);
    }
    else if(e.set) {
      e.set(prop, text);
    }
    else if(prop == 'title' && e.title) {
      e.title = text;
    }
    if(index != -1) {
      index++;
      e = dom.byId(id+index);
    } else {
      e = null;
    }
  }

}

pentaho.pir.view.prototype.localizeAll = function() {

  var key;
  // inject localization strings into UI elements using a naming convention
  var bundle = pentaho.common.Messages.getBundle('pir');
  if (bundle) {
    for (key in bundle) {
      if (bundle.hasOwnProperty(key)) {
        this.localizeCtrl(key, this.getLocaleString(key));
      }
    }
  }

  this.setupDojoList('numericformats', 'Editor_NUMERIC_FORMAT');
  this.setupDojoList('dateformats', 'Editor_DATE_FORMAT');
  this.setupDojoList('fontlist1', 'Editor_FONT');
  this.setupDojoList('fontsize1', 'Editor_FONT_SIZE');

  model.defaultReportTitle = this.getLocaleString('DefaultReportTitle');

  this.missingLabelText = this.getLocaleString('MissingLabelText');

  model.defaultReportFooter = this.getLocaleString('DefaultReportFooter');
  model.defaultTopLeftHeader = this.getLocaleString('DefaultTopLeftHeader');
  model.defaultTopRightHeader = this.getLocaleString('DefaultTopRightHeader');
  model.defaultBottomLeftFooter = this.getLocaleString('DefaultBottomLeftFooter');
  model.defaultBottomRightFooter = this.getLocaleString('DefaultBottomRightFooter');
  model.defaultGroupTotalsLabel = this.getLocaleString('DefaultGroupTotalsLabel');

  // set all the ok, cancel etc strings

  var txt = this.getLocaleString('Ok_txt');

  this.rptMenuSummaryAvg.set('label', this.getLocaleString('AGG_TYPES_AVERAGE'));
  this.rptMenuSummaryMin.set('label', this.getLocaleString('AGG_TYPES_MINIMUM'));
  this.rptMenuSummaryMax.set('label', this.getLocaleString('AGG_TYPES_MAXIMUM'));
  this.rptMenuSummarySum.set('label', this.getLocaleString('AGG_TYPES_SUM'));
  this.rptMenuSummaryCount.set('label', this.getLocaleString('AGG_TYPES_COUNT'));
  this.rptMenuSummaryCountDistinct.set('label', this.getLocaleString('AGG_TYPES_COUNT_DISTINCT'));
  this.toolbar1ClearCache.set('title', this.getLocaleString('RefreshReportData_Title'));
  this.toolbarSpinner.set('title', this.getLocaleString('toolbarSpinner_label'));

//    dom.byId('messageBoxDialogOk').innerHTML = txt;
//    this works for dojo toolbar button tooltips
//    this.toolbar1BoldBtn.set('label', 'tip 1');

//    this works for dojo dialog titles
//    this.modelSelectDialog.set('title',this.nlsStrings.SELECT_DATA_SOURCE);
//    dom.byId('modelSelectDialogComment').innerHTML = this.nlsStrings.SELECT_DATA_SOURCE_COMMENT

//    this works for HTML buttons
//    dom.byId('modelSelectDialogOk').innerHTML = 'mmm';

//    this sets the text for a dojo toolbar button that has a label (e.g. font)
//    this.toolbar1FontListBtn.set('label','label1');

//    this sets the tooltip for a dojo toolbar button that has a label (e.g. font)
//    this.toolbar1FontListBtn.set('title','title2');

//    this could be used to identify dojo objects
//    this.toolbar1FontListBtn.baseClass);

//    this sets the text for a dojo tab
//    registry.byId("datatab").set('title','title3');

}

pentaho.pir.view.prototype.getLocaleString = function(key, substitutionVars) {
  var str = pentaho.common.Messages.getString(key, substitutionVars);
// enable this line to test localization - it puts [[ and ]] around every localizaed string
  if(this.localizeTest) {
    str = (key == 'defaultPageFormat') ? str : (str == key) ? key : '[['+str+']]';
  }
  return this.decodeHtmlDecimalEntity(str);
}

var decodeHelper = null;
pentaho.pir.view.prototype.decodeHtmlDecimalEntity = function(html){
  try{
    if(decodeHelper == null) {
      decodeHelper = document.getElementById("decodeHelper");
    }
    if(decodeHelper.innerHTML != undefined){
      decodeHelper.innerHTML = html;
    }
    else{
      decodeHelper.innerText = html; // IE8
    }
    return decodeHelper.value;
  }
  catch(e){
    return html;
  }
}

pentaho.pir.view.prototype.setGlassPaneOpacity = function(opacity) {
  return;
  var pane = dom.byId('glasspane')
  style.set( pane, 'filter', 'alpha(opacity='+(opacity*100)+')');
  style.set( pane, 'opacity', ''+opacity);
  if(opacity == 1) {
//        style.set( pane,  'backgroundColor',  '#cccccc');
  } else {
//        style.set( pane,  'backgroundColor',  '#808080');
  }
}

pentaho.pir.view.prototype.showGlassPane = function(opacity) {
  if(this.glassPaneStack <1) {
    // its already showing
    this.setGlassPaneOpacity(opacity);
    this.glassPane.show();
  }
  this.glassPaneStack = this.glassPaneStack + 1;
}

pentaho.pir.view.prototype.hideGlassPane = function() {
  if(this.glassPaneStack <= 1) {
    this.glassPane.hide();
  }
  if(this.glassPaneStack > 0) {
    this.glassPaneStack = this.glassPaneStack - 1;
  }
}

pentaho.pir.view.prototype.hideEditModeSwitchButton = function() {
  style.set(this.toolbar1EditBtn.domNode, 'display', 'none');
  style.set(dom.byId('editSeparator'), 'display', 'none');
}

pentaho.pir.view.prototype.hideRepositoryButtons = function() {
  style.set(this.toolbar1NewBtn.domNode, 'display', 'none');
  style.set(this.toolbar1OpenBtn.domNode, 'display', 'none');
  style.set(this.toolbar1SaveBtn.domNode, 'display', 'none');
  style.set(this.toolbar1SaveAsBtn.domNode, 'display', 'none');
  style.set(dom.byId('repositorySeparator'), 'display', 'none');
}

pentaho.pir.view.prototype.showRepositoryButtons = function() {
  style.set(this.toolbar1NewBtn.domNode, 'display', '');
  style.set(this.toolbar1OpenBtn.domNode, 'display', '');
  style.set(this.toolbar1SaveBtn.domNode, 'display', '');
  style.set(this.toolbar1SaveAsBtn.domNode, 'display', '');
  style.set(dom.byId('repositorySeparator'), 'display', '');
}

/**
 * Hides the message box.
 * @param callback Optional callback
 */
pentaho.pir.view.prototype.closeMessageBox = function(callback) {
  this.hideGlassPane();
  if (callback) {
    var onHideHandle = on(this.messageBox, "Hide", function() {
      callback.call();
      onHideHandle.remove();
    });
  }
  this.messageBox.hide();
}

pentaho.pir.view.prototype.showMessageBox = function( message, dialogTitle, button1Text, button1Callback, button2Text, button2Callback, blocker ) {

  if(this.messageBox.shown) {
    // hide it then show the new message
    this.closeMessageBox();
  }

  this.showGlassPane(0.5);

  this.messageBox.setTitle('<div class="pentaho-pir-dialogtitle">' + Utils.escapeHtml(dialogTitle) + '</div>');
  this.messageBox.setMessage('<div class="pentaho-pir-dialog">' + message + '</div>');

  var b1Callback;
  var closeFunc = lang.hitch(this, function() {this.messageBox.hide(); this.hideGlassPane()});

  if(!button1Text) {
    button1Text = this.getLocaleString('Ok_txt');
  }
  if(!button1Callback) {
    b1Callback = closeFunc;
  } else {
    b1Callback = function() {
      closeFunc();
      button1Callback();
    }
  }
  if (!button2Callback) {
    button2Callback = closeFunc;
  }

  this.messageBox.onCancel = closeFunc;

  if(button2Text) {
    this.messageBox.callbacks = [
      b1Callback,
      button2Callback
    ];
    this.messageBox.setButtons([button1Text,button2Text]);
  } else {
    this.messageBox.callbacks = [
      b1Callback
    ];
    this.messageBox.setButtons([button1Text]);
  }
  if(blocker) {
    this.messageBox.setButtons([]);
  }
  this.messageBox.show();
}

pentaho.pir.view.prototype.showSelectableMessageBox = function( message, btnText, title ){
	this.showMessageBox("<textarea style='width:400px;height:252px;' rows='15'>" + message + "</textarea>", title, btnText);
}

pentaho.pir.view.prototype.settingsDone = function( settings ) {
  view.flagsDisplayed = true;
  view.showMenuButtons = true;
  // process the settings
  if(settings) {
    for(var idx=0; idx<settings.length; idx++) {
      if(settings[idx].name == view.TipsStartupSettings) {
        var value = settings[idx].value != 'false';
        view.flagsDisplayed = value;
      }
      else if(settings[idx].name == view.menuButtonsStartupSettings) {
        var value = settings[idx].value != 'false';
        view.showMenuButtons = value;
      }
    }
  }
  // update the UI

  if (dom.byId('menuButtonCheckBox')) {
	dom.byId('menuButtonCheckBox').checked = view.showMenuButtons;
  }
  if (dom.byId('menuButtonCheckBox')) {
	dom.byId('startupHintsCheckBox').checked = view.flagsDisplayed;
  }
  if (dom.byId('menuButtonCheckBox')) {
	dom.byId('startupHintsCheckBox2').checked = view.flagsDisplayed;
  }
  if (dom.byId('menuButtonCheckBox')) {
	dom.byId('hintsCheckBox').checked = view.flagsDisplayed;
  }
  view.refreshHints();
}

pentaho.pir.view.prototype.init = function() {

  pentaho.common.Messages.addUrlBundle('pir',CONTEXT_PATH+'i18n?plugin=pentaho-interactive-reporting&name=resources/messages/messages');
  pentaho.common.Messages.addUrlBundle('pir-help',CONTEXT_PATH+'i18n?plugin=pentaho-interactive-reporting&name=resources/help/messages');
    pentaho.common.Messages.addUrlBundle('reportviewer', CONTEXT_PATH+'i18n?plugin=reporting&name=reportviewer/messages/messages');

  this.localizeAll();

  style.set(this.labelsEditboxDiv, 'display', 'none');
  dom.byId("labeleditcloseBtn").setAttribute( "title", this.getLocaleString("labeleditcloseBtn_title"));
  on(this.labelEditButton.dropDown, "Hide", lang.hitch( this,  "labelEditChange"));
  on(this.labelEditButton.dropDown, "Cancel", lang.hitch( this,  "labelEditCancel"));
  this.setToolbar1Disabled(true);

  on(this.toolbar1BoldBtn, "Click", lang.hitch( this,  "toolbar1ToggleBold"));
  on(this.toolbar1ItalicBtn, "Click", lang.hitch( this,  "toolbar1ToggleItalic"));
  on(this.toolbar1AlignLeftBtn, "Click", lang.hitch( this,  "toolbar1ToggleLeft"));
  on(this.toolbar1AlignCenterBtn, "Click", lang.hitch( this,  "toolbar1ToggleCenter"));
  on(this.toolbar1AlignRightBtn, "Click", lang.hitch( this,  "toolbar1ToggleRight"));
  on(this.toolbar1NewBtn, "Click", lang.hitch( this,  "toolbar1New"));
  on(this.toolbar1OpenBtn, "Click", lang.hitch( this,  "toolbar1Open"));
  on(this.toolbar1SaveBtn, "Click", lang.hitch( this,  "toolbar1Save"));
  on(this.toolbar1SaveAsBtn, "Click", lang.hitch( this,  "toolbar1SaveAs"));
  on(this.toolbar1EditBtn, "Click", lang.hitch( this,  "toolbar1EditModeSwitch"));
  on(this.toolbar1UndoBtn, "Click", lang.hitch( this,  "toolbar1Undo"));
  on(this.toolbar1RedoBtn, "Click", lang.hitch( this,  "toolbar1Redo"));
  on(this.toolbar1ForeColorBtn, "Click", lang.hitch( this,  "toolbar1ForeColorBtnClick" ));
  on(this.toolbar1BackColorBtn, "Click", lang.hitch( this,  "toolbar1BackColorBtnClick" ));
  on(this.labelsEditDialog, "Change", lang.hitch( this,  "labelEditChange" ));
  on(this.toolbar1SelectAllBtn, "Click", lang.hitch( this,  "toolbar1SelectAll" ));
  on(this.toolbar1CopyBtn, "Click", lang.hitch( this,  "toolbar1CopyFormatting" ));
  on(this.toolbar1PasteBtn, "Click", lang.hitch( this,  "toolbar1PasteFormatting" ));
  on(this.toolbar1DeleteBtn, "Click", lang.hitch( this,  "toolbar1RemoveFormatting" ));

  on(this.reportContentDiv, "mouseover", lang.hitch( this,  "reportBackgroundMouseOver" ));
  on(this.reportContentDiv, "mouseout", lang.hitch( this,  "reportBackgroundMouseOut" ));
  on(this.reportContentDiv, "mouseup", lang.hitch( this,  "reportBackgroundMouseUp" ));
  on(dom.byId("hintsCheckBox"), "click", lang.hitch( this,  "changeHintsCheckBox" ));
  on(dom.byId("startupHintsCheckBox"), "click", lang.hitch( this,  "changeStartupHintsCheckBox" ));

  on(dom.byId("queryTimeoutCheckBox"), "click", lang.hitch( this,  "changeQueryTimeoutCheckBox" ));
  on(dom.byId("querylessCheckBox"), "click", lang.hitch( this,  "changeQuerylessCheckBox" ));
  on(dom.byId("disabledistinctcheckbox"), "click", lang.hitch( this,  "changeDisableDistinctCheckbox" ));

  on(dom.byId("menuButtonCheckBox"), "click", lang.hitch( this,  "changeMenuButtonCheckBox"));

  on(this.applyFilterButton, "click", lang.hitch(this, function() {
      if(!view.isValidFilterConditions()){
          view.showInvalidFilterMessage();
      } else {
          view.refresh();
      }
    }));

  on(this.toolbar1FilterToggle, "click", lang.hitch( this, function() {
    view.toggleControl("filterPanel");
  }));

  on(this.filterIndicator, "click", lang.hitch(this, function() {
    dom.byId("toolbar1.filterToggle").click();
  }));
  on(this.toolbar1LayoutToggle, "click", lang.hitch( this,  function() {
    view.toggleControl("layoutPanel");
  }));
  on(this.toolbar1ParameterToggle, "click", lang.hitch( this,  view.parameterToolbarClicked));
  on(this.toolbar1ClearCache, "click", lang.hitch( this,  function() {
    try {
      var url = window.location.href.split('?')[0];
      pentahoPost(url.substring(0, url.indexOf("/api/repos")) + '/plugin/reporting/api/cache/clear', '',  view.refresh, 'text/text');
    } catch (e) {
      logger && logger.log("Can't clear cache.");
      view.refresh();
    }
  }));

  dom.byId("advancedFilterTextPanel").toolbarItem = this.toolbar1FilterToggle;
  dom.byId("filterPanel").toolbarItem = this.toolbar1FilterToggle;
  dom.byId("layoutPanel").toolbarItem = this.toolbar1LayoutToggle;
  dom.byId("parameterPanel").toolbarItem = this.toolbar1ParameterToggle;

  on(dom.byId("reportArea"), "click", lang.hitch(this, this.reportAreaClick));

  dom.byId('querylessCheckBox').checked = true;
  // get the 'startup hints' setting from the user preferences
//    this.flagsDisplayed = true;
  dom.byId('hintsCheckBox').checked = this.flagsDisplayed;
  dom.byId('startupHintsCheckBox').checked = false;

  dom.byId("queryTimeoutEdit").onkeypress = function (e) {
    var chr = String.fromCharCode(e.which);
    if ("1234567890".indexOf(chr) < 0)
      return false;
  };

  topic.subscribe("/dnd/start", lang.hitch(this, this.onDndStart));

  topic.subscribe("/dnd/cancel", lang.hitch(this, function() {
    this.dragging = false;
    this.hideTrashcan();
    this.hideColumnDropTargets();
    this.hideDropTargets();
  }));

  topic.subscribe("/dnd/drop", lang.hitch(this, function(source, nodes, copy, target){
    setTimeout(function() { view.stopDragging(); controller.dropComplete(nodes, source, target) }, 1);
    this.hideTrashcan();
    this.hideColumnDropTargets();
    this.hideDropTargets();
    this.fieldList.clearSelection();
  }));

  view.resize();

  // PIR-581
  controller.fetchDefaultAutoRefreshSetting(lang.hitch(this, function(data) {
    var autoRefresh = !!data;
    if(controller.command !="view"){
      dom.byId('querylessCheckBox').checked = autoRefresh;
      this.changeQuerylessCheckBox();
    }
  }));

  this.filterDialog.setLocalizationLookupFunction(lang.hitch(this, this.getLocaleString));
  controller.fetchSearchListLimit(lang.hitch(this, function(data) {
    var limit = parseInt(data);
    if (!isNaN(limit)) {
      this.filterDialog.setSearchListLimit(limit);
    }
  }));
  this.filterDialog.registerReauthenticateCallback(lang.hitch(this, function(callback) {
    controller.reauthenticate(callback);
  }));
  this.filterDialog.registerOnSuccessCallback(lang.hitch(this, function(filter) {
    this.hideGlassPane();
    if (filter.isNew == true) {
      model.report.filters.push(filter);

      // add filterItem to filterStore
      view.addFilterToRoot(filter);
    }
    else{
      // remove existing filter item
      var filterToRemove = view.filterStore.query({value: filter})[0];
      var parentId = filterToRemove.parent;
      view.filterStore.remove(view.filterStore.getIdentity(filterToRemove));

      // replace filter item
      var filterItem = view.createFilterItem(filter);
      filterItem.parent = parentId;
      view.filterStore.put(filterItem);
    }
    delete filter.isNew;

    if (filter.parameterToDelete) {
      controller.removeParameter(filter.parameterToDelete);
      delete filter.parameterToDelete;
      view.refreshParameterPanel(true);
    } else {
      delete filter.parameterToDelete;

      view.refresh();
    }
  }));
  this.filterDialog.registerOnCancelCallback(lang.hitch(this, function() {
    this.hideGlassPane();
  }));

  this.pageNumberControl.registerLocalizationLookup(lang.hitch(this, this.getLocaleString));
  this.pageNumberControl.registerPageNumberChangeCallback(function(n) {
    if (controller.changePageNumber.call(controller, n)) {
      // If we have changed the page number successfully we should scroll to the top of the report page
      dom.byId("reportArea").scrollTop = 0;
    }
  });

  if (!dom.byId('menuButtonCheckBox')) {
    return;	// Bail out at this point if we don't have a proper view to display
  }
  pentaho.userSettingsInstance.getSettings(this.TipsStartupSettings+','+this.menuButtonsStartupSettings, this.settingsDone, this);

  this.columnMenu = null;
  on(registry.byId('rpt-menu'), "Close", function() {view.menuDiv.over = false});

  on(dom.byId(this.menuImageButton), "click", view.columnContextMenuShow);

  this.filterIndicator.configure(this.toolbar1FilterToggle, {left: 8, top: 8});
  this.fieldList.registerLocalizationLookup(lang.hitch(this, this.getLocaleString));
//    this.fieldList.registerTextSelectionDisabler(this.disableTextSelection);
  this.fieldList.setContextMenu(registry.byId('fieldContextMenu'));
  this.fieldList.registerDoubleClickCallback(lang.hitch(this, this.addFieldToColumnsFromContextMenu));

  if(this.modelSelectDialog) {
    this.modelSelectDialog.setLocalizationLookupFunction(lang.hitch(this,this.getLocaleString));
    this.modelSelectDialog.getModel = lang.hitch(controller, controller.getModel);
    this.modelSelectDialog.callbacks = [lang.hitch(this, this.selectModel), lang.hitch(this, this.cancelSelectModel)];
    this.modelSelectDialog.datasourceEditCallback = lang.hitch(this, this.afterDatasourceEdit);
    this.modelSelectDialog.datasourceAddCallback = lang.hitch(this, this.afterDatasourceAdd);
    this.modelSelectDialog.datasourceDeleteCallback = lang.hitch(this, this.afterDatasourceDelete);
    this.modelSelectDialog.datasourceEditorPath = CONTEXT_PATH+'content/data-access/resources/gwt/';
    this.modelSelectDialog.execute = lang.hitch(this, this.selectModel);
    this.modelSelectDialog.msgBox = this.messageBox;
  }

  var tabObj = registry.byId('sidepaneltabset');
  tabObj.stackContainerId = 'sidepaneltabs';
  tabObj.setTabs([
    {
      id: 'datatab',
      title: this.getLocaleString('dataTab_title'),
      afterCallback: this.resizeDataTab
    },
    {
      id: 'formattab',
      title: this.getLocaleString('formatTab_title')
    },
    {
      id: 'generaltab',
      title: this.getLocaleString('generalTab_title')
    }
  ]);

  var tabSpans = $('#sidepaneltabset > div > span');
  if(tabSpans && tabSpans.length){
		for(var i=0; i< tabSpans.length; i++){
			tabSpans[i].title = tabSpans[i].innerHTML;
		}
  }

  this.foreColorPicker.setLocalizationLookupFunction(lang.hitch(this,this.getLocaleString));
  this.foreColorPicker.onColorChange = lang.hitch(this, this.toolbar1ForeColor);
  this.foreColorPicker.closeCallback = function() { registry.byId('toolbar1.foreColorBtn').closeDropDown() };
  this.backColorPicker.setLocalizationLookupFunction(lang.hitch(this,this.getLocaleString));
  this.backColorPicker.onColorChange = lang.hitch(this, this.toolbar1BackColor);
  this.backColorPicker.closeCallback = function() { registry.byId('toolbar1.backColorBtn').closeDropDown() };

  this.createResizeHandles();
} // init

pentaho.pir.view.prototype.onDndStart = function(a, nodes) {
  console.log(arguments);
  view.dragging = true;
  view.onDndStartArgs = arguments;
  view.disableResizeRegions();

  var mgr = ManagerClass.manager();

  if (mgr.source.node.id == "column-dnd-target" || mgr.source.node.id == "layoutPanelGroupList"
    || mgr.source.node.id.indexOf(this.groupDndSourceBase) == 0 || mgr.source.node.id === "layoutPanelColumnList"
    || mgr.source.node.id == "column-block-dnd-container") {
    this.showTrashcan();
    var tc = geometry.position(view.trashcan);
    var c = geometry.position("reportArea");
    var bp = geometry.position('bottompanel');
    style.set(view.trashcan, "top", c.y + c.h + bp.h - tc.h - 12 + "px");
    style.set(view.trashcan, "left", (c.x + c.w - tc.w) + "px");
  }

  this.initDragInfo(nodes);
  var source = this.getDragSourceType(nodes[0]);
  if (nodes.length > 0) {
    // Don't show column drop targets when dragging a group out of the group or column panel
    if (source !== "group-panel" && source !== "column-panel") {
      view.showColumnDropTargets();
    }
  }
  view.showDropTargets(source);
}

pentaho.pir.view.prototype.stopDragging = function() {
  view.dragging = false;
  delete view.onDndStartArgs;
}

pentaho.pir.view.prototype.enableAdminOptions = function() {
  registry.byId('adminContextMenu').bindDomNode(registry.byId('toolbar1').domNode);
}

pentaho.pir.view.prototype.resizeDataTab = function() {
  // size the sorting panels
  if(model.report.groupSorts.length == 0) {
    style.set(dom.byId('groupsorttable'),  'display',  'none');
  } else {
    style.set(dom.byId('groupsorttable'),  'display',  '');
  }
  if(model.report.fieldSorts.length == 0) {
    style.set(dom.byId('fieldsorttable'),  'display',  'none');
  } else {
    style.set(dom.byId('fieldsorttable'),  'display',  'block');
  }

  var panelHeaderCoords = query('#datatabpanel .section-header-outer').coords();
  var delta = 0;
  array.forEach(panelHeaderCoords, function(c) {
    delta += c.h;
  });

  delta += geometry.position('groupsorttable').h;
  delta += geometry.position('fieldsorttable').h;

  // 100px is to negate the invalid height dojo returns for datatabpanel
  // (Caused by height: 100% on the data tab but not a quick fix so leaving it alone for now)
  var h = Math.max(0, geometry.position('datatabpanel').h - delta - 100);

  style.set(dom.byId('fieldlistContainer'),  'height',  ''+h+'px');
}

pentaho.pir.view.prototype.showTrashcan = function() {
  domClass.remove(this.trashcan, 'hidden');
  if (this.isHintsVisible()) {
    domClass.add('hintspanel', 'hidden');
  } else {
    domClass.remove('bottompanel', 'hidden');
    this.resize();
  }
}

pentaho.pir.view.prototype.hideTrashcan = function() {
  domClass.add(this.trashcan, 'hidden');
  if (this.isHintsVisible()) {
    domClass.remove('hintspanel', 'hidden');
  } else {
    domClass.add('bottompanel', 'hidden');
    this.resize();
  }
}

pentaho.pir.view.prototype.getDragSourceType = function(node) {
  if (domClass.contains(node, "field")) {
    return "field";
  } else if (domClass.contains(node, "groupItem")) {
    return "group-panel";
  } else if (domClass.contains(node, "columnItem")) {
    return "column-panel";
  } else if (node.id.indexOf(this.groupHeaderIdBase) == 0) {
    return "group-header";
  } else if (node.id.indexOf(this.columnHeaderIdBase) == 0) {
    return "column";
  } else if (node.id.indexOf(this.columnBlockIdBase) == 0) {
    return "column";
  }
  // undefined
}

pentaho.pir.view.prototype.initDragInfo = function(nodes) {
  var getIdForNode = lang.hitch(this, function(node, source) {
    if (source === "field" || source === "group-panel" || source === "column-panel") {
      return node.getAttribute( "fieldId");
    }
  });
  var getIdxForNode = lang.hitch(this, function(node, source) {
    if (source === "group-header" || source === "column") {
      return this.getColumnIndexFromId(node.id);
    }
  });
  var draggedItems = [];
  array.forEach(nodes, function(node, idx) {
    var source = this.getDragSourceType(node);
    draggedItems.push({
      "source": source,
      "id": getIdForNode(node, source),
      "idx": getIdxForNode(node, source)
    });
  }, this);
  view.draggedItems = draggedItems;

//  var fieldIds = [];
//  var fieldIdx = -1;
//    var fieldId = nodes[idx].setAttribute( "fieldId");
//    if (fieldId) {
//      fieldIds.push(
//        {
//          id: nodes[idx].setAttribute( "fieldId"),
//          idx: nodes[idx].setAttribute( "fieldIdx")
//        });
//      fieldIdx = nodes[idx].setAttribute( "fieldIdx");
//    }
//  }
//  view.draggedFields = fieldIds;
}

pentaho.pir.view.prototype.toolbar1SelectAll = function() {
  if(this.selectedItems.length > 0) {
    this.deselectAll();
  } else {
    this.selectItemsOfType('rpt-report-header-label-', 'label');
    this.selectItemsOfType('rpt-report-footer-label-', 'label');
    this.selectItemsOfType('rpt-report-footer-summary-', 'label');
    this.selectItemsOfType('rpt-page-header-', 'label');
    this.selectItemsOfType('rpt-page-footer-', 'label');
    this.selectItemsOfType('rpt-group-header-label-', 'label');
    this.selectItemsOfType(this.columnHeaderIdBase, 'column');
    this.selectItemsOfType(this.columnBlockIdBase, 'cell');

    // now do the group summaries
    for (var idx=0;idx<model.report.groups.length;idx++) {
      this.selectItemsOfType(this.groupSummaryIdBase+idx+'-', 'groupSummary');
    }

    view.updateToolbar1();
  }
}

pentaho.pir.view.prototype.selectItemsOfType = function(base, type) {
  var idx=0;
  while(true) {
    var cell = dom.byId(base+idx);
    if(!cell) {
      break;
    }
    this.showItemSelected(cell);
    idx++;
  }
  return idx;
}

pentaho.pir.view.prototype.addSelection = function(selection) {
  if (selection != undefined) {
    this.selectedItems.push(selection);
  }
}

pentaho.pir.view.prototype.collateColors = function() {
  var colors = {};
  this.collateColorsFromType('rpt-report-header-label-', colors);
  this.collateColorsFromType('rpt-report-footer-', colors);
  this.collateColorsFromType('rpt-page-header-', colors);
  this.collateColorsFromType('rpt-page-footer-', colors);
  this.collateColorsFromType('rpt-group-header-label-', colors);
  this.collateColorsFromType(this.reportSummaryIdBase, colors);
  this.collateColorsFromType(this.groupSummaryIdBase, colors);
  this.collateColorsFromType(this.columnHeaderIdBase, colors);
  this.collateColorsFromType(this.columnValueIdBase, colors);
  var colorArray = [];
  for(var color in colors) {
    if(color.indexOf('rgb') == 0) {
      // convert this to a hex color
      color = eval('this.'+color);
      colorArray.push(color);
    }
    else if(color.indexOf('#') == 0) {
      //we are ok
      colorArray.push(color);
    } else {
      // we cannot handle this color, whatever it is...
//            alert(color);
    }
  }
  var p1 = geometry.position(this.toolbar1ForeColorBtn.domNode);
  if(p1.x > 0) {
    var sample = dom.byId('foreColorSample');
    var p1 = geometry.position(this.toolbar1ForeColorBtn.domNode);
    var p2 = geometry.position(dom.byId('formattabpanelinner'));

    domClass.remove(sample, 'hidden');
    style.set(sample,  'top',  ''+(p1.y-p2.y+15)+'px');
    style.set(sample,  'left',  ''+(p1.x-p2.x+4)+'px');

    var sample = dom.byId('backColorSample');
    var p3 = geometry.position(this.toolbar1BackColorBtn.domNode);
    domClass.remove(sample, 'hidden');
    style.set(sample,  'top',  ''+(p3.y-p2.y+15)+'px');
    style.set(sample,  'left',  ''+(p3.x-p2.x+4)+'px');
  }

  return colorArray;
}

pentaho.pir.view.prototype.collateColorsFromType = function(base, colors) {
  var idx=0;
  while(true) {
    var cell = dom.byId(base+idx);
    if(!cell) {
      break;
    }
    var color = style.get(cell,  'color');
    colors[color] = true;
    color = style.get(cell,  'backgroundColor');
    colors[color] = true;
    idx++;
  }
}

pentaho.pir.view.prototype.toolbar1New = function() {
  var showRepoButtons = /showRepositoryButtons=true/.test(window.location.href);
  window.location.href = 'prpti.new?' + (showRepoButtons ? 'showRepositoryButtons=true' : '');
}

pentaho.pir.view.prototype.toolbar1Open = function() {
  controller.openSelectReportDialog();
}

pentaho.pir.view.prototype.toolbar1SaveAs = function() {
  controller.openSaveReportDialog(true);
}

pentaho.pir.view.prototype.toolbar1Save = function() {
  if (controller.newReport) {
    controller.openSaveReportDialog(false);
  } else {
    var filePath = controller.currentFilePath;
    var fileName = controller.currentFileName;
    controller.saveReport(fileName, '', filePath, '', true);
  }
}

pentaho.pir.view.prototype.toolbar1EditModeSwitch = function() {
  if (this.editMode == null) {
    this.editMode = controller.command != 'view';
  }
  this.editMode = !this.editMode;
  controller.toggleEditCallback(this.editMode);
}

pentaho.pir.view.prototype.toolbar1Undo = function() {
  controller.undo();
  this.updateUndoRedoButtons();
  this.refreshFilterItems(false);
}

pentaho.pir.view.prototype.toolbar1Redo = function() {
  controller.redo();
  this.updateUndoRedoButtons();
  this.refreshFilterItems(false);
}

pentaho.pir.view.prototype.updateUndoRedoButtons = function() {
  this.toolbar1UndoBtn.set('disabled',!controller.canUndo());
  this.toolbar1RedoBtn.set('disabled',!controller.canRedo());
}

pentaho.pir.view.prototype.updateFromState = function() {

  // select the right template
  this.showTemplateSelected(model.report.templateName);

  dom.byId('queryTimeoutCheckBox').checked = model.report.queryTimeout > 0;
  dom.byId('queryTimeoutEdit').disabled = model.report.queryTimeout == 0;

  // PIR-815
  dom.byId('queryTimeoutEdit').value = model.report.queryTimeout !== 0 ? model.report.queryTimeout : '';
  dom.byId('disabledistinctcheckbox').checked = !model.report.disableDistinct;

  // update the sorting info
  var sorts = model.report.fieldSorts;
  var table = dom.byId('fieldsorttable');
  this.setupSortTable(table, sorts, false);

  // update the sorting info
  sorts = model.report.groupSorts;
  table = dom.byId('groupsorttable');
  this.setupSortTable(table, sorts, true);

  this.updateToolbar1();
}

pentaho.pir.view.prototype.removeSort = function(event) {
  var sortNo = event.target.parentNode.parentNode.getAttribute( 'sortNo');
  var fieldName = model.report.fieldSorts[sortNo].field;
  this.removeSorting(fieldName, false);
}

pentaho.pir.view.prototype.moveSortDown = function(event) {
  var sortNo = event.target.parentNode.parentNode.getAttribute( 'sortNo');
  controller.moveSorting(sortNo, false, false);
  view.refresh();
  this.updateFromState();
}

pentaho.pir.view.prototype.moveSortUp = function(event) {
  var sortNo = event.target.parentNode.parentNode.getAttribute( 'sortNo');
  controller.moveSorting(sortNo, true, false);
  view.refresh();
  this.updateFromState();
}

pentaho.pir.view.prototype.setupSortTable = function(table, sorts, isGroup) {
  while( table.rows.length > 0 ) {
    table.deleteRow(0);
  }
  
  for (var idx=0; idx < sorts.length; idx++) {
    var column = controller.datasource.getColumnById(sorts[idx].field);
    var row = table.insertRow(-1);
    domClass.add(row, 'pentaho-listitem')
    if (!isGroup) {
      row.setAttribute( "sortNo", idx);
    }
    on(row, "mouseover", lang.hitch( function(event) {
      domClass.add(event.target.parentNode,  'pentaho-listitem-hover')
    } ));
    on(row, "mouseout", lang.hitch( function(event) {
      domClass.remove(event.target.parentNode,  'pentaho-listitem-hover')
    } ));
    if (!isGroup) {
      // insert a move button
      var cell = row.insertCell(-1);
      if( sorts.length > 1 ) {
        var img;
        if( idx < sorts.length-1) {
          img = construct.create("div", {
            className: 'imgSpacer pentaho-downbutton'
          });
          on( img, "click", lang.hitch( this,  view.moveSortDown));
        } else {
          img = construct.create("div", {
            className: 'imgSpacer pentaho-upbutton'
          });
          on( img, "click", lang.hitch( this,  view.moveSortUp));
        }
        on(img, "mouseover", lang.hitch( function(event) {
          domClass.add(event.target.parentNode.parentNode,  'pentaho-listitem-hover')
        } ));
        on(img, "mouseout", lang.hitch( function(event) {
          domClass.remove(event.target.parentNode.parentNode,  'pentaho-listitem-hover')
        } ));
        construct.place(img, cell);
      }
    }

    cell = row.insertCell(-1);
    style.set(cell, 'width', '100%');
    cell.innerHTML = column.name;
    var cell = row.insertCell(-1);

    var select = document.createElement("select");
    select.setAttribute( "sortNo", idx);
    select.setAttribute( "isGroup", isGroup);
    on(select, "mouseover", lang.hitch( function(event) {
      domClass.add(event.target.parentNode.parentNode,  'pentaho-listitem-hover')
    } ));
    on(select, "mouseout", lang.hitch( function(event) {
      domClass.remove(event.target.parentNode.parentNode,  'pentaho-listitem-hover')
    } ));
    this.reportConnectionHandles.push(on(select, "change", lang.hitch( select,  view.changeSorting)));
    var opt = new Option(this.getLocaleString('Editor_SORT_LABEL_1'), "asc");
    select.options[0] = opt;
    if(sorts[idx].direction == "asc") {
      opt.selected = true;
    }
    opt = new Option(this.getLocaleString('Editor_SORT_LABEL_2'), "desc");
    select.options[1] = opt;
    if(sorts[idx].direction == "desc") {
      opt.selected = true;
    }
    cell.appendChild(select);
    cell = row.insertCell(-1);
    if (!isGroup) {
      // add a remove button
      domClass.add(cell, "sortTableCell");
      var img;
      img = construct.create("div", {
        className: 'imgSpacer pentaho-deletebutton'
      });
      on( img, "click", lang.hitch( this,  view.removeSort));
      on(img, "mouseover", lang.hitch( function(event) {
        domClass.add(event.target.parentNode.parentNode,  'pentaho-listitem-hover')
      } ));
      on(img, "mouseout", lang.hitch( function(event) {
        domClass.remove(event.target.parentNode.parentNode,  'pentaho-listitem-hover')
      } ));
      construct.place(img, cell);
    }

  }
};

pentaho.pir.view.prototype.selectSort = function(e) {
  var sortNo = this.getAttribute( "sortNo") - 0;
  // remove all the other highlights
  var table = dom.byId('fieldsorttable');
  for( var idx=0; idx<table.rows.length; idx++ ) {
    style.set(table.rows[idx],  "backgroundColor",  (idx == sortNo) ? '#CCCCFF' : "");
  }
  view.selectedSort = sortNo;

  if(sortNo != -1) {
    var $sortingupimg = $('#sortingupimg');
    $sortingupimg.attr('class', 'sortingImageCommon');
    if(sortNo > 0) {
      $sortingupimg.removeClass('sortingUpImageDisabled').addClass('sortingUpImageEnabled');
    } else {
      $sortingupimg.removeClass('sortingUpImageEnabled').addClass('sortingUpImageDisabled');
    }

    var $sortingdownimg = $('#sortingdownimg');
    $sortingdownimg.attr('class', 'sortingImageCommon');
    if(sortNo < model.report.fieldSorts.length-1) {
      $sortingdownimg.removeClass('sortingDownImageDisabled').addClass('sortingDownImageEnabled');
    } else {
      $sortingdownimg.removeClass('sortingDownImageEnabled').addClass('sortingDownImageDisabled');
    }

    var $sortingremoveimg = $('#sortingremoveimg');
    $sortingremoveimg.attr('class', 'sortingImageCommon sortingRemoveImage');
  }
}

pentaho.pir.view.prototype.toolbar1CopyFormatting = function() {
  if( this.selectedItems.length == 1) {
    var format = controller.getFormatting(this.selectedItems[0], false);
    if(format == null) {
      this.formatBuffer = model.createFormat();
    } else {
      this.formatBuffer = model.cloneFormat(format);
    }

    this.dataFormatBuffer = controller.getDataFormat(this.selectedItems[0]);;
    this.toolbar1PasteBtn.set('disabled', false);
  }
}

pentaho.pir.view.prototype.toolbar1PasteFormatting = function() {
  if(this.formatBuffer == null) {
    return;
  }
  for(var idx=0; idx<this.selectedItems.length; idx++){
    controller.setFormatting(this.selectedItems[idx], this.formatBuffer);
    if(this.dataFormatBuffer != null){
      controller.setDataFormat(this.selectedItems[idx], this.dataFormatBuffer);
    }
  }

  view.refresh();
}

pentaho.pir.view.prototype.toolbar1RemoveFormatting = function() {
  for(var idx=0; idx<this.selectedItems.length; idx++){
    controller.removeFormatting(this.selectedItems[idx]);
  }

  this.currentFont = null;
  this.setupDojoList('fontlist1', 'Editor_FONT');
  this.setSelection(registry.byId('fontlist1'), registry.byId('fontlist1').getOptions()[0].label);

  view.refresh();
}

pentaho.pir.view.prototype.toolbar1ForeColorBtnClick = function() {
  if( this.currentForeColor != null) {
    this.toolbar1ForeColor(this.currentForeColor);
  }
}

pentaho.pir.view.prototype.updateForeColorCtrls = function(color) {
  if(color != null) {
    this.foreColorPicker.setColor(color,false);
  }
}

pentaho.pir.view.prototype.updateBackColorCtrls = function(color) {
  if(color != null) {
    this.backColorPicker.setColor(color,false);
  }
}

pentaho.pir.view.prototype.toolbar1ForeColor = function(color) {

  for(var idx=0; idx < this.selectedItems.length; idx++){
    controller.setColor(this.selectedItems[idx], color);
    if ( this.selectedItems[idx].type == 'groupHeaders' ) {
      controller.setFormattingSetManually( this.selectedItems[idx], true );
    }
    this.selectedItems[idx].foreColor = color;
  }
  this.currentForeColor = color;
  this.updateForeColorCtrls(color);
  if( color ) {
    style.set(dom.byId('foreColorSample'),  'backgroundColor',  color);
  } else {
    style.set(dom.byId('foreColorSample'),  'backgroundColor',  'none');
  }
  view.refresh();
}

pentaho.pir.view.prototype.toolbar1BackColorBtnClick = function() {

  if( this.currentBackColor != null) {
    this.toolbar1BackColor(this.currentBackColor);
  }
}

pentaho.pir.view.prototype.toolbar1BackColor = function(color) {

  for(var idx=0; idx < this.selectedItems.length; idx++){
    controller.setBackgroundColor(this.selectedItems[idx], color);
    this.selectedItems[idx].backColor = color;
  }
  this.currentBackColor = color;
  this.updateBackColorCtrls(color);
  if( color ) {
    style.set(dom.byId('backColorSample'),  'backgroundColor',  color);
  } else {
    style.set(dom.byId('backColorSample'),  'backgroundColor',  'none');
  }
  view.refresh();
}


pentaho.pir.view.prototype.toolbar1ToggleBold = function() {

  // are any selected items not bold?
  var doBold = false;

  for(var idx=0; idx<this.selectedItems.length; idx++){
    if( !controller.getIsFormatSet(this.selectedItems[idx], 'fontBold') ) {
      doBold = true;
    }
  }

  for(var idx=0; idx<this.selectedItems.length; idx++){
    if( !controller.getIsFormatSet(this.selectedItems[idx], 'fontBold') == doBold ) {
      controller.toggleBold(this.selectedItems[idx]);
    }
  }
  this.toolbar1BoldBtn.set('checked',  doBold);
  view.refresh();
}

pentaho.pir.view.prototype.toolbar1ToggleItalic = function() {

  // are any selected items not italic?
  var doItalic = false;

  for(var idx=0; idx<this.selectedItems.length; idx++){
    if( !controller.getIsFormatSet(this.selectedItems[idx], 'fontItalic') ) {
      doItalic = true;
    }
  }

  for(var idx=0; idx<this.selectedItems.length; idx++){
    if( !controller.getIsFormatSet(this.selectedItems[idx], 'fontItalic') == doItalic ) {
      controller.toggleItalic(this.selectedItems[idx]);
    }
  }
  this.toolbar1ItalicBtn.set('checked',  doItalic);
  view.refresh();
}


pentaho.pir.view.prototype.toolbar1ToggleLeft = function() {
  for(var idx=0; idx<this.selectedItems.length; idx++){
    controller.alignColumn(this.selectedItems[idx], "LEFT");
    this.toolbar1AlignLeftBtn.set('checked', true);
    this.toolbar1AlignCenterBtn.set('checked', false);
    this.toolbar1AlignRightBtn.set('checked', false);
  }
  view.refresh();
}

pentaho.pir.view.prototype.toolbar1ToggleRight = function() {
  for(var idx=0; idx<this.selectedItems.length; idx++){
    controller.alignColumn(this.selectedItems[idx], "RIGHT");
    this.toolbar1AlignLeftBtn.set('checked', false);
    this.toolbar1AlignCenterBtn.set('checked', false);
    this.toolbar1AlignRightBtn.set('checked', true);
  }
  view.refresh();
}

pentaho.pir.view.prototype.toolbar1ToggleCenter = function() {
  for(var idx=0; idx<this.selectedItems.length; idx++){
    controller.alignColumn(this.selectedItems[idx], "CENTER");
    this.toolbar1AlignLeftBtn.set('checked', false);
    this.toolbar1AlignCenterBtn.set('checked', true);
    this.toolbar1AlignRightBtn.set('checked', false);
  }
  view.refresh();
}

pentaho.pir.view.prototype.changeNumericFormat = function() {
  for(var idx=0; idx<this.selectedItems.length; idx++){
    if( this.selectedItems[idx].field ) {
      if( this.selectedItems[idx].dataType == pentaho.pda.Column.DATA_TYPES.NUMERIC ) {
        var format = registry.byId('numericformats').get("value");
        controller.setDataFormat(this.selectedItems[idx], format);
      }
    }
  }
  view.refresh();
}

pentaho.pir.view.prototype.changeDateFormat = function() {
  for(var idx=0; idx<this.selectedItems.length; idx++){
    if( this.selectedItems[idx].field ) {
      if( this.selectedItems[idx].dataType == pentaho.pda.Column.DATA_TYPES.DATE ) {
        var format = registry.byId('dateformats').get("value");
        controller.setDataFormat(this.selectedItems[idx], format);
      }
    }
  }
  view.refresh();
}

pentaho.pir.view.prototype.fontChanged = function(isBtnClick) {
  var fontName = this.currentFont;
  if(!isBtnClick){
    var fontName = registry.byId('fontlist1').get('value');
    if(!fontName) {
      fontName = null;
    }
    if(dom.byId('fontlist1').selectedIndex == 0) {
      fontName = null;
    }
  } else {
    if(this.currentFont == null) {
      return;
    }
  }
  for(var idx=0; idx<this.selectedItems.length; idx++){
    controller.setFontName(this.selectedItems[idx], fontName);
    this.selectedItems[idx].font = fontName;
  }
  this.currentFont = fontName;
  view.refresh();
}

pentaho.pir.view.prototype.fontSizeChanged = function(isBtnClick) {

  var fontSize = this.currentFontSize;
  if(!isBtnClick){
    fontSize = this.fontSizeList1.get('value');
    if(!fontSize) {
      return;
    }
  } else {
    if(this.currentFontSize == null) {
      return;
    }
  }
  for(var idx=0; idx<this.selectedItems.length; idx++){
    controller.setFontSize(this.selectedItems[idx], fontSize);
    this.selectedItems[idx].fontSize = fontSize;
  }
  this.currentFontSize = fontSize;
  // Prevent the refreshing of the report if we didn't make any changes.
  // This is the root cause for PIR-340
  if (this.selectedItems.length > 0) {
    view.refresh();
  }
}

pentaho.pir.view.prototype.updatePageFormatCtrl = function ( pageFormats ) {
  var pageFormatOptions = dom.byId('pageFormatOptions');
  while (pageFormatOptions.hasChildNodes()) {
    pageFormatOptions.removeChild(pageFormatOptions.lastChild);
  }

  var optionSelected = false;

  var localeFormatStr = this.getLocaleString("localeSpecificPageFormats");
  if (localeFormatStr != null) {
    var localeFormats = localeFormatStr.split(",");
    for(var idx=0; idx<localeFormats.length; idx++) {
      var option = document.createElement("option");
      var fmt = string.trim(localeFormats[idx]);
      option.innerHTML = fmt;
      option.value = fmt;
      if (model.report.pageFormat == fmt) {
        option.selected = true;
        optionSelected = true;
      }
      // check if this format exists
      if (array.indexOf(pageFormats, fmt) != -1) {
        pageFormatOptions.appendChild(option);
      }
    }
    if (localeFormats.length > 0) {
      option = construct.create("option");
      option.innerHTML = "----------------------------------------";
      option.value = "----------------------------------------";
      option.disabled = true;
      pageFormatOptions.appendChild(option);
    }
  }

  for(var idx=0; idx<pageFormats.length; idx++) {
    var option = document.createElement("option");
    option.innerHTML = pageFormats[idx];
    option.value = pageFormats[idx];
    if (!optionSelected && model.report.pageFormat == pageFormats[idx]) {
      option.selected = true;
    }
    pageFormatOptions.appendChild(option);
  }
}

pentaho.pir.view.prototype.isShowTemplatePickerOpen = function() {
  var dlg = registry.byId('templatePickerDialog');
  return dlg.shown;
}

pentaho.pir.view.prototype.showTemplatePicker = function() {
  var dlg = registry.byId('templatePickerDialog');
  dlg.callbacks = [lang.hitch(this, this.closeTemplatePicker)];
  dlg.setTemplates(this.templates);
  dlg.templateSelectedCallback = lang.hitch(this, this.templateSelectedCallback)

  this.showGlassPane(0.5);
  dlg.show();
}

pentaho.pir.view.prototype.templateSelectedCallback = function(idx) {
  view.changeTemplate({ id: 'template-name-'+(idx) });
  var isGlassPaneShown = false;
  if(controller._isAsync) {
    isGlassPaneShown = true;
  }
  view.closeTemplatePicker(isGlassPaneShown);
}

pentaho.pir.view.prototype.closeTemplatePicker = function(isGlassPaneShown) {
  registry.byId('templatePickerDialog').hide();
  if(!isGlassPaneShown) {
    this.hideGlassPane();
  }
}

pentaho.pir.view.prototype.prevTemplateClick = function() {
  var currentIdx = -1;
  for(var idx=0; idx<this.templates.length; idx++) {
    if(this.templates[idx].id == model.report.templateName) {
      currentIdx = idx;
      break;
    }
  }
  if(currentIdx == 0) {
    return;
  }
  view.changeTemplate({ id: 'template-name-'+(currentIdx-1) });
}

pentaho.pir.view.prototype.nextTemplateClick = function() {
  var currentIdx = -1;
  for(var idx=0; idx<this.templates.length; idx++) {
    if(this.templates[idx].id == model.report.templateName) {
      currentIdx = idx;
      break;
    }
  }
  if(currentIdx == -1) {
    return;
  }
  if(currentIdx == this.templates.length-1) {
    return;
  }
  view.changeTemplate({ id: 'template-name-'+(currentIdx+1) });
}

pentaho.pir.view.prototype.updateTemplateCtrl = function( templates ) {
  this.templates = templates;

  if(templates == null) {
    this.templates = [];
  }

  // turn the template images into valid relative URLs
  for(var idx=0; idx<this.templates.length; idx++) {
    if(this.templates[idx].imagePath == null) {
            this.templates[idx].imagePath = './resources/templates/image_not_found.png';
    }
    else if(this.templates[idx].imagePath.indexOf('../templates/') != 0) {
            this.templates[idx].imagePath = './resources/templates/'+this.templates[idx].imagePath;
    }
    var key = 'template_'+this.templates[idx].name;
    var str = this.getLocaleString(key);
    if(str != key) {
      // there is a localized name for this template
      this.templates[idx].name = str;
    }
  }
} //loadTemplateList

pentaho.pir.view.prototype.resize = function() {

  if(!this.canResize) {
    // we are not setup yet
    return;
  }

  // Update width of content area to match the report if it's there
  if (this.reportContentDiv.children.length > 0) {
    var reportWidth =  geometry.position(this.reportContentDiv.children[0]).w;
    style.set(this.reportContentDiv,  "width",  reportWidth + "px");
    // Add padding and shadow width for both sides to the outline width so it's centered
    var pageOutlineWidth = reportWidth
      + style.get(this.reportContentDiv,  "paddingLeft")
      + style.get(this.reportContentDiv,  "paddingRight")
      + style.get(this.reportContentDiv,  "borderLeftWidth")
      + style.get(this.reportContentDiv,  "borderRightWidth");
    style.set(dom.byId("reportPageOutline"),  "width",  pageOutlineWidth + "px");
  }

  var windowWidth = win.getBox().w;
  var windowHeight = win.getBox().h;

  if (dom.byId('sidepanel')) {
	  var panel = dom.byId('sidepanel');
	  var panelWidth = 0;
	  if (controller.command != "view") {
	    if( !this.sidePanelOpen ) {
	      domClass.add(panel, "sidePanelCollapsed");
	      style.set(panel, "width", "26px");
	    } else {
	      domClass.remove(panel, "sidePanelCollapsed");
	      style.set(panel, "width", "260px");
	    }
	    panelWidth = geometry.position(panel).w;
	    if (registry.byId('sidepaneltabs') != null) {
	      registry.byId('sidepaneltabs').resize();
	    }
	  }

	  this.resizeDataTab();

	  var toolbar1 = dom.byId('toolbar1');

	  var reportArea = dom.byId('reportArea');
	  style.set(reportArea,  'width',  ''+(windowWidth-panelWidth)+'px');

	  this.setToolbar1Disabled(this.toolbarCoreOnly);

	  var height = windowHeight - geometry.position(reportArea).y;
	  if (this.isBottomBarVisible()) {
	    height -= geometry.position('bottompanel').h;
	  }
	  if(height>0) {
	    style.set(reportArea,  'height',  height +'px');
	  }
	  var panel = dom.byId('toppanelouter');
	  var panelWidth = (windowWidth-panelWidth)+'px'
	  style.set(panel,  'width',  ''+ panelWidth);

	  this.labelEditButton.closeDropDown();
	  style.set(this.labelsEditboxDiv,  'display',  'none');

	  var panel = dom.byId('bottompanel');
	  style.set(panel,  'width',  ''+ panelWidth);

	  // Update filter indicator position in case the filter toolbar icon position changed (happens when toggling edit/view mode)
	  this.filterIndicator._updatePosition();
  }
} // resize

pentaho.pir.view.prototype.toggleSidePanel = function() {

  this.sidePanelOpen = !this.sidePanelOpen;
  var $sidepanelcloser = $('#sidepanelcloser');
  if(this.sidePanelOpen) {
    $sidepanelcloser.removeClass("sidePanelIconOpen").addClass("sidePanelIconClose");
    domClass.remove(dom.byId("sidepaneltabs"), "hidden");
    domClass.remove(dom.byId("sidepaneltabset"), "hidden");
  } else {
    $sidepanelcloser.removeClass("sidePanelIconClose").addClass("sidePanelIconOpen");
    domClass.add(dom.byId("sidepaneltabs"), "hidden");
    domClass.add(dom.byId("sidepaneltabset"), "hidden");
  }
  this.resize();

} // closeSidePanel

pentaho.pir.view.prototype.setModelList = function(list) {
  this.modelSelectDialog.setModelList(list);
}

pentaho.pir.view.prototype.showSelectModel = function() {

  this.modelSelectDialog.show();

  // PIR-607
  var puc = false;
  try{
    puc = window.top.mantle_initialized;
  } catch (ignored) {} // Ignore "Same-origin policy" violation in embedded IFrame

  if(!puc){
    var cancelBtnLocaleString = view.modelSelectDialog.getLocaleString('Cancel_txt');
    var cancelBtnIdx = view.modelSelectDialog.buttons.indexOf(cancelBtnLocaleString);
    view.modelSelectDialog.setButtonEnabled(cancelBtnIdx, false); // disable
  }
}

pentaho.pir.view.prototype.showAll = function() {
  domClass.remove(dom.byId("contentArea"), "hidden");
  domClass.remove(dom.byId("sidepanel"), "hidden");
  registry.byId('sidepaneltabs').resize();
  this.controlsShown = true;
  if(this.cachedContent) {
    this.setReportContent(this.cachedContent);
    this.cachedContent = null;
  }
  if(view.flagsDisplayed && (!controller.command || controller.command == 'new')) {
    this.showSplash();
  }
  this.resize();
}

pentaho.pir.view.prototype.showSplash = function() {
  var dlg = registry.byId('splashscreen');
  dlg.setTitle(this.getLocaleString('splash_title'));
  dlg.setText(this.getLocaleString('splash_message'));
  dlg.setButtonText( this.getLocaleString('splash_button') );
  dlg.callbacks = [lang.hitch(this, this.hideSplash)];
  this.showGlassPane(0.5);
  dlg.show();
}

pentaho.pir.view.prototype.hideSplash = function() {
  registry.byId('splashscreen').hide();
  this.hideGlassPane();
}

pentaho.pir.view.prototype.afterDatasourceAdd = function(val, transport) {

  try {
    controller.initDatasources();
    controller.loadModels();
    // now select the newly added one
    this.modelSelectDialog.setModelList(controller.datasourceInfos);
    // now select the added one
    var modelList = dom.byId('model-list');
    for(var idx=0;idx<controller.datasourceInfos.length; idx++) {
      if(controller.datasourceInfos[idx].modelId == transport.modelId  &&
        controller.datasourceInfos[idx].domainId == transport.domainId) {
        this.modelSelectDialog.setSelectedIndex(idx);
        this.selectModel();
        break;
      }
    }
  } catch (e) {
    // protect the data source wizard from any errors
  }
}

pentaho.pir.view.prototype.afterDatasourceDelete = function() {
  try {
    controller.initDatasources();
    controller.loadModels();
    this.modelSelectDialog.setModelList(controller.datasourceInfos);
  } catch (e) {
    // protect the data source wizard from any errors
  }
}

pentaho.pir.view.prototype.afterDatasourceEdit = function(val, transport) {
  try {
    controller.initDatasources();
    controller.loadModels();
    this.modelSelectDialog.setModelList(controller.datasourceInfos);
    // now select the edited one
    for(var idx=0;idx<controller.datasourceInfos.length; idx++) {
      if(controller.datasourceInfos[idx].modelId == transport.modelId  &&
        controller.datasourceInfos[idx].domainId == transport.domainId) {
        this.modelSelectDialog.setSelectedIndex(idx);
        break;
      }
    }
  } catch (e) {
    // protect the data source wizard from any errors
  }
}

pentaho.pir.view.prototype.selectModel = function() {
    while(this.glassPaneStack > 0) {
      this.hideGlassPane();
    }
    if (this.modelSelected) {
      return; // only a single launch
    }
    this.modelSelected = true;
  // hide dialog if it is showing
  try {
    var model = this.modelSelectDialog.getSelectedModel();
    controller.setModel(model.id, true);

    /* PPP-2848 */
    controller.pentahoUserConsole.collapseBrowsePanel();
    // TODO - sync/toggle browser button in mantle toolbar

  } catch (e) {
    alert( e.message );
  }
} // selectModel

pentaho.pir.view.prototype.cancelSelectModel = function() {
  // the user chose to close the tab
  try{
    if (window.parent != null && window.parent.mantle_initialized) {
      window.parent.closeTab();
    } else {
      // what do we do in standalone mode?
    }
  } catch (ignored) {} // Ignore "Same-origin policy" violation in embedded IFrame
}

pentaho.pir.view.prototype.showModelElements = function(elements) {

  this.resize();
  dom.byId('datasourcespan').innerHTML = controller.datasource.name;
  this.fieldList.configureFor(controller.datasource, dom.byId("fieldListTop"));
  this.resizeDataTab();
  // create menu options for the available agg types
  this.fieldAggOptionMap = {};
  var aggTypes = {};
  array.forEach(controller.datasource.getAllElements(), function(element) {
    if (element.isQueryElement) {
      array.forEach(element.availableAggregations, function(agg) {
        aggTypes[agg] = true;
      });
    }
  });
  // sort the options into alpha order
  var opts = [];
  for( var type in aggTypes) {
    var label = this.getLocaleString('AGG_TYPES_'+type);
    if(!label || label == 'AGG_TYPES_'+type) {
      label = type;
    }
    opts.push( [ type, label ] );
  }
  // now sort the list
  opts.sort( function(a,b) {
    if (a[0] === 'NONE') {return -1;}
    if (b[0] === 'NONE') {return 1;}
    return a[1] < b[1] ? -1 : 1 } );

  for( var idx=0; idx<opts.length; idx++) {

    var opt = new CheckedMenuItem({
      id: 'field-agg-'+opts[idx][0],
      label: opts[idx][1],
      onClick: function() {
        view.optionSelect(this.id);
      }
    })
    this.rptMenuAggSubmenu.addChild(opt);
    this.fieldAggOptionMap[opts[idx][0]] = opt;

  }
}

pentaho.pir.view.prototype.addFieldToColumnsFromContextMenu = function() {
  array.forEach(this.fieldList.getSelectedItems(), function(item) {
    controller.addDetailField(item.fieldId, false);
  });
  //view.prepareAdvancedFilters();
  view.refresh();
}

pentaho.pir.view.prototype.addFieldToGroupFromContextMenu = function() {
  array.forEach(this.fieldList.getSelectedItems(), function(item) {
    controller.addGroupField(item.fieldId, false);
  });
  //view.prepareAdvancedFilters();
  view.refresh();
}

pentaho.pir.view.prototype.addFilterFromContextMenu = function() {
  var items = this.fieldList.getSelectedItems();
  if (items.length > 0) {
    var filter = controller.createFilter(items[0].fieldId);
    if (filter) {
      view.editFilter(filter);
    }
  }
}

pentaho.pir.view.prototype.addParameterFromContextMenu = function() {
  var items = this.fieldList.getSelectedItems();
  if (items.length > 0) {
    controller.createOrEditParameter(items[0].fieldId);
  }
}


/**
 * Called immediately new report content is set. This is the place to clean up
 * anything from the current content before it is swapped out
 *
 * @param content New report content
 */
pentaho.pir.view.prototype.beforeReportContentSet = function(content) {
  this.cleanUpReportReferences();
}

pentaho.pir.view.prototype.cleanUpReportReferences = function() {
  if (this.contextHelp) {
    this.contextHelp.removeAll();
  }

  this.destroyFlags();

  array.forEach(this.reportConnectionHandles, function(handle) {
    handle.remove();
  });
  this.reportConnectionHandles = [];

  query("#" + this.reportContentDiv.id + " > *").orphan();
  // BACKLOG-9128 - clear style for correct rendering of templates with width values setting in %
  $('#reportPageOutline').css({height: '', width: ''});
  $('#reportContent').css({height: '', width: ''});
}

pentaho.pir.view.prototype.setReportContent = function(content) {
  this.beforeReportContentSet(content);
  if(this.controlsShown) {
    this.reportContentDiv.innerHTML = content;
    style.set(this.reportContentDiv,  "paddingTop",  model.report.marginTop + "pt");
    style.set(this.reportContentDiv,  "paddingRight",  model.report.marginRight + "pt");
    style.set(this.reportContentDiv,  "paddingBottom",  model.report.marginBottom + "pt");
    style.set(this.reportContentDiv,  "paddingLeft",  model.report.marginLeft + "pt");
    this.reportRefreshed();
  } else {
    this.cachedContent = content;
  }
  this.resizeDataTab();
}

pentaho.pir.view.prototype.unload = function() {
  this.cleanUpReportReferences();
  this.cachedContent = null;
}

pentaho.pir.view.prototype.setReportError = function(content) {
  // TODO show this in a dialog?
  this.reportContentDiv.innerHTML = '';
  var msg = Utils.escapeHtml(content);
  if( msg.length > 500) {
    msg.substr(0, 500);
  }
  this.showMessageBox(view.getLocaleString("UnexpectedError", [msg]),view.getLocaleString("Error_txt"));
}

/**
 * Builds up "id|||idx"
 */
pentaho.pir.view.prototype.buildStringDndItem = function(id, idx) {
  return id + "|||" + idx;
}

/**
 * Returns [fieldId, fieldIdx]
 */
pentaho.pir.view.prototype.parseStringDndItem = function(item) {
  return item.split("|||");
}

pentaho.pir.view.prototype.columnHeaderCreator = function(item, hint) {
  var s = view.parseStringDndItem(item);
  item = {
    fieldId: s[0],
    fieldIDx: s[1]
  }
  var div = construct.create("div",
    {
      innerHTML: controller.datasource.getColumnById(item.fieldId).name
    });
  if (hint === "avatar") {
    domClass.add(div, "dndAvatar");
  }
  return {node: div, data: item, type: ["column"]};
}

pentaho.pir.view.prototype.groupHeaderCreator = function(item, hint) {
  var s = view.parseStringDndItem(item);
  item = {
    groupId: s[0],
    groupIdx: s[1]
  }
  var div = construct.create("div",
    {
      innerHTML: controller.datasource.getColumnById(item.groupId).name
    });
  if (hint === "avatar") {
    domClass.add(div, "dndAvatar");
  }
  return {node: div, data: item, type: ["group-header"]};
}

pentaho.pir.view.prototype.injectElement = function(e, idx, allowDblClickEdit, hasColumnHeaders) {
  var parent;
  if(e) {
    if (allowDblClickEdit) {
      this.reportConnectionHandles.push(on(e, "dblclick", lang.hitch( e,  function(event) { view.itemDoubleClick(this, event) })));
    }
    this.reportConnectionHandles.push(on(e, "mouseover", function(event) { view.itemMouseOver(event) }));
    this.reportConnectionHandles.push(on(e, "mouseout", function(event) { view.itemMouseOut(event) }));
    this.reportConnectionHandles.push(on(e, "click", lang.hitch( this,  'itemClick' )));
    if (e.id == this.columnHeaderIdBase + idx) {
      // Add a class of the same name as the id so we can query all of them at once
      domClass.add(e, e.id);
      // Create a new source if we're not within one already
      if (!domClass.contains(e.parentNode, "container")) {
        e.parentNode.id = "column-dnd-target";
        domClass.add(e.parentNode, "container");
        e.parentNode.setAttribute( "data-dojo-type", "dojo.dnd.Source");
        e.parentNode.setAttribute( "copyOnly", "true");
        e.parentNode.setAttribute( "horizontal", "true");
        e.parentNode.setAttribute( "creator", "view.columnHeaderCreator");
        e.parentNode.setAttribute( "accept", "");
      }
      style.set(e,  "border",  "");
      var field = model.report.fields[idx];
      if (field) {
        domClass.add(e, "dojoDndItem");
        e.setAttribute( "fieldIdx", idx);
        e.setAttribute( "dndData", this.buildStringDndItem(field.field, idx));
        e.setAttribute( "dndType", "column");
      }
    } else if(e.id == this.groupHeaderIdBase + idx) {
      // Create a new source if we're not within one already
      if (!domClass.contains(e.parentNode, "container")) {
        e.parentNode.id = this.groupDndSourceBase + idx;
        domClass.add(e.parentNode, "container");
        e.parentNode.setAttribute( "data-dojo-type", "dojo.dnd.Source");
        e.parentNode.setAttribute( "copyOnly", "true");
        e.parentNode.setAttribute( "horizontal", "true");
        e.parentNode.setAttribute( "creator", "view.groupHeaderCreator");
        e.parentNode.setAttribute( "accept", "");
      }
      domClass.add(e, "dojoDndItem");
      e.setAttribute( "groupIdx", idx);
      var group = model.report.groups[idx];
      if (group) {
        e.setAttribute( "fieldId", group.field);
        e.setAttribute( "dndData", this.buildStringDndItem(group.field, idx));
        e.setAttribute( "dndType", "group-header");
      }
    }
  }
}

pentaho.pir.view.prototype.injectGroupSummaryItems = function( base ) {
  var idx = 0;
  var cells;
  while ((cells = query("table ." + base + idx++, "reportContent")).length > 0) {
    array.forEach(cells, function(e) {
      this.reportConnectionHandles.push(on(e, "mouseover", lang.hitch( this,  'itemMouseOver' )));
      this.reportConnectionHandles.push(on(e, "mouseout", lang.hitch( this,  'itemMouseOut' )));
      this.reportConnectionHandles.push(on(e, "click", lang.hitch( this,  'itemClick' )));
      this.reportConnectionHandles.push(on(e, "dblclick", lang.hitch( e,  function(event) { view.itemDoubleClick(this, event) })));
    }, this);
  }
}

pentaho.pir.view.prototype.createResizeHandles = function() {
  var parent = dom.byId("reportArea");
  view.createResizeHandle("left", parent);
  view.createResizeHandle("right", parent);
  var resizeIndicator = construct.create("div");
  resizeIndicator.id="resize-indicator";
  domClass.add(resizeIndicator, ["resizeIndicator", "hidden"]);
  construct.place(resizeIndicator, parent);
}

pentaho.pir.view.prototype.createResizeHandle = function(suffix, parent) {
  var resizeRegion = construct.create("div");
  resizeRegion.id="resize-region-" + suffix;
  resizeRegion.className = "resizeRegion";
  var resizeHandle = construct.create("div");
  resizeHandle.id="resize-handle-" + suffix;
  resizeHandle.className="resizeHandle";

  // Remove existing connections
  on(resizeRegion, "mouseover", this.resizeHandleMouseover(suffix));
  on(resizeRegion, "mouseout", this.resizeHandleMouseout(suffix));
  on(resizeRegion, "mousedown", lang.hitch( this.initResize(resizeRegion,  suffix)));

  construct.place(resizeHandle, resizeRegion);
  construct.place(resizeRegion, parent);
}

pentaho.pir.view.prototype.enableResizeRegionsFor = function(/* number */ idx) {
  var updateResizeRegion = function(/* number */ idx, resizeRegion, columnHeader) {
    var p = geometry.position(columnHeader);
    style.set(resizeRegion,  'top',  p.y + "px");
    style.set(resizeRegion,  'height',  p.h + "px");
    /* Should we pull the div width from div.offsetWidth? If so, how do we get it before allowing the browser to render it? */
    style.set(resizeRegion,  'left',  (p.x + p.w - (/* 1/2 width of div */ 6)) + "px");
    domClass.remove(resizeRegion, "hidden");
    resizeRegion.setAttribute( "fieldidx", idx);
  }
  if (idx - 1 >= 0) {
    var resizeRegion = dom.byId("resize-region-left");
    var columnHeader = dom.byId(this.columnHeaderIdBase + (idx - 1));
    updateResizeRegion(idx - 1, resizeRegion, columnHeader);
  }
  if (idx < model.report.fields.length - 1) {
    var resizeRegion = dom.byId("resize-region-right");
    var columnHeader = dom.byId(this.columnHeaderIdBase + idx);
    updateResizeRegion(idx, resizeRegion, columnHeader);
  }
}

pentaho.pir.view.prototype.disableResizeRegions = function() {
  domClass.add(dom.byId("resize-region-left"), "hidden");
  domClass.add(dom.byId("resize-region-right"), "hidden");
}

pentaho.pir.view.prototype.resizeHandleMouseover = function(suffix) {
  return function () {
    // Only show the resize handle if we're not in the middle of a resize operation
    if(view.resizer == null) {
      var rh = dom.byId("resize-handle-" + suffix);
      style.set(rh,  'display',  'block');
    }
  };
}

pentaho.pir.view.prototype.resizeHandleMouseout = function(suffix) {
  return function (event) {
    // Only hide the handle if we're not dragging it.
    // It will be removed when the report is refreshed during onmouseup anyway
    if (view.resizer == null) {
      var rh = dom.byId("resize-handle-" + suffix);
      style.set(rh,  'display',  'none');
    }
  }
}

pentaho.pir.view.prototype.initResize = function(element, suffix) {
  return function(e) {
    var padding = 50;
    view.resizer = {}
    view.resizer.fieldidx = parseInt(attr.getNodeProp(element, "fieldidx"), 10);
    view.resizer.div = element;
    view.resizer.indicator = dom.byId("resize-indicator");
    domClass.remove(view.resizer.indicator, "hidden");
    style.set(view.resizer.indicator,  'height',  view.reportContentDiv.offsetHeight + "px");
    style.set(view.resizer.indicator,  'left',  style.get(view.resizer.div,  'left') + "px");
    style.set(view.resizer.indicator,  'top',  (parseInt(style.get(view.resizer.div,  'top'), 10) + 26) + "px");

    // event.pageX is provided by Dojo: "event.pageX - the x coordinate, relative to the view port"
    view.resizer.startX = e.pageX;
    view.resizer.elStartLeft = parseInt(style.get(view.resizer.div,  'left'), 10);
    view.resizer.endX = view.resizer.startX;
    var lCol = dom.byId(view.columnHeaderIdBase + view.resizer.fieldidx);
    var rCol = dom.byId(view.columnHeaderIdBase + (view.resizer.fieldidx + 1));
    var tablePos = geometry.position(query("table", "reportContent")[0]);
    view.resizer.minX = tablePos.x + lCol.offsetLeft + padding;
    view.resizer.maxX = tablePos.x + rCol.offsetLeft + rCol.offsetWidth - padding;
    view.resizer.elStartLeft = Math.max(view.resizer.minX, Math.min(view.resizer.maxX, view.resizer.elStartLeft));
    view.resizer.mousemoveHandler = on(baseWin.doc, "mousemove", view.resizeMove);
    view.resizer.mouseupHandler = on(baseWin.doc, "mouseup", view.resizeDone);
    event.stop(e);
  };
}

pentaho.pir.view.prototype.resizeMove = function(e) {
  // event.pageX is provided by Dojo: "event.pageX - the x coordinate, relative to the view port"
  var x = e.pageX;
  view.resizer.endX = Math.max(view.resizer.minX, Math.min(view.resizer.maxX, (view.resizer.elStartLeft + x - view.resizer.startX)));
  style.set(view.resizer.div,  'left',  view.resizer.endX + 'px');
  style.set(view.resizer.indicator,  'left',  style.get(view.resizer.div,  'left') + "px");
  event.stop(e);
}

pentaho.pir.view.prototype.resizeDone = function(e) {
  domClass.add(view.resizer.indicator, "hidden");
  view.resizer.mousemoveHandler.remove();
  view.resizer.mouseupHandler.remove();
  var delta = view.resizer.endX - view.resizer.elStartLeft;
  if (delta != 0) {
    // Requery the table now in case it has been swapped out (report refreshed while we were dragging)
    var totalWidth = query("table", "reportContent")[0].offsetWidth;
    var perMoved = (delta / totalWidth * 100);
    var newWidthLeft = model.report.fields[view.resizer.fieldidx].width.value + perMoved;
    var newWidthRight = model.report.fields[view.resizer.fieldidx + 1].width.value + (-1 * perMoved);
    var fields = {};
    fields[view.resizer.fieldidx] = newWidthLeft;
    fields[view.resizer.fieldidx + 1] = newWidthRight;
    controller.resizeFields(fields);
    view.refresh();
  }

  // Make sure the resize handles are hidden after we're done
  style.set("resize-handle-left",  "display",  "none");
  style.set("resize-handle-right",  "display",  "none");

  view.resizer = null;
  event.stop(e);
}

pentaho.pir.view.prototype.itemMouseOver = function(evt) {

  if(this.dragging == true) {
    return;
  }
  var e = evt.target;

  if(this.isChildNode(e)) {
    // this is a label, get the parent cell
    e = e.parentNode;
  }

  if (e.isMouseOver) {
    return;
  }

  this.showItemMouseOver(e);

  if(e.id.indexOf(this.columnHeaderIdBase)==0) {
    this.enableResizeRegionsFor(this.getColumnIndexFromId(e.id));
    this.showContextMenuButtonFor(e);
  }
  else if(e.id.indexOf(this.columnBlockIdBase) == 0) {
    this.showContextMenuButtonFor(e);
  }
  else if( e.id.indexOf('-header-') != -1 || e.id.indexOf('-footer-') != -1) {
    this.setTemporaryLabel(e);
  }
  //dojo.stopEvent(event);
}

pentaho.pir.view.prototype.isChildNode = function(node) {
  if (node === undefined) {
    console.log("node undefined :(");
  }
  if (node.tagName === undefined || node.tagName === null) {
    console.log("Node tag name not set");
    console.log("node: "+ node);
  }
  return (node.tagName == 'SPAN' && !node.id) || domClass.contains(node, "sortAsc") || domClass.contains(node, "sortDesc");
}

pentaho.pir.view.prototype.getRelatedTarget = function(event) {
  if (event.relatedTarget) {
    return event.relatedTarget;
  }
  if (event.type === 'mouseout' && event.toElement) {
    return event.toElement;
  }
  if (event.type === 'mouseover' && event.fromElement) {
    return event.fromElement;
  }
  return undefined;
}

pentaho.pir.view.prototype.itemMouseOut = function(event) {
  if(this.dragging == true) {
    return;
  }

  if (this.getRelatedTarget(event) === this.menuImageButton) {
    return;
  }

  var e = event.target;
  var relatedTarget = this.getRelatedTarget(event);
  if (relatedTarget && this.isChildNode(relatedTarget) && event.target === relatedTarget.parentNode) {
    // No event handling when mousing from parent -> child (e.g. column header cell to column header label)
    return;
  }
  if(this.isChildNode(e)) {
    if (relatedTarget && (relatedTarget === e.parentNode
      || (this.isChildNode(relatedTarget) && e.parentNode === relatedTarget.parentNode))) {
      // No event handling when mousing from child -> parent (e.g. column header label to column header cell)
      // or between children of the same parent
      return;
    }
    // this is a label, get the parent cell
    e = e.parentNode;
  }

  // If we're here the mouse is leaving a "top level" element, not a child of one
  domClass.add(this.menuImageButton, "hidden");
  this.preventMenuButtonShow();

  this.showItemMouseOut(e);

  if( e.id.indexOf('-header-') != -1 || e.id.indexOf('-footer-')) {
    this.restoreOriginalLabel(e);
  }
  //dojo.stopEvent(event);
}

pentaho.pir.view.prototype.itemDoubleClick = function(e, event) {
  if(controller.command !== "view" && (e.id.indexOf('-header-') != -1 || e.id.indexOf('-footer-') != -1)) {
    this.changeLabel( e.id, event );
  }
}

pentaho.pir.view.prototype.reportAreaClick = function() {
  this.hideContextMenu();
  this.deselectAll();
};

pentaho.pir.view.prototype.deselectAll = function() {
  array.forEach(this.selectedItems, function(item) {
    var e = dom.byId(item.id);
    if (e) {
      this.showItemDeselected(e);
    }
  }, this);
  this.selectedItems = [];
  view.updateToolbar1();
}

pentaho.pir.view.prototype.itemClick = function(e) {
  if (controller.command == 'view') {
    return;
  }
  var x = e.target;
  // should we add to the selection list
  var adding = (e.ctrlKey != null && e.ctrlKey) || (e.metaKey != null && e.metaKey == true);
  this.elementClick(x, adding);
  event.stop(e);
}

pentaho.pir.view.prototype.sortIndicatorClicked = function(sortInd) {
  var idx = this.getColumnIndexFromId(sortInd.parentNode.id);
  var isGroup = sortInd.parentNode.id.indexOf(this.groupHeaderIdBase) >= 0;
  name = isGroup ? model.report.groups[idx].field : model.report.fields[idx].field;
  if (domClass.contains(sortInd, "sortAsc")) {
    controller.addSorting(name, 'desc', isGroup);
  } else {
    controller.addSorting(name, 'asc', isGroup);
  }
  view.refresh();
}

pentaho.pir.view.prototype.elementClick = function(x, adding) {

  if(this.isChildNode(x)) {
    if (x.parentNode.isSelected && (domClass.contains(x, "sortAsc") || domClass.contains(x, "sortDesc"))) {
      // We've clicked on the sort indicator
      this.sortIndicatorClicked(x);
      return;
    }

    // this is a label, get the parent cell
    x = x.parentNode;
  }

  // is this item in the list already?
  if(x.isSelected && adding) {
    // remove it from the list
    for(var idx=0; idx<this.selectedItems.length; idx++) {
      if(this.selectedItems[idx].id == x.id) {
        var item = this.selectedItems[idx];
        this.removeAndHideSelection(item);
        this.updateFromState();
        return;
      }
    }
    return;
  }

  if(!adding) {
    this.deselectAll();
  }
  this.showItemSelected(x);
  // update the toolbar buttons and side panel controls
  this.updateFromState();

}

pentaho.pir.view.prototype.setToolbar1Disabled = function( disabled ) {

  this.toolbarCoreOnly = disabled;
  this.toolbar1SelectAllBtn.set('disabled',false);

  this.fontList1.set('disabled',disabled);
  this.fontSizeList1.set('disabled',disabled);
  this.toolbar1BoldBtn.set('disabled',disabled);
  this.toolbar1ItalicBtn.set('disabled',disabled);
  this.toolbar1AlignLeftBtn.set('disabled',disabled);
  this.toolbar1AlignCenterBtn.set('disabled',disabled);
  this.toolbar1AlignRightBtn.set('disabled',disabled);
  this.toolbar1UndoBtn.set('disabled',!controller.canUndo());
  this.toolbar1RedoBtn.set('disabled',!controller.canRedo());
  this.toolbar1ForeColorBtn.set('disabled',disabled);
  this.toolbar1BackColorBtn.set('disabled',disabled);
  this.toolbar1DeleteBtn.set('disabled',disabled);
  this.toolbar1CopyBtn.set('disabled',disabled);
  this.toolbar1PasteBtn.set('disabled',disabled);

  var displayStyle = '';
  if(disabled) {
    // if the toolbar is disabled, reset all the toggle buttons
    this.toolbar1AlignLeftBtn.set('checked', false);
    this.toolbar1AlignCenterBtn.set('checked', false);
    this.toolbar1AlignRightBtn.set('checked', false);
    this.toolbar1BoldBtn.set('checked', false);
    this.toolbar1ItalicBtn.set('checked', false);

    // test of hiding the unused buttons
    displayStyle = 'none';
  }

  if (controller.command == "view") {
    displayStyle = 'none';
    style.set(this.toolbar1SelectAllBtn.domNode,  'display',  displayStyle);
    style.set(dom.byId('toolbar1.selectAllSeparator'),  'display',  displayStyle);
  } else {
    style.set(this.toolbar1SelectAllBtn.domNode,  'display',  '');
    style.set(dom.byId('toolbar1.selectAllSeparator'),  'display',  '');
  }

}

/*
 * Select a single item - removing the selection on all other items
 */
pentaho.pir.view.prototype.selectItem = function(x) {
  this.deselectAll();
  this.showItemSelected(x);
  // update the toolbar buttons and side panel controls
  this.updateFromState();
}

pentaho.pir.view.prototype.getReportNodesByClass = function(className) {
  return query("." + className, this.reportContentDiv);
}

/*
 * Style an item as selected and add it to list of styled items.
 */
pentaho.pir.view.prototype.showItemSelected = function(x) {
  this.createAndAddSelection(x);
  array.forEach(this.getReportNodesByClass(x.id), function(node) {
    node.isSelected = true;
    this.showElementSelected(node);
  }, this);
}

pentaho.pir.view.prototype.showItemDeselected = function(x) {
  array.forEach(this.getReportNodesByClass(x.id), function(node) {
    node.isSelected = false;
    this.showElementNormal(node);
  }, this);
}

pentaho.pir.view.prototype.createAndAddSelection = function(item) {
  if(item.id.indexOf(this.columnHeaderIdBase)==0) {
    return this.addSelection(this.createColumnSelection(item));
  }
  else if(item.id.indexOf(this.columnBlockIdBase)==0) {
    return this.addSelection(this.createCellSelection(item));
  }
  else if(item.id.indexOf(this.groupSummaryIdBase) == 0) {
    return this.addSelection(this.createGroupSummarySelection(item));
  }
  else if(item.id.indexOf(this.reportSummaryIdBase) == 0) {
    return this.addSelection(this.createReportSummarySelection(item));
  }
  else if(item.id.indexOf('-header-') != -1 || item.id.indexOf('-footer-') != -1) {
    return this.addSelection(this.createLabelSelection(item));
  }
  else if (item.id.indexOf('-column-') != -1) {
    return this.addSelection(this.createColumnSelection(item));
  }
  return undefined;
}

pentaho.pir.view.prototype.removeAndHideSelection = function(selectedItem) {
  this.showItemDeselected(selectedItem.element);
  if (selectedItem.element.isMouseOver) {
    this.showItemMouseOver(selectedItem.element);
  }
  var idx = array.indexOf(this.selectedItems, selectedItem);
  if (idx !== -1) {
    this.selectedItems.splice(idx, 1);
  }
}

pentaho.pir.view.prototype.createGroupSummarySelection = function(x) {

  var fieldIdx = x.id.substring(x.id.lastIndexOf('-')+1);

  // need idx from for group based on x.id
  var groupIdx = x.id.substring(0,x.id.lastIndexOf('-'));
  groupIdx = groupIdx.substring(groupIdx.lastIndexOf('-')+1) - 0;

  var column = controller.datasource.getColumnById(model.report.fields[fieldIdx].field);

  var firstCell = dom.byId(x.id);
  var base = x.id.substring(0,x.id.lastIndexOf('-')-1);
  // find the table
  var table = x.parentNode.parentNode.parentNode;
  var mainItem = {
    type: 'groupSummary',
    field: model.report.fields[fieldIdx],
    group: model.report.groups[groupIdx].field,
    element: firstCell,
    id: x.id,
    idx: groupIdx,
    fieldIdx: fieldIdx,
    dataType: pentaho.pda.Column.DATA_TYPES.NUMERIC,
    cells: []
  }

  firstCell.isSelected = true;
  for(var rowNo=0; rowNo<table.rows.length; rowNo++) {
    for(var colNo=0; colNo<table.rows[rowNo].cells.length; colNo++) {
      if(table.rows[rowNo].cells[colNo].id == x.id) {
        // we found a data cell
        var cell = table.rows[rowNo].cells[colNo];
        // show this column unselected
        cell.isSelected = true;
        this.showElementSelected(cell, false);
        mainItem.cells.push(cell);
      }
    }
  }
  return mainItem;
}

pentaho.pir.view.prototype.createReportSummarySelection = function(x) {
  var idx = this.getColumnIndexFromId(x.id);

  var item = {
    type: 'reportFooterSummary',
    idx: idx,
    id: x.id,
    element: x,
    field: model.report.fields[idx],
    dataType: pentaho.pda.Column.DATA_TYPES.NUMERIC
  }
  // show this column selected
  x.isSelected = true;
  this.showElementSelected(x);
  return item;
}


pentaho.pir.view.prototype.createCellSelection = function(x) {

  var idx = this.getColumnIndexFromId(x.id);
  if(!model.report.fields[idx]) {
    // the use has clicked on the sample field, don't allow selection
    return;
  }

  var column = controller.datasource.getColumnById(model.report.fields[idx].field);
  var firstCell = dom.byId(this.columnValueIdBase+idx);
  var base = this.columnValueIdBase;
  var divs = [];
  for(var colNo=0; colNo<this.columnPanels.length; colNo++) {
    if(this.columnPanels[colNo].id == x.id) {
      // show this column unselected
      this.columnPanels[colNo].div.isSelected = true;
      divs.push(this.columnPanels[colNo].div);
      this.showElementSelected(this.columnPanels[colNo].div, false);
    }
  }
  var mainItem = {
    type: 'cell',
    element: x,
    cells: divs,
    idx: idx,
    id: x.id,
    field: model.report.fields[idx],
    dataType: column.dataType
  }
  return mainItem;

}

pentaho.pir.view.prototype.createColumnSelection = function(x) {
  var idx = this.getColumnIndexFromId(x.id);

  var item = {
    type: 'fields',
    idx: idx,
    id: x.id,
    element: x,
    field: model.report.fields[idx]
  }
  // show this column selected
  x.isSelected = true;
  this.showElementSelected(x);
  return item;
}

pentaho.pir.view.prototype.combineProperty = function( value, prior ) {
  if(value) {
    if(prior == '') {
      return value;
    } else {
      if(value != prior) {
        return 'mixed';
      }
    }
  }
  return prior;
}

pentaho.pir.view.prototype.updateToolbar1 = function() {

  if(this.selectedItems.length == 0) {
    this.setToolbar1Disabled(true);
  } else {
    this.setToolbar1Disabled(false);
  }
  domClass.add(dom.byId('numericformatctrls'), 'hidden');
  domClass.add(dom.byId('dateformatctrls'), 'hidden');
  domClass.add(dom.byId('widthctrls'), 'hidden');
  if(this.selectedItems.length>0) {
    var bold = true;
    var italic = true;
    var left = true;
    var center = true;
    var right = true;
    var dataType = '';
    var fontSize = '';
    var font = '';
    var backColor = '';
    var foreColor = '';
    var width = '';
    var dataFormat = '';
    for(var idx=0; idx<this.selectedItems.length; idx++) {
      bold = bold && controller.getIsFormatSet(this.selectedItems[idx], 'fontBold');
      italic = italic && controller.getIsFormatSet(this.selectedItems[idx], 'fontItalic')
      left = left && controller.getIsFormatValue(this.selectedItems[idx], 'horizontalAlignmentName', 'LEFT');
      center = center && controller.getIsFormatValue(this.selectedItems[idx], 'horizontalAlignmentName', 'CENTER');
      right = right && controller.getIsFormatValue(this.selectedItems[idx], 'horizontalAlignmentName', 'RIGHT');
      if(this.selectedItems[idx].field) {
        width = this.combineProperty(this.selectedItems[idx].field.width.value, width);
      }

      var format = controller.getFormatting(this.selectedItems[idx]);
      if (format) {
        font = this.combineProperty( format.fontName, font);
        fontSize = this.combineProperty( format.fontSize, fontSize);
        backColor = this.combineProperty( format.backgroundColorStr, backColor);
        foreColor = this.combineProperty( format.fontColorStr, foreColor);
      }
      dataType = this.combineProperty( this.selectedItems[idx].dataType, dataType);
      dataFormat = this.combineProperty( controller.getDataFormat(this.selectedItems[idx]), dataFormat);
      if (this.selectedItems[idx].type == 'reportFooterSummary') {
        dataType = pentaho.pda.Column.DATA_TYPES.NUMERIC;
      }
    }
    // update the toolbar buttons
    this.toolbar1AlignLeftBtn.set('checked',left);
    this.toolbar1AlignCenterBtn.set('checked', center);
    this.toolbar1AlignRightBtn.set('checked', right);
    this.toolbar1BoldBtn.set('checked', bold);
    this.toolbar1ItalicBtn.set('checked', italic);
    this.setToolbar1Disabled(false);
    this.toolbar1CopyBtn.set('disabled',this.selectedItems.length != 1);

    if(dataType == pentaho.pda.Column.DATA_TYPES.NUMERIC) {
      domClass.remove(dom.byId('numericformatctrls'), 'hidden');
      if(dataFormat != '' && dataFormat != 'mixed') {
        this.setSelection( registry.byId('numericformats'), dataFormat );
      } else {
        this.setSelection( registry.byId('numericformats'), '' );
      }
    } else {
      domClass.add(dom.byId('numericformatctrls'), 'hidden');
    }
    if(dataType == pentaho.pda.Column.DATA_TYPES.DATE ) {
      domClass.remove(dom.byId('dateformatctrls'), 'hidden');
      if(dataFormat != '' && dataFormat != 'mixed') {
        this.setSelection( registry.byId('dateformats'), dataFormat );
      } else {
        this.setSelection( registry.byId('dateformats'), '' );
      }
    } else {
      domClass.add(dom.byId('dateformatctrls'), 'hidden');
    }
    if( foreColor != '' && foreColor != 'mixed') {
      this.updateForeColorCtrls(foreColor);
    } else {
      this.updateForeColorCtrls(null);
    }
    if( backColor != '' && backColor != 'mixed') {
      this.updateBackColorCtrls(backColor);
    } else {
      this.updateBackColorCtrls(null);
    }
    this.fontSizeList1.selectedIndex = -1;
    if(fontSize != 'mixed') {
      this.setSelection( registry.byId('fontsize1'), fontSize + 'pt');
    } else {
      this.setSelection( registry.byId('fontsize1'), '' );
    }
    if( font != '' && font != 'mixed') {
      if(font.indexOf('"') == 0 || font.indexOf("'") == 0) {
        font = font.substr(1,font.length-2);
      }
      this.setSelection( registry.byId('fontlist1'), font );
    } else {
      this.setSelection( registry.byId('fontlist1'), '' );
    }
    if( width == '') {
      domClass.add(dom.byId('widthctrls'), 'hidden');
    }
    else if( width != 'mixed') {
      domClass.remove(dom.byId('widthctrls'), 'hidden');
      dom.byId('widthedit').value = width;
    } else {
      domClass.remove(dom.byId('widthctrls'), 'hidden');
      dom.byId('widthedit').value = '';
    }
    this.toolbar1PasteBtn.set('disabled', this.formatBuffer == null);
  }

  var colors = this.collateColors();
  this.foreColorPicker.setUsedColors(colors);
  this.backColorPicker.setUsedColors(colors);
  //this.filterIndicator.update(model.report.filters.length);
  this.filterIndicator.update(this.filterStore.getConditions().length);
}

pentaho.pir.view.prototype.setSelection = function( list, value ) {

  var opts = list.getOptions();
  for(var idx=0; idx<opts.length; idx++){
    opts[idx].selected = opts[idx].label == value;
  }
  list.value = value;
  list._lastValueReported = value;
  list._setDisplay(value);
  list._updateSelection();

}

pentaho.pir.view.prototype.toolbarUsedColor = function(event) {
  if(event.target.getAttribute( "fore") == 'true') {
    this.toolbar1ForeColor(this.usedColors[event.target.id], false);
  } else {
    this.toolbar1BackColor(this.usedColors[event.target.id], false);
  }
}

pentaho.pir.view.prototype.hideContextMenu = function() {
  // hide context menu
//  this.menuOver = null;
  this.menuButton.closeDropDown();

  // Due to a bug in dojo's focus management, in IE with XHTML,
  // the menuButton thinks its dropdown is not open and doesn't close it.
  // See http://jira.pentaho.com/browse/PIR-967.
  // Explicitly hide the context menu, all its sub-context menus, of any context menu...
  query('.pentaho-menuPopup').style('display', 'none');
}

pentaho.pir.view.prototype.menuMouseOver = function() {
  domClass.remove(this.menuDiv, "hidden");
}

pentaho.pir.view.prototype.menuMouseOut = function() {
  //columnHeaderMouseOut()
}

pentaho.pir.view.prototype.labelEditKeyUp = function(event) {
  switch(event.keyCode){
    case keys.ENTER: //Process the Enter key event
      this.labelEditChange();
      break;
    case keys.ESCAPE: //Process the Enter key event
      style.set(this.labelsEditboxDiv,  'display',  'none');
      this.editLabel = null;
      break;
    default:
      //no defaults at this time
      break;
  };
}

pentaho.pir.view.prototype.labelEditCancel = function(event) {
  this.labelsEditbox.value = controller.getLabel(this.editLabel);
}

pentaho.pir.view.prototype.labelEditChange = function(event) {
  if (this.labelEditChangeActive) {
    return;
  }
  this.labelEditChangeActive = true;
  var value = this.labelsEditbox.value;
//    this.labelsEditDialog.hide();
  this.labelEditButton.closeDropDown();
  if(value == '') {
    value = ' ';
  }
  style.set(this.labelsEditboxDiv,  'display',  'none');
  var changed = controller.setLabel( this.editLabel, value );
  this.editLabel = null;
  if (changed) {
    view.refresh();
  }
  this.labelEditChangeActive = false;
}

pentaho.pir.view.prototype.setupLabel = function(id, event) {
  var labelType = '';
  var labelIdx = -1;

  var fieldIdx;
  var groupIdx;

  if( id.indexOf('rpt-report-header-label-') == 0 ) {
    labelType = 'reportTitles';
    labelIdx = parseInt(id.substr('rpt-report-header-label-'.length));
  }
  else if( id.indexOf('rpt-report-footer-label-') == 0 ) {
    labelType = 'reportFooters';
    labelIdx = parseInt(id.substr('rpt-report-footer-label-'.length));
  }
  else if( id.indexOf('rpt-page-header-') == 0 ) {
    labelType = 'pageHeaders';
    labelIdx = parseInt(id.substr('rpt-page-header-'.length));
  }
  else if( id.indexOf('rpt-page-footer-') == 0 ) {
    labelType = 'pageFooters';
    labelIdx = parseInt(id.substr('rpt-page-footer-'.length));
  }
  else if(id.indexOf(this.columnHeaderIdBase) == 0 ) {
    labelType = 'columnHeaders';
    labelIdx = parseInt(id.substr(this.columnHeaderIdBase.length));
  }
  else if(id.indexOf('rpt-group-header-label-') == 0 ) {
    labelType = 'groupHeaders';
    labelIdx = parseInt(id.substr('rpt-group-header-label-'.length));
    groupIdx = labelIdx;
  }
  else if(id.indexOf('rpt-group-header-value-') == 0 ) {
    labelType = 'groupHeaders';
    labelIdx = parseInt(id.substr('rpt-group-header-value-'.length));
  }
  else if(id.indexOf(this.reportSummaryIdBase) == 0 ) {
    labelType = 'reportFooterSummary';
    labelIdx = parseInt(id.substr('rpt-report-footer-summary-'.length));
  } else if (id.indexOf(this.groupSummaryIdBase) == 0) {
    fieldIdx = id.substring(id.lastIndexOf('-')+1);
    // need idx from for group based on x.id
    groupIdx = id.substring(0,id.lastIndexOf('-'));
    groupIdx = groupIdx.substring(groupIdx.lastIndexOf('-')+1) - 0;
    labelType = 'groupSummary';
  }

  if(labelType == 'columnHeaders' && model.report.fields.length == 0) {
    // the use has clicked on the sample field, don't allow selection
    return;
  }
  var cell = dom.byId(id);
  var span = cell.firstChild;
  if(!span || span.tagName != 'SPAN') {
    span = cell;
  }

  var p = geometry.position(span ? span : cell);
  var item = {
    type: labelType,
    idx: labelIdx,
    id: id,
    p: p,
    groupIdx: groupIdx,
    fieldIdx: fieldIdx,
    dataType: pentaho.pda.Column.DATA_TYPES.NUMERIC
  }
  return item;
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

pentaho.pir.view.prototype.rgba = function(r,g,b,a) {

  var hex = '#';
  var c1 = r.toString(16);
  var c2 = g.toString(16);
  var c3 = b.toString(16);
  hex += c1.length<2 ? '0'+c1 : c1;
  hex += c2.length<2 ? '0'+c2 : c2;
  hex += c3.length<2 ? '0'+c3 : c3;
  return hex;
}

pentaho.pir.view.prototype.createLabelSelection = function( x ) {
  var item = this.setupLabel(x.id);
  item.element = x;
  x.isSelected = true;
  this.showElementSelected(x);
  return item;
}

pentaho.pir.view.prototype.changeLabel = function(id, event) {

  var item = this.setupLabel(id, event);

  if(!item) return;

  var p =item.p;
  var value = controller.getLabel(item);

  this.editLabel = item;

  if(has("ie") == 7){
    // only IE7
    style.set('labelseditdialog',  {
      'position' : 'absolute',
      'top':  ''+(p.y)+'px',
      'left': ''+(p.x)+'px',
      'display': 'block',
      'width': '200px'
    });
  }
  else{
    style.set(this.labelsEditboxDiv,  'left',  ''+(p.x)+'px');
    style.set(this.labelsEditboxDiv,  'top',  ''+(p.y)+'px');
    style.set(this.labelsEditboxDiv,  'display',  'block');
  }
  this.labelsEditbox.value = value;

  style.set(dom.byId('labeloptions'),  'display',  (id.indexOf('-page-') != -1) ? 'block': 'none');

  if(this.labelEditButton._opened) {
    this.labelEditButton.closeDropDown();
  } else {
    this.labelEditButton.openDropDown();
  }

  this.labelsEditbox.select();
  this.labelsEditbox.focus();
}

pentaho.pir.view.prototype.storeElementProperties = function(e) {
  e.origBackgroundImage = style.get(e,  'backgroundImage');
  e.origBackgroundRepeat = style.get(e,  'backgroundRepeat');
  e.origStored = true;
}

pentaho.pir.view.prototype.showElementSelected = function(e, sidesOnly) {
  if(!e.origStored) {
    this.storeElementProperties(e);
  }
  // PIR-509
  if(!(has("ie") <= 7)){
    style.set(e,  'cursor',  null);
  }
  style.set(e,  'backgroundImage',  this.selectedBackgroundImage);
  style.set(e,  'backgroundRepeat',  this.selectedBackgroundRepeat);
  e.blur();
}

pentaho.pir.view.prototype.showElementNormal = function(e) {
  if(e.isMouseOver) {
    // don't show normal style when mouse is over the element
    return;
  }
  if(!e.origStored) {
    // we don't have the original properties
    return;
  }
  // PIR-509
  if(!(has("ie") <= 7)){
    style.set(e,  'cursor',  null);
  }
  style.set(e,  'backgroundImage',  e.origBackgroundImage);
  style.set(e,  'backgroundRepeat',   e.origBackgroundRepeat);
  e.blur();
}

pentaho.pir.view.prototype.showItemMouseOver = function(item) {
  array.forEach(this.getReportNodesByClass(item.id), function(node) {
    node.isMouseOver = true;
    this.showElementMouseOver(node);
  }, this);
}

pentaho.pir.view.prototype.showItemMouseOut = function(item) {
  var f = item.isSelected ? this.showElementSelected : this.showElementNormal;
  array.forEach(this.getReportNodesByClass(item.id), function(node) {
    node.isMouseOver = false;
    f.call(this, node);
  }, this);
}

pentaho.pir.view.prototype.showElementMouseOver = function(e) {

  if (controller.command == "view") {
    return;
  }

  if(!e.origStored) {
    this.storeElementProperties(e);
  }
  if(e.isSelected) {
    // don't show mouse over when the item is selected
    return;
  }

  if(e.id.indexOf(this.groupHeaderIdBase) == 0) {
    style.set(e,  'cursor',  this.mouseOverCursor);
  }
  else if(e.id.indexOf(this.columnHeaderIdBase) == 0) {
    style.set(e,  'cursor',  this.mouseOverCursor);
  }
  else if(e.id.indexOf(this.columnBlockIdBase) == 0) {
    style.set(e,  'cursor',  this.mouseOverCursor);
  }
  style.set(e,  'backgroundImage',  this.mouseOverBackgroundImage);
  style.set(e,  'backgroundRepeat',  this.selectedBackgroundRepeat);
  e.blur();
}

pentaho.pir.view.prototype.setTemporaryLabel = function(x) {
  // see if the label is empty
  if(x.firstChild && x.firstChild.tagName=="SPAN" && (controller.command == 'edit' || controller.command == "new" || controller.command == null) ) {
    var txt = x.firstChild.innerHTML;
    if(txt == "" || txt == " ") {
      // put some temporary text in there
      x.firstChild.innerHTML = this.missingLabelText;
      x.tempLabel = true;
    }
  }
}

pentaho.pir.view.prototype.restoreOriginalLabel = function(x) {
  if( x.tempLabel == true ) {
    x.firstChild.innerHTML = " ";
    x.tempLabel = true;
  }
}

pentaho.pir.view.prototype.showContextMenuButtonFor = function(x) {
  // show context menu

  if( this.menuDiv.targetId == x.id && this.menuDiv.over == true) {
    return;
  }
  var idx = this.getColumnIndexFromId(x.id);
  if( !model.report.fields[idx]) {
    return;
  }
  this.menuOver = x;

  this.menuDiv.targetId = x.id;

  x.isMouseOver = true;

  // set a delay for the options menu?
  this.preventMenuButtonShow();
  this.menuTimeout = setTimeout('view.configureColumnContextMenu()',200);
}

pentaho.pir.view.prototype.preventMenuButtonShow = function() {
  if(this.menuTimeout) {
    clearTimeout(this.menuTimeout);
  }
}

pentaho.pir.view.prototype.menuButtonMouseOver = function(event) {
  view.menuDiv.over = true;
}

pentaho.pir.view.prototype.menuButtonMouseOut = function(event) {
  view.menuDiv.over = false;
  var relatedTarget = view.getRelatedTarget(event);
  if (relatedTarget && relatedTarget !== this.menuOver && !this.isChildNode(relatedTarget)) {
    // Hide the menu button if the target of the mouse out event is not the element we're being shown for
    domClass.add(this.menuImageButton, "hidden");
  }
  this.showItemMouseOut(view.menuOver);
}

pentaho.pir.view.prototype.columnContextMenuShow = function(evt) {
  event.stop(evt);
  view.setupColumnOptions(view.getColumnIndexFromId(view.menuDiv.targetId));
  // hah
  var x = evt.pageX;
  var y = evt.pageY;
  view.contextLocation = { x : x, y : y};
  var rptMenu = registry.byId('rpt-menu');
  rptMenu.targetId = view.menuDiv.targetId;
  var item = dom.byId(rptMenu.targetId);
  lang.hitch(view, "selectItem", item)();
  rptMenu._scheduleOpen(view.menuOver, null, {x: x, y: y});
}


pentaho.pir.view.prototype.configureColumnContextMenu = function() {
  if(!this.menuOver) {
    return;
  }
  var x = this.menuOver;
  this.menuDiv.targetId = x.id;
  if(this.showMenuButtons) {
    var idx = this.getColumnIndexFromId(x.id);
    var xAdjust = 0;
    var p = geometry.position(x);
    var menuX = (p.x + p.w - 20 + xAdjust);
    if( menuX < p.x ) {
      menuX = p.x;
    }
    var menuY = p.y+5;
    style.set(this.menuImageButton,  "left",  (menuX) + "px");
    style.set(this.menuImageButton,  "top",  (menuY) + "px");
    style.set(this.menuImageButton,  'display',  'block');
    domClass.remove(this.menuImageButton, "hidden");
  }
}

pentaho.pir.view.prototype.setupColumnOptions = function(idx) {
  this.rptMenuSortAscOption.set('checked', false);
  this.rptMenuSortDescOption.set('checked', false);

  this.rptMenuSummaryAvg.set('checked', false);
  this.rptMenuSummaryMin.set('checked', false);
  this.rptMenuSummaryMax.set('checked', false);
  this.rptMenuSummarySum.set('checked', false);
  this.rptMenuSummaryCount.set('checked', false);
  this.rptMenuSummaryCountDistinct.set('checked', false);

  var field = model.report.fields[idx];

  for( type in this.fieldAggOptionMap) {
    if(this.fieldAggOptionMap[type]) {
      this.fieldAggOptionMap[type].set('disabled', true);
      this.fieldAggOptionMap[type].set('checked', false);
      this.fieldAggOptionMap[type].set('label', this.getLocaleString('AGG_TYPES_'+type));
    }
  }
  // setup the aggregation menu options
  var column = controller.datasource.getColumnById(model.report.fields[idx].field);
  var optionCount = 0;
  for(var i=0; i<column.availableAggregations.length; i++) {
    var type = column.availableAggregations[i];
    if(this.fieldAggOptionMap[type]) {
      this.fieldAggOptionMap[type].set('disabled', false);
      optionCount++;
    }
  }
  // Mark the default aggregation type
  if (this.fieldAggOptionMap[column.defaultAggregation]) {
    // PIR-640
    this.fieldAggOptionMap[column.defaultAggregation].set('label', this.getLocaleString('AGG_TYPES_'+column.defaultAggregation) + ' (' + this.getLocaleString('AGG_TYPES_DEFAULT_LABEL') + ')');
  }

  // Set up default label

  // setup the aggregation menu options
  if(field.fieldAggregation != null) {
    this.fieldAggOptionMap[field.fieldAggregation].set('checked', true);
  }

  if (field.aggregationFunctionClassname == model.itemFunctionClassnameBase + model.itemCountFunctionName) {
    this.rptMenuSummaryCount.set('checked', true);
  } else if (field.aggregationFunctionClassname == model.itemFunctionClassnameBase + model.itemCountDistinctFunctionName) {
    this.rptMenuSummaryCountDistinct.set('checked', true);
  } else if (field.aggregationFunctionClassname == model.itemFunctionClassnameBase + model.itemAvgFunctionName) {
    this.rptMenuSummaryAvg.set('checked', true);
  } else if (field.aggregationFunctionClassname == model.itemFunctionClassnameBase + model.itemMinFunctionName) {
    this.rptMenuSummaryMin.set('checked', true);
  } else if (field.aggregationFunctionClassname == model.itemFunctionClassnameBase + model.itemMaxFunctionName) {
    this.rptMenuSummaryMax.set('checked', true);
  } else if (field.aggregationFunctionClassname == model.itemFunctionClassnameBase + model.itemSumFunctionName) {
    this.rptMenuSummarySum.set('checked', true);
  }

  for(var i=0; i<model.report.fieldSorts.length; i++) {
    if(model.report.fieldSorts[i].field == field.field) {
      if(model.report.fieldSorts[i].direction == 'asc') {
        this.rptMenuSortAscOption.set('checked', true);
      }
      else if(model.report.fieldSorts[i].direction == 'desc') {
        this.rptMenuSortDescOption.set('checked', true);
      }
    }
  }

  this.rptMenuMoveLeft.set('disabled', idx < 1 );
  this.rptMenuMoveRight.set('disabled', idx >= model.report.fields.length-1);
}

pentaho.pir.view.prototype.createFlag = function(title, color, id, xOffset, yOffset, parent, anchor, anchorVert, anchorHorz, anchorChild) {

  if (controller.command && controller.command != 'new' && controller.command != 'edit') {
    return;
  }

  var div = document.createElement("div");
  var x = xOffset;
  var y = yOffset;
  if(anchor) {
    // make the position relative to an anchor element
    var anchor = dom.byId(anchor);
    if(!anchor) {
      // the anchor does not exist
      return;
    }
    if(anchorChild) {
      anchor = anchor.firstChild;
    }
    if(!anchor) {
      // the anchor does not exist
      return;
    }
    var coords = geometry.position(anchor);
    if(anchorVert == 'top') {
      y = coords.y + yOffset;
    }
    else if(anchorVert == 'bottom') {
      y = coords.y  + coords.h + yOffset;
    }
    else if(anchorVert == 'middle') {
      y = coords.y - (coords.h/2) + yOffset;
    }
    if(anchorHorz == 'left') {
      x = coords.x + xOffset;
    }
    else if(anchorHorz == 'right') {
      x = coords.x + coords.w + xOffset;
    }
    else if(anchorHorz == 'middle') {
      x = coords.x + (coords.w/2) + xOffset;
    }
    x = Math.round(x);
    y = Math.round(y);
  }

  style.set(div,  "left",  ''+(x)+'px');
  style.set(div,  "top",  ''+(y)+'px');
  domClass.add(div, "flag");
  style.set(div,  "display",  "block");
  div.setAttribute( "id", id);

  var span = document.createElement('span');
  span.innerHTML=title;
  div.appendChild(span);

  if (dom.byId(parent)) {
	  dom.byId(parent).appendChild(div);
  }

  var tooltip = new Tooltip({
    connectId: [id],
    label: '<div class="pentaho-rounded-panel2 pentaho-tooltip-background pentaho-padding-sm pentaho-shadow"><div class="pentaho-rounded-panel2 dialog-content pentaho-padding-sm">'+this.getLocaleString(id+'_hint')+'</div></div>'
  });
  div.tooltip = tooltip;
  this.flags.push(div);
}

pentaho.pir.view.prototype.layoutPanelCreator = function(item, hint, itemType) {
  if (typeof item === "string") {
    // Drop came from a report column. Our item is the field id.
    var s = view.parseStringDndItem(item);
    item = {
      fieldId: s[0],
      displayName: controller.datasource.getColumnById(s[0]).name,
      source: "column",
      fieldIdx: s[1]
    };
  }
  var div = construct.create("div",
    {
      "innerHTML": view.trim(item.displayName, 20),
      "fieldId": item.fieldId,
      "title": item.displayName,
      "source": item.source,
      "fieldIdx": item.fieldIdx
    });
  if (hint === "avatar") {
    domClass.add(div, "dndAvatar");
  } else {
    domClass.add(div, "layoutItem-" + itemType + " " + itemType + "Item");
  }
  return {node: div, data: item, type: [itemType]};
}

pentaho.pir.view.prototype.trim = function(string, length) {
  if (!string) {
    return string;
  }
  if (string.length <= length) {
    return string;
  }
  return string.substring(0, Math.max(0, length - 1)) + '…';
}

pentaho.pir.view.prototype.reportRefreshed = function() {
  // traverse the report DOM and hookup interaction points as we go.

  var table = this.reportContentDiv.firstChild;

  if(!table || !table.rows) {
    return;
  }
  this.dndZones = [];
  var rowNo = 0;
  var offset = geometry.position( this.reportContentDiv );

  var offsetX = offset.x;
  var offsetY = offset.y;

  var hasColumnHeaders = dom.byId("rpt-column-header-0")!=null;
  for(var rowNo=0; rowNo<table.rows.length; rowNo++) {
    var row = table.rows[rowNo];
    for(var cellNo=0; cellNo<row.cells.length; cellNo++) {
      var cell = row.cells[cellNo];
      var id = cell.id;
      if(!id) {
        continue;
      }
      // derive an index
      var splits = id.split('-');
      var lastSplit = splits[splits.length-1];
      var idx = parseInt(lastSplit);
      var base = id.substr(0, id.length-lastSplit.length);
      var allowDblClick = base != 'rpt-group-footer-label-';
      if(base.indexOf(this.groupSummaryIdBase) == 0) {
      } else {
        // setup labels and headers etc
        this.injectElement(cell, idx, allowDblClick, hasColumnHeaders);
      }
    }
  }

  parser.parse(table);

  // remove any spare drop targets

  // inject interactivity over all possible group footer summaries (1 per group)
  // we don't know which groups are going to be visible on the selected page of html
  // so we have to iterate over the known possibilities
  for (var idx=0;idx<model.report.groups.length;idx++) {
    this.injectGroupSummaryItems(this.groupSummaryIdBase + idx + '-');
  }

  domClass.add(this.menuImageButton, "hidden");

  this.refreshFilterItems();

  var layoutPanelGroupList = dom.byId("layoutPanelGroupList");
  if (layoutPanelGroupList) {
    construct.destroy(layoutPanelGroupList);
  }
  // see if we have any groups
  if (model.report.groups.length == 0) {
    this.initControlPanel(controller.command);
    domClass.remove("layoutPanelGroupHint", "hidden");
  } else {
    domClass.add("layoutPanelGroupHint", "hidden");
    // recreate the layout panel
    var layoutPanelGroupList = construct.create("div",
      {
        "id": "layoutPanelGroupList",
        "class": "container layoutPanel"
      }, "layoutPanelGroupDropArea");

    var groupDndItems = [];
    array.forEach(model.report.groups, function(group, idx) {
      // add DND items for drop area
      groupDndItems.push({
        "fieldId": group.field,
        "groupIdx": idx,
        "displayName": group.displayName
      });
    }, this);
    var groupDnd = new Source(layoutPanelGroupList,
      {
        horizontal: true,
        accept: ["treenode-leaf-label", "column"],
        creator: lang.hitch(this, function(item, hint) { return this.layoutPanelCreator(item, hint, "group"); })
      });
    groupDnd.insertNodes(false, groupDndItems);
  }

  // Create column dnd area
  var layoutPanelColumnList = dom.byId("layoutPanelColumnList");
  if (layoutPanelColumnList) {
    construct.destroy(layoutPanelColumnList);
  }
  // see if we have any columns
  if (model.report.fields.length == 0) {
    this.initControlPanel(controller.command);
    domClass.remove("layoutPanelColumnHint", "hidden");
  } else {
    domClass.add("layoutPanelColumnHint", "hidden");
    // recreate the layout panel
    var layoutPanelColumnList = construct.create("div",
      {
        "id": "layoutPanelColumnList",
        "class": "container layoutPanel"
      }, "layoutPanelColumnDropArea");

    var columnDndItems = [];
    array.forEach(model.report.fields, function(field, idx) {
      // add DND items for drop area
      columnDndItems.push({
        "fieldId": field.field,
        "fieldIdx": idx,
        "displayName": field.displayName
      });
    }, this);
    var columnDnd = new Source(layoutPanelColumnList,
      {
        horizontal: true,
        accept: ["treenode-leaf-label", "group"],
        creator: lang.hitch(this, function(item, hint) { return this.layoutPanelCreator(item, hint, "column"); })
      });
    columnDnd.insertNodes(false, columnDndItems);
  }

  if (controller.command != "view") {
    this.installContextHelp();
  }

  this.columnPanels = [];
  var currentColumns = null;
  var currentDndZones = null;
  var zone = null;

  var querylessDefaultString = this.getLocaleString("QuerylessDefaultString");
  for(var rowNo=0; rowNo < table.rows.length; rowNo++) {
    var row = table.rows[rowNo];
    for(var cellNo=0; cellNo < row.cells.length; cellNo++) {
      var cell = row.cells[cellNo];
      var id = cell.id;
      if(!id) {
        continue;
      }
      if(controller.querylessMode) {
        if(cell.innerHTML == '[--]') {
          cell.innerHTML = querylessDefaultString;
        }
        else if(cell.firstChild && cell.firstChild.innerHTML == '[--]') {
          cell.firstChild.innerHTML = querylessDefaultString;
        }
        else if(cell.firstChild && cell.firstChild.innerHTML && cell.firstChild.innerHTML.indexOf('[--]') != -1) {
          var pos = cell.firstChild.innerHTML.indexOf('[--]');
          cell.firstChild.innerHTML = cell.firstChild.innerHTML.substr(0,pos)+querylessDefaultString;
        }
      }
      // derive an index
      var splits = id.split('-');
      var lastSplit = splits[splits.length-1];
      var idx = parseInt(lastSplit);
      var base = id.substr(0, id.length-lastSplit.length);
      // set up DnD regions
      var coords = geometry.position(cell);
      if(id.indexOf(this.columnHeaderIdBase) == 0) {
        if(idx==0) {
          // we need to insert a group drop zone
          var rowCoords = geometry.position(row)
          var zone = {top: Math.round(rowCoords.y-offsetY-6), left: Math.round(rowCoords.x-offsetX), width: Math.round(rowCoords.w), height:Math.round(6), lineY: 0, bottom: Math.round(rowCoords.y-offsetY), fieldHeight: Math.round(rowCoords.w), idx: model.report.groups.length, fieldId: '', isDefault: false, isGroup:true};
          this.dndZones.push(zone);
        }

        var fld = (idx < model.report.fields.length) ? model.report.fields[idx].field : "";
        if(model.report.fields.length ==0) {
          coords = geometry.position(row);
          cell.innerHTML=' ';
        }
        // see if we need to put a sort indicator on the row
        for(var sortNo=0; sortNo<model.report.fieldSorts.length; sortNo++) {
          if(model.report.fieldSorts[sortNo].field == fld) {
            // this field is sorted
            var className = 'sortAsc';
            if(model.report.fieldSorts[sortNo].direction != 'asc') {
              className = 'sortDesc';
            }
            construct.create('div', {innerHTML: '&nbsp;', className: className}, cell);
          }
        }
        if(idx==0) {
          // this is the start of a column set
          currentDndZones = [];
          currentColumns = [];
          zone = {top: Math.round(coords.y-offsetY), left: Math.round(coords.x-offsetX), width: Math.round(coords.w/2), height:Math.round(coords.h), lineX: Math.round(coords.x-offsetX), bottom: Math.round(coords.y+coords.h-offsetY), fieldWidth: Math.round(coords.w), idx: idx, fieldId: fld, isDefault: false, isGroup:false};
          currentDndZones.push(zone);
          this.dndZones.push(zone);
        } else {
          // this is a regular column set
          var prevW = currentDndZones[idx-1].fieldWidth;
          var x = coords.x-prevW/2;
          var w = prevW/2 + coords.w/2;
          zone = {top: Math.round(coords.y-offsetY), left: Math.round(x-offsetX), width: Math.round(w), height: Math.round(coords.h), lineX: Math.round(coords.x-offsetX-3), bottom: Math.round(coords.y+coords.h-offsetY), fieldWidth: Math.round(coords.w), idx: idx, fieldId: fld, isDefault: false, isGroup:false};
          currentDndZones.push(zone);
          this.dndZones.push(zone);
        }
        if(idx == model.report.fields.length-1 || model.report.fields.length==0) {
          // this is the last column, add an additional target
          var x = coords.x+coords.w/2;
          zone = {top: Math.round(coords.y-offsetY), left: Math.round(x-offsetX), width: Math.round(coords.w/2), height:Math.round(coords.h), lineX: Math.round(coords.x+coords.w-offsetX-6), bottom: Math.round(coords.y+coords.h-offsetY), idx: model.report.fields.length, isDefault: true, isGroup:false};
          currentDndZones.push(zone);
          this.dndZones.push(zone);
        }
      }
      else if(id.indexOf(this.columnValueIdBase) == 0 && currentColumns) {
        if(idx >= currentColumns.length) {
          var fld = (idx < model.report.fields.length) ? model.report.fields[idx].field : "";
          zone = {top: Math.round(coords.y-offsetY), left: Math.round(coords.x-offsetX), width: Math.round(coords.w), height:Math.round(coords.h), bottom: Math.round(coords.y+coords.h-offsetY), idx: idx, fieldId: fld, isGroup:false};
          currentColumns.push(zone);
          this.columnPanels.push(zone);
        }
        // expand the drop zone for this column to include this row
        currentColumns[idx].height += coords.h;
        currentColumns[idx].bottom = coords.y+coords.h-offsetY;
        zone = currentDndZones[idx];
        zone.height = zone.height + coords.h;
        zone.bottom = coords.y+coords.h-offsetY;
        if(idx == model.report.fields.length-1 || model.report.fields.length==0) {
          zone = currentDndZones[idx+1];
          zone.height = zone.height + coords.h;
          zone.bottom = coords.y+coords.h-offsetY;
        }
      }
      else if(id.indexOf('rpt-group-header-label-') == 0) {
        // we need to insert a group drop zone
        var fld = (idx < model.report.groups.length) ? model.report.groups[idx].field : "";
        for(var sortNo=0; sortNo<model.report.groupSorts.length; sortNo++) {
          if(model.report.groupSorts[sortNo].field == fld) {
            // this field is sorted
            var className = 'sortAsc';
            if(model.report.groupSorts[sortNo].direction != 'asc') {
              className = 'sortDesc';
            }
            construct.create('div', {innerHTML: '&nbsp;', className: className}, cell);
          }
        }
        var rowCoords = geometry.position(row)
        var zone = {top: Math.round(rowCoords.y-offsetY-6), left: Math.round(rowCoords.x-offsetX), width: Math.round(rowCoords.w), height:Math.round(6), lineY: 0, bottom: Math.round(rowCoords.y-offsetY), fieldHeight: Math.round(rowCoords.w), idx: idx, fieldId: fld, isDefault: false, isGroup:true};
        this.dndZones.push(zone);
      }
    }
  }

  this.dndTargets = [];

  var colors = ['red','green','blue','yellow'];

  // Create the column panels and dnd source elements if we have fields on the report
  if (this.columnPanels.length > 0 && model.report.fields.length > 0) {
    // Create dojo dnd container
    var dndNode = construct.create("div", {
      "id": "column-block-dnd-container",
      "data-dojo-type": "dojo.dnd.Source",
      "copyOnly": "true",
      "horizontal": "true",
      "accept": "",
      "creator": "view.columnHeaderCreator"
    }, this.reportContentDiv);

    for(var i=0; i<this.columnPanels.length; i++) {
      if(this.columnPanels[i].width == 0) {
        continue;
      }
      var div, lineDiv;
      /*
       alert(''+Math.round(this.dndZones[i].left)+', '+
       Math.round(this.dndZones[i].top)+', '+
       Math.round(this.dndZones[i].width)+', '+
       Math.round(this.dndZones[i].height));
       */
      div = document.createElement("div");
      var id = this.columnBlockIdBase+this.columnPanels[i].idx;
      this.columnPanels[i].div = div;
      this.columnPanels[i].id = id;
      dndNode.appendChild(div);
      style.set(div,  "border",  "");
      domClass.add(div, "dojoDndItem");
      var field = model.report.fields[this.columnPanels[i].idx].field;
      div.setAttribute( "dndData", this.buildStringDndItem(field, this.columnPanels[i].idx));
      div.setAttribute( "dndType", "column");
      // Add a class of the same name as the id so we can query all of them at once
      domClass.add(div, id);
      div.setAttribute( "fieldIdx", this.columnPanels[i].idx);
      div.setAttribute( "fieldId", field);
      style.set(div,  "float",  "left");
      style.set(div,  "left",  ''+(this.columnPanels[i].left)+'px');
      style.set(div,  "top",  ''+(this.columnPanels[i].top)+'px');
      style.set(div,  "width",  ''+(this.columnPanels[i].width)+'px');
      style.set(div,  "height",  ''+(this.columnPanels[i].bottom-this.columnPanels[i].top)+'px');
      //        style.set(div,  "border",  "1px solid "+colors[i]);
      style.set(div,  "position",  "absolute");
      style.set(div,  "display",  "block");
      div.setAttribute( "id", id);
      style.set(div,  "cursor",  "move");
      this.reportConnectionHandles.push(on(div, "mouseover", function(event) {
        view.itemMouseOver(event);
      }));
      this.reportConnectionHandles.push(on(div, "click", lang.hitch( this,  'itemClick' )));
      this.reportConnectionHandles.push(on(div, "mouseout", function(event) {
        view.itemMouseOut(event);
      }));
    }
    parser.parse(dndNode);
  }

  for(var i=0; i<this.dndZones.length; i++) {
    if(this.dndZones[i].width == 0) {
      continue;
    }
    var div, lineDiv;
    /*
     alert(''+Math.round(this.dndZones[i].left)+', '+
     Math.round(this.dndZones[i].top)+', '+
     Math.round(this.dndZones[i].width)+', '+
     Math.round(this.dndZones[i].height));
     */
    if(i<this.dndTargets.length) {
      div = this.dndTargets[i];
    } else {
      div = document.createElement("div");
      this.reportContentDiv.appendChild(div);
      this.dndTargets.push(div);
      lineDiv = document.createElement("div");
      div.appendChild(lineDiv);
    }
    div.dndZone = this.dndZones[i];
    lineDiv.dndZone = this.dndZones[i];
    style.set(div,  "float",  "left");
    style.set(div,  "left",  ''+(this.dndZones[i].left)+'px');
    style.set(div,  "top",  ''+(this.dndZones[i].top)+'px');
    style.set(div,  "width",  ''+(this.dndZones[i].width)+'px');
    style.set(div,  "height",  ''+(this.dndZones[i].bottom-this.dndZones[i].top)+'px');
//        style.set(div,  "border",  "1px solid "+colors[i]);
    style.set(div,  "position",  "absolute");

    var leftPx = ''+(this.dndZones[i].lineX-this.dndZones[i].left)+'px';
    if(leftPx == 'NaNpx') {
      leftPx = '0px';
    }
    style.set(lineDiv,  "left",  leftPx);
    style.set(lineDiv,  "top",  '0px');
    style.set(lineDiv,  "display",  "block");
    domClass.add(lineDiv, this.dndZones[i].isGroup ? "dropIndicatorHorizontal" : "dropIndicatorVertical");

    this.reportConnectionHandles.push(on(div, "mouseover", function(event) { view.columnDnDMouseOver(event); }));
    this.reportConnectionHandles.push(on(lineDiv, "mouseover", function(event) { view.columnDnDMouseOver(event); }));
    this.reportConnectionHandles.push(on(div, touch.release, function(event) { view.columnDnDMouseUp(event); }));
    this.reportConnectionHandles.push(on(lineDiv, "mouseup", function(event) { view.columnDnDMouseUp(event); }));
    this.reportConnectionHandles.push(on(div, "mouseout", function(event) { view.columnDnDMouseOut(event); }));
    this.reportConnectionHandles.push(on(lineDiv, "mouseout", function(event) { view.columnDnDMouseOut(event); }));
    parser.parse(div);

  }

  this.reselectItems(this.selectedItems);

  this.resize();
  // Disable the resize regions so they wont linger around if never recalculated
  // as long as we're not currently resizing
  if (!view.resizer) {
    this.disableResizeRegions();
  }

  // update the toolbar buttons
  this.updateFromState();

//    this is for sprint 4
  var offset = geometry.position( this.reportContentDiv );

  this.refreshHints();

//    if(!this.dragLeftArrow) {
  this.dragLeftArrow = document.createElement("div");
  this.reportContentDiv.appendChild(this.dragLeftArrow);
  this.dragLeftArrow.setAttribute( "id", "leftarrow");
  style.set(this.dragLeftArrow,  "left",  '0px');
  style.set(this.dragLeftArrow,  "top",  '0px');
  domClass.add(this.dragLeftArrow, "dropLeftArrow");
  domClass.add(this.dragLeftArrow, "hidden");

  this.dragRightArrow = document.createElement("div");
  this.reportContentDiv.appendChild(this.dragRightArrow);
  this.dragRightArrow.setAttribute( "id", "rightarrow");
  style.set(this.dragRightArrow,  "left",  '0px');
  style.set(this.dragRightArrow,  "top",  '0px');
  domClass.add(this.dragRightArrow, "dropRightArrow");
  domClass.add(this.dragRightArrow, "hidden");

  this.dragTopArrow = document.createElement("div");
  this.reportContentDiv.appendChild(this.dragTopArrow);
  this.dragTopArrow.setAttribute( "id", "toparrow");
  style.set(this.dragTopArrow,  "left",  '0px');
  style.set(this.dragTopArrow,  "top",  '0px');
  domClass.add(this.dragTopArrow, "dropTopArrow");
  domClass.add(this.dragTopArrow, "hidden");

  this.dragBottomArrow = document.createElement("div");
  this.reportContentDiv.appendChild(this.dragBottomArrow);
  this.dragBottomArrow.setAttribute( "id", "bottomarrow");
  style.set(this.dragBottomArrow,  "left",  '0px');
  style.set(this.dragBottomArrow,  "top",  '0px');
  domClass.add(this.dragBottomArrow, "dropBottomArrow");
  domClass.add(this.dragBottomArrow, "hidden");
//    }

  domClass.add(this.reportContentDiv, "container");


  this.reportContentDiv.setAttribute( "horizontal", "true");
  parser.parse(this.reportContentDiv);

  view.hideColumnDropTargets();

  var connectedIds = [];
  array.forEach(this.columnPanels, function(columnPanel) {
    if (!connectedIds[columnPanel.id]) {
      connectedIds[columnPanel.id] = 1;
      array.forEach(query("." + columnPanel.id, this.reportContentDiv), function(node) {
        this.reportConnectionHandles.push(on(node, "contextmenu", this.columnContextMenuShow));
      },  this);
    }
  }, this);

  array.forEach(model.report.fields, function(field, idx) {
    array.forEach(query("." + this.columnHeaderIdBase + idx, this.reportContentDiv), function(node) {
      this.reportConnectionHandles.push(on(node, "contextmenu", this.columnContextMenuShow));
    },  this);
  }, this);

  if (view.dragging) {
    // Restart dragging operation
    this.onDndStart.apply(this, this.onDndStartArgs);
  }
}

pentaho.pir.view.prototype.reselectItems = function(items) {
  this.deselectAll();
  var findFieldsWithWidth = function(allFields, fieldName) {
    var fields = [];
    array.forEach(allFields, function(field) {
      if (fieldName === field.field && field.width.value !== 0) {
        fields.push(field);
      }
    });
    return fields;
  }
  array.forEach(items, function(item) {
    switch (item.type) {
      case 'fields':
        // see if this field still exists
        array.forEach(model.report.fields, function(field, idx) {
          if (item.field.field === field.field && field.width.value !== 0) {
            var e = dom.byId(this.columnHeaderIdBase + idx);
            if (e) {
              this.showItemSelected(e);
            }
          }
        }, this);
        break;
      case 'cell':
        // see if this field still exists
        array.forEach(model.report.fields, function(field, idx) {
          if (item.field.field === field.field && field.width.value !== 0) {
            var e = dom.byId(this.columnBlockIdBase + idx);
            if (e) {
              this.showItemSelected(e);
            }
          }
        }, this);
        break;
      case 'groupSummary':
        // see if this group still exists
        array.forEach(model.report.groups, function(group, groupIdx) {
          if (group.field === item.group) {
            // see if the field still exists
            array.forEach(model.report.fields, function(field, fieldIdx) {
              if (item.field.field === field.field && field.width.value !== 0) {
                var e = dom.byId(this.groupSummaryIdBase + groupIdx + '-' + fieldIdx);
                if (e) {
                  this.showItemSelected(e);
                }
              }
            }, this);
          }
        }, this);
        break;
      default:
        var e = dom.byId(item.id);
        if (e) {
          this.showItemSelected(e);
        }
    }
  }, this);
}

pentaho.pir.view.prototype.showColumnDropTargets = function() {
  array.forEach(this.columnPanels, function(panel) {
    domClass.add(panel, "hidden");
  })
  array.forEach(this.dndTargets, function(target) {
    domClass.remove(target, "hidden");
  })
}

pentaho.pir.view.prototype.showDropTargets = function(source) {
  domClass.add("filterPanel", "dropTarget");
  domClass.add("parameterPanel", "dropTarget");
  // Don't show drop target for group panel when dragging a group from the report canvas
  if (source !== "group-header") {
    domClass.add("layoutPanelGroupHint", "dropTarget");
    var groupList = dom.byId("layoutPanelGroupList");
    if (groupList) {
      domClass.add(groupList, "dropTarget");
    }
  }
  // Don't show drop target for column panel when dragging a column or group from the report canvas
  if (source !== "group-header" && source !== "column") {
    domClass.add("layoutPanelColumnHint", "dropTarget");
    var columnList = dom.byId("layoutPanelColumnList");
    if (columnList) {
      domClass.add(columnList, "dropTarget");
    }
  }
}

pentaho.pir.view.prototype.hideDropTargets = function(source) {
  domClass.remove("filterPanel", "dropTarget");
  domClass.remove("parameterPanel", "dropTarget");
  domClass.remove("layoutPanelGroupHint", "dropTarget");
  domClass.remove("layoutPanelColumnHint", "dropTarget");
}

pentaho.pir.view.prototype.hideColumnDropTargets = function() {
  array.forEach(this.dndTargets, function(target) {
    domClass.add(target, "hidden");
  });
  array.forEach(this.columnPanels, function(panel) {
    domClass.remove(panel, "hidden");
  });
  var hideArrow = function(name) {
    if (this[name]) {
      domClass.add(this[name], "hidden");
    }
  };
  array.forEach(['dragLeftArrow', 'dragRightArrow', 'dragTopArrow', 'dragBottomArrow'],
    lang.hitch(this, hideArrow));
}

pentaho.pir.view.prototype.columnDnDMouseOver= function(event) {
  if(event.target.dndZone) {
    this.highlightDropZone( event.target.dndZone, true);
  }
}

pentaho.pir.view.prototype.columnDnDMouseOut = function(event) {
  if(event.target.dndZone) {
    this.highlightDropZone( event.target.dndZone, false);
  }
}

pentaho.pir.view.prototype.columnDnDMouseUp = function(event) {
  if(view.dragging) {
    view.fieldList.clearSelection();
    view.hideColumnDropTargets();
    var insertIndex = event.target.dndZone.idx;
    view.stopDragging();

    if (this.draggedItems.length === 0) {
      return;
    }

    // We are only able to drag a single type of item at a time. Use the first dragged item's type to determine
    // the kind of items we're dragging.
    if (this.draggedItems[0].source === 'column') {
      var indices = array.map(this.draggedItems, function(item) {
        return item.idx;
      });
      if (event.target.dndZone.isGroup) {
        // we are dragging from columns to groups
        // Loop over items in reverse order so they are added at the correct index in order
        array.forEach(this.draggedItems.reverse(), function(item, idx) {
          controller.addGroupFieldAtPosition(model.report.fields[item.idx].field, insertIndex, 'asc', false);
        });
        // Remove all fields in reverse to we don't have to calculate index offsets
        array.forEach(indices.sort().reverse(), function(idx) {
          controller.removeColumn(idx);
        });
      } else {
        // Handle dragging and dropping multiple columns around
        model.report.fields = controller.bulkMove(model.report.fields, indices, insertIndex);
      }
    } else {
      // Loop over items in reverse order so they are added at the correct index in order
      array.forEach(this.draggedItems.reverse(), function(item, idx) {
        switch(item.source) {
          case "field":
            // we are dragging a field from the side panel
            if (event.target.dndZone.isGroup) {
              controller.addGroupFieldAtPosition(item.id, insertIndex, 'asc', false);
            } else {
              controller.addDetailFieldAtPosition(item.id, insertIndex, false);
            }
            break;
          case "group-header":
            // we are dragging a group header
            if (event.target.dndZone.isGroup) {
              // We're currently only able to drag a single group at a time. If that changes, this must be updated
              // to properly handle moving multiple groups at once (similar to how moving columns works).
              var group = model.report.groups.splice(item.idx, 1)[0];
              // Moving the group
              model.report.groups.splice(insertIndex, 0, group);

              // Update sort order
              var sorts = [];
              array.forEach(model.report.groups, function(group) {
                array.some(model.report.groupSorts, function(s, idx) {
                  if (s.field === group.field) {
                    sorts.push(s);
                    model.report.groupSorts.splice(idx, 1);
                    return true;
                  }
                });
              });
              model.report.groupSorts = sorts;
            } else {
              var group = controller.removeGroup(item.idx);
              // Dragging a group to a column
              controller.addDetailFieldAtPosition(group.field, insertIndex, false);
            }
            break;
          case "group-panel":
          default:
        }
      }, this);
    }
    //view.prepareAdvancedFilters();
    view.refresh();
  }
}

pentaho.pir.view.prototype.highlightDropZone = function(zone, highlight) {
  var zoneIdx = zone.idx
  if(zoneIdx == -1) {
    // do the default
    zoneIdx=model.report.fields.length;
  }
  // highlight every dropzone with this index
  for(var idx=0; idx<this.dndTargets.length; idx++) {
    if(!highlight) {
      domClass.add(this.dndTargets[idx].firstChild, "hidden");
      domClass.add(this.dragLeftArrow, "hidden");
      domClass.add(this.dragRightArrow, "hidden");
      domClass.add(this.dragTopArrow, "hidden");
      domClass.add(this.dragBottomArrow, "hidden");
    }
    else if(this.dndTargets[idx].dndZone == zone) {
      // this is the zone the mouse is over
      domClass.remove(this.dndTargets[idx].firstChild, zone.isGroup ? "dropHiliteHorizontal" : "dropHiliteVertical");
      domClass.add(this.dndTargets[idx].firstChild, zone.isGroup ? "dropActiveHorizontal" : "dropActiveVertical");
      domClass.remove(this.dndTargets[idx].firstChild, "hidden");
      if(zone.isGroup) {
        // show the left and right arrows
        domClass.remove(this.dragLeftArrow, "hidden");
        domClass.remove(this.dragRightArrow, "hidden");
        domClass.add(this.dragTopArrow, "hidden");
        domClass.add(this.dragBottomArrow, "hidden");
        style.set(this.dragLeftArrow,  'top',  ''+(zone.top-5)+'px');
        style.set(this.dragLeftArrow,  'left',  ''+(zone.left-9)+'px');
        style.set(this.dragRightArrow,  'top',  ''+(zone.top-5)+'px');
        style.set(this.dragRightArrow,  'left',  ''+(zone.left+zone.width-7)+'px');
      } else {
        // show the top and bottom arrows
        domClass.remove(this.dragTopArrow, "hidden");
        domClass.remove(this.dragBottomArrow, "hidden");
        domClass.add(this.dragLeftArrow, "hidden");
        domClass.add(this.dragRightArrow, "hidden");
        style.set(this.dragTopArrow,  'top',  ''+(zone.top-6)+'px');
        style.set(this.dragTopArrow,  'left',  ''+(zone.lineX-5)+'px');
        style.set(this.dragBottomArrow,  'top',  ''+(zone.top+zone.height-6)+'px');
        style.set(this.dragBottomArrow,  'left',  ''+(zone.lineX-5)+'px');

      }
    }
    else if(this.dndTargets[idx].dndZone.idx == zoneIdx && this.dndTargets[idx].dndZone.isGroup == zone.isGroup) {
      // this is a similar zone to the current one
      domClass.remove(this.dndTargets[idx].firstChild, zone.isGroup ? "dropActiveHorizontal" : "dropActiveVertical");
      domClass.add(this.dndTargets[idx].firstChild, zone.isGroup ? "dropHiliteHorizontal" : "dropHiliteVertical");
      domClass.remove(this.dndTargets[idx].firstChild, "hidden");
    }
    else {
      domClass.add(this.dndTargets[idx].firstChild, "hidden");
    }
  }
}

pentaho.pir.view.prototype.reportBackgroundMouseOver = function(event) {
  if( event.target.id == '' || event.target.id == this.reportContentDiv.id) {
//        this.animateDropZone(-1, true);
  }
}

pentaho.pir.view.prototype.reportBackgroundMouseOut = function(event) {
  if( event.target.id == '' || event.target.id == this.reportContentDiv.id) {
//        this.animateDropZone(-1, false);
  }
}

pentaho.pir.view.prototype.reportBackgroundMouseUp = function(event) {
  if(view.dragging && this.draggedFields && (event.target.id == '' || event.target.id == this.reportContentDiv.id)) {
    for(var idx=0; idx<this.draggedFields.length; idx++) {
//            controller.addDetailFieldAtPosition(this.draggedFields[idx], -1, false);
    }
    view.refresh();
  }
  view.stopDragging();
}

pentaho.pir.view.prototype.changeSorting = function() {
  var dir = this.value;
  var idx = this.getAttribute( "sortNo") - 0;
  var isGroup = this.getAttribute( "isGroup");
  if (isGroup === 'true') {
    model.report.groupSorts[idx].direction = dir;
  } else {
    model.report.fieldSorts[idx].direction = dir;
  }
  view.refresh();

}

pentaho.pir.view.prototype.removeSorting = function(fieldName, isGroup) {
  if(!fieldName) {
    var idx = this.selectedSort;
    if (isGroup) {
      fieldName = model.report.groupSorts[idx].field;
    } else {
      fieldName = model.report.fieldSorts[idx].field;
    }
  }

  controller.removeSorting(fieldName, false);
  view.refresh();
  this.updateFromState();
}

pentaho.pir.view.prototype.setSorting = function(fieldName, direction) {
  controller.addSorting(fieldName, direction, false, -1);
  view.refresh();
  this.updateFromState();
}

pentaho.pir.view.prototype.getColumnIndexFromId = function(id) {
  if( id.indexOf(this.columnBlockIdBase) == 0) {
    return parseInt(id.substr(this.columnBlockIdBase.length));
  }
  if( id.indexOf(this.columnHeaderIdBase) == 0) {
    return parseInt(id.substr(this.columnHeaderIdBase.length));
  }
  if( id.indexOf(this.columnValueIdBase) == 0) {
    return parseInt(id.substr(this.columnValueIdBase.length));
  }
  if (id.indexOf(this.groupHeaderIdBase) == 0) {
    return parseInt(id.substr(this.groupHeaderIdBase.length));
  }
  if (id.indexOf(this.reportSummaryIdBase) == 0) {
    return parseInt(id.substr(this.reportSummaryIdBase.length));
  }
}

pentaho.pir.view.prototype.optionSelect = function(option) {

  var idx = this.getColumnIndexFromId(registry.byId('rpt-menu').targetId);
  if(option == 'filter') {
    controller.createOrEditFilter(idx);
  } else if (option === 'parameter') {
    controller.createOrEditParameterByIdx(idx);
  } else if( option == 'remove') {
    // NOTE: this code is in tune with that of pentaho.pir.controller#dropComplete,
    // the code that runs when a gem is dropped on the trash-can.
    controller.removeColumn(idx);
    view.refresh();
  }
  else if(option == 'sortasc') {
    this.setSorting(model.report.fields[idx].field, 'asc');
  }
  else if(option == 'sortdesc') {
    this.setSorting(model.report.fields[idx].field, 'desc');
  }
  else if(option == 'sortremove') {
    this.removeSorting(model.report.fields[idx].field);
  }
  else if(option == 'moveleft') {
    controller.moveColumn(idx, true);
  }
  else if(option == 'moveright') {
    controller.moveColumn(idx, false);
  } else if (option == 'summary-count') {
    controller.setColumnSummaryFunction(model.report.fields[idx], model.itemFunctionClassnameBase + model.itemCountFunctionName);
  } else if (option == 'summary-count-distinct') {
    controller.setColumnSummaryFunction(model.report.fields[idx], model.itemFunctionClassnameBase + model.itemCountDistinctFunctionName);
  } else if (option == 'summary-avg') {
    controller.setColumnSummaryFunction(model.report.fields[idx], model.itemFunctionClassnameBase + model.itemAvgFunctionName);
  } else if (option == 'summary-min') {
    controller.setColumnSummaryFunction(model.report.fields[idx], model.itemFunctionClassnameBase + model.itemMinFunctionName);
  } else if (option == 'summary-max') {
    controller.setColumnSummaryFunction(model.report.fields[idx], model.itemFunctionClassnameBase + model.itemMaxFunctionName);
  } else if (option == 'summary-sum') {
    controller.setColumnSummaryFunction(model.report.fields[idx], model.itemFunctionClassnameBase + model.itemSumFunctionName);
  } else if (option == 'summary-remove') {
    controller.removeColumnSummaryFunction(model.report.fields[idx]);
  } else if (option == 'field-agg-COUNT') {
    controller.setColumnAggregation(model.report.fields[idx], pentaho.pda.Column.AGG_TYPES.COUNT);
  } else if (option == 'field-agg-COUNT_DISTINCT') {
    controller.setColumnAggregation(model.report.fields[idx], pentaho.pda.Column.AGG_TYPES.COUNT_DISTINCT);
  } else if (option == 'field-agg-AVERAGE') {
    controller.setColumnAggregation(model.report.fields[idx], pentaho.pda.Column.AGG_TYPES.AVERAGE);
  } else if (option == 'field-agg-MINIMUM') {
    controller.setColumnAggregation(model.report.fields[idx], pentaho.pda.Column.AGG_TYPES.MIN);
  } else if (option == 'field-agg-MAXIMUM') {
    controller.setColumnAggregation(model.report.fields[idx], pentaho.pda.Column.AGG_TYPES.MAX);
  } else if (option == 'field-agg-SUM') {
    controller.setColumnAggregation(model.report.fields[idx], pentaho.pda.Column.AGG_TYPES.SUM);
  } else if (option == 'field-agg-NONE') {
    controller.setColumnAggregation(model.report.fields[idx], pentaho.pda.Column.AGG_TYPES.NONE);
  }

  // guarantee the menu will now be hidden
  domClass.add(this.menuImageButton, "hidden");
}

pentaho.pir.view.prototype.showPageSetup = function() {
  this.showGlassPane(0.5);

  // repopulate dialog with actual settings
  if (!view.marginUnitOverride) {
    var isInches = this.getLocaleString('marginUnitDefault').toLowerCase() == "inches";
    dom.byId('marginUnitInches').checked = isInches;
    dom.byId('marginUnitCm').checked = !isInches;
  }

  // update margins
  var marginUnit = dom.byId("marginUnitInches").checked ? 72 : 28.346;
  view.currentMarginUnit = marginUnit;
  dom.byId("marginTopInput").value = model.report.marginTop / marginUnit;
  dom.byId("marginRightInput").value = model.report.marginRight / marginUnit;
  dom.byId("marginBottomInput").value = model.report.marginBottom / marginUnit;
  dom.byId("marginLeftInput").value = model.report.marginLeft / marginUnit;

  // update selected page format
  var pageFormatOptions = dom.byId("pageFormatOptions");
  for(var idx=0; idx<pageFormatOptions.options.length; idx++) {
    var option = pageFormatOptions.options[idx];
    if (option.value == model.report.pageFormat) {
      option.selected = true;
      option.scrollIntoView();
      break;
    }
  }

  // update orientation ui
  this.pageSetupDialog.setOrientation(model.report.orientation ? this.pageSetupDialog.ORIENTATION_PORTRAIT : this.pageSetupDialog.ORIENTATION_LANDSCAPE);

  this.pageSetupDialog.title = this.getLocaleString('pageSetupDialogTitle');

  this.pageSetupDialog.callbacks = [
    lang.hitch(this,this.changePageSetup,false),
    lang.hitch(this,this.changePageSetup,true)
  ];

  this.pageSetupDialog.registerOnCancelCallback(lang.hitch(this, function() {
    this.hideGlassPane();
  }));

  this.pageSetupDialog.buttons = [this.getLocaleString('Ok_txt'),this.getLocaleString('Cancel_txt')];

  this.pageSetupDialog.show();
}

pentaho.pir.view.prototype.changePageSetup = function(isCancel) {
  this.hideGlassPane();
  this.pageSetupDialog.hide();
  if (!isCancel) {
    // get page format from dialog (by id)
    var pageFormatOptions = dom.byId("pageFormatOptions");
    var pageFormat = pageFormatOptions.options[pageFormatOptions.selectedIndex].value;
    if (array.indexOf(controller.pageFormats, pageFormat) != -1) {
      controller.changePageFormat( pageFormat );
    }
    // get orientation from dialog (by id)
    controller.setOrientation(this.pageSetupDialog.getOrientation());
    // page margins
    try {
      var marginTop = dom.byId("marginTopInput").value * view.currentMarginUnit;
      var marginRight = dom.byId("marginRightInput").value * view.currentMarginUnit;
      var marginBottom = dom.byId("marginBottomInput").value * view.currentMarginUnit;
      var marginLeft = dom.byId("marginLeftInput").value * view.currentMarginUnit;
      if(''+marginTop == 'NaN' || ''+marginRight == 'NaN' || ''+marginBottom == 'NaN' || ''+marginLeft == 'NaN') {
        alert(this.getLocaleString("marginsMustBeGeneric"));
      } else {
        controller.setMargins(marginTop, marginRight, marginBottom, marginLeft);
      }
    } catch (e) {
      alert(this.getLocaleString("marginsMustBeGeneric"));
    }
    controller.cancelCurrentAsyncJob();
    controller.updateReport();
  }
}

pentaho.pir.view.prototype.updateMarginUnits = function() {
  // update margins
  var marginUnit = view.currentMarginUnit;
  var marginTop = dom.byId("marginTopInput").value * marginUnit;
  var marginRight = dom.byId("marginRightInput").value * marginUnit;
  var marginBottom = dom.byId("marginBottomInput").value * marginUnit;
  var marginLeft = dom.byId("marginLeftInput").value * marginUnit;

  marginUnit = dom.byId("marginUnitInches").checked ? 72 : 28.346;
  dom.byId("marginTopInput").value = marginTop / marginUnit;
  dom.byId("marginRightInput").value = marginRight / marginUnit;
  dom.byId("marginBottomInput").value = marginBottom / marginUnit;
  dom.byId("marginLeftInput").value = marginLeft / marginUnit;
  view.currentMarginUnit = marginUnit;
  view.marginUnitOverride = true;
}

pentaho.pir.view.prototype.changeTemplate = function(e) {

  var idx = parseInt(e.id.substr('template-name-'.length));

  this.nextTemplate = idx;

  if(controller.isFormattingModified()) {
    this.showMessageBox(this.getLocaleString('ChangeTemplateMessage'),this.getLocaleString('ChangeTemplate'),
      this.getLocaleString('Yes_txt'), function() {view.changeTemplate2(true, e)},
      this.getLocaleString('No_txt'), function() {view.changeTemplate2(false, e)});
  } else {
    view.changeTemplate2(false, e);
  }

}

pentaho.pir.view.prototype.changeTemplate2 = function(keepFormatting, e) {

  if(this.templates == null || this.templates.length == 0) {
    return;
  }
  this.closeMessageBox();
  if(!keepFormatting) {
    controller.removeAllFormatting();

    // update margins from template
    controller.setMargins(-1, -1, -1, -1);
    controller.changePageFormat(null);
    controller.setOrientation(-1);
  }

  this.showTemplateSelected(this.templates[this.nextTemplate].id);

  // see if the user wants to keep formatting changes
  controller.changeTemplate( this.templates[this.nextTemplate].id );
}

pentaho.pir.view.prototype.showTemplateSelected = function(templateId) {
  // deselect all the templates
  var selected = -1;
  for(var idx=0; idx<this.templates.length; idx++) {
    if(this.templates[idx].id == templateId) {
      selected = idx;
            dom.byId('currentTemplateIcon').src = './'+this.templates[idx].imagePath;
      dom.byId('currentTemplateName').innerHTML = this.templates[idx].name;
      break;
    }
  }
  var $prevIcon = $('#prevTemplateIcon');
  if(selected == 0) {
    $prevIcon.removeClass("prevTemplateIconOn").addClass("prevTemplateIconOff");
  } else {
    $prevIcon.removeClass("prevTemplateIconOff").addClass("prevTemplateIconOn");
  }

  var $nextIcon = $('#nextTemplateIcon');
  if(selected == this.templates.length-1) {
    $nextIcon.removeClass("nextTemplateIconOn").addClass("nextTemplateIconOff");
  } else {
    $nextIcon.removeClass("nextTemplateIconOff").addClass("nextTemplateIconOn");
  }
}

pentaho.pir.view.prototype.changeQueryTimeoutCheckBox = function() {
  var checked = dom.byId('queryTimeoutCheckBox').checked;
  if( checked ) {
    dom.byId('queryTimeoutEdit').value = controller.queryTimeoutDefault;
    dom.byId('queryTimeoutEdit').disabled = false;
    controller.setQueryTimeout(controller.queryTimeoutDefault);
  } else {
    dom.byId('queryTimeoutEdit').value = '';
    dom.byId('queryTimeoutEdit').disabled = true;
    controller.setQueryTimeout(0);
  }
  view.refresh();
}

pentaho.pir.view.prototype.changeQueryTimeoutEdit = function() {
  var value = dom.byId('queryTimeoutEdit').value;
  if (!dom.byId('queryTimeoutCheckBox').checked) {
    value = 0;
  }
  try {
    var intValue = parseInt(value);
    if(''+intValue != 'NaN') {
      controller.setQueryTimeout(intValue);
    }
  } catch (e) {}
}


pentaho.pir.view.prototype.changeQuerylessCheckBox = function() {
  var checked = dom.byId('querylessCheckBox').checked;
  controller.setQuerylessMode(!checked);
}

pentaho.pir.view.prototype.changeDisableDistinctCheckbox = function() {
  var checked = dom.byId('disabledistinctcheckbox').checked;
  model.report.disableDistinct = !checked;
  view.refresh();
}

pentaho.pir.view.prototype.changeWidthEdit = function() {
  var value = dom.byId("widthedit").value;
  try {
    var floatValue = parseFloat(value);
    if ('' + floatValue != 'NaN') {
      var fieldWidths = {};
      for (var idx = 0; idx < this.selectedItems.length; idx ++) {
        fieldWidths[this.selectedItems[idx].idx] = floatValue;
      }
      controller.resizeFields(fieldWidths);
      view.refresh();
    }
  } catch (e) {}
}

pentaho.pir.view.prototype.installContextHelp = function() {
  // Finds the PIR-HELP message bundle and build a help context out of it
  var messageBundle = pentaho.common.Messages.getBundle('pir-help');
  if (messageBundle) {
    this.contextHelp = pentaho.common.ContextHelp.buildContext(messageBundle);
    this.contextHelp.installAll(this.reportContentDiv);
  }
}

/**
 * Toggle the "report control" panel designated by the name provided.
 *
 * @param name Name of report control to show or hide
 * @param show Optional: if provided the control will be shown or hidden based on its value
 */
pentaho.pir.view.prototype.toggleControl = function(name, show) {
  var panel = dom.byId(name);
  var checked = panel.toolbarItem.checked;

  if (show !== undefined) {
    if (show === checked) {
      return;
    } else {
      checked = show;
      // Sync view & model
      panel.toolbarItem.set('checked', checked);
    }
  }

  var ctlPanel = dom.byId("reportControlPanel");

  this.disableResizeRegions();
  this.hideContextMenu();

  if (checked) {
    // Show the control panel
    domClass.remove(ctlPanel, "hidden");
  } else {
    domClass.add(ctlPanel, "hidden");
  }

  if (checked) {
    domClass.remove(panel, "hidden");
  } else {
    domClass.add(panel, "hidden");
  }

  query("#reportControlPanel > div").forEach(function (e) {
    if (e.toolbarItem != panel.toolbarItem) {
      domClass.add(e, "hidden");
      e.toolbarItem.set("checked", false);
    }
  });
  this.resize();
  this.resizeFilterWidget();
}



// This works but doesn't animate the contents of the panels... :(
//pentaho.pir.view.prototype.toggleControlWithAnimation = function(name) {
//  var panel = dom.byId(name);
//  var checked = panel.toolbarItem.checked;
//  var ctlPanel = dom.byId("reportControlPanel");
//
//  var togglePanelContents = function() {
//    dojo.toggleClass(panel, "hidden");
//    query("#reportControlPanel > div").forEach(function (e) {
//      if (e.toolbarItem != panel.toolbarItem) {
//        domClass.add(e, "hidden");
//        e.toolbarItem.set("checked", false);
//      }
//    });
//  }
//
//  if (checked && domClass.contains(ctlPanel, "hidden")) {
//    // Show the control panel
////    var height = style.get(dom.byId("reportControlPanel"),  "height");
//    var height = 100;
//    style.set(dom.byId("reportControlPanel"),  "height",  0);
//    domClass.remove(ctlPanel, "hidden");
//    togglePanelContents();
//    dojo.anim(ctlPanel, {height: height}, 350, dojo.fx.easing.cubicOut);
//  } else if (!domClass.contains(ctlPanel, "hidden")) {
//    dojo.anim(ctlPanel, {height: 0}, 350, dojo.fx.easing.cubicOut, function() {
//      domClass.add(dom.byId("reportControlPanel"), "hidden");
//      togglePanelContents();
//    });
//  }
//}

pentaho.pir.view.prototype.prepareAdvancedFilters = function(){
  if(model.report.filters && (model.report.filters.length > 0)){
    var mql = this.traverseFilterStore(true);
    if(mql != null && string.trim(mql).length > 0){
      var mqlFilter = controller.createMqlFilter(mql);
      mqlFilter.isAdvanced = true;
      model.report.filters.push(mqlFilter);
    }
  }
}

pentaho.pir.view.prototype.traverseFilterStore = function (isMQL){
  var root = this.filterStore.getRootItem();
  var outputString = {description:''};
  this.traverseFilterStoreHelper(root, outputString, isMQL, 0);
  return outputString.description;
}

pentaho.pir.view.prototype.traverseFilterStoreHelper = function (filterItem, outputString, isMQL, idx){

  var children = this.filterStore.getChildren(filterItem);
  if(filterItem.type == 'operator'){
    if(isMQL){
      if(idx > 0){
        outputString.description += ';';
      }
      if(children.length > 1){
        outputString.description += filterItem.value + '(';
      }
    }
    else{
      if(idx > 0){
        //outputString.description += ' ??? ';

        // find closest ancestor with multiple children
        var root = this.filterStore.getRootItem();
        var parent = this.filterStore.getParent(filterItem);
        while(!this.filterStore.hasSiblings(parent, false)){
          if(parent == root){
            break;
          }
          parent = this.filterStore.getParent(parent);
        }
        outputString.description += ' ' + parent.value + ' ';
      }
      if(children.length > 1){
        outputString.description += '(';
      }
    }
  }
  children.forEach(function(item, index){
    view.traverseFilterStoreHelper(item, outputString, isMQL, index);
    if(item.type == 'condition'){
      if(isMQL){
        if(index > 0){
          outputString.description +=  ';'
        }
        outputString.description += controller.filterToMqlString(item.value);
      }
      else{
        if(index > 0){
          var op = ' ' + filterItem.value + ' ';
          outputString.description +=  op;
        }
        outputString.description += item.description;
      }
    }
  });
  if(filterItem.type == 'operator' && children.length > 1){
    outputString.description += ')';
  }
}

pentaho.pir.view.prototype.createMemoryStore = function (dataArray, uniqueItemId){
  return new Observable(Memory(
    {
      data: dataArray,
      idProperty: uniqueItemId ? uniqueItemId : 'id'
    }
  ));
}

pentaho.pir.view.prototype.createNewExpression = function (filterItem) {

  // create a new expression
  var exp = new ExpressionTree({
    label: filterItem.value,
    value: filterItem.value
    //selected: true
  });
  aspect.after(exp, "onOperatorChange", function(newValue) {
    filterItem.value = newValue;
    view.filterStoreCleanUp();
    view.createFilterItems(true);

    view.refresh();
  }, true);

  return exp;
}

pentaho.pir.view.prototype.moveUpFilter = function (idx) {

  if(idx == undefined || idx == null){
    idx = view.filterStore.currentIdx;
  }

  var filterItem = this.filterStore.get("filter-" + idx);
  var currentIdx = this.filterStore.getCurrentIdx(filterItem);
  if(currentIdx <= 0){
    if(currentIdx == 0){
      // top most filter; move to parent if exists
      var parent = this.filterStore.getParent(filterItem);
      if(parent){
        if(parent.id != this.filterStore.getRootItem().id){
          filterItem.parent = parent.parent;
          this.filterStore.put(filterItem);

          // fix ordering (may need to swap last sibling)
          this.filterStore.insertBefore(filterItem, parent, false);
        }
      }
    }
    else{
      console.log('filter item not found');
    }
  }
  else{
    var sibling = this.filterStore.getSiblingAtIndex(filterItem, currentIdx-1);
    if(sibling){
      if(sibling.type == 'operator'){
        // move as a child of sibling
        filterItem.parent = this.filterStore.getIdentity(sibling);
        this.filterStore.put(filterItem);

        // fix ordering
        var lastSibling = this.filterStore.getLastSibling(filterItem);
        if(lastSibling){
          this.filterStore.insertBefore(lastSibling, filterItem, false);
        }
      }
      else{
        // simple swap
        this.filterStore.insertBefore(filterItem, sibling);
      }
    }
  }

  view.filterStoreCleanUp();
  this.createFilterItems(true);
}

pentaho.pir.view.prototype.moveDownFilter = function (idx) {

  if(idx == undefined || idx == null){
    idx = view.filterStore.currentIdx;
  }

  var filterItem = this.filterStore.get("filter-" + idx);

  var currentIdx = this.filterStore.getCurrentIdx(filterItem);
  if(currentIdx >= 0){
    var sibling = this.filterStore.getSiblingAtIndex(filterItem, currentIdx+1);
    if(sibling){
      if(sibling.type == 'operator'){
        // move as a child of sibling
        filterItem.parent = this.filterStore.getIdentity(sibling);
        this.filterStore.put(filterItem);

        // fix ordering
        var firstSibling = this.filterStore.getFirstSibling(filterItem);
        if(firstSibling){
          this.filterStore.insertBefore(filterItem, firstSibling, false);
        }
      }
      else{
        // simple swap
        this.filterStore.insertBefore(sibling, filterItem);
      }
    }
    else{
      // bottom most filter; move to parent if exists
      var parent = this.filterStore.getParent(filterItem);
      if(parent){
        //if(parent.id != 'root'){
        if(parent.id != this.filterStore.getRootItem().id){
          filterItem.parent = parent.parent;
          this.filterStore.put(filterItem);

          // fix ordering (may need to swap last sibling)
          this.filterStore.insertBefore(parent, filterItem, false);
        }
      }
      else{
        console.log('cannot move bottom');
      }
    }
  }

  view.filterStoreCleanUp();
  this.createFilterItems(true);
}

pentaho.pir.view.prototype.indentFilter = function (idx) {

  if(idx == undefined || idx == null){
    idx = view.filterStore.currentIdx;
  }

  var filterItem = this.filterStore.get("filter-" + idx);
  var currentIdx = this.filterStore.getCurrentIdx(filterItem);

  var random = Math.floor(Math.random()*1001);
  var id = "exp-" + random + "-" + idx;
  this.filterStore.put({
    id: id,
    type: 'operator',
    value:'AND'
  }, {
    before: filterItem,
    parent: this.filterStore.get(filterItem.parent)
  });

  filterItem.parent = id;
  this.filterStore.put(filterItem);

  view.filterStoreCleanUp();
  this.createFilterItems(true);
}

pentaho.pir.view.prototype.handleRemoveFilter = function (idx) {
  controller.handleRemoveFilter();
}

pentaho.pir.view.prototype.removeFilterFromStore = function (filterToRemove) {
  this.filterStore.remove(this.filterStore.getIdentity(filterToRemove));

  // remove operator if it doesn't contain filter items
  var parent = this.filterStore.getParent(filterToRemove);
  var filterSiblings = this.filterStore.getChildren(parent);
  if(this.filterStore.getRootItem() != parent && filterSiblings && filterSiblings.length < 1) {
      this.filterStore.remove(this.filterStore.getIdentity(parent));
  }
}

pentaho.pir.view.prototype.isValidFilterConditions = function () {

  var isValid = true;
  var operators = this.filterStore.query({type:'operator'});
  if( operators && operators.length > 1){ // only check if multiple operator exist (ignore root operator)
    operators.some(function(filterItem){
      if(view.filterStore.getChildren(filterItem).length < 2){
        isValid = false;
        return false; // break out of loop
      }
    });
  }

  return isValid;
}

/*
 pentaho.pir.view.prototype.outdentFilter = function (idx) {

 var filterItem = this.filterStore.get("filter-" + idx);

 var parentFilter = this.filterStore.get(filterItem.parent);
 if (parentFilter.parent != null){
 filterItem.parent = parentFilter.parent;
 }
 else{
 filterItem.parent = parentFilter.id;
 }

 this.filterStore.put(filterItem);

 view.filterStoreCleanUp();
 this.createFilterItems();
 }
 */


pentaho.pir.view.prototype.resizeFilterWidget = function () {
  this.filterStore.query({type:'operator'}).forEach(function(filterItem){
    filterItem.exp.resize();
  });
}

pentaho.pir.view.prototype.filterStoreCleanUp = function () {
  // remove empty operators
  this.filterStore.query({type:'operator'}).forEach(function(filterItem){
    if(view.filterStore.query({parent:filterItem.id}).length <= 0){
      view.filterStore.remove(filterItem.id);
    }
  });
}

pentaho.pir.view.prototype.addFilterToRoot = function (filter) {
  var filterItem = view.createFilterItem(filter);
  filterItem.parent = view.filterStore.getRootItem().id;
  view.filterStore.put(filterItem);
}

pentaho.pir.view.prototype.createFilterItem = function (filter, idx) {

  idx = filter.id ? filter.id : idx;
  var div = construct.create("div",
    {
      "id": "filter-" + idx,
      "fieldId": idx,
      //"class": "dojoDndItem filterItemContainer propPanel_gemBar number",
      "class": "dojoDndItem propPanel_gemBar number pentaho-filter-item-container"
    });

  var desc;
  if(filter.mqlCondition != null){
    var mqlConditionHtml = construct.create("span", {innerHTML: filter.mqlCondition}, div);
    desc = filter.mqlCondition;
  }
  else{
    var isPrompt = filter.parameterName && controller.findParameterByName(filter.parameterName);
    var wrapper = construct.create("div", {"class": "gem pentaho-filter-gem-wrapper"}, div);
    var gemLabelClassName = 'gem-label';
    var filterHtml = construct.create("div", {"class": gemLabelClassName, innerHTML: this.filterDialog.buildFilterText(filter, isPrompt)}, wrapper);
    var popupButton = construct.create("div", {"class": "gemMenuHandle"}, wrapper);

    // sets the current filter/index when the popup button is clicked
    this.reportConnectionHandles.push(on(popupButton, "click", function() {
      view.filterStore.currentFilter = filter;
      view.filterStore.currentIdx = idx;
    }));

    // bind the menu to the popup button
    registry.byId('filterActionContextMenu').bindDomNode(popupButton);
    this.reportConnectionHandles.push(on(wrapper, "mouseover", lang.hitch( function(event) { domClass.add(wrapper,  "over"); })));
    this.reportConnectionHandles.push(on(wrapper, "mouseout", lang.hitch( function(event) { domClass.remove(wrapper,  "over"); })));

    desc = this.filterDialog.buildFilterText(filter, isPrompt);
  }

  var filterItem = this.filterStore.get("filter-" + idx);
  var parent = null;
  if(filterItem){
    parent = filterItem.parent;
  }
  else{
    parent = filter.parentId ? "filter-" + filter.parentId : 'root';
  }

  filterItem = {
    id: "filter-" + idx,
    type: 'condition',
    value: filter,
    description: desc,
    parent: parent,
    html: div
  };

  return filterItem;
}

pentaho.pir.view.prototype.refreshFilterItems = function (preventReset) {
  this.createFilterItems(preventReset);
  this.fieldList.updateFilterIndicators(model.report.filters);
}

pentaho.pir.view.prototype.createFilterItems = function (preventReset) {
  this.filterDialog.setDatasource(controller.datasource);
  var filterList = dom.byId("filterList");
  if (model.report.filters.length > 0 ) {
    domClass.add("filterPanelHint", "hidden");
    domClass.remove("filterList", "hidden");
  } else {
    this.initControlPanel(controller.command);
    domClass.remove("filterPanelHint", "hidden");
    domClass.add("filterList", "hidden");
  }
  construct.empty(filterList);

  if(preventReset){
    // do nothing
  }
  else{
    // reset filterStore with default root
    this.filterStore.resetData();

    // add filter combinations to the store
    array.forEach(model.report.filters, function(filter, idx) {
      if(!filter.column){
        if(filter.parentId == null){
          // this is the real root; remove default root
          this.filterStore.remove('root');
        }

        // add to filterStore
        this.filterStore.put({
          id: "filter-" + filter.id,
          type: 'operator',
          value: filter.combinationType,
          parent: filter.parentId ? "filter-" + filter.parentId : null
        });
      }
    }, this);
  }

  // add filter conditions to the store
  array.forEach(model.report.filters, function(filter, idx) {
    if(filter.column){
      var filterItem = this.createFilterItem(filter, idx);
      if(filterItem.parent == 'root' || filterItem.parent == 'filter-undefined'){ // PIR-747
        filterItem.parent = this.filterStore.getRootItem().id;
      }
      this.filterStore.put(filterItem);
    }
  }, this);

  // create parent expressions
  this.filterStore.getOperators().forEach(function(filterItem){
    var exp = view.createNewExpression(filterItem);
    filterItem.exp = exp;
    view.filterStore.put(filterItem);
  });

  // attach children expressions to parent expreassions
  var root = this.filterStore.getRootItem().exp;
  this.filterStore.getOperators().forEach(function(filterItem){
    var exp = filterItem.exp;
    view.filterStore.query({parent: filterItem.id}).forEach(function(f){

      // add simple condition
      if(f.html){
        exp.addCondition(f.html);
      }

      // add expression
      if(f.exp){
        if((view.filterStore.query({parent: f.id}).length) > 0){
          exp.addCondition(f.exp.domNode);
        }
      }
    });
  });

  construct.place(root.domNode, filterList);
  this.resizeFilterWidget();

  var readableFilterString;
  if(!view.isValidFilterConditions()){
      readableFilterString = "Invalid filter. Changes in filter will not be saved."
  } else {
      readableFilterString = this.traverseFilterStore();
  }

  construct.create("div",
    {
      "innerHTML": '<br/>' + readableFilterString,
      "class": 'pentaho-human-readable-filter-string'
    }, filterList);
}

pentaho.pir.view.prototype.editFilter = function(f) {
  if(!f){
    f = view.filterStore.currentFilter;
  }

  var filter = typeof f == "number" ? model.report.filters[f] : f;
  if(filter.mqlCondition != null){
    /*
     view.advancedFilterWidget.set('model', filter);
     view.advancedFilterWidget.set('text', filter.mqlCondition);
     view.showAdvancedFilterTextPanel();
     */
  }
  else{
    this.filterDialog.setDatasource(controller.datasource);
    this.filterDialog.configureFor(filter);
    this.filterDialog.registerPreSaveCallback(this.validateParameterNameChange);
    this.filterDialog.callbacks = [
      lang.hitch(this, function() {
        if (this.canUpdateFilter(f, this.filterDialog.matchAggType.value)) {
          this.filterDialog.save();
        }
      }, f),
      lang.hitch(this, function() {this.filterDialog.cancel()})];
    this.showGlassPane(0.5);
    this.filterDialog.show();
  }
}

/**
 * PIR-839
 *
 * This method will check if a filter can be updated depending on the aggregation type
 * being selected and the remaining filters' aggregation types.
 *
 * @param filter The filter being edited
 * @param affType The aggregation type selected
 */
pentaho.pir.view.prototype.canUpdateFilter = function(filter, aggType) {
  var newFilterAggr = aggType;
  var currFilter = filter;
  var canUpdate = false;

  var filterHasAggregation = newFilterAggr && newFilterAggr != 'NONE';

  if (currFilter.selectedAggType != newFilterAggr) {
    // Filter aggregation type has been changed which can be problematic.
    // Lets check if there's any problem with the other filters in the report

    if (filterHasAggregation) {
      if (controller.mixedFilterAggTypesInReport(filterHasAggregation)) {
        // Mixed aggregation types in the report filters,
        // check if all non-aggregated filters are columns in the report
        if (!this.nonAggFiltersInReport(currFilter)) {
          view.showMessageBox(
              view.getLocaleString("UnableToEditFilterErrorWithAggr_Message"),
              view.getLocaleString("UnableToEditFilterError_Title"));
          return;
        }
        canUpdate = true;
      }
      else {
        canUpdate = true;
      }
    }
    else {
      // This filter doesn't have aggregation so there can't be any filter with aggregation
      // already there unless this filter is also a field in the report
      if (controller.mixedFilterAggTypesInReport(filterHasAggregation)) {
        // No aggregation on the filter and there's other filters present with aggregations
        // We can only allow this if the filter being updated is present as a field in the report
        var column = _.find(model.report.fields, function(obj) { return obj.field == currFilter.column });
        var group = _.find(model.report.groups, function(obj) { return obj.field == currFilter.column });

        if ((column && (column.fieldAggregation == 'NONE' || column.fieldAggregation == 'none')) || (group)) {
          canUpdate = true;
        } else {
          view.showMessageBox(
              view.getLocaleString("UnableToEditFilterErrorWithoutAggr_Message"),
              view.getLocaleString("UnableToEditFilterError_Title"));
          return;
        }
      }
      else {
        canUpdate = true;
      }
    }
  } else {
    if (controller.mixedFilterAggTypesInReport(filterHasAggregation)) {
      if (!this.nonAggFiltersInReport(currFilter)) {
        // Mixed aggregation types in the report filters,
        // check if all non-aggregated filters are columns in the report
        view.showMessageBox(
            view.getLocaleString("Unable to add filter since there's an aggregated column in the report."),
            view.getLocaleString("Unable to add filter"));
        return;
      }
    }
    canUpdate = true;
  }
  return canUpdate;
}

// Validate if all non-aggregated filters are present in the report as fields
pentaho.pir.view.prototype.nonAggFiltersInReport = function(currFilter) {
  var reportFields = _.pluck(model.report.fields, 'field');
  var reportGroups = _.pluck(model.report.groups, 'field');
  var allFiltersInReport = true;
  _.each(model.report.filters, function(filter) {
    if (filter.selectedAggType == 'NONE') {
      if (filter.column && filter.column != currFilter.column &&
          !(_.contains(reportFields, filter.column)) && !(_.contains(reportGroups, filter.column))) {
        allFiltersInReport = false;
      }
    }
  });
  // Also check current filter being added
  if (currFilter.selectedAggType == 'NONE') {
    var column = _.find(model.report.fields, function(obj) { return obj.field == currFilter.column });
    var group = _.find(model.report.groups, function(obj) { return obj.field == currFilter.column });
    if ((!column || (column.fieldAggregation != 'NONE' && column.fieldAggregation != 'none')) && (!group)) {
      allFiltersInReport = false;
    }
  }
  return allFiltersInReport;
}

// If the user changes the parameter name of the filter that would cause a prompt to be orphaned (not connected to the query)
// we need to make sure the user knows this will result in deleting the prompt
pentaho.pir.view.prototype.validateParameterNameChange = function(filterDialog, filter, saveCallback) {
  delete filter.parameterToDelete; // remove old parameter to delete
  if (filterDialog.getParameterName() !== filter.parameterName) {
    var param = controller.findParameterByName(filter.parameterName);
    if (param) {
      var lastReference = true;
      // If this parameter (prompt) referenced by any other filter we don't need to prompt the user
      array.some(model.report.filters, function(f) {
        if (f !== filter && f.parameterName === filter.parameterName) {
          lastReference = false;
          return true; // break
        }
      });
      if (lastReference) {
        var confirmed = function() {
          filter.parameterToDelete = filter.parameterName;
          saveCallback();
        }
        // Ask the user to delete the prompt by changing the parameter name
        view.showMessageBox(
          view.getLocaleString('ChangeParameterNameDeletePromptMessage', filter.parameterName),
          view.getLocaleString('ChangeParameterNameDeletePromptTitle'),
          view.getLocaleString('Yes_txt'),
          confirmed,
          view.getLocaleString('No_txt'));
        return;
      }
    }
  }
  saveCallback();
}

pentaho.pir.view.prototype.changeHintsCheckBox = function() {
  this.flagsDisplayed = dom.byId('hintsCheckBox').checked;
  this.refreshHints();
  this.resize();
}

pentaho.pir.view.prototype.isHintsVisible = function() {
  return controller.command !== "view" && this.flagsDisplayed;
}

pentaho.pir.view.prototype.isBottomBarVisible = function() {
  return this.isHintsVisible() || !domClass.contains(this.trashcan, 'hidden');
}

pentaho.pir.view.prototype.refreshHints = function() {
  var visible = this.isHintsVisible();
  this.showFlags(visible);
  if(visible) {
    domClass.remove('bottompanel','hidden');
    domClass.remove('hintspanel', 'hidden');
  } else {
	if (dom.byId('bottompanel')) {
      domClass.add('bottompanel','hidden');
	}
    if (dom.byId('hintspanel')) {
      domClass.add('hintspanel', 'hidden');
    }
  }
  this.resize();
}

pentaho.pir.view.prototype.destroyFlags = function() {
  array.forEach(this.flags, function(flag) {
    flag.tooltip.destroy();
    construct.destroy(flag);
  });
  this.flags = [];
}
/*
 * This will remove existing hint flags and recreate them.
 */
pentaho.pir.view.prototype.createFlags = function() {
  this.destroyFlags();
  var offset = geometry.position( this.reportContentDiv );
  this.createFlag(this.getLocaleString('fieldListFlag'), 'green', 'fieldListFlag', 100, 25, 'fieldlist');
  this.createFlag(this.getLocaleString('inlineEditFlag'), 'green', 'inlineEditFlag', 100-offset.x, -10-offset.y, 'reportContent', 'rpt-report-header-label-0' ,'top', 'left', false); //[PIR-579]
  this.createFlag(this.getLocaleString('swapDropFlag'), 'green', 'swapDropFlag', 10-offset.x, -15-offset.y, 'reportContent', 'rpt-column-value-0' ,'top', 'left' ,false);
  var cell = dom.byId('rpt-column-header-0');
  if(cell) {
    var row = cell.parentNode;
    this.createFlag(this.getLocaleString('dropGroupsFlag'), 'green', 'dropGroupsFlag', -100-offset.x, -15-offset.y, 'reportContent', row ,'top', 'right' ,false);
  }
}

pentaho.pir.view.prototype.showFlags = function(show) {
  this.createFlags();
  for(var idx=0; idx<this.flags.length; idx++) {
    if(show) {
      domClass.remove(this.flags[idx], "hidden");
    } else {
      domClass.add(this.flags[idx], "hidden");
    }
  }
}

pentaho.pir.view.prototype.changeStartupHintsCheckBox = function() {
  var startup = dom.byId('startupHintsCheckBox').checked;
  dom.byId('startupHintsCheckBox2').checked = startup;
  pentaho.userSettingsInstance.setSetting(this.TipsStartupSettings, ''+startup, this.settingSaved, this)

}

pentaho.pir.view.prototype.saveReport = function(openSaveAs, afterCallback) {
    onSave = function () {
        if (openSaveAs) {
            controller.openSaveReportDialog(false, afterCallback);
        } else {
            var filePath = controller.currentFilePath;
            var fileName = controller.currentFileName;
            controller.saveReport(fileName, '', filePath, '', true, false, afterCallback);
        }
        // afterCallback
    };
    view.showMessageBox(
            view.getLocaleString("NeedToSaveMessage"),
            view.getLocaleString('NeedToSaveTitle'),
            view.getLocaleString('Yes_Save_txt'), onSave,
            view.getLocaleString('No_txt'));
}

pentaho.pir.view.prototype.queryLimitRunNow = function() {
  var runNowCallback = function() {
    openReportBackgroundDialog(controller.currentFilePath + '/' + controller.currentFileName);
  };
  if (controller.newReport) {
      this.saveReport(true, runNowCallback);
  } else if (hasUnsavedChanges() || this._getStateProperty("parametersChanged")) {
      this.saveReport(false, runNowCallback);
  } else {
      runNowCallback();
  }
}
pentaho.pir.view.prototype.queryLimitSchedule = function() {
  var scheduleCallback = function() {
    openReportSchedulingDialog(controller.currentFilePath + '/' + controller.currentFileName);
  };
  if (controller.newReport) {
      this.saveReport(true, scheduleCallback);
  } else if (hasUnsavedChanges() || this._getStateProperty("parametersChanged")) {
      this.saveReport(false, scheduleCallback);
  } else {
      scheduleCallback();
  }
}

pentaho.pir.view.prototype.changeMenuButtonCheckBox = function() {
  var value = dom.byId('menuButtonCheckBox').checked;
  this.showMenuButtons = value;
  if(!this.showMenuButtons) {
    domClass.add(this.menuImageButton, "hidden");
  }

  pentaho.userSettingsInstance.setSetting(this.menuButtonsStartupSettings, ''+value, this.settingSaved, this)

}

pentaho.pir.view.prototype.settingSaved = function(status) {

//    alert(status.message);
}

pentaho.pir.view.prototype.disableTextSelection = function(target){
  if (typeof target.onselectstart!="undefined") //IE route
    on(target, "selectstart", lang.hitch( null,  function() { return false; }));
  else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
    target.style.MozUserSelect="none"
  else //All other route (ie: Opera)
    on(target, "mousedown", lang.hitch( null,  function() { return false; }));
  target.style.cursor = "default"
}

pentaho.pir.view.prototype.showQuerySetup = function() {

  var p = geometry.position(dom.byId('queryOptions'));
  var p2 = geometry.position(registry.byId('datatab').domNode);
  var div = dom.byId('queryOptionsMenuContainer');

  style.set(div,  'left',  ''+(p.x-p2.x)+'px');
  style.set(div,  'top',  ''+(p.y-p2.y)+'px');
  style.set(div,  'display',  'block');
  registry.byId("queryOptionsMenuButton").openDropDown();
  $("#queryOptions").addClass("checked");
  dom.byId('disabledistinctcheckbox').focus();
//  style.set(div,  'display',  'none');

}

pentaho.pir.view.prototype.onForeColorChange = function( color ) {
  this.toolbar1ForeColor(color);
}

pentaho.pir.view.prototype.onBackColorChange = function( color ) {
  this.currentBackColor = color;
}

pentaho.pir.view.prototype.initControlPanel = function(command) {
  var key;
  if (command === 'view' && model.report.filters.length === 0) {
    key = "filterPanelNoFiltersHint_content";
  } else {
    key = "filterPanelHint_content";
  }
  dom.byId("filterPanelHint").innerHTML = this.getLocaleString(key);

  if (command === 'view' && model.report.groups.length === 0) {
    key = "layoutPanelNoGroupsHint_content";
  } else {
    key = "layoutPanelGroupHint_content";
  }
  dom.byId("layoutPanelGroupHint").innerHTML = this.getLocaleString(key);

  if (command === 'view' && model.report.fields.length === 0) {
    key = "layoutPanelNoColumnsHint_content";
  } else {
    key = "layoutPanelColumnHint_content";
  }
  dom.byId("layoutPanelColumnHint").innerHTML = this.getLocaleString(key);

  if (command === 'view' && !this.hasVisibleParameters(model.report)) {
    key = "parameterPanelNoParametersHint_content";
  } else {
    key = "parameterPanelHint_content";
  }
  dom.byId("parameterPanelHint").innerHTML = this.getLocaleString(key);
}

pentaho.pir.view.prototype.adminShowModel = function() {
  controller.prepareReport();
  this.showSelectableMessageBox(dojox.html.entities.encode(json.stringify( model.report )), this.getLocaleString('Ok_txt'), this.getLocaleString('ReportModel'));
}

pentaho.pir.view.prototype.adminShowQuery = function() {
  controller.prepareReport();
  var ds = controller.getDefaultDataSource(model.report);
  if (ds != null && ds.query != null) {
    this.showSelectableMessageBox(dojox.html.entities.encode(ds.query), this.getLocaleString('Ok_txt'), this.getLocaleString('ReportQuery'));
  }
}

pentaho.pir.view.prototype.adminShowSql = function() {
  this.showSelectableMessageBox(dojox.html.entities.encode(controller.getSqlQuery()), this.getLocaleString('Ok_txt'), this.getLocaleString('ReportSQL'));
}

pentaho.pir.view.prototype.parameterToolbarClicked = function() {
  this.toggleControl("parameterPanel");
}

pentaho.pir.view.prototype.openParameterPanel = function() {
  this.toggleControl("parameterPanel", true);
}

pentaho.pir.view.prototype.hasVisibleParameters = function(report) {
  var visible = false;
  array.some(report.parameters, function(p) {
    if (!p.hidden) {
      visible = true;
      return true; // break
    }
  });
  return visible;
}

pentaho.pir.view.prototype.createPromptPanel = function() {
  this.promptApi.operation.render(function(api, callback) {
    var paramDefnCallback = function(xml) {
      var paramDefn = this.promptApi.util.parseParameterXml(xml);

      paramDefn.ignoreBiServer5538 = false; // TODO move this to the server side.
      // Make sure we retain the current auto-submit setting
      var currentAutoSubmit = this._getStateProperty("autoSubmit");
      if (currentAutoSubmit != undefined) {
        paramDefn.autoSubmitUI = currentAutoSubmit;
      }
      callback(paramDefn);

      this._createPromptPanelFetchCallback(paramDefn);
    };
    controller.fetchParameterDefinition(paramDefnCallback.bind(this));
  }.bind(this));
},

pentaho.pir.view.prototype.refreshParameterPanel = function(createUndoItem) {
  if (createUndoItem) {
    controller.addToUndo(json.stringify(model.report));
  }
  this.promptApi.operation.refreshPrompt(true);
}

pentaho.pir.view.prototype.getUrlParameters = function() {
  var urlParams = {};
  var e,
    a = /\+/g,  // Regex for replacing addition symbol with a space
    reg = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(a, " ")); },
    query = window.location.search.substring(1);

  while (e = reg.exec(query)) {
    var paramName = decode(e[1]);
    var paramVal = decode(e[2]);

    if (urlParams[paramName] !== undefined) {
      paramVal = (urlParams[paramName] instanceof Array)
        ? urlParams[paramName].concat([paramVal])
        : [urlParams[paramName], paramVal];
    }
    urlParams[paramName] = paramVal;
  }
  return urlParams;
}

pentaho.pir.view.prototype.parameterPreSaveHook = function(filter) {
  // Check if the parameter name is available if it has changed
  if (filter.title !== filter.originalName) {
    var uniqueName = true;
    array.some(model.report.parameters, function(p) {
      if (p.name === filter.title) {
        uniqueName = false;
        return true; // break
      }
    });
    if (!uniqueName) {
      return {
        title: view.getLocaleString("ParameterNameTakenTitle"),
        message: view.getLocaleString("ParameterNameTakenMessage", filter.title)
      }
    }
  }

  // check parameter name
  if (filter.title.match(/[-'`~!@#$%^&*()_+=?;:'",.<>\|\{\}\[\]\\\/]/)) {
    return {
      title: view.getLocaleString("InvalidParameterNameTitle"),
      message: view.getLocaleString("InvalidParameterNameMessage")
    }
  }

  if (filter.type == 'dateInputComponent') {
    var formatter = controller.getDateFormatter(filter.dateFormat);
    if (!formatter) {
      return {
        title: view.getLocaleString("DateFormatError"),
        message: view.getLocaleString("DateFormatInvalid", filter.dateFormat)
      };
    }
    if (filter.defaultValue != null && filter.defaultValue[0] != null) {
      var s;
      try {
        s = formatter.format(new Date(filter.defaultValue[0]));
      } catch (e) {
        s = formatter.parse(filter.defaultValue[0]);
      } finally {
        if (!s) {
          return {
            title: view.getLocaleString("DateFormatError"),
            message: view.getLocaleString("DateStringInvalid", filter.defaultValue[0])
          };
        }
      }
    }
  }
  return undefined; // we're good
}

pentaho.pir.view.prototype.editParameter = function(parameterName) {
  // TODO Convert parameter to filter obj
  var param = controller.findParameterByName(parameterName);
  var paramAsFilter = controller.createGwtFilterFromParam(param);
  var column = controller.datasource.getColumnById(param.columnId);
  var config = controller.createFilterDialogConfig(column);
  paramAsFilter.originalName = parameterName;
  pentaho.filterdialog.editFilter(paramAsFilter, this.parameterPreSaveHook, function(filter) {

    // PIR-597
    var originalName = parameterName;
    var newName = filter.title;
    var updateFilterParameter = function(){
      controller.replaceParameter(parameterName, filter); // default behavior

      // find filter with matching parameter name and replace with new parameter name
      array.some(model.report.filters, function(f, idx){
        if(originalName === f.parameterName){
          f.parameterName = newName; // PIR-734 & PIR-731 - set parameter name instead of deleting the filter
          return true; // break
        }
      });
    };

    if(originalName !== newName){
      view.showMessageBox(
        view.getLocaleString('ChangePromptNameUpdateFilterParameterNameMessage', filter.name),
        view.getLocaleString('ChangePromptNameUpdateFilterParameterNameTitle'),
        view.getLocaleString('Yes_txt'),
        updateFilterParameter,
        view.getLocaleString('No_txt'));
    }
    else{
      controller.replaceParameter(parameterName, filter);
    }

  }, undefined, config);
}

pentaho.pir.view.prototype.removeParameter = function(parameterName) {
  controller.removeParameter(parameterName);
  view.refreshParameterPanel(true);
}

});
