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


define(['amd!cdf/lib/jquery.ui', 'dashboards/pentaho-dashboard-controller', "dashboards/oss-module", "dashboards/dashboard-module"], function($, dashboardController){
  var dashboard = dashboardController.cdfDashboard;

  showEditToolsOnLoad = false;

  var isRunningIFrameInSameOrigin = null;
  try {
    var ignoredCheckCanReachOutToParent = window.parent.mantle_initialized;
    isRunningIFrameInSameOrigin = true;
  } catch (ignoredSameOriginPolicyViolation) {
    // IFrame is running embedded in a web page in another domain
    isRunningIFrameInSameOrigin = false;
  } 

  SolutionBrowserHelper = {};
  SolutionBrowserHelper.extensionRegExp = /\.([^\.]+)$/;
  SolutionBrowserHelper.showBrowser = function(path){
    var parent = window.parent;
    if ( !isRunningIFrameInSameOrigin 
        || !parent 
        || !parent.mantle_initialized ) {
      alert(pho_messages.getMessage("DashboardWizard.FILE_CHOOSER_STANDALONE_ERROR", "Cannot open file chooser outside of Pentaho User Console"));
      return;
    }
    if (!parent.mantle_repository_loaded) {
      alert(pho_messages.getMessage("DashboardWizard.FILE_CHOOSER_SOLUTION_NOT_LOADED", "Pentaho User Console has not finished loading the Solution Browser!"))
      return;
    }
    var func, args = [
      new function() {
        this.fileSelected = SolutionBrowserHelper.createComponentForFile;
      }
    ];
    if (path) {
      func = parent.openFileDialogWithPath;
      args.push(path);
    }
    else {
      func = parent.openFileDialog;
    }
    var selectMessage = pho_messages.getMessage("select_message");
    args.push(selectMessage, selectMessage, PentahoDashboardController.getComponentFileTypes().join(","));
    func.apply(parent, args);
  };

  SolutionBrowserHelper.showBrowserWithPath = function(path) {
    SolutionBrowserHelper.showBrowser(path);
  };

  SolutionBrowserHelper.createComponentForFile = function(repositoryFile, filePath, fileName, title) {
    var component;
    if (SolutionBrowserHelper.extensionRegExp.test(fileName)){
      var extension = RegExp.$1;
      component = PentahoDashboardController.getComponentByFileType(extension);
    }
    if(component){
      component.newInstance(filePath, title);
    }
    else {
      alert(pho_messages.getMessage("DashboardWizard.UNKNOWN_FILE_TYPE", 'Unknown file type'));
    }
  }

  pentahoDashboardEditRevert = function() {
    populateDashboardSettings();
  }

//on edit dashboard title textbox
  pentahoDashboardEditApply = function(textbox) {
    pentahoDashboardController.setDashboardHeading(textbox.value);
    pentahoDashboardController.updateDashboardHeading();
  }

//on edit dashboard refresh textbox
  pentahoDashboardRefreshEditApply = function(textbox){
    pentahoDashboardController.setGlobalRefresh(textbox.value);
  }

//allow only numeric values in textbox
//to be used with onKeyPress, keyUp and keyDown won't give the same codes in firefox
  isNumericKeyPress = function(event){
    var charCode = (navigator.product == "Gecko") ? event.which /*firefox, chrome, etc. */ : event.keyCode /*IE */ ;
    return (
        charCode > 31 &&                    //backspace etc
            (charCode < 48 || charCode > 57)    //['0'..'9']
        ) ? false : true; //check for false, so keys that don't return a code will work
  }

//click widget printing checkbox
  pentahoDashboardWidgetPrintingEditApply = function(checkbox) {
    pentahoDashboardController.setEnableWidgetPrinting(checkbox.checked);
    if (checkbox.checked && !printVisible) {
      window.gwtAlert(
        pho_messages.getMessage(
          "printing_disabled",
          "Dashboard printing is currently disabled. If you are an administrator please refer to the Business Analytics Administrator's Guide for instructions on how to enable dashboard printing."
        ), {
          onOk: function(){}
        },
        {title: pho_messages.getMessage("dashboard_disabled.title", "Dashboard Printing is Disabled")}
      );
    }
  }


  WaqrProxy = function() {
    this.wiz = new Wiz();
    this.repositoryBrowserController = new RepositoryBrowserControllerProxy();
  }

  Wiz = function() {
    currPgNum = 0;
  }

function savePg0() {
}

window.handle_puc_save = function(path, myFilename, overwrite, errorCallback) {
	this.gCtrlr.repositoryBrowserController.remoteSave(path, myFilename, overwrite, errorCallback);

    // Remove xdash extension if present
    var index = myFilename.search(/\.xdash/);
    if (index != -1)
      myFilename = myFilename.substring(0, index);

    // Extract just the path in case the user selected an item in the file dialog
    index = path.search(/\/[^\/]*\.xdash/);
    if (index != -1)
      path = path.substring(0, index);

    path = path + "/" +  myFilename + ".xdash"; // This is where we will save the report

    // if possible refresh the solution browser panel
    if (isRunningIFrameInSameOrigin && typeof window.parent.mantle_refreshRepository !== "undefined") {
      window.parent.mantle_refreshRepository();
    }
    return encodeURIComponent(path);
}

window.lastSaveDashboardXml = '';

window.hasUnsavedChanges = function() {
  return this.gCtrlr.repositoryBrowserController.hasUnsavedChanges();
}

function RepositoryBrowserControllerProxy() {

    this.getPossibleFileExtensions = function() {
      return ['.xdash'];
    };
    
    this.hasUnsavedChanges = function() {
    	return (lastSaveDashboardXml != pentahoDashboardController.getDashboardXml());
    }

    this.remoteSave = function (myPath, myFilename, oerwrite, errorCallback ) {
      if(window.currentWidget) {
    	  window.pho.dashboards.jsni_propPanelApply();
      }
      myFilename = myFilename.replace(/\.xdash$/, "");
      try {
        // traverse the current components,
        // and add or set the xdash and component parameters for server side sql filters
        var fullpath = XActionHelper.genXaction(null, myPath, myFilename),
            idx, numWidgets = dashboardWidgets.length, foundXdash, foundComponent,
            i, params, param, numParams
            ;
        for (idx=0; idx < numWidgets; idx++) {
          widget = dashboardWidgets[idx];
          if ((typeof(widget.url) === "undefined") || !pho.dashboards.jsni_isPovWidget(widget.type)) continue;
          // reformat of parameters for easier parsing
          foundXdash = false;
          foundComponent = false;
          params = widget.parameters;
          numParams = params.length;
          for (i=0; i < numParams; i++) {
            param = params[i];
            switch (param[0]) {
              case "xdash":
                param[2] = fullpath + ".xdash";
                foundXdash = true;
                break;
              case "component":
                param[2] = widget.name;
                foundComponent = true;
                break;
            }
          }
          if (!foundXdash) params.push(["xdash", "", fullpath + ".xdash"]);
          if (!foundComponent) params.push(["component", "", widget.name]);
        }
      } catch (e) {
        alert(e);
      }

      // ====================================================================
      // PDB-456 All of this is to remove any inactive widgets before saving
      // From the template, count the number of widgets this template can possibly hold...
      var numSupportedWidgets = 0, holdMyWidgets = [], widgetCount = 0;
      while (pentahoDashboardController.findXulItemById("Panel_" + (++numSupportedWidgets), xulDomJson['window']['items'] ));
      numSupportedWidgets--;
      dashboardWidgets.sort( function ( widget1, widget2 ) {
        if ( widget1.htmlObject > widget2.htmlObject ) {
          return 1;
        } else {
          return -1;
        }
      });
      // Now, taking care not to remove filters, remove any extra widgets beyond the supported boundary.
      for (idx = 0; idx < numWidgets; idx++) {
        widget = dashboardWidgets[idx];
        if (typeof(widget.type) === "undefined") continue;
        if (pho.dashboards.jsni_isPovWidget(widget.type) || (++widgetCount <= numSupportedWidgets)) holdMyWidgets.push(widget);
      }
      // Don't know if this is pulling the rug out from under the controller :(
      dashboardWidgets = holdMyWidgets;
      // =======================================================================

      pentahoDashboardController.getDashboard().setTitle( myFilename );
      var xml = pentahoDashboardController.getDashboardXml();
      window.lastSaveDashboardXml = xml;
      var xmlInput = document.getElementById("dashboardXml");
      var form = document.getElementById("submitform");

      if (xmlInput && form) {
        refreshRequired = true;
        pho.dashboards.enableWaitCursor(true);
        window.refreshUrl = form.action;
        
        // duplicating the form post values on the "GET" string, allows users to open the Dashboard in a separate tab within PUC.
        //form.action = "?solution="+encodeURIComponent(mySolution)+"&path="+encodeURIComponent(myPath)+"&action_name="+encodeURIComponent(myFilename+".xdash");
        $.ajax({
          type: "post",
          url: "?path="+encodeURIComponent(myPath)+"&action_name="+encodeURIComponent(myFilename+".xdash"),
          data: {
            // don't need to encode POST params
            "action_name": myFilename + ".xdash",
            "path" : myPath,
            "dashboardXml" : xml,
            "command": "save"
          },
          error: function(e){
            if(e.responseText != "Success"){
              var message = e.responseText;
              var idx = message.indexOf("with id");
              if(!isRunningIFrameInSameOrigin) {
                alert("Error:" + message.substr(0,idx));
              } else {
                window.parent.mantle_showMessage("Error", message.substr(0,idx));
              }
            }
          },
          complete: function(e){
            if(e.responseText != "Success"){
              var message = e.responseText;
              var idx = message.indexOf("with id");
              if(idx == -1) {
                    if(!isRunningIFrameInSameOrigin) {
                            alert("Error: " + message);
                        } else {
                    window.parent.mantle_showMessage("Error", message);
                        }
              } else {
                errorCallback();
              }
            }
          }
        });
      }
      else {
        alert( pho_messages.getMessage("DashboardWizard.ERROR_SAVING_MISSING_FORM", "Cannot save due missing form."));
      }
    };
  }   

  window.gCtrlr = new WaqrProxy();

  showEditToolsStartUp = function() {
    showEditToolsOnLoad = true;
  }

  showEditTools = function() {
    showEditToolsOnLoad = true;
  }

  getPanelForCoordinates = function(x, y) {
    var prefix = "Panel_", panel, id = 1, rect;
    while (panel = document.getElementById(prefix + id++)) {
      rect = getRectangle(panel);
      if(x > rect.x && x < rect.x+rect.width && y > rect.y && y < rect.y + rect.height) return panel;
    }
    return null;
  }

  setDirty = function(isDirty) {
    if(currentWidget && currentWidget.setDirty) {
      currentWidget.setDirty(isDirty);
    }
  }

  PentahoDashboardEditor = function() {
    this.editorPanel = null;
    this.editorPanelHeight = $('#edit-panel').height();
    this.widgetTitleDoubleClickFunctionBackup = null;
    this.dashboardKeyUpFunctionBackup = null;
    this.dashboardMouseUpFunctionBackup = null;
    this.dashboardMouseMoveFunctionBackup = null;
    this.xulTree = null;
    this.templates = null;
    this.themes = null;

    this.confirmFunctionHelper = function(operationFunt){
      pentahoDashboardController.cancelContentDropDown();
      if (currentWidget.type != "PentahoEmptyWidget") {
        window.gwtConfirm(pho_messages.getMessage("discard_content","Discard current content?"), new function(){
          this.onOk = function(){
            operationFunt();
          }
        }, {title: pho_messages.getMessage("warning.title", "Warning")});
      } else {
        operationFunt();
      }
    }

    this.editSelectedWidget = function() {
      var editButton = document.getElementById("edit-btn-Panel_" + (pentahoDashboardController.getSelectedWidget()));
      if (editButton.className == "edit-btn-disabled") {
        return;
      }
      switch (currentWidget.type) {
        case "xaction":
        case "PentahoPrptComponent":
          SolutionBrowserHelper.showBrowserWithPath(currentWidget.xactionPath || "");
          break;
        default:
          var widgetType = PentahoDashboardController.getWidgetType(currentWidget.type);
          if (widgetType != null) {
            widgetType.editWidget.bind(currentWidget).call();
          }
          break;
      }
    }

    this.createWidget = function(widgetType) {
      this.confirmFunctionHelper(
          function(){
            PentahoDashboardController.getWidgetType(widgetType).createWidget()
          }
      );
    }

    this.createFile = function(id) {
      this.confirmFunctionHelper(
          function(){
            SolutionBrowserHelper.showBrowser();
          }
      );
    }

    this.resize = function() {
      if (this.isEditPanelVisible()) this.showEditorPanel();
    }

    this.displayWidgetContents = function(display) {
      var widgets = dashboard.components,
          w, i, n = widgets.length
          ;
      if (typeof(display) !== "string") display = display ? "" : "none";
      for (i = 0; i < n; i++) if (w = document.getElementById(widgets[i].htmlObject)) w.style.display = display;
    }

    this.setWidgetParameters = function( id, params ) {
      var widget = pentahoDashboardController.getWidgetFromId( id );
      for(var param in params ) {
        widget.setParameter( 'dashboard_editor', param, params[ param ] );
      }
      widget.update();
    }

    this.cloneWidgetSettings = function( fromWidget, toWidget ) {

      toWidget.id = fromWidget.id;
      toWidget.title = fromWidget.title;
      toWidget.boxId = fromWidget.boxId;
      toWidget.containerId = fromWidget.containerId;
      toWidget.titleId = fromWidget.titleId;
      toWidget.controllerId = fromWidget.controllerId;
      var from = fromWidget.settings;
      var to = toWidget.settings;
      for( name in from ) {
        to[ name ] = from[ name ];
      }
    }

    this.cueAreaDoubleClick = function() {
    }

    this.isEditPanelVisible = function() {
      var editorPanel = this.editorPanel;
      return editorPanel ? editorPanel.style.display !== "none" : false;
    }

    this.toggleEditorPanel = function(enabled) {
      if (enabled){
        this.showEditorPanel();
        this.resizeEditorPanel();
      }
      else {
        this.hideEditorPanel();
      }
      pentahoDashboardController.resizeDashboard(true);
    }

    this.getElementsByClassName = function(className){
        return document.getElementsByClassName ? document.getElementsByClassName( className ) : document.querySelectorAll( '.' + className);
    }

    this.localizeByClass = function(className, fieldToLocalize){
       var localisedValue = pho_messages.getMessage(className);
       var foundElements = this.getElementsByClassName(className);
       for(var i = 0, length = foundElements.length; i < length; i++){
           foundElements[i].setAttribute(fieldToLocalize, localisedValue);
       }
    }
    
    this.applyLabels = function() {
      document.getElementById("objects_lbl").innerHTML = pho_messages.getMessage("objects_lbl", "Objects");
      document.getElementById("span-tab-layout").innerHTML = pho_messages.getMessage("templates_lbl", "Templates");
      document.getElementById("span-tab-theme").innerHTML = pho_messages.getMessage("themes_lbl", "Themes");
      document.getElementById("span-tab-dashboard-settings").innerHTML = pho_messages.getMessage("properties_lbl", "Properties");
      document.getElementById("page_title_lbl").innerHTML = pho_messages.getMessage("page_title_lbl", "Page Title") + ":";
      document.getElementById("refresh_interval_lbl").innerHTML = pho_messages.getMessage("refresh_interval_lbl", "Refresh Interval (sec)") + ":";
      document.getElementById("resize_panels_lbl").innerHTML = pho_messages.getMessage("resize_panels_lbl", "Resize Panels");
      document.getElementById("panel-title-FilterPanel").innerHTML = pho_messages.getMessage("prompt_filter_panel_lbl", "Prompts");
      this.localizeByClass("insert-btn", "title");
      this.localizeByClass("edit-btn", "title");
      return;
    }

    this.resizeEditorPanel = function(force) {
      if (!this.editorPanel) return;
      var width = pentahoDashboardController.windowWidth;
      var height = pentahoDashboardController.windowHeight;
      if( width == 0 ) {
        return;
      }
      if( this.editorPanelLastWidth == width && this.editorPanelLastHeight == height && !force ) {
        return;
      }

      if( width >= 0 ) {
        this.editorPanel.style.width = ''+(width-8)+'px';
      }

      this.editorPanelLastWidth = width;
      this.editorPanelLastHeight = height;

      document.getElementById("objectTree").style.width = (width * .15 - 14)+"px";
      document.getElementById("editWrapper").style.width = (width * .84)+"px";

    }

    this.showEditorPanel = function() {

      if (!this.editorPanel) {
        if (!(this.editorPanel = document.getElementById("edit-panel"))) return;
      }
      var parent = window.parent;
      if (mantle_enabled && parent && parent.enableContentEdit) parent.setContentEditSelected(true);

      this.resizeEditorPanel();
      pentahoDashboardController.adjustForWidgetAreaScroll = true;
      this.editorPanel.style.display = "";
      // resize the widget area so the user can scroll to see all the content
      var widgetArea;
      if (widgetArea = document.getElementById("widget-area")) {
        var style = widgetArea.style,
          //leave some space between the edit panel and widget area
            h = parseInt(style.height, 10) - 15, // used to not hide the bottom of the widgets
            w = parseInt(style.width, 10),
            winH = pentahoDashboardController.windowHeight;
        if (h > (winH - 100) && (style.height && (h - this.editorPanelHeight) >= 0 )) {
          //widgetArea.style.overflow = 'auto';
          style.height = (h - this.editorPanelHeight) + "px";
        }
        style.overflow = "auto";  // only shows the scrollbars if needed
      }

      // show the edit panes if they exist
      var i, n = pentahoDashboardController.getWidgetCount();
      for (i=0; i < n; i++) {
        this.widgetMouseOut(pentahoDashboardController.getWidget(i).id);
      }
      if (!this.xulTree) {
        this.updateXulTree();
        showProperties("Dashboard");
      }

      //re-highlight previously selected Widget
      if (this.previousHighlightedWidget){
        highlightWidgetArea(this.previousHighlightedWidget);
        this.previousHighlightedWidget = null;
      }
      this.initDND();
      var iframedropdown = document.getElementById("content-menu");
      var dddoc = iframedropdown.contentWindow || iframedropdown.contentDocument;
      dddoc.initMenu(PentahoDashboardController.getWidgetTypes(), pho_messages);
      this.applyLabels();
    }

    this.getWidgetRefreshPeriod = function(widget) {
      var refreshPeriod = dashboard.refreshEngine.getRefreshPeriod(widget);
      //the cdf already returns an integer, consider axing the next two lines.
      refreshPeriod = parseInt(refreshPeriod, 10);
      refreshPeriod = isNaN(refreshPeriod) ? 0 : refreshPeriod;
      return String(refreshPeriod);
    }

    this.setWidgetRefreshPeriod = function(widget, refreshPeriod) {
      if (widget){
        dashboard.refreshEngine.registerComponent(widget, refreshPeriod);
        dashboard.refreshEngine.processComponent(widget);//activate refresh
      }
      else alert("setWidgetRefreshPeriod: no widget supplied.");
    }

    this.updateXulTree = function() {
      if( !xulDomJson ) {
        return;
      }
      var title, html = "<table cellspacing=\"0\" cellpadding=\"0\" style=\"padding-top:10px\">\n";
      title = pho_messages.getMessage("DashboardWizard.GENERAL_SETTINGS", "General Settings");
      // add an entry for the dashboard
      html += "<tr>" +
          "<td width=\"5\">" +
          "<td width=\"20\">" +
          "<div class='icon-object-dashboard'></div>" +
          "</td>" +
          "<td colspan=\"2\" id=\"dashboarditem\"" +
          " onmouseover=\"objectListMouseOver(this.id,'')\"" +
          " onmouseout=\"objectListMouseOut(this.id,'')\"" +
          " onclick=\"selectObjectList(this.id); showProperties('Dashboard');\"" +
          " class=\"objectlist\"" +
          ">" +
          "<a class=\"objectlist-span\">" + title + "</a>" +
          "</td>" +
          "</tr>\n"
      ;
      // add an entry for the POV bar
      title = pho_messages.getMessage("DashboardWizard.PROMPTS", "Prompts");
      html += "<tr>" +
          "<td width=\"5\"></td>" +
          "<td width=\"10\"></td>" +
          "<td width=\"20\">" +
          "<div class='icon-object-filters'></div>" +
          "</td>" +
          "<td id=\"povpanelitem\"" +
          " onmouseover=\"objectListMouseOver(this.id,'FilterPanel')\"" +
          " onmouseout=\"objectListMouseOut(this.id,'FilterPanel')\"" +
          " onclick=\"selectObjectList(this.id); showProperties('FilterPanel');\"" +
          " class=\"objectlist\"" +
          ">" +
          "<a class=\"objectlist-span\">" + title + "</a>" +
          "</td>" +
          "</tr>\n"
      ;
      // now add entries for the widgets
      var i = 0, widget, id;
      while (true) {
        id = "Panel_" + (++i);
        containerId = "content-area-" + id;
        widget = pentahoDashboardController.findXulItemById(id);
        if (!widget) break;
        title = widget.properties.title;
        html += "<tr>" +
            "<td width=\"5\"></td>" +
            "<td width=\"10\"></td>" +
            "<td width=\"20\">"+
            "<div class='icon-object-widget'></div>" +
            "</td>" +
            "<td id=\"widgetitem" + i + "\"" +
            " onmouseover=\"objectListMouseOver(this.id,'"+containerId+"')\"" +
            " onmouseout=\"objectListMouseOut(this.id,'"+containerId+"')\"" +
            " onclick=\"selectObjectList(this.id); showProperties('widget" + i + "');\"" +
            " class=\"objectlist\"" +
            ">" +
            "<a title=\""+PentahoDashboardController.xmlEncode(title)+"\" class=\"objectlist-span\">" +
            PentahoDashboardController.xmlEncode(title.substr(0, 20)) +
            (title.length > 10 ? "..." : "") +
            "</a>"+
            "</td>"+
            "</tr>"
        ;
      }
      html += "</table>";
      this.xulTree = html;
      if (this.getElement("editpanel-tabs") && (e = document.getElementById("treebox"))) {
        e.innerHTML = this.xulTree;
        selectObjectList( objectTreeSelectedId || "dashboarditem");
      }
    }

    this.initDND = function(){
      $(".widgetContainer").draggable({ opacity: 0.7, helper: 'clone' });
      $(".widgetContainer").droppable({ opacity: 0.7, helper: 'clone' });
      if (this.draggables) {
        this.draggables.draggable( "destroy" );
        this.draggables.droppable( "destroy" );
      }

      if (pentahoDashboardEditor.isEditPanelVisible() == false) return;

      this.draggables = $(".widgetContainer");
      $(".wgtHead").addClass("dragHint");
      this.draggables.draggable({
        cursor: 'move',
        start: function(event){
          if (pentahoDashboardEditor.isEditPanelVisible() === false) return;
          dragging = this;
          pentahoDashboardEditor.showDragOverlay(true);
        },
        drag: function(event){
        },
        cursorAt: {
          top: -5,
          left: -5
        },
        helper: function(event) {
          dragHandle = $('<div class="reorderIcon" style="z-index:1000"><img src="../dashboards/resources/images/spacer.gif" height="32" width="32"/></div>');
          return dragHandle;
        },
        stop: function(event){
          pentahoDashboardEditor.showDragOverlay(false);
          var x = event.originalEvent.clientX;
          var y = event.originalEvent.clientY;
          var panel = getPanelForCoordinates(x, y);
          if (panel) pentahoDashboardEditor.swapWidgets(dragging.id, panel.id);
        }
      });

      this.draggables.droppable({
        drop: function(event, ui) {
          // IE Drop actions were not always firing. Computing drops in the draggable "stop" instead
          //pentahoDashboardController.swapWidgets(dragging.id, this.id);
        },
        accept: ".widgetContainer",
        over: function(event, ui){
          dragHandle.addClass("reorderIconSwap");
          highlightWidgetArea(this.id);
        },
        out: function(event, ui){
          activeSwapTarget = this;
          dragHandle.removeClass("reorderIconSwap");
        }
      });
    };

    this.showDragOverlay = function(show){
      document.getElementById("dialog-glass").style.display = show ? "" : "none";
    }

    this.swapWidgets = function(source, target){
      var sourceId = source.substr("Panel_".length),
          targetId = target.substr("Panel_".length)
          ;
      if (sourceId === targetId) return;

      var sourceWidget = null, sourceRegExp, sourceTitle,
          targetWidget = null, targetRegExp, targetTitle,
          i, n, widget
          ;

      for (i=0, n = dashboardWidgets.length; i < n; i++) {
        widget = dashboardWidgets[i];
        if (widget.htmlObject === "content-area-Panel_" + targetId){
          targetWidget = widget;
        } else
        if (widget.htmlObject === "content-area-Panel_" + sourceId){
          sourceWidget = widget;
        }
        if (sourceWidget && targetWidget) break;
      }
      if (!sourceWidget) return;

      //re-init the source component and its widget title
      sourceWidget.htmlObject = "content-area-Panel_" + targetId;
      sourceWidget.name = "widget" + targetId;
      sourceRegExp = new RegExp("^\$widget" + sourceId + "$", "");
      sourceTitle = pentahoDashboardController.getXulDomProperty(source, "title");
      var untitled = window.dashboard_messages.getMessage("DashboardRenderer.UNTITLED_STR");
      var renameTitle = function(sourceTitle, sourceId, targetId) {
        if (sourceTitle != undefined && sourceTitle == untitled.replace('{0}', sourceId)) {
          return untitled.replace('{0}', targetId);
        } else {
          return sourceTitle;
        }
      };
      sourceTitle = renameTitle(sourceTitle, sourceId, targetId);
      //re-init the target component and its widget title
      if (targetWidget) {
        targetWidget.htmlObject = "content-area-Panel_" + sourceId;
        targetWidget.name = "widget" + sourceId;
        targetRegExp = new RegExp("^\$widget" + targetId + "$", "");
        targetTitle = pentahoDashboardController.getXulDomProperty(target, "title");
        targetTitle = renameTitle(targetTitle, targetId, sourceId);
      }
      else {
        targetTitle = untitled.replace('{0}', sourceId);
        document.getElementById("content-area-Panel_" + sourceId).innerHTML = "";
      }

      pentahoDashboardController.setXulDomProperty(target, "title", sourceTitle);
      $("#panel-title-" + target).text(sourceTitle);
      pentahoDashboardController.setXulDomProperty(source, "title", targetTitle);
      $("#panel-title-" + source).text(targetTitle);

      pentahoDashboardEditor.updateXulTree();

      selectObjectList("widgetitem" + targetId); // calls setSelectedWidget
      showProperties('widget' + targetId);

      // fix listeners, parameters, outputParameters
      var components = dashboard.components, comp,
          listeners, listener,
          oParams, oParam,
          iParams, iParam
          ;
      for(comp in components){
        comp = components[comp];
        if (listeners = comp.listeners) {
          for (i=0, n = listeners.length; i < n; i++){
            listener = comp.listeners[i];
            listener = listener.replace(sourceRegExp, sourceWidget.name);
            if (targetWidget) listener = listener.replace(targetRegExp, targetWidget.name);
            comp.listeners[i] = listener;
          }
        }

        if (oParams = comp.outputParameters) {
          for (i=0, n = oParams.length; i < n; i++){
            oParam = oParams[i];
            if (oParam.length <= 1 || !(oParam = oParam[2])) continue;

            oParam = oParam.replace(sourceRegExp, sourceWidget.name);
            if (targetWidget) oParam = oParam.replace(targetRegExp, targetWidget.name);
            oParams[i][2] = oParam;
          }
        }
        if (iParams = comp.parameters) {
          for (i=0, n = iParams.length; i < n; i++) {
            iParam = iParams[i];
            if (!iParam.length || !(iParam = iParam[1])) continue;

            iParam = iParam.replace(sourceRegExp, sourceWidget.name);
            if (targetWidget) iParam = iParam.replace(targetRegExp, targetWidget.name);

            iParams[i][1] = iParam;
          }
        }
      }
      sourceWidget.update();
      if (targetWidget) targetWidget.update();
    }

    this.hideEditorPanel = function() {

      if (!this.editorPanel) return; // there is no panel for us to hide
      if (mantle_enabled && window.parent && window.parent.enableContentEdit) window.parent.setContentEditSelected(false);

      pentahoDashboardController.adjustForWidgetAreaScroll = false;
      var widgetArea = document.getElementById('widget-area');
      if (widgetArea){
        var style = widgetArea.style;
        if (style.height ) {
          var h = parseInt( style.height );
        //      widgetArea.style.overflow = 'hidden';
          if( (h+this.editorPanelHeight) > 0 ) {
            style.height = '' + (h + this.editorPanelHeight) + 'px';
          }
        }
        style.overflow = "hidden";
      } 
      this.editorPanel.style.display = 'none';

      var i, n = pentahoDashboardController.getWidgetCount(), widget, id;
      for(i = 0; i < n; i++ ) {
        widget = pentahoDashboardController.getWidget(i);
        if (widget.type !== "PentahoChartComponent") continue;
        widget.update();
      }
      //If there's a selection highlighted, save reference to it and hide the selection
      this.previousHighlightedWidget = window.highlightedWidget;
      highlightWidgetArea(null);
      if (this.draggables) {
        this.draggables.draggable("destroy");
        this.draggables.droppable("destroy");
      }
      $(".wgtHead").removeClass("dragHint");
    }

    this.errorLoadingCount = 0;

    this.pageLoaded = function() {
      // This can be called before the dashboard has been fully processed. In that case, retry after 100ms for
      // up to 7 seconds.
      if(pentahoDashboardController.getDashboard() == null){
        this.errorLoadingCount++;
        if(this.errorLoadingCount > 70){ // 7 seconds
          window.alert(pho_messages.getMessage("DashboardWizard.ERROR_LOADING_EDITOR", 'Error loading dashboard editor. Dashboard definition not found.'));
        } else {
          setTimeout("pentahoDashboardEditor.pageLoaded()", 100);
        }
        return;
      }
      // enable PUC save buttons
      if( mantle_enabled && window.parent && window.parent.enableSave ) {
        window.parent.enableSave( true );
      }

      if (printVisible !== true) {
        var prefix = "dashboard-showwidgetprint-";
        document.getElementById(prefix + "label").style.display = "none";
        document.getElementById(prefix + "edit").style.display = "none";
      }

      this.setupTemplates();
      this.setupThemes();

      // only register the URL widget if allowed
      if (typeof(editperms) != 'undefined' && editperms.urlwidget) {
        PentahoDashboardController.registerWidgetType(new PentahoUrlComponent());
      }
    }

    this.setupTemplates = function() {
      this.templates = new Templates();
      var items = templatesJson.Templates.items,
          item, i, n = items.length, template,
          table = document.getElementById("templates-table"),
          columns = 99, tr, td, templateHTML,
          selectedTemplate = pentahoDashboardController.getDashboard().getTemplateRef()
          ;
      if(!table) return; // Editing may not be enabled.
      for (i = 0; i < n; i++) {
        item = items[i].Template.properties;
        templateHTML = templateFragment;
        template = new Template();
        templateHTML = templateHTML.replace(/\{id\}/g, i);
        template.setName(item.name);
        templateHTML = templateHTML.replace(/\{name\}/g, item.name);
        template.setThumbnail(item.thumbnail);
        templateHTML = templateHTML.replace(/\{thumbnail\}/g, item.thumbnail);
        template.setPath(item.path);
        if (selectedTemplate === item.path) this.selectedTemplate = i;
        this.templates.addTemplate(template);
        if (i % columns === 0) tr = table.insertRow(table.rows.length);
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = templateHTML;
      }
      this.selectTemplate(this.selectedTemplate);
    }

    this.setupThemes = function() {
      this.themes = new Themes();
      var items = themesJson.Themes.items,
          item, i, n = items.length, theme,
          table = document.getElementById("themes-table"),
          columns = 99, tr, td, themeHTML,
          selectedTheme = pentahoDashboardController.getDashboard().getThemeRef()
          ;
      if(!table) return; // Editing may not be enabled.
      for (i = 0; i < n; i++) {
        item = items[i].Theme.properties;
        themeHTML = themeFragment;
        theme = new Theme();
        themeHTML = themeHTML.replace(/\{id\}/g, i);
        theme.setName(item.name);
        themeHTML = themeHTML.replace(/\{name\}/g, item.name);
        theme.setThumbnail(item.thumbnail);
        themeHTML = themeHTML.replace(/\{thumbnail\}/g, item.thumbnail);
        theme.setPath(item.path);
        if (selectedTheme === item.path) this.selectedTheme = i;
        this.themes.addTheme(theme);
        if (i % columns === 0) tr = table.insertRow(table.rows.length);
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = themeHTML;
      }
      this.selectTheme(this.selectedTheme);
    }

    this.startupInEditMode = function( needPanel ) {
      if( needPanel && !this.isEditPanelVisible() ) {
        this.showEditorPanel();
        if(mantle_enabled && window.parent && window.parent.enableContentEdit){
          window.parent.enableContentEdit(true);
        }
        pentahoDashboardController.setEditEnabled(true);
        pentahoDashboardController.resizeDashboard( true );
      }
    }

    this.widgetTitleDoubleClick = function( id ) {
      var widget = pentahoDashboardController.getWidgetFromId( id );
      if( !widget ) {
        return;
      }
      var newTitle = prompt( "New title", widget.title );
      if( newTitle ) {
        widget.title = newTitle;
        pentahoDashboardController.updateWidgetTitle( widget );
      }
    }

    this.widgetMouseOver = function( id ) {
    }

    this.widgetMouseOut = function( id ) {
    }

    this.widgetMouseClick = function( id ) {
    }

    this.widgetMouseDoubleClick = function( id ) {
    }

    this.elementCache = {};

    this.getElement = function( id, force ) {
      var result;
      if (!force) {
        result = this.elementCache[id];
        if (result) return result;
      }
      result = pentahoGet(
          "editor",
          "command=xulconvert" +
              "&xul=" + dashboardSettings.theme + "/" + id,
          null,
          "text/html"
      );
      this.elementCache[id] = result;
      return result;
    }

    this.getStyleElement = function( path, force ) {
      var result;
      if (!force) {
        result = this.elementCache[path];
        if (result) return result;
      }
      result = pentahoGet("service/" + path, "", null, "text/html");
      this.elementCache[path] = result;
      return result;
    }

    this.changePickThemeState = function( id, idx, state ) {
      if( state == 'hover' ) {
        document.getElementById( id ).className = 'pickBoxHover';
      } else {
        if( idx != this.selectedTheme ) {
          document.getElementById( id ).className = 'pickBox';
        } else {
          document.getElementById( id ).className = 'pickBoxSelected';
        }
      }
    }

    this.changePickTemplateState = function( id, idx, state ) {
      if( state == 'hover' ) {
        document.getElementById( id ).className = 'pickBoxHover';
      } else {
        if( idx != this.selectedTemplate ) {
          document.getElementById( id ).className = 'pickBox';
        } else {
          document.getElementById( id ).className = 'pickBoxSelected';
        }
      }
    }

    this.selectedTheme = -1;
    this.selectTheme = function( id ) {
      this.highlightTheme(id);
      if( this.selectedTheme == id ) {
        return;
      }
      this.selectedTheme = id;
      this.themeChange();
    }

    this.highlightTheme = function( id ) {
      var idx;
      var count = this.themes.getThemeCount();
      for( idx=0; idx<count; idx++ ) {
        var e = document.getElementById( 'theme'+idx+'-table' );
        if( idx == id ) {
          if( e ) {
            e.className = 'pickBoxSelected';
          }
        } else {
          if( e ) {
            e.className = 'pickBox';
          }
        }
      }
    }

    this.selectedTemplate = -1;
    this.selectTemplate = function( id ) {
      this.highlightTemplate(id);
      if( this.selectedTemplate == id ) {
        return;
      }
      this.selectedTemplate = id;
      this.templateChange();
    }

    this.highlightTemplate = function( id ) {
      var idx;
      var count = this.templates.getTemplateCount();
      for( idx=0; idx<count; idx++ ) {
        var e = document.getElementById( 'template'+idx+'-table' );
        if( idx == id ) {
          if( e ) {
            e.className = 'pickBoxSelected';
          }
        } else {
          if( e ) {
            e.className = 'pickBox';
          }
        }
      }
    }

    this.templateChange = function() {
      this.resetOverlays();
      var name = this.templates.getTemplate( this.selectedTemplate ).getName();
      var path = this.templates.getTemplate( this.selectedTemplate ).getPath();

      pentahoDashboardController.getDashboard().setTemplateRef( path );

      //Kill off all content with an IFrame (Mozilla dies when plucking out DOM elements with PDF plug-ins in them)

      var e = document.getElementById( 'widget-area' );
      this.killIFrameContent(e);

      this.updateContentArea();
      pentahoDashboardController.clearResizeCache();
      pentahoDashboardController.displayWidgetPrintButtons();
    }

    var resetOverlaysAtLevel = function(result, level){

      var levelProp;
      for(var p in level){
        levelProp = p;
        break;
      }
      if(level[levelProp]['properties']['flex']){
        level[levelProp]['properties']['flex'] = 1;
      }
      for(var i=0; i< level[levelProp].items.length; i++){
        var item = level[levelProp].items[i];
        var prop;
        for(var p in item){
          prop = p;
          break;
        }
        result = resetOverlaysAtLevel(result, item);
      }
      return result;
    }

    this.resetOverlays = function(){
      var result = overlayXml;
      for(var i=0; i<xulDomJson['window']['items'].length; i++){
        result = resetOverlaysAtLevel(result, xulDomJson['window']['items'][i]);
      }
      return result;
    }

    this.killIFrameContent = function(ele){
      if(ele.tagName == "IFRAME"){
        ele.contentWindow.location.href="about:blank";
      }
      if(ele.childNodes.length > 0){
        for(var i=0; i<ele.childNodes.length; i++){
          this.killIFrameContent(ele.childNodes[i]);
        }
      }
    }

    this.updateContentArea = function() {

      var html, json, tmlJson,
          xml = pentahoDashboardController.getDashboardXml(),
          command = "templatecontents",
          url = "service",
          query = "command=" + command +
              "&dashboardXml=" + encodeURIComponent(xml) +
              "&type=",
          dashboardContent = document.getElementById("dashboard-content"),
          widgetArea
          ;
      function postTemplateContents(type) {
        var response = pentahoPost(url, query + type, null, "text/html");
        if (response === '<web-service><unauthorized/></web-service>' || response.indexOf('<title>Pentaho User Console - Login</title>') !== -1) {
          // display logout
          // TODO: call into mantle
          alert(pho_messages.getMessage("DashboardWizard.SESSION_TIMEOUT", "Your session has timed out.  Please log back in."));
          response = false;
        }
        return response;
      }

      pentahoDashboardController.beforeTabsUnload();

      if ((html = postTemplateContents("html"))===false) return;
      if ((json = postTemplateContents("json"))===false) return;

      pentahoDashboardController.widgets = new Array();

      var tmpJson;
      try {
        tmpJson = JSON.parse( json.replace( new RegExp( "'", 'g' ), '"' ) );
      } catch(exception) {
        alert(exception);
      }

      if (dashboardContent) dashboardContent.innerHTML = html;
      xulDomJson = tmpJson;
      this.updateXulTree();
      pentahoDashboardController.updateDashboardHeading();
      pentahoDashboardController.resizeDashboard(true);

      widgetArea = document.getElementById("widget-area");
      pentahoDashboardController.updateAllWidgets();
      widgetArea.style.display = "block";
    }

    this.setActiveStyleSheet = function (title) {
      var links = document.getElementsByTagName("link"),
          i, n = links.length, link, linkTitle
          ;
      for (i = 0; i < n; i++) {
        link = links.item(i);
        if ((link.rel.indexOf("style") === -1) ||
            (!((linkTitle = link.title) ||
                (/dashboards\/service\/themes\/\d{2}-.*\/\d{2}-.*\.css/.test(link.href)))
                )
            ) continue;

        link.disabled = true;
        if (linkTitle === title) link.disabled = false;
      }
    }

    this.themeChange = function() {
      // switch the stylesheet over
      var theme = this.themes.getTheme(this.selectedTheme);
      var name = theme.getName();
      var path = theme.getPath();
      this.setActiveStyleSheet(name);
      pentahoDashboardController.getDashboard().setThemeRef(path);
      // now get the script for this style and eval it
      var themeString = this.getStyleElement( 'themes/'+path+'/'+path+'.json', true );
      try {
        jsonTheme = JSON.parse(themeString);
        var dashboardSettings = jsonTheme['dashboardSettings'];
        var elementSettings = jsonTheme['elementSettings'];
        var povPanelSettings = jsonTheme['povPanelSettings']
      } catch (e) {}
      try {
        pentahoDashboardController.setDashboardSettings( dashboardSettings );
      } catch (e) {
        // this is optional so we can ignore the error
      }
      pentahoDashboardController.elementSettings = elementSettings;
      pentahoDashboardController.resizeDashboard(true);
      pentahoDashboardController.updateAllWidgets();
    }

    this.getXulTree = function() {
      var xml = pentahoDashboardController.getDashboardXml();
      var command = "xultree";
      var theme = pentahoDashboardController.getDashboard().getThemeRef();

      var url = "service";
      var query = "command=xultree&width=188&height="+(this.editorPanelHeight-42)+"&theme="+theme+"&dashboardXml="+encodeURIComponent(xml);
      var html = pentahoPost( url, query, null, "text/html" );
      return html;
    }

    this.enterResizeMode = function(show){
      var wrapper = document.getElementById("resize-wrapper").style;
      function setMode() {
        var display = show ? "" : "none";
        wrapper.display = display;
        document.getElementById("resize-exit-control").style.display = display;
        pentahoDashboardController.setOverlayMode(show);
        pentahoDashboardEditor.displayWidgetContents(!show);
        pentahoDashboardEditor.toggleEditorPanel(!show);
      }

      if (show) setMode();

      $('#resize-wrapper').animate(
          {opacity: show ? 1 : 0.0}, 500,
          function() {
            if (show) wrapper.display = "";
            else setMode();
          }
      );
    }

  }

  objectListMouseOver = function(id, containerId) {
  }

  objectListMouseOut = function(id, containerId) {
  }

  objectTreeSelectedId = null;

  selectObjectList = function(id) {
    if (!id) {
      return;
    }
    objectTreeSelectedId = id;
    var e = document.getElementById("dashboarditem");
    e.className = "objectlist";
    e = document.getElementById("povpanelitem");
    e.className = "objectlist";
    var i = 1;
    while (true) {
      if (!(e = document.getElementById("widgetitem"+ i))) break;
      if (e.id !== id) {
        e.className = "objectlist";
      }
      else {
        pentahoDashboardController.setSelectedWidget(i);
      }
      i++;
    }
    e = document.getElementById(id);
    e.className = "objectlist-selected";
  }

  /*  Code for creating resize handles between widget boxes.
   Each ResizeHandle holds reference to the widget boxes it's managing */
  ResizeHandleCache = {};

  ResizeHandle = function(vertical, parent, item1, item2, x, y, width, height, areaLeft, areaTop){

    this.vertical = vertical;
    this.parent = parent;

    this.id1 = this.getItemId(item1);
    this.id2 = this.getItemId(item2);

    this.handle = this.createHandle();
    this.update(x, y, width, height, areaLeft, areaTop);

    var me = this;
    $(this.handle).draggable({
      start: function(event){
        me.startDrag(event);
      },
      stop: function(event){
        me.stopDrag()
      },
      axis: (vertical)?"y":"x",
      drag: function(event, ui){
        me.whileDrag(event, ui);
      }
    });
  };

  ResizeHandle.prototype = {
    getItemId: function(item) {
      var prop;
      for (prop in item) {
        break;
      }
      return item[prop].properties.id;
    },
    createHandle: function() {
      var resizeGlass = document.getElementById("resize-wrapper"),
          handle = document.createElement("DIV")
          ;
      handle.setAttribute("item1", this.id1);
      handle.setAttribute("item2", this.id2);
      handle.className = "resizeHandle " + (this.vertical ? "resizey" : "resizex");
      resizeGlass.appendChild(handle);
      return handle;
    },
    update: function(){
      var rect1 = getRectangle(document.getElementById(this.id1)),
          padding = 3, handleStyle = this.handle.style
          ;
      ResizeHandleCache[this.id1 + "|" + this.id2] = this;
      if (this.vertical) {
        handleStyle.top = (rect1.y + rect1.height - 4) + "px";
        handleStyle.left = (rect1.x + padding) + "px";
        handleStyle.width = (rect1.width - (padding * 2)) + "px";
        handleStyle.height = "7px";
      }
      else {
        handleStyle.top = (rect1.y + padding) + "px";
        handleStyle.left = (rect1.x + rect1.width - 1) + "px";
        handleStyle.height = (rect1.height - (padding * 2) - 3) + "px";
        handleStyle.width = "7px";
      }
    },
    startDrag: function(event) {
      var s1 = document.getElementById(this.id1).style,
          s2 = document.getElementById(this.id2).style
          ;
      if (this.vertical) {
        this.startLoc = event.originalEvent.clientY;
        this.item1StartHeight = parseInt(s1.height);
        this.item2StartTop = parseInt(s2.top);
        this.item2StartHeight = parseInt(s2.height);
      }
      else {
        this.startLoc = event.originalEvent.clientX;
        this.item1StartWidth = parseInt(s1.width);
        this.item2StartLeft = parseInt(s2.left);
        this.item2StartWidth = parseInt(s2.width);
      }
      dragging = this;
      pentahoDashboardEditor.showDragOverlay(true);
    },
    whileDrag: function(event, ui) {
      var s1 = document.getElementById(this.id1).style,
          s2 = document.getElementById(this.id2).style,
          v, delta
          ;
      if(this.vertical){
        v = event.originalEvent.clientY;
        delta = v - this.startLoc;

        // don't let the delta get bigger than the neighbor
        if(delta >= 0) {
          delta = Math.min(delta, this.item2StartHeight);
        } else {
          delta = Math.max(delta, this.item1StartHeight * -1);
        }

        s1.height = (this.item1StartHeight + delta) + "px";
        s2.top = (this.item2StartTop + delta) + "px";
        s2.height = (this.item2StartHeight - delta) + "px";
      }
      else {
        v = event.originalEvent.clientX;
        delta = v - this.startLoc;

        // don't let the delta get bigger than the neighbor
        if(delta >= 0) {
          delta = Math.min(delta, this.item2StartWidth);
        } else {
          delta = Math.max(delta, this.item1StartWidth * -1);
        }
        s1.width = (this.item1StartWidth +delta)+"px";
        s2.left = (this.item2StartLeft +delta)+"px";
        s2.width = (this.item2StartWidth -delta)+"px";
      }
      var i, len = this.parent.items.length;
      for (i = 0; i < len; i++){
        var id = this.getItemId(this.parent.items[i]),
            s = document.getElementById(id).style,
            prop;
          if (this.vertical) {
              v = parseInt(s.height);
          } else {
              v = parseInt(s.width);
          }
          //PDB-1389 Always setting dom property as flex fixes resizing issues.
          if(id === "FilterPanel") {
          	// unless it's the filter panel. the templates all specify 100 height. that always wins over flex, so we set that instead.
          	// if we were to change the templates, then only new dashboards would benefit.
          	prop = this.vertical ? "height" : "width";
          } else {
            prop="flex";
          }
          pentahoDashboardController.setXulDomProperty(id, prop, v);
      }
      pentahoDashboardController.resizeDashboard(true);
    },
    stopDrag: function(){
      pentahoDashboardEditor.showDragOverlay(false);
    }
  };

  selectedTabs = {};
// tabset stuff

  pentahoTabOver = function(id, set) {
  }

  pentahoTabOut = function(id, set) {
  }

  pentahoTabSelect = function(id, set) {
    var e = document.getElementById(id);
    if (e) {
      e.className = e.className + ' pentaho-tabWidget-selected';
    }
  }

  pentahoTabDeselect = function(id, set) {
    var e = document.getElementById(id);
    if (e) {
      e.className = 'pentaho-tabWidget'.replace(' pentaho-tabWidget-selected','');
    }
  }

  pentahoTabClick = function(id, set) {

    if (selectedTabs[set] == id) {
//    //refresh pov container parameters panel
//    if (id == 'tab-povpanel-settings') {
//      pho.dashboards.jsni_refreshPovParameters();
//    }
      return;
    }
    var oldTab = selectedTabs[set];
    if (oldTab) {
      selectedTabs[set] = null;
      var e = document.getElementById(oldTab + '-panel');
      if (e) {
        e.style.display = 'none';
      }
      pentahoTabDeselect(oldTab, set);
    }

    // only blur if the tab exists
    var e = document.getElementById(id);
    if (e) {
      e.blur();
    }
    e = document.getElementById('span-' + id);
    if (e) {
      e.blur();
    }

    selectedTabs[set] = id;
    e = document.getElementById(id + '-panel');
    if (e) {
      e.style.display = 'block';
    }
    if (id == 'tab-povpanel-settings') {
      // call gwt refresh for now
      pho.dashboards.jsni_refreshPovContainerPanel();
    }

    pentahoTabSelect(id, set);

  }

  showPropertiesSlide = function(type) {
    var i, display, types = {
      dashboard: 0,
      widget: 1,
      povpanel: 2
    };
    for (i=0; i<3; i++) {
      display = (types[type] === i) ? "block" : "none";
      document.getElementById("props-deck-" + i).style.display = display;
    }
  }

  showProperties = function(id) {
    if (currentWidget && currentWidget.isDirty) {
      pho.dashboards.jsni_showApplyWarning(id);
      return;
    }

    var widget = pentahoDashboardController.getWidgetFromId(id);
    if (widget) {
      if (widget.type === "xaction") {
        if (widget.title) {
          widget.localizedName = widget.title;
          delete widget.title;
          widget.xactionPath = widget.solution + '/' + widget.path +  '/' + widget.action;
          // used in GWT properties panel
          widget.iconImgSrc = '../../../../../repos/xaction/resources/images/xaction_file_image.png';
        }
      }
    }
    else
    if (id.indexOf("widget") === 0) {
      widget = new PentahoEmptyWidget(id);
    }

    if (widget === currentWidget) return;

    var slideType = "", tab, tabPage;
    if (widget) {
      highlightWidgetArea(id);
      currentWidget = widget;
      slideType = "widget";
      tab = "tab-widget-settings";
      tabPage = "tabbox-widget";
      var details;
      if (widget.type === "xaction") {
        details = XActionHelper.genXaction(widget.solution, widget.path, widget.action);
      }
      PropertiesPanelHelper.initPropertiesPanel(details);
      //rpb: this is already called by initPropertiesPanel, remove it?
      PropertiesPanelHelper.updateContentLinkingPanel(widget.name);
    }
    else {
      currentWidget = null;
      switch (id) {
        case "Dashboard":
          populateDashboardSettings();
          slideType = "dashboard";
          tab = "tab-layout";
          tabPage = "tabbox-dashboard";
          break;
        case "FilterPanel":
          highlightWidgetArea(id);
          slideType = "povpanel";
          tab = "tab-povpanel-settings";
          tabPage = "tabbox-povpanel";
          break;
      }
    }
    if (tab && tabPage) pentahoTabClick(tab, tabPage);
    showPropertiesSlide(slideType);
  }

  populateDashboardSettings = function() {
    var d = pentahoDashboardController.dashboard, e;
    if (e = document.getElementById("dashboard-title-edit")) e.value = d.getHeading();
    if (e = document.getElementById("dashboard-refresh-edit")) e.value = d.getGlobalRefresh();
    if (e = document.getElementById("dashboard-showwidgetprint-edit")) e.checked = d.getEnableWidgetPrinting();
  }

  PropertiesPanelHelper = {};
  PropertiesPanelHelper.addOrReplaceCurrentWidget = function() {
    // Make sure the component has been registered in the proper collections
    var isNew, currentWidgetName = currentWidget.name;
    if (dashboard.getComponent(currentWidgetName) == null) {
      dashboardController.addComponents([currentWidget]);
      dashboardWidgets.push(currentWidget);
      isNew = true;
    } else {
      var i, n, widgets, widget;
      for (i = 0, widgets = dashboardWidgets, n = widgets.length; i < n; i++) {
        widget = widgets[i];
        if (widget && widget.name === currentWidgetName && widgets[i] !== currentWidget) {
          isNew = true;
          widgets.splice(i, 1, currentWidget);
          var xulId = pentahoDashboardController.getWidgetXulId(widget);
          if (widget.type === "PentahoPrptComponent") {
            widget.clear();
          }
          break;
        }
      }
      for (i = 0, widgets = dashboard.components, n = widgets.length; i < n; i++) {
        widget = widgets[i];
        if (widget.name === currentWidgetName && widget !== currentWidget) {
          isNew = true;
          widgets.splice(i, 1, currentWidget);
          break;
        }
      }
    }
    //PDB 917: add change / postExecution hooks to update widget title.
    if (isNew) {
      pentahoDashboardController.setWidgetHooks(currentWidget);
    }
  };

  PropertiesPanelHelper.initPropertiesPanel = function(details) {
    if (!pho.dashboards.editMode) return; //shouldn't be used outside of edit mode

    var i, title, refreshPeriod, paramString, onApplyCallback;

    PropertiesPanelHelper.addOrReplaceCurrentWidget();

    if (currentWidget.name) {
      title = pentahoDashboardController.getXulDomProperty(
          pentahoDashboardController.getWidgetXulId(currentWidget),
          "title"
      );
      refreshPeriod = pentahoDashboardEditor.getWidgetRefreshPeriod(currentWidget);
    }
    else {
      title = "";
      refreshPeriod = 0;
    }

    // GWT call; see DashboardDesignerApp.initPropertiesPanel()
    // convert dashboard parameters (aka filters) into comma-separated string
    paramString = PropertiesPanelHelper.getDashboardParametersString(currentWidget.name);
    if (currentWidget.refreshParameters) currentWidget.refreshParameters();

    PropertiesPanelHelper.updateContentLinkingPanel(currentWidget.name);

    // callback for use by GWT properties panel
    var onApplyCallback = new function() {
      this.onApply = function(title, refreshPeriod, params, outputParams) {//String, Integer, String[][], String[][]
        // var pentahoDashboardEditor is global;
        // var currentWidget is global;
        // var title, params is local;
        setDirty(false);

        //update the widget title in the UI.
        var xulId = pentahoDashboardController.getWidgetXulId(currentWidget);
        pentahoDashboardController.setXulDomProperty(xulId, "title", title);
        $("#panel-title-" + xulId).text(title);

        var i, paramCount, param,
            j, component,
            components = dashboard.components,
            componentCount = components.length,
            listeners = []
            ;
        for (i = 0, paramCount = params.length; i < paramCount; i++) {
          // params[i][1] is a parameter name; in the case of a static param, it is an empty string
          if ((param = params[i][1]) === "") continue;
          // Resolve the filter name to the filter id
          for (j=0; j < componentCount; j++){
            component = components[j];
            if (component.getGUID &&
                OutputParametersHelper.isParameterFromComponent(param, component.getGUID())
                ){
              //exists, add to listener
              listeners.push(param); //TODO: can we just add the parameter?..
              break;
            }
          }
        }
        currentWidget.listeners = listeners;
        currentWidget.parameters = params;

        if (OutputParametersHelper.hasOutputParameters(currentWidget)){//multiple output parameters support
          currentWidget.setOutputParameters(outputParams);
        }
        else {
          for (i = 0, paramCount = outputParams.length; i < paramCount; i++) {
            param = outputParams[i];
            if (param === "true" || param[1] === true) {
              currentWidget.parameter = param[0];
            }
          }
        }

        PropertiesPanelHelper.addOrReplaceCurrentWidget();
        pentahoDashboardEditor.setWidgetRefreshPeriod(currentWidget, refreshPeriod);
        currentWidget.update();   //rpb: TODO: this update is called way too often.
        pentahoDashboardEditor.updateXulTree();
      }
    };
    //PDB-1301: somehow, sometimes, the DashboardDesignerApp module doesn't get initialized.
    //I need to get to the root of that but reproducing it has been very hard.
    //I'm going to try if this fixes it for now.
    if (typeof(pdb1301)==="undefined") {
      pho.dashboards.init();
      pdb1301 = true;
    }
    //end PDB-1301
    pho.dashboards.jsni_initPropertiesPanel(title, refreshPeriod, currentWidget, paramString, onApplyCallback, details);

    //set filter on refreshPeriod textBox
    // ToDo: xul textbox should be changed to type="number" when supported
    var rptb = document.getElementById("propertiesPanelRefreshPeriod");
    if(rptb){
      rptb.onkeypress = isNumericKeyPress;
    }

  }

  PropertiesPanelHelper.updateContentLinkingPanel = function(widgetName) {
    // GWT call; see DashboardDesignerApp.initContentLinkingPanel()
    if (!pho.dashboards.editMode) return; //shouldn't be used outside of edit mode
    pho.dashboards.jsni_initContentLinkingPanel(
        PropertiesPanelHelper.getDashboardOutputParametersString(widgetName)
    );
  }

//get dashboard output parameters (aka content linking) as a comma-separated string (<displayName>;<enabled>;<parameter>,<parameter2>;<displayName2>..)
  PropertiesPanelHelper.getDashboardOutputParametersString = function(nameToMatch){
    var comp = dashboard.getComponent(nameToMatch);
    return (comp && OutputParametersHelper.hasOutputParameters(comp)) ? PropertiesPanelHelper.getJaggedArrayAsString(comp.getOutputParameters()) : "";
  }

  PropertiesPanelHelper.getDashboardParametersString = function(nameToIgnore){
    var result = [], componentTitle, paramTitle,
        i, components = dashboard.components, component, n = components.length
        ;
    for (i = 0; i < n; i++) {
      component = components[i];
      if (nameToIgnore === component.name) continue;
      componentTitle = PropertiesPanelHelper.getWidgetTitle(component);
      //output parameters
      if (OutputParametersHelper.hasOutputParameters(component)) {//list each outParameter
        var oParams = component.getOutputParameters() || [],
            j, numParams = oParams.length, oParam
            ;
        for (j = 0; j < numParams; j++) {
          oParam = oParams[j];
          if (!OutputParametersHelper.isParamEnabled(oParam)) continue;
          paramTitle = componentTitle;
          if (!pho.dashboards.jsni_isPovWidget(component.type)){
            paramTitle += " - " + oParam[OutputParametersHelper.OUT_PARAMS_TITLE_IDX];
          }
          result.push([
            oParam[OutputParametersHelper.OUT_PARAMS_ID_IDX],
            paramTitle
          ]);
        }
      }
      else
      if (component.parameter) { //single output parameter (old)
        result.push([component.parameter, componentTitle]);
      }
    }
    return PropertiesPanelHelper.getJaggedArrayAsString(result);
  }

  PropertiesPanelHelper.getWidgetTitle = function(comp){
    var title = comp.name;
    if (pho.dashboards.jsni_isPovWidget(comp.type)) {//POV Widget
      title = comp.title;
    }
    else {//dashboard widget
      title = pentahoDashboardController.getXulDomProperty(
          pentahoDashboardController.getWidgetXulId(comp),
          "title"
      );
    }
    return title;
  }
//return compunt name with component's name/id and the inner output parameter name
  PropertiesPanelHelper.getOutParameterUID = function(comp, outParam) {
    return comp.name + "." + outParam;
  }

//turns jagged array [[valA1, valA2 ,..], [valB1, valB2, ..]] into a comma-separated string (<valA1>;<valA2>;..,<valB1>;<valB2>;..)
  PropertiesPanelHelper.getJaggedArrayAsString = function(array){
    if (typeof(array) === "undefined") return "";
    var i, len = array.length, outer = [];
    for(i = 0; i < len; i++){
      outer.push(array[i].join(";"));
    }
    return outer.join(",");
  }

  PropertiesPanelHelper.setParameterListeners = function(widget, params){
    var listeners = (widget.listeners = []),
        i, numParams = params.length, param,
        components = dashboard.components, component
        ;
    for (i = 0; i < numParams; i++) {
      // params[i][1] is the dashboard filter name; in the case of a static param, it is an empty string
      if ((param = params[i][1]) === "") continue;
      for (component in components) {
        component = components[component];
        if (pho.dashboards.jsni_isPovWidget(component.type) && component.parameter === param) {
          // We have matched the name, add the id to the listeners
          listeners.push(param);
        }
      }
    }
  }


  selectedWidgetPanel = null;

  highlightWidgetAreaWithCss = function(id) {
    var panel = document.getElementById("FilterPanel"),
        widgetNum, widgetPanel
        ;
    if (id !== null) {
      widgetNum = pentahoDashboardController.getWidgetId(id);
      widgetPanel = document.getElementById("Panel_" + widgetNum);
    }
    panel.className = panel.className.replace(/\bhighlight-shadow\b/, "");
    if (selectedWidgetPanel) {
      // turn off current highlight widget
      selectedWidgetPanel.className = selectedWidgetPanel.className.replace(/\bhighlight-shadow\b/, "");
    }
    if (id === null) {
      window.highlightedWidget = null;
      selectedWidgetPanel = null;
      return;
    }
    else
    if(id === "FilterPanel"){
      selectedWidgetPanel = panel;
      if (panel.style.display === "none"){
        highlightWidgetAreaWithCss(null);
        return;
      }
      panel.className += " highlight-shadow";
      return;
    }
    if (widgetPanel) {
      selectedWidgetPanel = widgetPanel;
      widgetPanel.className += " highlight-shadow";
    }
    window.highlightedWidget = id;
  }

  var supportsCssStyle = (function() {
    var div = document.createElement('div'),
        vendors = 'Khtml Ms O Moz Webkit'.split(' '),
        len = vendors.length;

    return function(prop) {
      len = vendors.length;
      if ( prop in div.style ) return true;

      prop = prop.replace(/^[a-z]/, function(val) {
        return val.toUpperCase();
      });

      while(len--) {
        if ( vendors[len] + prop in div.style ) {
          // browser supports the style. Do what you need.
          return true;
        }
      }
      return false;
    };
  })();

  highlightWidgetArea = function(id) {
    if (supportsCssStyle('boxShadow')) {
      highlightWidgetAreaWithCss(id);
    }
    else
    if (id === null) {
      window.highlightedWidget = null;
      var div = document.getElementById("select-frame-left");
      if (div) div.style.display = "none";
      div = document.getElementById("select-frame-top");
      if (div) div.style.display = "none";
      div = document.getElementById("select-frame-bottom");
      if (div) div.style.display = "none";
      div = document.getElementById("select-frame-right");
      if (div) div.style.display = "none";
      return;
    }
    else
    if(id === "FilterPanel"){
      var panel = document.getElementById("FilterPanel");
      if(panel.style.display == "none"){
        highlightWidgetArea(null);
        return;
      }
      var rect = getRectangle(panel, panel.parentNode);
      showSelectionBox(rect);
      return;
    }
    else {
      var widgetNum = pentahoDashboardController.getWidgetId(id);
      var widgetPanel = document.getElementById("Panel_" + widgetNum);
      if (widgetPanel) {
        var rect = getRectangle(widgetPanel, widgetPanel.parentNode.parentNode);
        showSelectionBox(rect);
      }
      window.highlightedWidget = id;
    }
  }

  showSelectionBox = function(rect) {

    var borderWidth = 4;
    var div = document.getElementById("select-frame-left");
    if (div) {
      div.style.display = "block";
      div.style.left = rect.x - borderWidth + "px";
      div.style.top = rect.y - borderWidth + "px";
      div.style.height = (rect.height + borderWidth * 2 - 1) + "px";
    }
    div = document.getElementById("select-frame-top");
    if (div) {
      div.style.display = "block";
      div.style.left = rect.x - borderWidth + "px";
      div.style.top = rect.y - borderWidth + "px";
      div.style.width = (rect.width + borderWidth * 2) + "px";
    }
    div = document.getElementById("select-frame-bottom");
    if (div) {
      div.style.display = "block";
      div.style.left = rect.x - borderWidth + "px";
      div.style.top = (rect.y + rect.height - borderWidth * 0) + "px";
      div.style.width = (rect.width + borderWidth * 2) + "px";
    }
    div = document.getElementById("select-frame-right");
    if (div) {
      div.style.display = "block";
      div.style.left = (rect.x - borderWidth * 0 + rect.width) + "px";
      div.style.top = rect.y - borderWidth + "px";
      div.style.height = (rect.height + borderWidth * 2 - 1) + "px";
    }

  }

  XActionHelper.genXaction = function(solution, path, action) {
    var gen = solution == null ? '' : solution;
    if (path != null) {
      if (gen.length > 0 && gen.substr(gen.length - 1, 1) != '/') {
        gen += '/';
      }
      gen += path;
    }
    if (action != null) {
      if (gen.length > 0 && gen.substr(gen.length - 1, 1) != '/') {
        gen += '/';
      }
      gen += action;
    }
    return gen;
  }

  XActionHelper.parseXaction = function(path) {
    // find the first '/'
    var result = new Array();
    var pos1 = path.indexOf('/');
    if (pos1 != -1) {
      var solution = path.substr(0, pos1);
      result[0] = solution;
    }

    // find the last '/'
    var pos2 = path.lastIndexOf('/');
    if (pos1 != -1) {
      result[1] = path.substr(pos1 + 1, pos2 - pos1 - 1);
      result[2] = path.substr(pos2 + 1);
    } else {
      result[1] = '';
      result[2] = path.substr(pos1 + 1);
    }
    return result;
  }
  if (mantle_enabled) {
    window.parent.enableSave(true);

    window.mantleDragEvent = function(x,y, name){
      if(!SolutionBrowserHelper.extensionRegExp.test(name) || !pentahoDashboardEditor.isEditPanelVisible() ) return;
      var extension = RegExp.$1,
          component = PentahoDashboardController.getComponentByFileType(extension),
          panel
          ;
      if (!component) return false;
      if (!(panel = getPanelForCoordinates(x, y))) return false;
      highlightWidgetArea(panel.id);
      return true;
    }

    window.mantleDragEnd = function(x,y,solution, path, name, localizedFileName){

      if(!SolutionBrowserHelper.extensionRegExp.test(name) || !pentahoDashboardEditor.isEditPanelVisible() ) return;
      if (localizedFileName == "undefined") localizedFileName = name;
      var panel = getPanelForCoordinates(x, y);
      if (!panel) return;

      function dropItem(){
        SolutionBrowserHelper.createComponentForFile(solution, path, name, localizedFileName);
      }
      pentahoDashboardController.panelTitleClick(panel.id, false);
      var widget = currentWidget;
      if (widget.htmlObject !== "content-area-" + panel.id) return;

      if(widget.type === "PentahoEmptyWidget") dropItem();
      else {
        window.gwtConfirm(
            pho_messages.getMessage("discard_content", "Discard current content?"), {
              onOk: dropItem
            },
            {title: pho_messages.getMessage("warning.title", "Warning")}
        );
      }
    }
  }
});
