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
    ["dojo/on", "dojo/query", "dojo/_base/lang", "dojo/_base/array", "dijit/registry", "dojo/dom", "pentaho/common/Messages", "dojo/dom-class",
      "dojo/request", "dojox/html/entities", "dojo/json", "dojo/has", "dojo/sniff", "dojo/date/stamp",
      "dojo/dom-construct", 'common-ui/util/formatting', "dojo/io-query", "dojo/dom-attr",
      'common-ui/util/URLEncoder', 'common-ui/prompting/WidgetBuilder',
      'pir/ParameterPanelBuilder', 'common-ui/underscore', 'dojo/date/locale', 'cdf/lib/jquery', 'amd!cdf/lib/jquery.ui', "common-repo/pentaho-ajax", "dijit/ProgressBar", "common-data/xhr",
      'pentaho/reportviewer/FeedbackScreen'
    ],
    function(on, query, lang, array, registry, dom, _Messages, domClass, request, entities, json, has, sniff, stamp, construct,
             ReportFormatUtil, ioQuery, attr, encoder, WidgetBuilder, ParameterPanelBuilder, _, locale, $) {

      /**
       * A counter that keeps track of a sequence number and handles
       * incrementing and wrapping of the value when it reaches the max.
       */
      pentaho.pir.SequenceNumberCounter = function () {
        // Maximum Number in JavaScript that you can increment
        this.MAX_SEQUENCE_NUMBER = Math.pow(2, 53) - 1;
        this.seqNum = 0;

        this.get = function () {
          return this.seqNum;
        };

        this.set = function (seqNum) {
          return this.seqNum = (seqNum === undefined || seqNum > this.MAX_SEQUENCE_NUMBER || seqNum < 0) ? 0 : seqNum;
        };

        this.increment = function () {
          return this.set(this.seqNum + 1);
        };
      };

      /*
       This is the base controller class
       */
      pentaho.pir.controller = function () {
        this.templates = [];
        this.pageFormats = [];
        this.datasourceInfos = [];
        this.datasource = null;
        this.undoStack = [];
        this.undoPosition = -1;
        this.pentahoUserConsole = new PentahoUserConsole(); // to integrate with save/load/edit
        this.pentahoUserConsole.toggleEditCallback = this.toggleEditCallback;
        this.acceptedPage = 0;
        this.queryTimeoutDefault = 60;
        this.formattingModified = false;
        this.command = "edit";
        this.currentFileName = null; // it must contain ".prpti" extension for server communication
        this.currentFilePath = null;
        this.querylessMode = false;
        this.lastSaveQueryLimit = null;
        this.lastSaveState = null;
        this.licensed = true; // LICENSE CHECK
        this.newReport = true;
        this.pirLicenseError = false;
        // The sequence number counter for requests
        this.sequenceNumberCounter = new pentaho.pir.SequenceNumberCounter();

        this.DATA_TYPE_MAPPING = {};
        this.DATA_TYPE_MAPPING[pentaho.pda.Column.DATA_TYPES.STRING] = 'java.lang.String';
        this.DATA_TYPE_MAPPING[pentaho.pda.Column.DATA_TYPES.NUMERIC] = 'java.math.BigDecimal';
        this.DATA_TYPE_MAPPING[pentaho.pda.Column.DATA_TYPES.DATE] = 'java.sql.Timestamp';
        this.DATA_TYPE_MAPPING[pentaho.pda.Column.DATA_TYPES.BOOLEAN] = 'java.lang.Boolean';
        this.DATA_TYPE_MAPPING['default'] = 'java.lang.String';

        this.defaultDateFormat = "yyyy-MM-dd";
        this._isAsync = null;
        this._pollingInterval = 1000;
        this._dialogThreshold = 1500;
        this._currentReportStatus = null;
        this._currentReportUuid = null;
        this._currentStoredPagesCount = null;
        this._requestedPage = 0;
        this._isNewReportGenerated = null;
        this._handlerRegistration = null;
        this._showProgressDialogTimer = null;
        this._isFinished = false;
        this._initialModelLimit = null;
        this._canceledReportUuid = null;
        this._paramDefnInitialized = false;
      }

      pentaho.pir.controller.prototype.isParamDefnInitialized = function() {
        return this._paramDefnInitialized;
      }

      pentaho.pir.controller.prototype.isReportModified = function () {
        return this.canUndo();
      }

      pentaho.pir.controller.prototype.isFormattingModified = function () {
        return this.formattingModified;
      }

      pentaho.pir.controller.prototype.initDatasources = function () {
        var da_mql = {
          name: 'da-mql',
          objectClass: pentaho.pda.MqlHandler
        };
        pentaho.pentahoMetadataClient = {
          app: new pentaho.pda.app(),
          prior_idx: -1,
          source: {}
        };
        var moduleArray = [da_mql];
        pentaho.pentahoMetadataClient.app.init(moduleArray);
        pentaho.pentahoMetadataClient.app.moduleData['da-mql'].instance.METADATA_SERVICE_URL = CONTEXT_PATH + 'content/ws-run/metadataService';
      }

      window.onbeforeunload = function(e) {
        if (typeof controller.cancelCurrentAsyncJob !== "undefined") {
          controller.cancelCurrentAsyncJob();
        }
        if(isRunningIFrameInSameOrigin && window.top.mantle_removeHandler) {
          window.top.mantle_removeHandler(controller._handlerRegistration);
        }
        return;
      };

      pentaho.pir.controller.prototype.init = function () {
        pentahoRepositoryClient.saveState = this.saveReport;
        if (gCtrlr && gCtrlr.repositoryBrowserController) {
          gCtrlr.repositoryBrowserController.remoteSave = this.saveReport;
          gCtrlr.repositoryBrowserController.getPossibleFileExtensions = this.possibleExtensions;
        }
        this.initDatasources();

        this.command = this.findUrlParam('command', document.location.href);
        if (this.command == null) {
          this.command = null;
        }

        this.fetchAsyncModeEnabledStatus();
        this.initPrompting();

        this.initialized = true;
        this.load();

        if(isRunningIFrameInSameOrigin && window.top.mantle_addHandler) {
          this._handlerRegistration = window.top.mantle_addHandler("GenericEvent", this.onTabCloseEvent.bind(this));
        }

        var pageNumberInput = document.getElementsByClassName('pc_pageNumberInput')[0];
        registry.byNode(pageNumberInput).set('invalidMessage', '<div class=pageNumberInputTooltip>'+ registry.byNode(pageNumberInput).messages.invalidMessage + '</div>');
        registry.byNode(pageNumberInput).set('rangeMessage', '<div class=pageNumberInputTooltip>'+ registry.byNode(pageNumberInput).messages.rangeMessage + '</div>');
      }

      /**
       * Load PIR iff. we're initialized and the GWT text formatter has loaded. This handles out of order script loading.
       * TODO Replace this with a valid use of AMD when it is available
       */
      pentaho.pir.controller.prototype.load = function () {
        if (!!this.initialized && !!this.formatterLoaded) {
          this.initRenderMode(false);
        }
      }

      pentaho.pir.controller.prototype.initPrompting = function () {
        WidgetBuilder.mapping['parameter-panel'] = new ParameterPanelBuilder(this);
      }

      pentaho.pir.controller.prototype.onTabCloseEvent = function (event) {
        if (event.eventSubType == 'tabClosing' && event.stringParam == window.frameElement.id) {
          controller.cancelCurrentAsyncJob();
          if(isRunningIFrameInSameOrigin && window.top.mantle_removeHandler) {
            window.top.mantle_removeHandler(this._handlerRegistration);
          }
        }
      }

      pentaho.pir.controller.prototype.initRenderMode = function (fromEditContentButton) {
        view.addBusy();
        var rowLimitControl = registry.byId('rowLimitControl');

        rowLimitControl.bindChange(function () {
          //reset callback
        });
        rowLimitControl.bindGetMessage(function () {
          return registry.byId('rowLimitMessage');
        });
        rowLimitControl.bindGetDialog(function () {
          return registry.byId('rowLimitExceededDialog');
        });
        rowLimitControl.bindShowGlassPane(dojo.hitch(this, function(){
          view.showGlassPane();
        }));
        rowLimitControl.bindHideGlassPane(dojo.hitch(this, function(){
          view.hideGlassPane();
        }));
        var rowLimitMessage = registry.byId('rowLimitMessage');
        rowLimitMessage.bindRun(function () {
          view.queryLimitRunNow();
        });
        rowLimitMessage.bindSchedule(function () {
          view.queryLimitSchedule();
        });
        if(!rowLimitControl._isInitialized()) {
          rowLimitControl._setRowLimitRestrictionDisabled(true);
          rowLimitControl._setRowsNumberInputDisabled(true);
        } else {
          //User has switched mode
          rowLimitControl.rowLimitRestrictions.removeOption(registry.byId("rowLimitControl").rowLimitRestrictions.getOptions());
          rowLimitControl._initialized = false;
          rowLimitControl._systemRowLimit = undefined;
          rowLimitControl._reportRowLimit = undefined;
          rowLimitControl._selectedRowLimit = undefined;
          rowLimitControl._setRowLimitRestrictionDisabled(true);
          rowLimitControl._setRowsNumberInputDisabled(true);
        }

        rowLimitControl.registerLocalizationLookup(_Messages.getString);
        registry.byId('rowLimitExceededDialog').registerLocalizationLookup(_Messages.getString);
        rowLimitMessage.registerLocalizationLookup(_Messages.getString);
        domClass.remove(dom.byId("toolbar-parameter-separator-row-limit"), "hidden");
        domClass.remove(dom.byId('rowLimitControl'), "hidden");


        if (this.pentahoUserConsole.console_enabled) {
          view.hideEditModeSwitchButton();
        }

        try {
          var showRepositoryButtons = view.getUrlParameters()['showRepositoryButtons'];
          if (controller.command == 'view' || showRepositoryButtons != 'true') {
            view.hideRepositoryButtons();
          } else {
            view.showRepositoryButtons();
          }
          controller.pentahoUserConsole.enableEditButton();
          controller.pentahoUserConsole.lowerEditButton();
          controller.loadPageFormats();
          if (controller.command == null || controller.command == 'new') {
            controller.command = 'new';
            controller.loadTemplateList();
            if (this.pirLicenseError == true) {
              view.removeBusy();
              if(isRunningIFrameInSameOrigin) {
                // also close any please wait dialogs
                if (window.top.hideLoadingIndicator) {
                  window.top.hideLoadingIndicator();
                } else {
                  if (window.parent.hideLoadingIndicator) {
                    window.parent.hideLoadingIndicator();
                  }
                }
              }

              return;
            }
            view.updateTemplateCtrl(this.templates);
            var providedModel = this.findUrlParam('model', document.location.href);
            if (providedModel == null) {
              controller.loadModels();
              controller.addToUndo(json.stringify(model.report));
              controller.reportLoaded = true;
              view.createPromptPanel();
              if (this.licensed) { // LICENSE CHECK
                controller.pentahoUserConsole.disableEditButton();
                view.showSelectModel();
              } // LICENSE CHECK
            } else {
              controller.setModel(providedModel);
              view.hideGlassPane();
              view.createPromptPanel(); // PIR-663/CUST-47
              view.canResize = true;
            }
            view.updatePageFormatCtrl(controller.pageFormats);
            view.updateFromState();
          }
          else if (controller.command == 'edit' || controller.command == 'view') {
            view.canResize = true;
            if (!fromEditContentButton) {
              controller.loadTemplateList();
              view.updateTemplateCtrl(controller.templates);
              controller.loadModels();
              var solution = controller.findUrlParam('solution', document.location.href);
              var path = controller.findUrlParam('path', document.location.href);
              var file = controller.findUrlParam('file', document.location.href);
              controller.currentFilePath = path;
              controller.currentFileName = file;
              // load the report definition
              controller.loadReport(solution, path, file);
            } else {
              view.refreshParameterPanel();
            }
            view.updatePageFormatCtrl(controller.pageFormats);
            view.sidePanelOpen = true;
            document.getElementById('sidepanel').style.display = 'block';

            if (controller.command == 'view') {
              view.deselectAll();
              // need to disable stuff
              // entire sidepanel goes away
              document.getElementById('sidepanel').style.display = 'none';
              view.sidePanelOpen = false;
              //document.getElementById('toppanel').style.display = 'none';
              // in view mode we cannot save
              controller.pentahoUserConsole.disableSaveButtons();
              controller.pentahoUserConsole.resetEditButton();
              if(!this._isAsync) {
                view.hideGlassPane();
              }
            } else {
              this.pentahoUserConsole.enableSaveButtons();
            }
            view.refreshHints();
            view.resize();
          }
          this.checkDataAccess();
          dojo.hitch(view, view.initControlPanel(controller.command));
        } catch (e) {
        }
        view.removeBusy();

        if(isRunningIFrameInSameOrigin) {
          if (window.top.hideLoadingIndicator) {
            window.top.hideLoadingIndicator();
          } else if (window.parent.hideLoadingIndicator) {
            window.parent.hideLoadingIndicator();
          }
        }
      }

      pentaho.pir.controller.prototype.toggleEditCallback = function (selected) {
        // toggle between edit/view modes
        if (selected) {
          controller.command = "edit";
        } else {
          controller.command = "view";
        }

        if (controller._initialModelLimit === null || controller._initialModelLimit < 0) {
          //We don't want design limit to be applied in edit mode and be reset in view mode
          model.report.queryLimit = -1;
          controller._initialModelLimit = null;
        }

        controller.initRenderMode(true);
      }

      pentaho.pir.controller.prototype.isLoginContent = function (content) {

        if (content.indexOf('j_spring_security_check') != -1) {
          // looks like we have the login page returned to us
          return true;
        }
        return false;
      }

      pentaho.pir.controller.prototype.isTemplateMissing = function (content) {

        if (content.indexOf('InteractiveAdhocReportUtils.ERROR_0003') != -1) {
          return true;
        }
        return false;
      }

      pentaho.pir.controller.prototype.isColumnMissing = function(content){

        if(content.indexOf('InteractiveAdhocReportUtils.ERROR_0006') != -1) {
          return true;
        }
        return false;
      }

      pentaho.pir.controller.prototype.isMessageContent = function (content) {

        if (content.indexOf('{') == 0) {
          var pos = content.substr(0, 100).indexOf('com.pentaho.iadhoc.service.StatusMessage');
          if (pos > 0 && pos < 20) {
            // looks like we have a json message returned to us
            return true;
          }
        }
        return false;
      }

      pentaho.pir.controller.prototype.isQueryExecutionFailed = function (content) {

        if(content.indexOf('InteractiveAdhocReportUtils.ERROR_0007') != -1) {
          return true;
        }
        return false;
      }

      pentaho.pir.controller.prototype.checkDataAccess = function () {
        var url = CONTEXT_PATH + 'content/ws-run/metadataServiceDA/getDatasourcePermissions';
        var query = '';

        var resultXml;
        this.sendRequest(url, {query:query, sync:true}).then(function(data) {
          resultXml = data;
        });
        var perms = this.getResultText(resultXml);
        if (perms == 'EDIT') {
          // enable the data access buttons
          if (view && view.modelSelectDialog) {
            view.modelSelectDialog.setCanDataSourceAdmin(true);
          }
          view.enableAdminOptions();
        }
      }

// PIR-496
      pentaho.pir.controller.prototype.handleMissingFields = function(jsonData) {
        array.forEach(jsonData.messages, function(message) {
          if(message != null && message.code == 'MISSING_FIELD'){
            view.showMessageBox(view.getLocaleString("MissingColumnWarning", message.message),
                view.getLocaleString("Error_txt"),
                view.getLocaleString('Yes_txt'),
                function() {
                  view.closeMessageBox();

                  //var ds = controller.getDefaultDataSource(model.report);
                  var findColumnIdx = function(columns, name) {
                    var idx = -1;
                    array.some(columns, function(cn,  i) {
                      if (cn.field === name) {
                        idx = i;
                        return true; // break
                      }
                    });
                    return idx;
                  }
                  controller.removeColumn(findColumnIdx(model.report.fields, message.message));
                  controller.cancelCurrentAsyncJob();
                  controller.refresh();
                },
                view.getLocaleString('No_txt'),
                function() {
                  view.closeMessageBox();
                  dom.byId('querylessCheckBox').checked = false;
                  view.changeQuerylessCheckBox();
                }
            );
            return true; // break;
          }
        });
      }

      pentaho.pir.controller.prototype.loadReport = function (solution, path, filename) {
        view.addBusy();
        try {
          // handle '/'s robustly
          if (path.indexOf('/') == 0) {
            // trim a leading '/'
            path = path.substr(1);
          }
          if (path[path.length - 1] == '/') {
            path = path.substr(0, path.length - 2);
          }
          var fullpath;
          if (path != '') {
            fullpath = solution + '/' + path + '/' + filename;
          } else {
            fullpath = solution + '/' + filename;
          }

          var onLoad = lang.hitch(this, function (data) {
            try {
              var text = this.getResultText(data);
              if (text.indexOf("wrapper_license_message") !== -1 ) {  // Server says no license.
                var e = document.createElement('div');
                e.innerHTML = text;
                text = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
                document.getElementById("contentArea").innerHTML=text;
                domClass.remove(dom.byId("contentArea"), "hidden");
                this.pirLicenseError = true;
                return;
              }
              var jsonData = this.getJsonFromXml(data);
              this.setReport(jsonData);

              var defaultDs = this.getDefaultDataSource(model.report);
              var modelRef = defaultDs.domainId + ':' + defaultDs.modelId;
              this.setModel(modelRef);

              view.hideGlassPane();
              view.showAll();
              view.createFilterItems(); // need to initiate the filter store
              view.updateFromState();
              this.addToUndo(json.stringify(model.report));
              controller.reportLoaded = true;
              view.createPromptPanel();
              this.newReport = false;
            } finally {
              view.removeBusy();
            }

            controller.handleMissingFields(jsonData); // PIR-496
          });

          var onError = lang.hitch(this, function (data) {
            view.removeBusy();
            if (data.status === 500 &&
                ((data.responseText.indexOf("QueryXmlHelper.ERROR_0009") !== -1) ||
                (data.responseText.indexOf("QueryXmlHelper.ERROR_0010") !== -1))) {  // PIR-623
              // Unable to load data source
              view.showMessageBox(view.getLocaleString("MissingDatasourceError"), view.getLocaleString("Error_txt"), null, null, null, null, true);
            }
            else if (data.status === 500 && controller.isColumnMissing(data.responseText)){
              // TODO
            }
            else {
              // TODO Move this to a more central location for any errors when loading reports
              view.showMessageBox(view.getLocaleString("UnexpectedError", [data.responseText.substr(0, 500) + (data.responseText.length > 500 ? '...' : '')]), view.getLocaleString("Error_txt"), null, null, null, null, true);
            }
          });

          this.sendRequest(CONTEXT_PATH + 'content/ws-run/InteractiveAdhocService/getReportSpecificationJson', {
            sync: true,
            preventCache: true,
            query: {
              fullpath: fullpath
            },
            handleAs: "text"
          }).then(onLoad, onError);
        } catch (e) {
          view.showMessageBox(view.getLocaleString("UnexpectedError", [e]), view.getLocaleString("Error_txt"), null, null, null, null, true);
        }
      }

      pentaho.pir.controller.prototype.setReport = function (report) {
        var me = this;
        // Remove placeholder column if it exists
        if (report.fields.length === 1
            && (report.fields[0].field === 'placeholder'
            || (report.fields[0].field === '' && report.fields[0].displayName === 'placeholder'))) {
          report.fields = [];
        }

        // Decode all report values that could be encoded

        // Decode the properties of every object in the collection
        var decoder = function (collection, property) {
          array.forEach(collection, function (obj) {
            obj[property] = me.decodeHtml(entities.decode(obj[property]));
          });
        }

        var dsQueryDecoder = function (collection, property) {
          array.forEach(collection, function (obj) {
            obj[property] = entities.decode(obj[property]);
          });
        }

        // PIR-632
        if (model.report.dataSources.length == 0) {
          dsQueryDecoder(report.dataSources, "query");
          decoder(report.dataSources, "domainId");
          decoder(report.dataSources, "xmi");
        }
        decoder(report.fields, "displayName");
        decoder(report.pageFooters, "value");
        decoder(report.pageHeaders, "value");
        decoder(report.reportFooters, "value");
        decoder(report.reportTitles, "value");
        array.forEach(report.groups, function (group) {
          group.headerLabel = entities.decode(group.headerLabel);
          decoder(group.summaryFormats, "label");
        });

        // Decode filter values
        array.forEach(report.filters, function (filter) {
          filter.operator = entities.decode(filter.operator);
          filter.parameterName = entities.decode(filter.parameterName);

          // Decode report.filters values only when the report is loaded for the first time
          if(model.report.filters.length == 0) {
            // Undo PIR-517 fix; decode filter values
            array.forEach(filter.value, function(value, idx) {
              filter.value[idx] = entities.decode(value);
            });
          }
        });

        model.report = report;
      }

      pentaho.pir.controller.prototype.findUrlParam = function (name, url) {

        var result = null;
        if (name.indexOf('command') != -1) {
          if (url.indexOf('?') != -1) {
            result = url.substring(url.indexOf('/prpti.') + 7, url.indexOf('?'));
          } else {
            result = url.substr(url.indexOf('/prpti.') + 7);
          }
        }
        if (name.indexOf('file') != -1) {
          url = decodeURIComponent( url );
          var pathParts = url.split("/");
          var reposIndex = array.indexOf(pathParts, "repos");
          if( reposIndex !== -1 ) {
            var myFullPath = pathParts[reposIndex + 1];
            myFullPath = encoder.decodeRepositoryPath(myFullPath);
            result = myFullPath.substring(myFullPath.lastIndexOf("/") + 1, myFullPath.length);
            return result;
          }
        }
        if (name.indexOf('solution') != -1) {
          // solution is no longer applicable, path will also now include what this used to provide
          return "";
        }
        if (name.indexOf('path') != -1) {
          url = decodeURIComponent( url );
          var pathParts = url.split("/");
          var reposIndex = array.indexOf(pathParts, "repos");
          if( reposIndex !== -1 ) {
            var myFullPath = pathParts[reposIndex + 1];
            myFullPath = encoder.decodeRepositoryPath(myFullPath);
            result = myFullPath.substring(0, myFullPath.lastIndexOf("/"));
            return result;
          }
        }
        if (name.indexOf('model') != -1) {
          // PIR-881
          var queryString = url.substring(url.indexOf("?") + 1, url.length);
          var queryObject = ioQuery.queryToObject(queryString);
          result = queryObject[name];
        }

        return result;
      }

      /**
       * Make the start of an undo operation. This is a flag on the controller so we can track an undo operation across many function calls.
       */
      pentaho.pir.controller.prototype.startUndo = function () {
        this.isUndoing = true;
      }

      pentaho.pir.controller.prototype.stopUndo = function () {
        this.isUndoing = false;
      }

      pentaho.pir.controller.prototype.undo = function (withoutRefresh) {

        if (!this.canUndo()) {
          return;
        }
        var newPosition = this.undoPosition - 1;
        var json = this.undoStack[newPosition];
        var report = JSON.parse(json);
        model.report = report;
        view.createFilterItems(false);
        if (!withoutRefresh) {
          this.startUndo();
          view.refreshParameterPanel();
        }
        this.undoPosition = newPosition;
        view.updateFromState();

        if (!this.canUndo()) {
          this.formattingModified = false;
        }
      }

      pentaho.pir.controller.prototype.getPreviousState = function () {
        if (this.undoStack.length > 0) {
          return JSON.parse(this.undoStack[this.undoPosition]);
        }
      }

      pentaho.pir.controller.prototype.redo = function () {
        if (!this.canRedo()) {
          return;
        }
        var newPosition = this.undoPosition + 1;
        var json = this.undoStack[newPosition];
        var report = JSON.parse(json);
        model.report = report;
        view.createFilterItems(false);
        this.undoPosition = newPosition;
        this.startUndo();
        view.refreshParameterPanel();
      }

      pentaho.pir.controller.prototype.canUndo = function () {
        return this.undoPosition > 0;
      }

      pentaho.pir.controller.prototype.canRedo = function () {
        return this.undoStack.length > 0 && this.undoPosition < this.undoStack.length - 1;
      }

// TODO Implement undo/redo with a sequence number
      pentaho.pir.controller.prototype.addToUndo = function (json) { //, sequenceNumber)
        if (this.undoPosition != this.undoStack.length - 1) {
          // the stack position is part way through, junk the rest of the stack
          this.undoStack.length = this.undoPosition + 1;
        }
        this.undoStack.push(json);
        this.undoPosition = this.undoStack.length - 1;
      }

      pentaho.pir.controller.prototype.loadPageFormats = function () {

        view.addBusy();
        try {
          var url = CONTEXT_PATH + 'content/ws-run/InteractiveAdhocService/getPageFormatListJson';
          var query = '';

          var resultXml;
          this.sendRequest(url, {query:query, sync:true}).then(function(data) {
            resultXml = data;
          });

          this.pageFormats = this.getJsonFromXml(resultXml);

          this.pageFormats.sort(function (a, b) {
            if (a < b) {
              return -1;
            } else if (a == b) {
              return 0;
            } else {
              return 1;
            }
          });
        } catch (e) {
        }
        view.removeBusy();
      }

      pentaho.pir.controller.prototype.loadTemplateList = function () {
        view.addBusy();
        try {
          var url = CONTEXT_PATH + 'content/ws-run/InteractiveAdhocService/getTemplatesListJson';
          var query = '';

          var resultXml;
          this.sendRequest(url, {query:query, sync:true}).then(function(data) {
            resultXml = data;
          });

          var text = this.getResultText(resultXml);
          if (text.indexOf("wrapper_license_message") !== -1 ) {  // Server says no license.
            var e = document.createElement('div');
            e.innerHTML = text;
            text = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
            document.getElementById("contentArea").innerHTML=text;
            domClass.remove(dom.byId("contentArea"), "hidden");
            this.pirLicenseError = true;
            view.removeBusy();
            return;
          }

          if (this.isMessageContent(text)) {
            this.handleMessages(text);
            return;
          }

          this.templates = this.getJsonFromXml(resultXml);

        } catch (e) {
        }
        view.removeBusy();
        // find the default template
        for (var idx = 0; idx < this.templates.length; idx++) {
          if (this.templates[idx].isDefault) {
            model.report.templateName = this.templates[idx].id;
          }
        }

      } // loadTemplateList

      pentaho.pir.controller.prototype.getResultText = function (xml) {
        // this isn't the best, but getText is truncating the node text for some reason

        var pos1 = xml.indexOf('<return>');
        var pos2 = xml.indexOf('</return>');

        var text;
        if (pos1 != -1 && pos2 != -1) {
          text = xml.substr(pos1 + 8, pos2 - pos1 - 8)
        } else {
          text = xml;
        }
        return text;
      }

      pentaho.pir.controller.prototype.getJsonFromXml = function (xml) {
        var resultJson = this.getResultText(xml);
        var json = JSON.parse(resultJson);
        return json;
      }

      pentaho.pir.controller.prototype.getPageFormatList = function () {
        return this.pageFormats;
      }

      pentaho.pir.controller.prototype.getTemplateList = function () {
        return this.templates
      } // getTemplateList

      pentaho.pir.controller.prototype.refreshDatasources = function () {
        this.loadModels();
      }

      pentaho.pir.controller.prototype.getSqlQuery = function () {
        this.prepareReport();
        var defaultDs = this.getDefaultDataSource(model.report);
        if (!defaultDs || !defaultDs.query) {
          return "";
        }
        var url = CONTEXT_PATH + 'content/ws-run/InteractiveAdhocService/getSqlQueryjson';
        var queryXml = defaultDs.query;
        queryXml = queryXml.replace('"&quot;', '"').replace('&quot;"', '"'); // PIR-754
        var resultXml;
        this.sendRequest(url, {query: {
              queryXml: queryXml
            }, sync:true}).then(function(data) {
          resultXml = data;
        });
        var json = this.getJsonFromXml(resultXml);
        return json.sql;
      }

      pentaho.pir.controller.prototype.getModelState = function (daModel) {

        var model = {};
        model.domainId = daModel.domainId;
        model.modelId = daModel.modelId;
        model.id = daModel.id;
        model.name = daModel.name;
        model.type = daModel.type,
            model.description = daModel.description;
        model.categories = daModel.categories;

        return model;
      }

      pentaho.pir.controller.prototype.loadModels = function () {
        view.addBusy();
        try {
          this.datasourceInfos = [];
          var list = this.datasourceInfos;
          // load the list of datasource models
          pentaho.pentahoMetadataClient.app.getSources(
              //function to be called for each source as it is added
              function (source) {
                //console.log(source);
                list.push(source);
              }, {context: "interactive-reporting"}
          );
          var modelStates = [];
          for (var idx = 0; idx < list.length; idx++) {
            modelStates.push(this.getModelState(list[idx]));
          }
        } catch (e) {
        }
        view.removeBusy();
        view.setModelList(this.datasourceInfos);
      }

      pentaho.pir.controller.prototype.getModel = function (id) {
        for (var idx = 0; idx < this.datasourceInfos.length; idx++) {
          if (this.datasourceInfos[idx].domainId + ':' + this.datasourceInfos[idx].modelId == id) {
            return this.datasourceInfos[idx];
          }
        }
        return null;
      }

      pentaho.pir.controller.prototype.setModel = function (modelId, reAuthenticate) {
        // get the model
        pentaho.pentahoMetadataClient.source = pentaho.pentahoMetadataClient.app.getSources(/*callback*/ null,
            {filter: {property: 'id', value: modelId}, context: "interactive-reporting"}
        );
        pentaho.pentahoMetadataClient.source.discoverModelDetail();

        var elements = pentaho.pentahoMetadataClient.source.getAllElements();

        if ((elements == "" || elements == undefined) && reAuthenticate) {
          // looks like our session expired
          controller.reauthenticate(function () {
            controller.setModel(modelId, false)
          });
          return;
        }

        this.datasource = pentaho.pentahoMetadataClient.source;
        view.showModelElements(elements);

        this.pentahoUserConsole.enableEditButton();
        this.pentahoUserConsole.enableSaveButtons();


        view.modelSelectDialog.hide();

        // Push the execution of showAll() until after the browser finishes rendering
        // to prevent scrollbar initialization errors
        setTimeout(lang.hitch(view, view.showAll));
        // FIX for PIR-358 - IE7 the available fields panel is not visible when the initial call to resizeDataTab is
        // called from the showAll above, must wait for it to become visible to set resize it properly
        if (view.resizeDataTab) {
          setTimeout(lang.hitch(view, view.resizeDataTab), 250);
        }
      } // setModel

      pentaho.pir.controller.prototype.prepareReport = function () {
        view.prepareAdvancedFilters(); // PIR-735
        if (!this.datasource) {
          return;
        }
        var query = this.datasource.createQuery();

        query.state.disableDistinct = model.report.disableDistinct;

        // first add the groups
        for (var idx = 0; idx < model.report.groups.length; idx++) {
          query.addSelectionById(model.report.groups[idx].field);
        }

        // now add the details
        for (var idx = 0; idx < model.report.fields.length; idx++) {
          // add selection

          var selection = query.addSelectionById(model.report.fields[idx].field);
          if (model.report.fields[idx].fieldAggregation != null) {
            // we have an aggregation type for this field
            if(selection != null){
              selection.selectedAggType = model.report.fields[idx].fieldAggregation;
            }
          }
          // add sorting (we are only sorting on fields on the report, i think we can sort on any field though)
          // perhaps "sort" should be an array of fields such as model.report.sortFields[]
        }

        // group sorts are first
        for (var idx = 0; idx < model.report.groupSorts.length; idx++) {
          if (model.report.groupSorts[idx].direction == 'asc') {
            query.addSortById(model.report.groupSorts[idx].field, pentaho.pda.Column.SORT_TYPES.ASCENDING);
          }
          else if (model.report.groupSorts[idx].direction == 'desc') {
            query.addSortById(model.report.groupSorts[idx].field, pentaho.pda.Column.SORT_TYPES.DESCENDING);
          }
        }

        for (var idx = 0; idx < model.report.fieldSorts.length; idx++) {
          if (model.report.fieldSorts[idx].direction == 'asc') {
            query.addSortById(model.report.fieldSorts[idx].field, pentaho.pda.Column.SORT_TYPES.ASCENDING);
          }
          else if (model.report.fieldSorts[idx].direction == 'desc') {
            query.addSortById(model.report.fieldSorts[idx].field, pentaho.pda.Column.SORT_TYPES.DESCENDING);
          }
        }

        var addedParameters = {};
        var addedConditions = {};

        var containsAdvancedFilter = false;
        var advancedFilter = null;
        if (model.report.filters) {
          for (var idx = 0; idx < model.report.filters.length; idx++) {
            var filter = model.report.filters[idx];
            var value = model.report.filters[idx].value;

            if (!(filter.value || filter.column || filter.mqlCondition)) {
              continue; // ignore combination filters (AND, OR, etc).
            }

            if (filter.isAdvanced) {
              containsAdvancedFilter = true;
              advancedFilter = filter; // there should only be one
            }

            var isParameterized = filter.parameterName && filter.parameterName != null && filter.parameterName.length > 0;
            if (isParameterized) {
              // PIR-1413
              // TYPES.EQUAL covers both inclusion and exclusion filters with parameters having multiple values
              if(filter.operator == 'IN') {
                filter.operator = pentaho.pda.Column.CONDITION_TYPES.EQUAL;
              }

              query.addParameterById(filter.column, filter.parameterName, null, filter.value);
              value = [filter.parameterName];
              addedParameters[filter.parameterName] = 1;
            }

            //query.addConditionById(model.report.filters[idx].column, model.report.filters[idx].operator, value, model.report.filters[idx].combinationType, isParameterized, filter.selectedAggType);
            addedConditions[model.report.filters[idx].column] = 1;
          }
        }

        // set default value for use in scheduling and next execution
        if (this.isParamDefnInitialized()) {
          var promptParams = view.promptApi.operation.getParameterValues();
          for (var j = 0; j < model.report.parameters.length; j++) {
            var param = model.report.parameters[j];

            if (promptParams[param.name]) {
              var v = promptParams[param.name];
              if (v instanceof Array) {
                param.defaultValue = v;
              } else {
                param.defaultValue = [""+v];
              }
            }
          }
        }

        if (containsAdvancedFilter) {
          var condition = query.createCondition();
          condition.value = "::mql::" + advancedFilter.mqlCondition; // advanced mql filter
          query.addCondition(condition);

          // PIR-727 - remove advanced filter from filter array after adding to condition
          array.forEach(model.report.filters, function (f, i) {
            if (f == advancedFilter) {
              model.report.filters.splice(i, 1);
            }
          });
        }

        if (model.report.parameters) {
          array.forEach(model.report.parameters, function (p) {
            if (!p.hidden) {
              var defaultValue = this.convertDateValueForMetadata(p, p.defaultValue);
              // Only add a parameter if a filter hasn't defined it yet. This is only the case for creating a new parameter. The server will parse
              // out the parameters from the query and create filters and include them with the response. Doing this lets us only implement that
              // once: on the server.
              if (addedParameters[p.name] !== 1) {
                query.addParameterById(p.columnId, p.name, null, defaultValue);
              }
              // Same goes for the condition, add the condition COLUMN = VALUE if it does not exist
              if (addedConditions[p.columnId] !== 1) {
                query.addConditionById(p.columnId, pentaho.pda.Column.CONDITION_TYPES.EQUAL, [p.name], pentaho.pda.Column.OPERATOR_TYPES.AND, true);
              }
            }
          }, this);
        }

        var ds = this.updateDefaultDataSource(model.report, this.datasource.domainId, this.datasource.modelId, this.datasource.domainId, query.serialize());

        array.forEach(model.report.dataSources, lang.hitch(this, function (ds) {
          if (ds.hasOwnProperty("queryless")) {
            ds.queryless = this.querylessMode;
          }
        }));

        ds.queryless = this.querylessMode || (model.report.fields.length === 0 && model.report.groups.length === 0);
      }

      pentaho.pir.controller.prototype.convertDateValueForMetadata = function (param, defaultValue) {
        if (this.isDateType(param.valueType) && defaultValue && defaultValue.length === 1 && defaultValue[0]) {
          // Convert date from UTC string to Metadata-valid string

          // PIR-752 & PIR-758
          var utcDefault = defaultValue[0];
          if (has('ie') == 7 || has('ie') == 8) {
            if (utcDefault.length <= 10) { // simple check if not in UTC
              utcDefault = utcDefault.replace(/\-/g, '/'); // IE7 & IE8 Requires '/' instead of '-'
              var utcDefaultDate = new Date(utcDefault);
              utcDefault = stamp.toISOString(utcDefaultDate);

              // IE7 & IE8 requires the milliseconds in UTC or this.utcDateFormatter.parse fails
              var position = utcDefault.lastIndexOf('-'); // milliseconds insert position
              utcDefault = [utcDefault.slice(0, position), '.' + utcDefaultDate.getMilliseconds(), utcDefault.slice(position)].join(''); // insert milliseconds
            }
          }

          return [this.metadataDateFormatter.format(new Date(this.utcDateFormatter.parse(utcDefault)))];
        }
        return defaultValue;
      }

      /**
       * Check if two objects are equal. If they are arrays check that their elements are equal
       * (simple check, no multidimensional arrays)
       */
      pentaho.pir.controller.prototype.equals = function (a, b) {
        a = a || null; // convert undefined to null
        b = b || null; // convert undefined to null
        // If either is null they both better be
        if (a == null || b == null) {
          return a == b;
        }
        var eq = true;
        // If a is an array check that be is as well, and if so, check their elements for simple equality
        if (a instanceof Array) {
          if (!(b instanceof Array) || b.length !== a.length) {
            return false;
          }
          array.some(a, function (av, i) {
            var bv = b[i];
            if (av !== bv) {
              eq = false;
              return true; // break
            }
          });
        } else {
          // Check them for simple equality (non-arrays)
          eq = a === b;
        }
        return eq;
      }

      pentaho.pir.controller.prototype.updateDefaultDataSource = function (report, domainId, modelId, xmi, query) {
        var defaultDs = this.getDefaultDataSource(report);

        if (xmi != null && !xmi.endsWith(".xmi")) {
          xmi = xmi + "/metadata.xmi";
        }

        if (defaultDs == null) {
          defaultDs = model.createPmdDataSource(model.defaultDataSourceName, domainId, modelId, xmi, query);
          report.dataSources.push(defaultDs);
          // Remove the empty dataSource if this report is not empty
          if (this.reportIsNotEmpty(report)) {
            this.removeEmptyDataSource(report);
          }
        } else {
          // Update the existing
          defaultDs.domainId = domainId;
          defaultDs.modelId = modelId;
          defaultDs.xmi = xmi;
          defaultDs.query = query;
        }
        return defaultDs;
      }

      pentaho.pir.controller.prototype.removeEmptyDataSource = function (report) {
        for (var i = report.dataSources.length - 1; i >= 0; i--) {
          if (report.dataSources[i].name === "default-empty") {
            report.dataSources.splice(i, 1);
          }
        }
      }

      pentaho.pir.controller.prototype.reportIsNotEmpty  = function (report) {
        return !( report.fields == null || report.fields.length == 0 )
            && ( report.groups == null || report.groups.length == 0 );
      }

      pentaho.pir.controller.prototype.handleMessages = function (data) {
        /* START LICENSE CHECK */
        if (!this.licensed) {
          return true;
        }
        /* END LICENSE CHECK */
        var jsonMsg = this.getJsonFromXml(data);
        /* START LICENSE CHECK */
        if (jsonMsg.code == 'ERROR_0009_INVALID') {
          this.licensed = false;
        }
        /* END LICENSE CHECK */
        view.modelSelectDialog.hide();
        view.setGlassPaneOpacity(0.5);
        view.showMessageBox(jsonMsg["message"], view.getLocaleString("Error_txt"), null, null, null, null, true);
        view.setGlassPaneOpacity(0.5);
      }

      pentaho.pir.controller.prototype.getReportResponseType = function (data) {
        if (data.indexOf('<table') != 0) {
          if (this.isMessageContent(data)) {
            return "MESSAGE";
          }
          if (this.isLoginContent(data)) {
            // looks like our session expired
            return "LOGIN";
          }
          if (this.isTemplateMissing(data)) {
            // looks like our session expired
            return "TEMPLATE_MISSING";
          }

          if (this.isColumnMissing(data)) {
            return "COLUMN_MISSING";
          }

          return "UNEXPECTED";
        }
        return "VALID";
      }

      pentaho.pir.controller.prototype.handleUnexpectedErrorResponse = function (data) {
        view.showMessageBox(view.getLocaleString('UnexpectedError', [data.substr(0, 100)]), view.getLocaleString("Error_txt"));
      }

      pentaho.pir.controller.prototype.reauthenticate = function (f) {

        if (isRunningIFrameInSameOrigin && this.pentahoUserConsole.console_enabled) {
          var callback = {
            loginCallback: f
          }
          window.parent.authenticate(callback);
        } else {
          view.showMessageBox(view.getLocaleString("SessionExpiredComment"),
              view.getLocaleString("SessionExpired"),
              view.getLocaleString('Yes_txt'),
              function () {
                view.closeMessageBox(f);
              },
              view.getLocaleString('No_txt'),
              function () {
                view.closeMessageBox();
              });
        }
      }

      pentaho.pir.controller.prototype.getLimitToApply = function () {
        var result = -1;
        if (!model.report) {
          return result;
        }
        var reportRowLimit = this._initialModelLimit == null ? model.report.queryLimit : this._initialModelLimit;
        if (this._initialModelLimit == null) {
          if (reportRowLimit > 0) {
            this._initialModelLimit = reportRowLimit;
          } else {
            this._initialModelLimit = -1;
          }
        }
        var designQueryLimit =  this.command !== 'view' ? model.report.designQueryLimit : -1;
        var systemQueryLimit = model.report.systemQueryLimit;
        //Double check what do we get from server
        if (systemQueryLimit !== null && systemQueryLimit > 0) {
          result = systemQueryLimit;
          if (reportRowLimit !== null && reportRowLimit > 0) {
            result = Math.min(reportRowLimit, systemQueryLimit);
          } else if (designQueryLimit !== null && designQueryLimit > 0) {
            result = Math.min(designQueryLimit, systemQueryLimit);
          }
        } else {
          if (reportRowLimit !== null && reportRowLimit > 0) {
            result = reportRowLimit;
          } else if (designQueryLimit !== null && designQueryLimit > 0) {
            result = designQueryLimit;
          }
        }
        return result;
      }

      pentaho.pir.controller.prototype.updateReport = function () {

        //BISERVER-1225
        var isCanceled = false;
        var isFirstContAvStatus = true;
        var isIframeContentSet = false;
        this._isFinished = false;
        this._requestedPage = this.acceptedPage;

        domClass.add('reportPageOutline', 'hidden');

        if (this._isAsync && this._currentReportStatus == "CANCELED" && this._showProgressDialogTimer) {
          clearTimeout(this._showProgressDialogTimer);
        }

        var currentUuid;
        if ((this._isAsync && controller.command !== 'new') || (this._isAsync && controller._isNewReportGenerated)) {
          $( "#notification-close" ).on( "click", lang.hitch( this,  function() {
            domClass.add('notification-screen', 'hidden');
          }));

          var dlg = registry.byId('feedbackScreen');
          var handleCancelCallback = dojo.hitch(this, function (result) {
            isCanceled = true;
          });
          dlg.setTitle(_Messages.getString('ScreenTitle'));
          dlg.setText(_Messages.getString('FeedbackScreenActivity'));
          dlg.setText2(_Messages.getString('FeedbackScreenPage'));
          dlg.setText3(_Messages.getString('FeedbackScreenRow'));
          dlg.setCancelText(_Messages.getString('ScreenCancel'));
          dlg.hideBackgroundBtn();

          dlg.callbacks = [
            function feedbackscreenDone() {
              this.cancel(this._currentReportStatus, this._currentReportUuid);
              view.hideGlassPane();
              dlg.hide();
            }.bind(this)
          ];

          var me = this;
          this._showProgressDialogTimer = setTimeout(
              function () {
                if (!me._isFinished) {
                  dlg.show();
                }
              }, this._dialogThreshold);
        }

        if (!model.report) {
          return;
        } else if (view._getStateProperty("promptNeeded")) {
          // We're no longer in the middle of an undo operation - user input is required by the user
          this.stopUndo();
          view.openParameterPanel();
          this._isFinished = true;
          return;
        }

        view.addBusy();
        view.showGlassPane();

        // Determine if report structure changed enough to warrant resetting the page number
        if (this.isReportStructureSignificantlyChanged()) {
          this.resetPageNumber();
        }

        var rowLimit = registry.byId('rowLimitControl');

        //Init row limit. Don't do it for a new report until the first field is added.
        if (controller.command != 'new' || (controller.command == 'new' && controller.sequenceNumberCounter.seqNum > 0 && model.report.dataSources.length > 0 )) {
          var initialCall = !rowLimit._isInitialized();
          var toApply = this.getLimitToApply();

          rowLimit.apply(model.report.systemQueryLimit, -1, false);
          if (initialCall) {
            rowLimit._selectedRowLimit = toApply;
            rowLimit._initUI();
            this.lastSaveQueryLimit = this.lastSaveQueryLimit == null ? toApply : model.report.queryLimit;
            model.report.queryLimit = rowLimit._getRowLimit();
            rowLimit.bindChange(dojo.hitch(this, function (selectedLimit) {
              var me = this;
              me._isFinished = true;
              clearTimeout(me._showProgressDialogTimer);
              me.setRowLimit(selectedLimit);
            }));
          }
        }

        var filtersBeforeUpdate = model.report.filters;
        // Add unique sourceReport key for caching
        model.report.sourceReport = this.findUrlParam('path', document.location.href) + '/' + this.findUrlParam('file', document.location.href);

        var jsonResult = json.stringify(model.report);

        var sequenceNumber = this.sequenceNumberCounter.increment();

        //The parameters to pass to xhrPost, the message, and the url to send it to
        //Also, how to handle the return and callbacks.
        var promise;
        var func = lang.hitch(this, function (response) {
          domClass.remove('reportPageOutline', 'hidden');
          this._isNewReportGenerated = true;
          var data = response.data;
          var immediateUndo = lang.hitch(this, function () {
            // TODO Undo the correct undo item using the sequence number, not just the last one
            this.undo(true); // , sequenceNumber );
          });

          switch (this.getReportResponseType(data)) {
            case "MESSAGE":
              view.removeBusy();
              this.handleMessages(data)
              immediateUndo();
              return;
            case "LOGIN":
              view.removeBusy();
              this.reauthenticate(lang.hitch(this, function () {
                this.startUndo();
                this.updateReport();
              }));
              return;
            case "VALID":
              // Fall through, we're good.
              break;
            case "TEMPLATE_MISSING":
              view.removeBusy();
              immediateUndo();
              view.showMessageBox(view.getLocaleString('UnexpectedError', [data.substr(40, 200)]), view.getLocaleString("Error_txt"));
              if (!view.isShowTemplatePickerOpen()) {
                view.showTemplatePicker();
              }
              return;
            case "COLUMN_MISSING":
              view.removeBusy();
              this.handleMessages(data)
              return;
            case "UNEXPECTED":
            default:
              view.removeBusy();
              immediateUndo();
              this.handleUnexpectedErrorResponse(data);
              return;
          }

          var metadata;
          var onError = lang.hitch(this, function () {
            // TODO Undo the correct undo item using the sequence number, not just the last one
            this.undo(true);
            view.removeBusy();
            view.setReportError(view.getLocaleString('InvalidResponseTryAgain'));
          });
          var tmp = data.split("@@PIR_METADATA_BEGIN@@");
          if (tmp.length != 2) {
            onError();
            return;
          }
          data = tmp[0];
          try {
            metadata = JSON.parse(entities.decode(tmp[1]));
            if (metadata.sequenceNumber !== this.sequenceNumberCounter.get() && !this._isAsync) {
              // Ignore this response, we've submitted another already
              view.removeBusy();
              return;
            }
            controller.setReport(metadata.thinSpec);
            // Don't worry about updating the json string for the sake of the undo stack. It was good enough to get us
            // a valid report so it'll be good enough to send back to the server in the event of an undo.

            // PIR-747
            if (filtersBeforeUpdate.length != metadata.thinSpec.filters.length) {
              controller.undoStack[controller.undoPosition] = json.stringify(metadata.thinSpec);
            }
          } catch (e) {
            onError();
            return;
          }
          view.setReportContent(data);
          var pageCount = parseInt(response.getHeader("Page-Count"));
          view.pageNumberControl.setPageCount(pageCount);

          if(!this._isAsync){
            var isLimitReached = response.getHeader("Query-Limit-Reached") !== null;
            rowLimit.apply(model.report.systemQueryLimit, -1, isLimitReached);
          }

          view.removeBusy();
          if (controller.command != 'new' || (controller.command == 'new' && (controller.sequenceNumberCounter.seqNum > 1 || model.report.dataSources.length > 1))) {
            while(view.glassPaneStack > 0) {
              view.hideGlassPane();
            }
          }
        });

        var content = {};
        lang.mixin(content, this.getParameterValues());
        lang.mixin(content, {
          json: jsonResult,
          rowLimit: model.report.queryLimit,
          acceptedPage: this.acceptedPage,
          renderMode: "REPORT",
          command: (this.command == null ? "edit" : this.command),
          sequenceNumber: sequenceNumber
        });

        // BISERVER-9098
        if(this.findUrlParam('command', document.location.href) != 'new'){
          lang.mixin(content, {
            solution: this.findUrlParam('solution', document.location.href),
            path: this.findUrlParam('path', document.location.href),
            name: this.findUrlParam('file', document.location.href)
          });
        }
        // PIR-1021 - use user-defined filters if there are parameters in url
        for (var i = 0; i < filtersBeforeUpdate.length; i++) {
          if (filtersBeforeUpdate[i].parameterName != null && view.getUrlParameters()[filtersBeforeUpdate[i].parameterName] != null) {
            lang.mixin( content, json.parse( '{"' + filtersBeforeUpdate[i].parameterName + '": ' + JSON.stringify(filtersBeforeUpdate[i].value) + '}' ) );
          }
        }
        if (!this.isUndoing) {
          // TODO Create undo item with sequence number so we can undo specific requests
          this.addToUndo(jsonResult); // , sequenceNumber );
        }
        this.stopUndo();

        if ((this._isAsync && controller.command !== 'new') || (this._isAsync && controller._isNewReportGenerated)) {
          var handleResultCallback = dojo.hitch(this, function (result) {
            if (!isCanceled) {
              var resultJson;
              try {
                resultJson = JSON.parse(result.data === undefined ? result : result.data);
              } catch (e) {
                view.removeBusy();
                view.setReportError(e);
                view.hideGlassPane();
                dlg.hide();
                return;
              }
              if (resultJson.status != null) {

                rowLimit.apply( model.report.systemQueryLimit, -1, resultJson.isQueryLimitReached);

                if (resultJson.activity != null) {
                  dlg.setText(_Messages.getString(resultJson.activity) + '...');
                }
                dlg.setText2(_Messages.getString('FeedbackScreenPage') + ': ' + resultJson.page);
                dlg.setText3(_Messages.getString('FeedbackScreenRow') + ': ' + resultJson.row + ' / ' + resultJson.totalRows);
                this._currentReportStatus = resultJson.status;
                this._currentReportUuid = resultJson.uuid;
                this._currentStoredPagesCount = resultJson.generatedPage;

                progressBar.set({value: resultJson.progress});

                var handleContAvailCallback = dojo.hitch(this, function (result2) {
                  var resultJson2;
                  try {
                    resultJson2 = JSON.parse(result2.data === undefined ? result2 : result2.data);
                  } catch (e) {
                    view.removeBusy();
                    view.setReportError(e);
                    view.hideGlassPane();
                    dlg.hide();
                    return;
                  }
                  if (resultJson2.status == "QUEUED" || resultJson2.status == "WORKING") {
                    var urlStatus2 = CONTEXT_PATH + "plugin/pentaho-interactive-reporting/api/jobs/" + resultJson2.uuid + '/status';
                    setTimeout(function () {
                      pentahoGet(urlStatus2, "", handleContAvailCallback);
                    }, this._pollingInterval);
                  } else if (resultJson2.status == "FINISHED") {
                    promise = request(CONTEXT_PATH + "plugin/pentaho-interactive-reporting/api/jobs/" + resultJson2.uuid + '/content', {
                      data: content,
                      handleAs: "text",
                      preventCache: true,
                      method: "POST"
                    }).response.then(
                        function (response) {
                          this._updatedIFrameSrc = true;
                          dlg.hide();
                          view.hideGlassPane();
                          isIframeContentSet = true;
                          $('#notification-message').html(_Messages.getString('LoadingPage'));
                          $('#notification-screen').css("z-index", 100);
                          if (this._currentReportStatus && this._currentReportStatus != 'FINISHED' && this._currentReportStatus != 'FAILED' && this._currentReportStatus != 'CANCELED') {
                            domClass.remove('notification-screen', 'hidden');
                          }
                          this._previousPage = resultJson2.page;
                          func(response);
                        }.bind(this),
                        function (err) {
                          view.removeBusy();
                          view.setReportError(err);
                          view.hideGlassPane();
                          dlg.hide();
                        });
                  }
                });

                if (resultJson.status == "QUEUED" || resultJson.status == "WORKING") {
                  var urlStatus = CONTEXT_PATH + "plugin/pentaho-interactive-reporting/api/jobs/" + resultJson.uuid + '/status';
                  setTimeout(function () {
                    pentahoGet(urlStatus, "", handleResultCallback);
                  }, this._pollingInterval);
                } else if (resultJson.status == "CONTENT_AVAILABLE") {
                  if (isFirstContAvStatus) {
                    isFirstContAvStatus = false;
                    if (this._currentStoredPagesCount > this._requestedPage) {
                      //Prevent double content update on 1st page
                      this._requestedPage = -1;
                      promise = request(CONTEXT_PATH + "api/repos/pentaho-interactive-reporting/iadhocasync", {
                        data: content,
                        handleAs: "text",
                        preventCache: true,
                        method: "POST"
                      }).response.then(handleContAvailCallback, function (err) {
                        view.removeBusy();
                        view.setReportError(err);
                      });
                    }

                    var urlStatus = CONTEXT_PATH + "plugin/pentaho-interactive-reporting/api/jobs/" + resultJson.uuid + '/status';
                    setTimeout(function () {
                      pentahoGet(urlStatus, "", handleResultCallback);
                    }, this._pollingInterval);
                  } else {
                    if ((this._cachedReportCanceled && this._requestedPage == 0) || ((this._requestedPage >= 0) && (this._currentStoredPagesCount > this._requestedPage))) {
                      lang.mixin(content, {
                        acceptedPage: this._requestedPage,
                      });
                      //BACKLOG-9814 distinguish initial 1st page from going back to the 1st page
                      this._requestedPage = -1;
                      this._cachedReportCanceled = false;

                      promise = request(CONTEXT_PATH + "api/repos/pentaho-interactive-reporting/iadhocasync", {
                        data: content,
                        handleAs: "text",
                        preventCache: true,
                        method: "POST"
                      }).response.then(handleContAvailCallback, function (err) {
                        view.removeBusy();
                        view.setReportError(err);
                      });

                      registry.byId('reportGlassPane').hide();
                    }

                    $('#notification-message').html(_Messages.getString('LoadingPage') + " " + resultJson.page + " " + _Messages.getString('Of') + " " + resultJson.totalPages);
                    registry.byId('reportGlassPane').setText(_Messages.getString('LoadingPage') + " " + resultJson.page + " " + _Messages.getString('Of') + " " + resultJson.totalPages);

                    var urlStatus = CONTEXT_PATH + 'plugin/pentaho-interactive-reporting/api/jobs/' + resultJson.uuid + '/status';
                    setTimeout(function () {
                      pentahoGet(urlStatus, "", handleResultCallback);
                    }, this._pollingInterval);
                  }
                } else if (resultJson.status == "FINISHED") {
                  // do not need to request content for the canceled job
                  if (!isIframeContentSet && (!this._canceledReportUuid || this._canceledReportUuid != resultJson.uuid)) {
                    promise = request(CONTEXT_PATH + "plugin/pentaho-interactive-reporting/api/jobs/" + resultJson.uuid + '/content', {
                      data: content,
                      handleAs: "text",
                      preventCache: true,
                      method: "POST"
                    }).response.then(
                        function (response) {
                          this._updatedIFrameSrc = true;
                          view.hideGlassPane();
                          dlg.hide();
                          func(response);
                        },
                        function (err) {
                          view.removeBusy();
                          view.setReportError(err);
                          view.hideGlassPane();
                          dlg.hide();
                        });
                  }

                  if ( this._requestedPage > 0 ) {
                    // main request finished before requested page was stored in cache
                    if(content.acceptedPage != this._requestedPage){
                      lang.mixin(content, {
                        acceptedPage: this._requestedPage
                      });
                      this._requestedPage = 0;
                      promise = request(CONTEXT_PATH + "api/repos/pentaho-interactive-reporting/iadhocasync", {
                        data: content,
                        handleAs: "text",
                        preventCache: true,
                        method: "POST"
                      }).response.then(handleContAvailCallback, function (err) {
                        view.removeBusy();
                        view.setReportError(err);
                        view.hideGlassPane();
                        dlg.hide();
                      });
                    }
                  }

                  this._isFinished = true;
                  domClass.add('notification-screen', 'hidden');
                  registry.byId('reportGlassPane').hide();

                } else if (resultJson.status == "FAILED") {
                  if (typeof resultJson.errorMessage !== 'undefined' && resultJson.errorMessage !== null) {
                    view.setReportError(resultJson.errorMessage);
                  } else {
                    view.setReportError(_Messages.getString('FatalErrorTitle'));
                  }
                  view.hideGlassPane();
                  dlg.hide();
                  domClass.add('notification-screen', 'hidden');
                  this._isFinished = true;
                } else if(resultJson.status = 'CANCELED') {
                  domClass.add('notification-screen', 'hidden');
                }
              }
              return resultJson;
            }
          });

          //Navigation on report in progress section
          if (this._currentReportStatus && this._currentReportStatus != 'FINISHED' && this._currentReportStatus != 'FAILED' && this._currentReportStatus != 'CANCELED') {
            //In progress
            if (this._currentStoredPagesCount > this._requestedPage) {
              //Page available
              this._isFinished = true;
            } else {
              //Need to wait for page
              var urlRequestPage = CONTEXT_PATH + 'plugin/pentaho-interactive-reporting/api/jobs/' + this._currentReportUuid
                  + '/requestPage/' + this._requestedPage;
              pentahoGet(urlRequestPage, "");
              this._isFinished = true;

              var dlg2 = registry.byId('reportGlassPane');
              dlg2.setTitle(_Messages.getString('ScreenTitle'));
              dlg2.setText(_Messages.getString('LoadingPage'));
              dlg2.setButtonText(_Messages.getString('ScreenCancel'));
              dlg2.callbacks = [function reportGlassPaneDone() {
                this._requestedPage = this._previousPage;
                var pageContr = registry.byId('pageNumberControl');
                pageContr.setPageNumber(this._previousPage);
                this._cachedReportCanceled = true;
                dlg2.hide();
                view.removeBusy();
                view.hideGlassPane();
              }.bind(this)];
              dlg2.show();
            }
          } else {
            var me = this;
            //Not started or finished
            var spawnJobCallback = dojo.hitch(this, function (data) {
              if (data && data.data) {
                try {
                  var reservedId = JSON.parse(data.data).reservedId;
                  me._currentReportUuid = reservedId;
                  content.reservedId = reservedId;
                } catch (ignored) {
                }
              }
              promise = request(CONTEXT_PATH + "api/repos/pentaho-interactive-reporting/iadhocasync", {
                data: content,
                handleAs: "text",
                preventCache: true,
                method: "POST"
              }).response.then(handleResultCallback, function (err) {
                view.removeBusy();
                view.setReportError(err);
              });
            });
            promise = request(CONTEXT_PATH + 'plugin/pentaho-interactive-reporting/api/jobs/reserveId', {
              handleAs: "text",
              preventCache: true,
              method: "POST"
            }).response.then(spawnJobCallback, function (err) {
              spawnJobCallback();
            });
          }
        } else {

          this.sendRequest(CONTEXT_PATH + "api/repos/pentaho-interactive-reporting/iadhoc", {
            data: content,
            handleAs: "text",
            preventCache: true,
            method: "POST"
          }).response.then(func, function(err) {
            view.removeBusy();
            view.setReportError(err);
          });
        }
      }

      pentaho.pir.controller.prototype.cancel = function (status, uuid) {
        var cancelUrl = CONTEXT_PATH + "plugin/pentaho-interactive-reporting/api/jobs/" + uuid + '/cancel';
        pentahoGet(cancelUrl, "");
        view.removeBusy();
        view.updateUndoRedoButtons();
      }

      pentaho.pir.controller.prototype.resetPageNumber = function () {
        this.resettingPageNumber = true;
        try {
          view.pageNumberControl.reset();
        } finally {
          this.resettingPageNumber = false;
        }
      }

      pentaho.pir.controller.prototype.isRowLimitChanged = function () {
        var rowLimit = registry.byId('rowLimitControl');
        if (!rowLimit._isInitialized()) {
          return true;
        }
        return rowLimit._selectedRowLimit != rowLimit._previousRowLimit;
      }

      /**
       * Determines if the report structure has changed significantly since last update.
       * A significant change is one of the following:
       * - Fields added or removed
       * - Row Limit changed
       * - Margin, format, orientation changed
       * - Template changed
       * - Groups added or removed
       * - Groups reordered
       * - Filters added, removed, or changed
       * - Queryless mode changed (Model's Datasource)
       */
      pentaho.pir.controller.prototype.isReportStructureSignificantlyChanged = function () {
        var s = this.getPreviousState();
        if (!s) {
          return true;
        } else {
          var resetNeeded = this.haveFieldsAndGroupsSignificantlyChanged(model.report, s);
          // Orientation, Page Format, and Margins are set to null or -1 to indicate "pull from template". These values
          // should not affect whether the report has significantly changed or not because they are simply "not set".
          resetNeeded = resetNeeded || (s.orientation != -1 && model.report.orientation != s.orientation);
          resetNeeded = resetNeeded || (s.marginTop != -1 && model.report.marginTop != s.marginTop);
          resetNeeded = resetNeeded || (s.marginBottom != -1 && model.report.marginBottom != s.marginBottom);
          resetNeeded = resetNeeded || (s.marginLeft != -1 && model.report.marginLeft != s.marginLeft);
          resetNeeded = resetNeeded || (s.marginRight != -1 && model.report.marginRight != s.marginRight);
          resetNeeded = resetNeeded || (s.pageFormat != null && model.report.pageFormat != s.pageFormat);
          resetNeeded = resetNeeded || model.report.templateName != s.templateName;
          // Was the queryless mode toggled
          if (!resetNeeded) {
            var oldDefaultDs = this.getDefaultDataSource(s);
            var newDefaultDs = this.getDefaultDataSource(model.report);
            resetNeeded = oldDefaultDs == null || oldDefaultDs.queryless !== newDefaultDs.queryless;
          }

          // get current filters
          var filters = [];
          if (view.filterStore) {
            var filterConditions = view.filterStore.getConditions();
            filters = array.map(filterConditions, function (item) {
              return item.value
            });
          }

          // get old filters
          var oldFilters = array.filter(s.filters, function (item) {
            return ((item.column != null) ? true : false)
          });

          // find filter from old filters
          var findFilter = function (filter) {
            var target = null;
            array.some(oldFilters, function (f, i) {
              // is this logic enough???
              if (filter.column == f.column &&
                  filter.operator == f.operator &&
                  filter.parameterName == f.parameterName) {
                target = filter;
                return true; // break out of array.some
              }
            });
            return target;
          };

          resetNeeded = resetNeeded || filters.length != oldFilters.length; // PIR-744
          if (!resetNeeded) {
            // Check for changed filters
            array.some(filters, function (filter, i) {
              var oldFilter = findFilter(filter);
              if (oldFilter == null) {
                resetNeeded = true;
                return true; // break out of array.some
              }
              resetNeeded = resetNeeded || (oldFilter.field != filter.field);
              resetNeeded = resetNeeded || (oldFilter.operator != filter.operator);
              if (oldFilter.value && filter.value) { ////// TODO - review this logic
                resetNeeded = resetNeeded || (oldFilter.value.length != filter.value.length);
              }
              if (!resetNeeded) {
                if (filter.value) {
                  array.some(filter.value, function (value, i) {
                    var oldValue = oldFilter.value[i];
                    if (value != oldValue) {
                      resetNeeded = true;
                      return true; // break out of array.some
                    }
                  });
                }
              } else {
                return true; // break out of array.some
              }
            });
          }
          if (!resetNeeded) {
            array.some(model.report.parameters, lang.hitch(this, function (param, i) {
              var oldParam = s.parameters[i];
              resetNeeded = oldParam == undefined || !this.equals(param.defaultValue, oldParam.defaultValue);
              if (resetNeeded) {
                return true; // break
              }
            }));
          }
          return resetNeeded;
        }
      }

      pentaho.pir.controller.prototype.isReportFieldsOrGroupsSignificantlyChanged = function () {
        var s = this.getPreviousState();
        return s ? this.haveFieldsAndGroupsSignificantlyChanged(model.report, s) : true;
      }

      pentaho.pir.controller.prototype.haveFieldsAndGroupsSignificantlyChanged = function (newReport, oldReport) {
        var resetNeeded = oldReport.fields.length != newReport.fields.length;
        resetNeeded = resetNeeded || (oldReport.groups.length != newReport.groups.length);
        if (!resetNeeded) {
          // Check for reordered groups
          array.some(newReport.groups, function (group, i) {
            var oldGroup = oldReport.groups[i];
            if (oldGroup.field != group.field) {
              resetNeeded = true;
              return true; // break out of array.some
            }
          });
        }
        return resetNeeded;
      }

      pentaho.pir.controller.prototype.setFontName = function (primaryItem, fontName) {
        var fmt = this.getFormatting(primaryItem, true);
        fmt.fontName = fontName;
        this.formattingModified = true;
      }

      pentaho.pir.controller.prototype.setFontSize = function (primaryItem, fontSize) {
        var fmt = this.getFormatting(primaryItem, true);
        fmt.fontSize = fontSize;
        this.formattingModified = true;
      }

      pentaho.pir.controller.prototype.setColor = function (primaryItem, fontColorStr) {
        var fmt = this.getFormatting(primaryItem, true);
        fmt.fontColorStr = fontColorStr;
        this.formattingModified = true;
      }

      pentaho.pir.controller.prototype.setFormattingSetManually = function (primaryItem, bool) {
        var obj = model.report.groups[primaryItem.idx];
        obj.formattingSetManually = bool;
      }

      pentaho.pir.controller.prototype.refresh = function () {
        //view.prepareAdvancedFilters();
        this.prepareReport();

        if(!view.isValidFilterConditions()){
            view.refreshFilterItems(true);
            return;
        }

        this.updateReport();
      }

      pentaho.pir.controller.prototype.setBackgroundColor = function (primaryItem, colorStr) {
        var fmt = this.getFormatting(primaryItem, true);
        fmt.backgroundColorStr = colorStr;
        this.formattingModified = true;
      }

      pentaho.pir.controller.prototype.getIsFormatSet = function (primaryItem, property) {
        return this.getIsFormatValue(primaryItem, property, true);
      }

      pentaho.pir.controller.prototype.getFormatting = function (primaryItem, create) {
        var obj, fmtName;
        if (primaryItem.type == 'fields') {
          obj = model.report.fields[primaryItem.idx];
          fmtName = 'headerFormat';
        }
        else if (primaryItem.type == 'cell') {
          obj = model.report.fields[primaryItem.idx];
          fmtName = 'itemFormat';
        }
        else if (primaryItem.type == 'groupHeaders') {
          obj = model.report.groups[primaryItem.idx];
          fmtName = 'headerFormat';
        }
        else if (primaryItem.type == 'reportFooterSummary') {
          obj = model.report.fields[primaryItem.idx];
          fmtName = 'reportSummaryFormat';
        }
        else if (primaryItem.type == 'groupSummary') {
          var summaryFormats = model.report.groups[primaryItem.idx].summaryFormats;
          for (var i = 0; i < summaryFormats.length; i++) {
            if (summaryFormats[i].field == primaryItem.field.field) {
              obj = summaryFormats[i];
            }
          }
          if (obj == null) {
            obj = model.createSummaryFormat(primaryItem.group, primaryItem.field.field);
            model.report.groups[primaryItem.idx].summaryFormats.push(obj);
          }
          fmtName = 'format';
        } else {
          obj = model.report[primaryItem.type][primaryItem.idx];
          fmtName = 'format';
        }
        var fmt = obj ? obj[fmtName] : null;
        if (fmt == null && create) {
          fmt = model.createFormat();
          obj[fmtName] = fmt;
        }
        return fmt;
      }

      pentaho.pir.controller.prototype.setFormatting = function (primaryItem, format) {
        if (primaryItem.type == 'fields') {
          return model.report.fields[primaryItem.idx].headerFormat = format;
        }
        else if (primaryItem.type == 'cell') {
          return model.report.fields[primaryItem.idx].itemFormat = format;
        }
        else if (primaryItem.type == 'groupHeaders') {
          model.report.groups[primaryItem.idx].headerFormat = format;
        }
        else if (primaryItem.type == 'groupSummary') {
          var summaryFormats = model.report.groups[primaryItem.idx].summaryFormats;
          for (var i = 0; i < summaryFormats.length; i++) {
            if (summaryFormats[i].field == primaryItem.field.field) {
              obj = summaryFormats[i];
            }
          }
          if (obj == null) {
            obj = model.createSummaryFormat(primaryItem.group, primaryItem.field.field);
            model.report.groups[primaryItem.idx].summaryFormats.push(obj);
          }
          obj.format = format;
        } else if (primaryItem.type == 'reportFooterSummary') {
          model.report.fields[primaryItem.idx].reportSummaryFormat = format;
        } else {
          var list = model.report[primaryItem.type];
          if (list[primaryItem.idx]) {
            return list[primaryItem.idx].format = format;
          }
        }
        this.formattingModified = true;
      }

      pentaho.pir.controller.prototype.getIsFormatValue = function (primaryItem, property, value) {
        var fmt = this.getFormatting(primaryItem, false);
        return fmt != null && fmt[property] != null && fmt[property] == value;
      }

      pentaho.pir.controller.prototype.getDataFormat = function (primaryItem) {
        if (primaryItem.type == 'cell') {
          return model.report.fields[primaryItem.idx].dataFormat;
        } else if (primaryItem.type == 'reportFooterSummary') {
          return model.report.fields[primaryItem.idx].reportSummaryDataFormat;
        } else if (primaryItem.type == 'groupSummary') {
          var summaryFormats = model.report.groups[primaryItem.idx].summaryFormats;
          var obj = null;
          for (var i = 0; i < summaryFormats.length; i++) {
            if (summaryFormats[i].field == primaryItem.field.field) {
              obj = summaryFormats[i];
            }
          }
          if (obj != null) {
            return obj.dataFormat;
          }
        }
        return null;
      }

      pentaho.pir.controller.prototype.setDataFormat = function (primaryItem, value) {
        if (value == '') {
          var column = this.datasource.getColumnById(primaryItem.field.field);
          if (primaryItem.type == 'reportFooterSummary') {
            model.report.fields[primaryItem.idx].reportSummaryDataFormat = column.formatMask;
          } else {
            model.report.fields[primaryItem.idx].dataFormat = column.formatMask;
          }
        }
        else if (primaryItem.type == 'cell') {
          model.report.fields[primaryItem.idx].dataFormat = value;
        } else if (primaryItem.type == 'reportFooterSummary') {
          model.report.fields[primaryItem.idx].reportSummaryDataFormat = value;
        } else if (primaryItem.type == 'groupSummary') {
          var summaryFormats = model.report.groups[primaryItem.idx].summaryFormats;
          var obj = null;
          for (var i = 0; i < summaryFormats.length; i++) {
            if (summaryFormats[i].field == primaryItem.field.field) {
              obj = summaryFormats[i];
            }
          }
          if (obj == null) {
            obj = model.createSummaryFormat(primaryItem.group, primaryItem.field.field);
            model.report.groups[primaryItem.idx].summaryFormats.push(obj);
          }
          obj.dataFormat = value;
        }
        this.formattingModified = true;
      }

      pentaho.pir.controller.prototype.toggleBold = function (primaryItem) {
        var bold = !this.getIsFormatSet(primaryItem, 'fontBold');
        var fmt = this.getFormatting(primaryItem, true);
        fmt.fontBold = bold;
        this.formattingModified = true;
      }

      pentaho.pir.controller.prototype.toggleItalic = function (primaryItem) {
        var italic = !this.getIsFormatSet(primaryItem, 'fontItalic')
        var fmt = this.getFormatting(primaryItem, true);
        fmt.fontItalic = italic;
        this.formattingModified = true;
      }

      pentaho.pir.controller.prototype.alignColumn = function (primaryItem, alignment) {
        var fmt = this.getFormatting(primaryItem, true);
        fmt.horizontalAlignmentName = alignment
        this.formattingModified = true;
      }

      pentaho.pir.controller.prototype.removeAllFormatting = function () {
        for (var idx = 0; idx < model.report.fields.length; idx++) {
          this.removeFormatting({ field: model.report.fields[idx], type: 'fields', idx: idx});
          this.removeFormatting({ field: model.report.fields[idx], type: 'cell', idx: idx});
          this.removeFormatting({ field: model.report.fields[idx], type: 'reportFooterSummary', idx: idx});
        }
        for (var idx = 0; idx < model.report.groups.length; idx++) {
          this.removeFormatting({ field: model.report.groups[idx], type: 'groupSummary', idx: idx});
          this.removeFormatting({ field: model.report.groups[idx], type: 'groupHeaders', idx: idx});
        }
        for (var idx = 0; idx < model.report.reportFooters.length; idx++) {
          this.removeFormatting({ type: 'reportFooters', idx: idx});
        }
        for (var idx = 0; idx < model.report.reportTitles.length; idx++) {
          this.removeFormatting({ type: 'reportTitles', idx: idx});
        }
        for (var idx = 0; idx < model.report.pageHeaders.length; idx++) {
          this.removeFormatting({ type: 'pageHeaders', idx: idx});
        }
        for (var idx = 0; idx < model.report.pageFooters.length; idx++) {
          this.removeFormatting({ type: 'pageFooters', idx: idx});
        }
        // reset page margins
        this.setMargins(-1, -1, -1, -1);
        this.formattingModified = false;
      }

      pentaho.pir.controller.prototype.removeFormatting = function (primaryItem) {
        if (primaryItem.type == 'fields') {
          model.report.fields[primaryItem.idx].headerFormat = this.createDefaultFormatting(primaryItem.field.field);
        }
        else if (primaryItem.type == 'cell') {
          model.report.fields[primaryItem.idx].itemFormat = this.createDefaultFormatting(primaryItem.field.field);
        }
        else if (primaryItem.type == 'groupSummary') {
          model.report.groups[primaryItem.idx].summaryFormats = [];
        }
        else if (primaryItem.type == 'groupHeaders') {
          model.report.groups[primaryItem.idx].headerFormat = null;
        }
        else if (primaryItem.type == 'reportFooterSummary') {
          model.report.fields[primaryItem.idx].reportSummaryFormat = this.createDefaultFormatting(primaryItem.field.field);
        } else {
          var list = model.report[primaryItem.type];
          if (list[primaryItem.idx]) {
            list[primaryItem.idx].format = null;
          }
        }
      }

      pentaho.pir.controller.prototype.createDefaultFormatting = function (fieldId) {
        // it would be cool if i could get more metadata such as font/colors/etc
        var column = this.datasource.getColumnById(fieldId);
        var thinFormat = model.createFormat();
        var align = column.horizontalAlignment;
        if (align == 'CENTERED') {
          thinFormat.horizontalAlignmentName = 'CENTER';
        } else {
          thinFormat.horizontalAlignmentName = align;
        }
        return thinFormat;
      }

      pentaho.pir.controller.prototype.removeSorting = function (fieldName, isGroup) {
        var sorts = null;
        if (isGroup) {
          sorts = model.report.groupSorts;
        } else {
          sorts = model.report.fieldSorts;
        }

        for (var sortNo = 0; sortNo < sorts.length; sortNo++) {
          if (sorts[sortNo].field == fieldName) {
            sorts.splice(sortNo, 1);
          }
        }
      }

      pentaho.pir.controller.prototype.addSorting = function (fieldName, direction, isGroup, position) {

        var sort = null;
        var sorts = null;

        if (isGroup) {
          sorts = model.report.groupSorts;
        } else {
          sorts = model.report.fieldSorts;
        }

        // see if this field sorted already
        for (var idx = 0; idx < sorts.length; idx++) {
          if (sorts[idx].field == fieldName) {
            sort = sorts[idx];
          }
        }

        if (sort == null) {
          // create a new sort
          var sort = model.createSort();
          sort.field = fieldName;
          if (position != -1) {
            sorts.splice(position, 0, sort);
          } else {
            sorts.push(sort);
          }
        }
        sort.direction = direction;

        return sort;
      }

      pentaho.pir.controller.prototype.moveSorting = function (idx, moveUp, isGroup) {

        var sorts = null;
        if (isGroup) {
          sorts = model.report.groupSorts;
        } else {
          sorts = model.report.fieldSorts;
        }

        if (isNaN(idx) || idx < 0 || idx >= sorts.length || (idx == 0 && moveUp) || (idx == sorts.length - 1 && !moveUp)) {
          // this is an invalid index
          return;
        }
        // grab the sorting to be moved
        var sort = sorts.splice(idx, 1);
        if (moveUp) {
          // add the sort back in, higher up the list
          sorts.splice(parseInt(idx) - 1, 0, sort[0]);
        } else {
          // add the sort back in, lower down in the list
          sorts.splice(parseInt(idx) + 1, 0, sort[0]);
        }

      }

      pentaho.pir.controller.prototype.numberComparator = function (a, b) {
        return a - b;
      }

      pentaho.pir.controller.prototype.removeColumns = function (indices) {
        array.forEach(indices.sort(this.numberComparator).reverse(), function (fieldIdx) {
          this.removeColumn(fieldIdx);
        }, this);
      }

      pentaho.pir.controller.prototype.removeColumn = function (idx) {
        var column = model.report.fields[idx];

        // PIR-839
        // Verify if the column being removed will leave the report in a state that
        // will lead to an invalid SQL query.
        if (column.fieldAggregation == 'NONE' || column.fieldAggregation == null) {
          if (this.mixedFilterAggTypesInReport()) {
            var columnFilter = _.find(model.report.filters, function(f) {
              return f.column == column.field;
            });

            if (columnFilter) {
              if (columnFilter.selectedAggType == 'NONE') {
                view.showMessageBox(
                    view.getLocaleString("UnableToRemoveField_Message"),
                    view.getLocaleString("UnableToRemoveField_Title"));
                return;
              }
            }
          }
        }

        // remove any sorting that was applied to this field
        var field = model.report.fields.splice(idx, 1)[0];

        controller.removeSorting(field.field, false);
        controller.redistributeFieldWidths(100 * (100 / (100 - field.width.value)));
      }

      pentaho.pir.controller.prototype.addGroupField = function (columnId, autoRefresh) {
        this.addGroupFieldAtPosition(columnId, -1, 'asc', autoRefresh);
      }

      pentaho.pir.controller.prototype.addGroupFieldAtPosition = function (columnId, position, sortDirection, autoRefresh) {

        // add group
        var column = this.datasource.getColumnById(columnId);
        if (column != null) {
          var group = model.createGroup(column.id, column.name);
          if (position == -1 || model.report.groups.length == 0) {
            // add the new field to the end
            model.report.groups.push(group);
          } else {
            // insert the new field
            model.report.groups.splice(position, 0, group);
          }

          // add default sorting
          this.addSorting(column.id, sortDirection, true, position);
        }
        if (autoRefresh) {
          this.cancelCurrentAsyncJob();
          this.refresh();
        }
      }

      pentaho.pir.controller.prototype.addDetailField = function (columnId, autoRefresh) {
        this.addDetailFieldAtPosition(columnId, -1, autoRefresh);
      }

      pentaho.pir.controller.prototype.addDetailFieldAtPosition = function (columnId, position, autoRefresh) {

        var column = this.datasource.getColumnById(columnId);
        if (column != null) {
          var field = model.createField(column.id, column.name);
          field.fieldAggregation = column.defaultAggregation;
          var itemFormat = null;
          var headerFormat = null;
          var reportSummaryFormat = null;
          // New column width is: 1 / (n + 1)
          controller.setWidth(field, 1 / (model.report.fields.length + 1) * 100);
          controller.redistributeFieldWidths(100 - field.width.value);
          if (position == -1 || model.report.fields.length == 0) {
            if (model.report.fields.length > 0) {
              // take the formatting from the last column
              itemFormat = model.report.fields[model.report.fields.length - 1].itemFormat;
              headerFormat = model.report.fields[model.report.fields.length - 1].headerFormat;
              reportSummaryFormat = model.report.fields[model.report.fields.length - 1].reportSummaryFormat;
            }
            // add the new field to the end
            model.report.fields.push(field);
          } else {
            if (position == 0) {
              // take the formatting from the first column
              itemFormat = model.report.fields[0].itemFormat;
              headerFormat = model.report.fields[0].headerFormat;
              reportSummaryFormat = model.report.fields[0].reportSummaryFormat;
            } else {
              // take the formatting from the column to the left
              itemFormat = model.report.fields[position - 1].itemFormat;
              headerFormat = model.report.fields[position - 1].headerFormat;
              reportSummaryFormat = model.report.fields[position - 1].reportSummaryFormat;
            }
            // insert the new field
            model.report.fields.splice(position, 0, field);
          }
          if (itemFormat != null) {
            var newFormat = model.cloneFormat(itemFormat);
            // remove any column alignment that has been set?
            newFormat.horizontalAlignmentName = null;
            field.itemFormat = newFormat;
          }
          if (headerFormat != null) {
            var newFormat = model.cloneFormat(headerFormat);
            // remove any column alignment that has been set?
            field.headerFormat = newFormat;
          }
          if (reportSummaryFormat != null) {
            var newFormat = model.cloneFormat(reportSummaryFormat);
            // remove any column alignment that has been set?
            field.reportSummaryFormat = newFormat;
          }

          // set the alignment to that specified by the metadata
          var align = column.horizontalAlignment;
          if (align == 'CENTERED') {
            field.itemFormat.horizontalAlignmentName = 'CENTER';
            field.headerFormat.horizontalAlignmentName = 'CENTER';
            field.reportSummaryFormat.horizontalAlignmentName = 'CENTER';
          } else {
            field.itemFormat.horizontalAlignmentName = align;
            field.headerFormat.horizontalAlignmentName = align;
            field.reportSummaryFormat.horizontalAlignmentName = align;
          }
          field.dataFormat = column.formatMask;
          field.reportSummaryDataFormat = column.formatMask;

          // use numeric format for date field summary
          if (column.dataType == pentaho.pda.Column.DATA_TYPES.DATE || !column.formatMask) {
            field.reportSummaryDataFormat = "#,###";
          }
        }
        if (autoRefresh) {
          this.cancelCurrentAsyncJob();
          this.refresh();
        }
      }

      pentaho.pir.controller.prototype.getLabel = function (editLabel) {
        if (editLabel.type == 'columnHeaders') {
          return model.report.fields[editLabel.idx].displayName;
        } else if (editLabel.type == 'groupSummary') {
          var field = model.report.fields[editLabel.fieldIdx].field;

          var obj = null;
          var summaryFormats = model.report.groups[editLabel.groupIdx].summaryFormats;
          for (var i = 0; i < summaryFormats.length; i++) {
            if (summaryFormats[i].field == field) {
              obj = summaryFormats[i];
            }
          }
          if (obj != null) {
            return obj.label;
          }
        } else if (editLabel.type == 'reportFooterSummary') {
          return model.report.fields[editLabel.idx].reportSummaryLabel;
        } else if (editLabel.type == 'groupHeaders') {
          if (model.report.groups[editLabel.groupIdx].headerLabel == null) {
            return model.report.groups[editLabel.groupIdx].displayName;
          } else {
            return model.report.groups[editLabel.groupIdx].headerLabel;
          }
        }

        var list = model.report[editLabel.type];
        if (list) {
          return list[editLabel.idx].value;
        }
        return null;
      }

      pentaho.pir.controller.prototype.setLabel = function (editLabel, value) {
        if (editLabel == null) {
          return false;
        }
        var currentValue = controller.getLabel(editLabel);
        if (currentValue === value) {
          return false;
        }
        if (editLabel.type == 'columnHeaders') {
          model.report.fields[editLabel.idx].displayName = value;
        } else if (editLabel.type == 'groupSummary') {
          var summaryFooters = model.report.groups[editLabel.groupIdx].summaryFooters;
          var field = model.report.fields[editLabel.fieldIdx].field;
          var obj = null;
          var summaryFormats = model.report.groups[editLabel.groupIdx].summaryFormats;
          for (var i = 0; i < summaryFormats.length; i++) {
            if (summaryFormats[i].field == field) {
              obj = summaryFormats[i];
            }
          }
          if (obj == null) {
            obj = model.createSummaryFormat(primaryItem.group, primaryItem.field.field);
            model.report.groups[primaryItem.idx].summaryFormats.push(obj);
          }
          obj.label = value;
        } else if (editLabel.type == 'reportFooterSummary') {
          model.report.fields[editLabel.idx].reportSummaryLabel = value;
        } else if (editLabel.type == 'groupHeaders') {
          model.report.groups[editLabel.groupIdx].headerLabel = value;
        } else {
          var list = model.report[editLabel.type];
          if (list && editLabel.idx < list.length) {
            list[editLabel.idx].value = value;
          }
        }
        return true;
      }

      pentaho.pir.controller.prototype.setOrientation = function (orientation) {
        model.report.orientation = orientation;
      }

      pentaho.pir.controller.prototype.changePageFormat = function (pageFormat) {
        model.report.pageFormat = pageFormat;
      }

      pentaho.pir.controller.prototype.setMargins = function (marginTop, marginRight, marginBottom, marginLeft) {
        model.report.marginTop = marginTop;
        model.report.marginRight = marginRight;
        model.report.marginBottom = marginBottom;
        model.report.marginLeft = marginLeft;
      }

      pentaho.pir.controller.prototype.setQueryTimeout = function (queryTimeout) {
        model.report.queryTimeout = queryTimeout;
      }

      pentaho.pir.controller.prototype.setRowLimit = function (rowLimit) {
        model.report.queryLimit = rowLimit; // PIR-815
        this.startUndo();
        this.cancelCurrentAsyncJob();
        this.refresh();
      }

      pentaho.pir.controller.prototype.changeTemplate = function (template) {
        model.report.templateName = template;
        this.cancelCurrentAsyncJob();
        // BACKLOG-9917 selecting template we have to re-query parameters.
        view.createPromptPanel();
        this.refresh();
      }

      pentaho.pir.controller.prototype.moveColumn = function (idx, left) {

        if (idx == 0 && left) {
          return;
        }
        else if (idx == model.report.fields && !left) {
          return;
        }
        // remove the item
        var newFields = new Array();
        var newIdx = left ? idx - 1 : idx + 2;

        for (var i = 0; i < model.report.fields.length; i++) {
          if (i == idx) {
          }
          if (i == newIdx) {
            newFields.push(model.report.fields[idx]);
          }
          if (i != idx) {
            newFields.push(model.report.fields[i]);
          }
        }
        if (newIdx >= model.report.fields.length) {
          newFields.push(model.report.fields[idx]);
        }
        model.report.fields = newFields;
        /*
         var field = model.report.fields.splice(idx,1);

         if(left) {
         //        model.report.fields.splice(idx-1,0,field);
         } else {
         //        model.report.fields.splice(idx+1,0,field);
         }
         alert(model.report.fields.length);
         */
        this.cancelCurrentAsyncJob();
        this.refresh();

      }

      /**
       * Export the report in the given output type.
       * @param outputType {HTML, PDF, CSV, XLS}
       */
      pentaho.pir.controller.prototype.exportReport = function (/* String */ outputType) {
        var exportForm = dom.byId('exportform');
        var createHiddenField = function (name, value, form) {
          var values = [].concat(value);
          array.forEach(values, function (v) {
            construct.create('input', {
              type: 'hidden',
              name: name,
              value: v
            }, form);
          });
        }

        this.prepareReport();

        // Clear form
        construct.empty(exportForm);

        // Load parameter values
        var formValues = controller.getParameterValues();

        // Set mandatory fields after parameter values so they will take precedence
        delete formValues['::session'];
        delete formValues['output-target'];
        formValues['command'] = 'export';
        formValues['json'] = json.stringify(model.report);
        formValues['renderMode'] = 'REPORT';
        formValues['output-type'] = outputType;

        // Create hidden form elements
        for (var k in formValues) {
          if (formValues.hasOwnProperty(k)) {
            createHiddenField(k, formValues[k], exportForm);
          }
        }

        exportForm.setAttribute( "action", exportForm.action + "?rand=" + Math.random());

        exportForm.submit();
      }

      window.handle_puc_save = function(path, myFilename, overwrite, errorCallback) {
        pentaho.pir.controller.prototype.saveReport(myFilename, "", path, "", overwrite, errorCallback);

        // Remove prpti extension if present
        var index = myFilename.search(/\.prpti/);
        if (index != -1)
          myFilename = myFilename.substring(0, index);

        // Extract just the path in case the user selected an item in the file dialog
        index = path.search(/\/[^\/]*\.prpti/);
        if (index != -1)
          path = path.substring(0, index);

        path = path + "/" +  myFilename + ".prpti"; // This is where we will save the report

        try{
          // if possible refresh the solution browser panel
          if (typeof window.top.mantle_refreshRepository !== "undefined") {
            window.top.mantle_refreshRepository();
          }
        } catch (ignored) {} // Ignore "Same-origin policy" violation in embedded IFrame

        var encodedURL = encoder.encode( "{0}", path );

        return encodedURL;
      }

      pentaho.pir.controller.prototype.openSelectReportDialog = function () {
        openFileChooserDialog({
          fileSelected : function(repositoryFile, filePath, fileName, title) {
            if(fileName.indexOf('prpti') < 0) {
              alert('You can currently only open Interactive Report files');
              return;
            }
            var updatedFilePath = filePath.replace(/\//g, ':');
            var showRepoButtons = /showRepositoryButtons=true/.test(window.location.href);
            window.location.href = window.CONTEXT_PATH + 'api/repos/' + updatedFilePath + '/prpti.view?' + (showRepoButtons ? 'showRepositoryButtons=true' : '');
          },
          dialogCanceled : function(){}
        });
      }

      pentaho.pir.controller.prototype.openSaveReportDialog = function (saveAs, successCallback) {
        if(this.saveAsOpen){
          return;
        }
        this.saveAsOpen = true;
        var outterThis = this;
        var openSaveDialogFuntion = saveAs ? saveAsFileChooserDialog : saveFileChooserDialog;
        openSaveDialogFuntion({
          fileSelected: function(repositoryFile, filePath, fileName, title){
            controller.saveReport(fileName, '', filePath, '', true, undefined, successCallback);
            outterThis.saveAsOpen = false;
          },
          dialogCanceled: function() {
            outterThis.saveAsOpen = false;
          }
        });
      }

      pentaho.pir.controller.prototype.saveReport = function(myFilename, mySolution, myPath, myType, myOverwrite, errorCallback, successCallback) {
        view.promptApi.operation.state({"parametersChanged": false});

        view.addBusy();
        var filepath = myPath + '/' + myFilename;
        controller.prepareReport();
        var js = json.stringify(model.report);

        var content = {};
        lang.mixin(content, controller.getParameterValues());
        lang.mixin(content, {
          json: js,
          replace: myOverwrite,
          filepath: filepath
        });

        controller.lastSaveState = js;
        controller.lastSaveQueryLimit = model.report.queryLimit;

        this.sendRequest(CONTEXT_PATH + "api/repos/pentaho-interactive-reporting/iadhocsave", {
          data: content,
          handleAs: "text",
          preventCache: true,
          method: "POST"
        }).then(function (data) {
          view.removeBusy();
          if (data.indexOf("SAVE_SUCCESSFUL") == -1) {
            errorCallback();
          } else {
            controller.currentFileName = myFilename;
            if (controller.currentFileName.indexOf('.prpti') == -1) {
              controller.currentFileName += '.prpti';
            }
            controller.currentFilePath = myPath;
            controller.newReport = false;
            // BISERVER-9321
            controller.pentahoUserConsole.refreshCurrentFolder();
          }
          controller._initialModelLimit = model.report.queryLimit;
          successCallback();
        }, function(err){
          // handle an error condition
        }, function (error) {
          view.removeBusy();
          view.showMessageBox(data, view.getLocaleString('Error_txt'));
        });
      }

      pentaho.pir.controller.prototype.possibleExtensions = function () {
        return ['.prpti'];
      }

      preTabCloseHook = function () {
        try {
          if (!model) {
            return false;
          }
          var currentState = json.stringify(model.report);
          if (!controller.canUndo() && (controller.lastSaveState == null || controller.lastSaveState == '')) {
            return true;
          }
          if (currentState != controller.lastSaveState && controller.pentahoUserConsole.console_enabled) {
            // warn the user about closing
            return confirm(view.getLocaleString("closeWarning"));
          }
        } catch (e) {
          // ignore any errors and close
        }
        return true;
      }

      hasUnsavedChanges = function () {
        try {
          if (!model) {
            return false;
          }
          if (!controller.isUndoing && controller.undoPosition == 0) {
            return false;
          }
          var currentState = json.stringify(model.report);
          var queryLimitChanged = controller.lastSaveQueryLimit != model.report.queryLimit;
          if (!controller.canUndo() && controller.lastSaveState == null && !queryLimitChanged) {
            return false;
          }
          if ((queryLimitChanged || (currentState != controller.lastSaveState)) && controller.pentahoUserConsole.console_enabled) {
            return true;
          }
        } catch (e) {
          // ignore any errors and close
        }
        return false;
      }

      /**
       * PIR-839
       *
       * This method verifies if the report has filters with different aggregation types
       * (meaning with aggregation - SUM, AVG, COUNT, COUNT DISTINCT - and no aggregation).
       * A boolean parameter can be passed on to the method to indicate that a filter
       * is being added to the report
       *
       * @param hasAggregation indicates whether the filter being added has aggregation
       **/
      pentaho.pir.controller.prototype.mixedFilterAggTypesInReport = function (hasAggregation) {
        if (hasAggregation === undefined) {
          var mixedFilterAggTypesInReport = false;
          var aggrFiltersPresent = false,
              noAggrFiltersPresent = false;
          _.each(model.report.filters, function(filter) {
            if (filter.selectedAggType == 'NONE') {
              noAggrFiltersPresent = true;
            }
            if (filter.selectedAggType && filter.selectedAggType != '' && filter.selectedAggType != 'NONE') {
              aggrFiltersPresent = true;
            }
          });
          return aggrFiltersPresent && noAggrFiltersPresent;
        }
        else {
          if (hasAggregation) {
            var anyFilterWithNoAggregation = _.some(_.pluck(model.report.filters, 'selectedAggType'), function(aggr, idx) {
              if (model.report.filters[idx].column == null) {
                return;
              }
              return (aggr == 'NONE' || aggr == null);
            });
            return anyFilterWithNoAggregation;
          } else {
            var anyFilterWithAggregation = _.some(_.pluck(model.report.filters, 'selectedAggType'), function(aggr) {
              return aggr != 'NONE' && aggr != null;
            });
            return anyFilterWithAggregation;
          }
        }
      }

      /**
       * PIR-839
       *
       * This method will validate if we can add the filter to the report without generating
       * an invalid SQL query.
       *
       * @param column The column id for the filter being added
       * @param selectedAggType the aggregation type of the filter being added
       **/
      pentaho.pir.controller.prototype.validateFilterAddition = function(columnOrGroup, selectedAggType, isPrompt) {
        // Let's check if there are any other filters. If not, just let the filter be added.
        if (model.report.filters.length > 0) {

          var filterHasAggregation = selectedAggType && selectedAggType != 'NONE';

          var mixedFilterAggTypesInReport = this.mixedFilterAggTypesInReport(filterHasAggregation);

          if (mixedFilterAggTypesInReport) {
            // The non-aggregated fields used in the filters must be columns or groups in the report.
            if (!filterHasAggregation) {

              var isColumnFilter = _.contains(_.pluck(model.report.fields, 'field'), columnOrGroup);
              var isGroupFilter = _.contains(_.pluck(model.report.groups, 'field'), columnOrGroup);

              if (!isColumnFilter && !isGroupFilter) {
                if (isPrompt) {
                  view.showMessageBox(
                      view.getLocaleString("UnableToCreatePromptErrorWithoutAggr_Message"),
                      view.getLocaleString("UnableToCreatePromptError_Title"));
                } else {
                  view.showMessageBox(
                      view.getLocaleString("UnableToCreateFilterErrorWithoutAggr_Message"),
                      view.getLocaleString("UnableToCreateFilterError_Title"));
                }
                return false;
              }
            }
          }
        }
        return true;
      }

      pentaho.pir.controller.prototype.createFilter = function (columnId) {

        var column = controller.datasource.getColumnById(columnId);
        if (!column) {
          throw "Unknown column id: " + columnid;
        }
        var filter = model.createFilter(columnId, column.defaultAggregation);

        // PIR-839
        if (this.validateFilterAddition(filter.column, filter.selectedAggType, false)) {
          // Set transient isNew flag so we can handle cancellation of edit dialog properly
          filter.isNew = true;
          return filter;
        }
      }

      pentaho.pir.controller.prototype.createMqlFilter = function (mqlCondition) {

        var filter = model.createMqlFilter(mqlCondition);
        return filter;
      }

      pentaho.pir.controller.prototype.handleRemoveFilter = function (filter) {

        if (filter == undefined) { // PIR-719
          filter = view.filterStore.currentFilter;
        }

        var filterIdx;
        if (typeof filter === "number") {
          filterIdx = filter;
        } else {
          array.some(model.report.filters, function (f, idx) {
            if (f === filter) {
              filterIdx = idx;
              return true; // break
            }
          });
        }
        var f = function () {
          controller.removeFilter(filterIdx);

          var filterToRemove = view.filterStore.query({value: filter})[0];
          view.removeFilterFromStore(filterToRemove);

          view.refreshParameterPanel(true);
        }

        if (model.report.filters[filterIdx].parameterName) {
          var paramName = model.report.filters[filterIdx].parameterName;
          if (paramName) {
            var param = controller.findParameterByName(paramName);
            if (param && !param.hidden) {
              // Ask user to delete both or not at all
              view.showMessageBox(
                  view.getLocaleString('DeleteFilterWithParameterWarningMessage', paramName),
                  view.getLocaleString('DeleteFilterWithParameterWarningTitle'),
                  view.getLocaleString('Yes_txt'),
                  f,
                  view.getLocaleString('No_txt'));
              return;
            }
          }
        }
        f();
      }

      pentaho.pir.controller.prototype.removeFilter = function (filterIdx) {
        if (filterIdx != undefined) {
          var filter = model.report.filters.splice(filterIdx, 1)[0];
          // Remove the parameter
          if (filter.parameterName) {
            controller.removeParameter(filter.parameterName);
          }
        }
      }

      pentaho.pir.controller.prototype.setColumnAggregation = function (field, aggType) {
        // PIR-839
        // We need to validate if the change is going to generate a bad SQL query
        // The rule is: if we have mixed aggregation types on the report's filters, all the
        // non-aggregated filters should also be a column in the report and that column
        // cannot have any aggregation
        if (aggType != 'NONE') {
          if (this.mixedFilterAggTypesInReport()) {
            var filter = _.find(model.report.filters, function(obj) {
              return obj.column == field.field;
            });
            if (filter && filter.selectedAggType == 'NONE') {
              view.showMessageBox(
                  view.getLocaleString("UnableToEditFilter_Message"),
                  view.getLocaleString("UnableToEditFilter_Title"));
              return;
            }
          }
        }

        field.fieldAggregation = aggType;
        this.cancelCurrentAsyncJob();
        this.refresh();
      }

      pentaho.pir.controller.prototype.setColumnSummaryFunction = function (field, functionClassName) {
        field.aggregationFunctionClassname = functionClassName;
        this.cancelCurrentAsyncJob();
        this.refresh();
      }

      pentaho.pir.controller.prototype.removeColumnSummaryFunction = function (field) {
        field.aggregationFunctionClassname = null;
        this.cancelCurrentAsyncJob();
        this.refresh();
      }

      pentaho.pir.controller.prototype.dropToColumns = function (nodes) {
        target = document.getElementById("column-dnd-target");

        // find index to insert at
        var insertIndex = 0;
        var isMove = true;
        for (var idx = 0; idx < target.childNodes.length; idx++) {
          if (target.childNodes[idx].getAttribute) {
            var fieldIdx = target.childNodes[idx].getAttribute("fieldIdx");
            var fieldId = target.childNodes[idx].getAttribute("fieldId");
            if (fieldIdx != null) {
              // type conversion
              insertIndex = (fieldIdx - 0) + 1;
            }
            if (fieldId != null) {
              // we have a non-indexed child node, insert position discovered
              isMove = false;
              break;
            }
          }
        }

        if (isMove) {
          var fields = new Array();
          for (var i = 0; i < target.childNodes.length; i++) {
            if (target.childNodes[i].getAttribute) {
              var fieldIdx = target.childNodes[i].getAttribute("fieldIdx");
              if (fieldIdx != null) {
                fields.push(model.report.fields[fieldIdx]);
              }
            }
          }
          model.report.fields = fields;
        } else {
          // add to the back if our drop index is to far out
          if (insertIndex > model.report.fields.length) {
            insertIndex = model.report.fields.length;
          }
          for (var idx = 0; idx < nodes.length; idx++) {
            var fieldId = nodes[idx].getAttribute("fieldId");
            controller.addDetailFieldAtPosition(fieldId, insertIndex, false);
          }
        }
      }

      pentaho.pir.controller.prototype.dropToColumnPanel = function (nodes, source, target) {
        var oldFields = model.report.fields;
        model.report.fields = [];

        var orderedItems = target.getAllNodes().map(function (node) {
          return target.getItem(node.id).data;
        });

        var newFieldInfo = [];
        var fromGroupPanel = source.node.id === "layoutPanelGroupList";
        var groupIndicesToRemove = [];
        array.forEach(orderedItems, function (item, idx) {
          if (undefined !== item.fieldIdx) {
            // Use existing field
            model.report.fields.push(oldFields[item.fieldIdx]);
          } else {
            // Need to create a new field at this index
            newFieldInfo.push([item.fieldId, idx, false]);
          }
          if (undefined !== item.groupIdx) {
            groupIndicesToRemove.push(item.groupIdx);
          }
        }, this);

        array.forEach(newFieldInfo, function (args) {
          controller.addDetailFieldAtPosition.apply(controller, args);
        })

        // Remove the groups when dragged from groups to columns
        this.removeGroups(groupIndicesToRemove);

        // Remove items from hints panel
        query("#layoutPanelColumnHint > *").orphan();
      }

      pentaho.pir.controller.prototype.removeGroups = function (indices) {
        array.forEach(indices.sort(this.numberComparator).reverse(), function (groupIdx) {
          this.removeGroup(groupIdx);
        }, this);
      }

      pentaho.pir.controller.prototype.removeGroup = function (groupIdx) {
        var group = model.report.groups.splice(groupIdx, 1)[0];
        model.report.groupSorts.splice(groupIdx, 1);
        return group;
      }

      pentaho.pir.controller.prototype.dropToGroups = function (source, target) {
        var oldGroups = model.report.groups;
        var oldSorts = model.report.groupSorts;
        model.report.groups = [];
        model.report.groupSorts = [];

        var orderedItems = target.getAllNodes().map(function (node) {
          return target.getItem(node.id).data;
        });

        var fromColumn = source.node.id === "layoutPanelColumnList" || source.node.id === "column-dnd-target";
        var fieldIndicesToRemove = [];

        array.forEach(orderedItems, function (item) {
          if (undefined !== item.groupIdx) {
            // Use existing group
            model.report.groups.push(oldGroups[item.groupIdx]);
            // Find sort for field
            var sort;
            array.some(oldSorts, function (s) {
              if (s.field === item.fieldId) {
                sort = s;
                return true;
              }
            });
            if (sort) {
              model.report.groupSorts.push(sort);
            }
          } else {
            // Create new group
            this.addGroupFieldAtPosition(item.fieldId, -1, "asc", false);
          }
          if (undefined !== item.fieldIdx) {
            // This node was moved from a container of columns and should be removed
            fieldIndicesToRemove.push(parseInt(item.fieldIdx));
          }
        }, this);

        // Remove the fields moved from columns to groups
        this.removeColumns(fieldIndicesToRemove);

        // Remove items from hints panel
        query("#layoutPanelGroupHint > *").orphan();
      }

      pentaho.pir.controller.prototype.createOrEditFilter = function (fieldIdx) {
        var field = model.report.fields[fieldIdx];
        var filter = this.findFilterForField(field);
        if (!filter) {
          filter = this.createFilter(field.field);
        }
        view.editFilter(filter);
      }

      pentaho.pir.controller.prototype.findFilterForField = function (field) {
        var filter;
        array.some(model.report.filters, function (f) {
          if (f.column === field.field) {
            filter = f;
            return true;
          }
        });
        return filter;
      }

      pentaho.pir.controller.prototype.dropToFilters = function (nodes) {
        array.some(nodes, function (node) {
          var fieldId = node.getAttribute( "fieldId");
          if (!fieldId) {
            var field = model.report.fields[node.getAttribute( "fieldIdx")];
            if (field) {
              fieldId = field.field;
            }
          }
          if (fieldId) {
            var filter = this.createFilter(fieldId);
            if (filter) {
              view.editFilter(filter);
            }
            return true; // Only process the first field
          } else {
            if(console){
              console.warn("Invalid node dragged to filter panel: " + node.id + ": " + node);
            }
          }
        }, this);
      }

      pentaho.pir.controller.prototype.dropToParameterPanel = function (nodes) {
        array.some(nodes, function (node) {
          var fieldId = node.getAttribute( "fieldId");
          if (!fieldId) {
            var field = model.report.fields[node.getAttribute( "fieldIdx")];
            if (field) {
              fieldId = field.field;
            }
          }
          if (fieldId) {
            controller.createParameter(fieldId);
            view.refreshParameterPanel(true);
          } else {
            if(console){
              console.warn("Invalid node dragged to parameter panel: " + node.id + ": " + node);
            }
          }
        }, this);
      }

      pentaho.pir.controller.prototype.dropComplete = function (nodes, source, target) {
        var refresh = true;
        if (target.node.id === "layoutPanelColumnHint" || target.node.id === "layoutPanelColumnList") {
          this.dropToColumnPanel(nodes, source, target);
        } else if (target.node.id == "layoutPanelGroupHint" || target.node.id == "layoutPanelGroupList" || target.node.id == "group-dnd-target") {
          this.dropToGroups(source, target);
        } else if (target.node.id == "filterPanel") {
          // Remove the dragged nodes from the filter panel
          array.forEach(target.node.childNodes, function (node) {
            if (node && (attr.has(node, "fieldId") || attr.has(node, "fieldIdx"))) {
              node.parentNode.removeChild(node);
            }
          });
          this.dropToFilters(nodes);
          refresh = false;
        } else if (target.node.id == "trash-dnd-target") {
          if (source.node.id == "column-dnd-target" || source.node.id === "layoutPanelColumnList" || source.node.id == "column-block-dnd-container") {
            var fieldIndices = array.map(nodes, function (node) {
              return parseInt(node.getAttribute( "fieldIdx"));
            });
            this.removeColumns(fieldIndices);
          } else if (source.node.id == "layoutPanelGroupList" || source.node.id == "group-dnd-target") {
            this.dropToGroups(source, source);
          } else if (source.node.id.indexOf("group-dnd-source-") == 0) {
            var groupIndices = array.map(nodes, function (node) {
              return parseInt(node.getAttribute( "groupIdx"));
            }, this);
            this.removeGroups(groupIndices);
          }
          if (target.node.hasChildNodes()) {
            while (target.node.childNodes.length > 0) {
              target.node.removeChild(target.node.firstChild);
            }
          }
        } else if (target.node.id == "parameterPanel") {
          array.forEach(target.node.childNodes, function (node) {
            if (node && (attr.has(node, "fieldId") || attr.has(node, "fieldIdx"))) {
              node.parentNode.removeChild(node);
            }
          });
          this.dropToParameterPanel(nodes);
          refresh = false;
        }

        if (refresh) {
          controller.cancelCurrentAsyncJob();
          controller.refresh();
        }
      }

      pentaho.pir.controller.prototype.resizeFields = function (/* <fieldidx, value> */ fields) {
        // Validate that we can resize the fields to what's being requested
        // Total resize width must not exceed:
        // 100 - (# columns not being resized) - (total width of fields being resized)
        // This will ensure at least 1% space for any columns not being resized. This minimum
        // is necessary for the report wizard to properly lay out the report.
        var total = model.report.fields.length;
        for (var idx in fields) {
          if (fields.hasOwnProperty(idx)) {
            total += this.getNormalizedColumnWidth(fields[idx]) - 1 /* minimum column width */;
          }
        }
        if (total > 100) {
          // Cannot resize fields. Total width would exceed 100%.
          return;
        }

        for (var idx in fields) {
          if (fields.hasOwnProperty(idx)) {
            controller.setWidth(model.report.fields[idx], fields[idx]);
          }
        }
        // Calculate overflow field as the last field that was not changed
        var overflowField = model.report.fields.length - 1;
        for (var idx = overflowField; idx >= 0; idx--) {
          if (!fields.hasOwnProperty(idx)) {
            overflowField = idx;
            break;
          }
        }
        controller.redistributeFieldWidths(100, overflowField);
      }

      pentaho.pir.controller.prototype.setWidth = function (field, /* number */ value) {
        if (value == null) {
          field.width = null;
        } else {
          value = this.getNormalizedColumnWidth(value);
          field.width = {lengthUnit: "PERCENTAGE", value: value};
        }
      }

      pentaho.pir.controller.prototype.getNormalizedColumnWidth = function (width) {
        // Max 3 decimal places to appease report engine
        // Minimum width: 1
        // Maximum width: 100
        return Math.max(1, Math.min(100, Math.round(width * 1000) / 1000));
      }

      /**
       * Redistribute column widths within a total percentage width of {totalPercentage}.
       * (totalPercentage > 100 can be used to accommodate resizing after removing a column)
       *
       * @param overflowIndex The index extra space (due to rounding) will be applied. If this is not provided the last column is used.
       */
      pentaho.pir.controller.prototype.redistributeFieldWidths = function (/* number */ totalPercentage, overflowIndex) {
        var total = 0;
        overflowIndex = overflowIndex == undefined ? model.report.fields.length - 1 : overflowIndex;
        for (var idx = 0; idx < model.report.fields.length; idx++) {
          var field = model.report.fields[idx];
          var width;
          if (idx !== overflowIndex) {
            width = (totalPercentage / 100) * field.width.value;
            controller.setWidth(field, width);
            total += field.width.value;
          }
        }
        if (overflowIndex >= 0) {
          field = model.report.fields[overflowIndex];
          // Round the total now so we don't overflow
          total = Math.round(total * 1000) / 1000;
          width = (totalPercentage > 100 ? 100 : totalPercentage) - total;
          controller.setWidth(field, width);
        }

      }

      pentaho.pir.controller.prototype.changePageNumber = function (pageNum) {
        var accepted = pageNum - 1;
        if (this.acceptedPage != accepted) {
          this.acceptedPage = accepted;
          if (!this.resettingPageNumber) {
            // this.startUndo(); // PIR-759 - Need to update undo stack to reflect change in queryless mode
            this.refresh();
            return true;
          }
        }
        return false;
      }

      pentaho.pir.controller.prototype.fetchSearchListLimit = function (callback) {
        this.sendRequest(CONTEXT_PATH + 'content/ws-run/InteractiveAdhocService/getSearchListLimit', {
          preventCache: true
        }).then(lang.hitch(this, function (data) {
          callback(this.getJsonFromXml(data));
        }));
      }

//PIR-581
      pentaho.pir.controller.prototype.fetchDefaultAutoRefreshSetting = function (callback) {
        this.sendRequest(CONTEXT_PATH + 'content/ws-run/InteractiveAdhocService/getDefaultAutoRefreshSetting', {
          preventCache: true
        }).then(lang.hitch(this, function (data) {
          callback(this.getJsonFromXml(data));
        }));
      }

      pentaho.pir.controller.prototype.validateMQLFormula = function (formula, callback) {
        this.sendRequest(CONTEXT_PATH + 'content/ws-run/InteractiveAdhocService/getDefaultAutoRefreshSetting', {
          preventCache: true,
          data: {
            formula: formula
          }
        }).then(lang.hitch(this, function (data) {
          var result = this.getJsonFromXml(data);
          if (callback != null) {
            callback(result);
          }
        }));
      }

      /**
       * Move elements of data at the indices provided to the index denoted by insertIndex.
       * @param data Data to rearrange
       * @param indices Indices to move
       * @param insertIndex Index to place moved items at
       * @return New array with elements moved.
       */
      pentaho.pir.controller.prototype.bulkMove = function (data, indices, insertIndex) {
        // Create lookup map for indices we're going to move
        var itemMap = {};
        array.forEach(indices, function (i) {
          itemMap[i] = true;
        });
        var newData = [];
        array.forEach(data, function (d, idx) {
          if (insertIndex === idx) {
            // Add all elements at indices to the insert index
            array.forEach(indices, function (i) {
              newData.push(data[i]);
            });
          }
          // Skip this index if it's one we're moving
          if (itemMap[idx]) {
            return;
          }
          // This index isn't being moved so add it to the new data set
          newData.push(d);
        });
        if (insertIndex >= data.length) {
          // Add all elements at indices to the end
          array.forEach(indices, function (i) {
            newData.push(data[i]);
          });
        }
        return newData;
      }

      pentaho.pir.controller.prototype.promptFormatterLoaded = function () {
        this.formatterLoaded = true;

        this.metadataDateFormatter = ReportFormatUtil.createFormatter(
            {type: 'date', attributes: {timezone: 'client'}},
            'yyyy-MM-dd HH:mm:ss.S');
        this.utcDateFormatter = ReportFormatUtil.createDataTransportFormatter(
            {type: 'date', attributes: {timezone: 'client'}},
            'yyyy-MM-dd HH:mm:ss.S');
        this.simpleReportingDateFormat = this.defaultDateFormat;
        this.simpleReportingDateFormatter = ReportFormatUtil.createFormatter(
            {type: 'date', attributes: {timezone: 'client'}},
            this.simpleReportingDateFormat);

        this.load();
      }

      pentaho.pir.controller.prototype.filterDialogLoaded = function () {
        pentaho.filterdialog.init();
      }

      pentaho.pir.controller.prototype.createFilterDialogConfig = function (column) {
        var config = pentaho.filterdialog.createConfig();
        config.title = view.getLocaleString('ParameterFilterDialogTitle', column.name);
        config.displayNameChecked = false;
        config.parametersSupported = false;
        config.calendarRestrictionsSupported = false;
        config.textFieldOptionsSupported = false;
        config.orientationOptionsSupported = false;
        config.isDisplayNameSupported = false;
        if (column.formatMask) {
          config.defaultDateFormat = column.formatMask;
        } else {
          config.defaultDateFormat = this.simpleReportingDateFormat;
        }
        config.supportedComponentTypes = ['DROP_DOWN', 'LIST', 'RADIO', 'CHECK', 'BUTTON', 'TEXT'];
        if (column.dataType === 'DATE') {
          config.supportedComponentTypes.push('DATE');
        }
        return config;
      }

      pentaho.pir.controller.prototype._buildRequestData = function(jsonReport) {
        var content = {};
        lang.mixin(content, this.getParameterValues());
        lang.mixin(content, {
          // only parameter without pagination of content ..
          renderMode: 'PARAMETER',
          json: jsonReport
        });

        // BISERVER-9098
        if (this.findUrlParam('command', document.location.href) != 'new') {
          lang.mixin(content, {
            solution: this.findUrlParam('solution', document.location.href),
            path: this.findUrlParam('path', document.location.href),
            name: this.findUrlParam('file', document.location.href)
          });
        }
        return content;
      };

      /**
       * @private Sequence number to detect concurrent fetchParameterDefinition calls.
       * Only the response to the last call will be processed.
       */
      pentaho.pir.controller.prototype._fetchParamDefId = -1;

      pentaho.pir.controller.prototype.fetchParameterDefinition = function(callback) {
        view.addBusy();
        var currentAutoSubmit = view._getStateProperty("autoSubmit");
        if (currentAutoSubmit) {
          view.showGlassPane();
        }

        try {
          this.resetPageNumber();
          // BACKLOG-8514
          if (!currentAutoSubmit) {
            view.pageNumberControl.setPageCount(1);
          }
          this.prepareReport();

          // PIR-1021 - use parameters in url for startup
          array.forEach(model.report.filters, function(filter) {
            if (view.getUrlParameters()[filter.parameterName]) {
			  urlparam = view.getUrlParameters()[filter.parameterName];
			  if ( urlparam instanceof Array ) {
				filter.value = urlparam;
			  } else {
                filter.value = [ urlparam ];
			  }
            }
          }, this);

          var jsonResult = json.stringify(model.report);
          if (jsonResult === "undefined") {
            view.removeBusy();
            return; // PIR-621 -  Do not send request if model.report/json isn't ready
          }

          var fetchParamDefId = ++this._fetchParamDefId;

          var content = this._buildRequestData(jsonResult);

          this.sendRequest(CONTEXT_PATH + "api/repos/pentaho-interactive-reporting/iadhoc", {
            method: "POST",
            data: content,
            handleAs: "text",
            sync: true,
            preventCache: true
          }).then(lang.hitch(this, function (data) {
            // Another request was made after this one, so this one is ignored.
            if(fetchParamDefId !== this._fetchParamDefId) { return; }
            try {
              if (this.isLoginContent(data)) {
                this.reauthenticate(function () {
                  this.fetchParameterDefinition.call(controller, callback);
                });
                return;
              }
              if (this.isQueryExecutionFailed(data)) {
                view.setReportError(data);
                return;
              }
              callback(data);
            } finally {
              if ( currentAutoSubmit &&
                  (!this._isAsync
                    || this._currentReportStatus == 'FINISHED'
                    || this._currentReportStatus == 'FAILED'
                    || this._currentReportStatus == 'CANCELED'
                    || !this._currentReportStatus
                  )
              ) {
                view.hideGlassPane();
              }
              this._paramDefnInitialized = true;
              view.removeBusy();
            }
          }), lang.hitch(this, function (data) {
            // Another request was made after this one, so this one is ignored.
            if(fetchParamDefId !== this._fetchParamDefId) { return; }
            view.removeBusy();
            view.setReportError(data);
          }));
        } catch (e) {
          if (currentAutoSubmit) {
            view.hideGlassPane();
          }
          view.removeBusy();
        }
      }

      pentaho.pir.controller.prototype.getParameterValues = function () {
        var paramValues = view.getUrlParameters();
        // Remove reserved parameter names
        delete paramValues["jsset"];
        delete paramValues["command"];
        delete paramValues["model"];
        delete paramValues["solution"];
        delete paramValues["path"];
        delete paramValues["file"];
        // parameters for saving
        delete paramValues["replace"];
        delete paramValues["filepath"];

        if (model.report.parameters.length > 0 && this.isParamDefnInitialized()) {
          lang.mixin(paramValues, view.promptApi.operation.getParameterValues());
        }

        return paramValues;
      }

      pentaho.pir.controller.prototype.getDefaultDataSource = function (report) {
        return this.getDataSourceByName(report, model.defaultDataSourceName);
      }

      pentaho.pir.controller.prototype.getDataSourceByName = function (report, name) {
        var idx = this.findDataSourceIdxByName(report, name);
        return idx > -1 ? report.dataSources[idx] : null;
      }

      pentaho.pir.controller.prototype.findDataSourceIdxByName = function (report, name) {
        var idx = -1;
        array.some(report.dataSources, function (ds, i) {
          if (name === ds.name) {
            idx = i;
            return true; // break
          }
        });
        return idx;
      }

      pentaho.pir.controller.prototype.setQuerylessMode = function (b) {
        this.querylessMode = b;
        view.refreshParameterPanel();
      }

      pentaho.pir.controller.prototype.createOrEditParameterByIdx = function (fieldIdx) {
        this.createOrEditParameter(model.report.fields[fieldIdx].field);
      }

      pentaho.pir.controller.prototype.createOrEditParameter = function (columnId) {
        var parameter = this.findParameterForColumn(columnId);
        if (!parameter) {
          controller.createParameter(columnId);
          view.refreshParameterPanel(true);
        } else {
          view.editParameter(parameter.name);
        }
      }

      /**
       * Creates a parameter and the data source for a given column.
       */
      pentaho.pir.controller.prototype.createParameter = function (columnId) {

        var column = this.datasource.getColumnById(columnId);
        var type = this.getMappedDataType(column);
        var param = model.createParameter(columnId, type, column.name);

        // PIR-839
        if (!this.validateFilterAddition(columnId, column.selectedAggregation, true)) {
          return;
        }

        var domainId = controller.datasource.domainId;
        var domainEscaped = domainId;//.replace(/\//g, '\\/');
        var modelId = controller.datasource.modelId;
        var modelName = controller.datasource.name;

        var mql = '<mql><domain_id><![CDATA[' + domainId + ']]></domain_id><model_id>' + modelId + '</model_id><options><disable_distinct>false</disable_distinct><limit>-1</limit></options><selections><selection><view>' + column.parent.id + '</view><column>' + column.id + '</column><aggregation>NONE</aggregation></selection></selections><constraints/><orders/></mql>';

        // Create the associated data source
        var ds = model.createPmdDataSource(
            column.name + '-' + new Date().getTime(),
            domainId,
            modelId,
            domainId,
            mql
        );

        param.query = ds.name;
        param.attributes.jsMql = '{"MQLQuery":{"cols":{"org.pentaho.commons.metadata.mqleditor.beans.Column":[{"id":"' + column.id + '","name":"' + column.name + '","type":"TEXT","aggTypes":{"org.pentaho.commons.metadata.mqleditor.AggType":["NONE"]},"defaultAggType":"NONE","selectedAggType":"NONE","persistent":true}]},"limit":-1,"domain":{"@id":"default","@name":"' + domainEscaped + '"},"model":{"@id":"' + modelId + '","@name":"' + modelName + '"},"query":"&lt;?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>' + entities.encode(mql) + '"}}';

        // Set a reasonable default value for the parameter so in the event the prompt is removed
        // the filter that is generated is valid.
        switch (column.dataType) {
          case pentaho.pda.Column.DATA_TYPES.UNKNOWN:
            // Treat unknowns like strings
          case pentaho.pda.Column.DATA_TYPES.STRING:
            param.defaultValue = [''];
            break;
          case pentaho.pda.Column.DATA_TYPES.DATE:
            if (column.formatMask) {
              param.dataFormat = column.formatMask;
            } else {
              param.dataFormat = this.simpleReportingDateFormat;
            }
            param.defaultValue = [this.simpleReportingDateFormatter.format(new Date())];
            // param.defaultValue = [this.utcDateFormatter.format(new Date())];
            // utcDateFormatter
            break;
          case pentaho.pda.Column.DATA_TYPES.NUMERIC:
          case pentaho.pda.Column.DATA_TYPES.BOOLEAN:
            param.defaultValue = ['0'];
          case pentaho.pda.Column.DATA_TYPES.NONE:
            // This is a wild guess but let's not do anything and see what comes out the other end...
            break;
          default:
            throw 'Unknown data type: ' + column.dataType;
        }

        model.report.parameters.push(param);
        model.report.dataSources.push(ds);

        // 1) Wire up an existing filter for this column if it does not declare a parameter.
        // 2) Rename this parameter to the parameter name of the first filter that declares a parameter but is not linked to a prompt
        // 3) Create a new filter if no filter exists for the column or all filters for the column are already linked to prompts
        var createFilter = true;
        array.some(model.report.filters, function (f) {
          if (f.column === column.id) {
            if (f.parameterName) {
              var parameter = controller.findParameterByName(f.parameterName);
              if (parameter) {
                // Don't touch filters that are already wired up to a prompt
              } else {
                // If this filter is parameterized and is not linked to a prompt rename this parameter to the filter's parameter name
                param.name = f.parameterName;
                param.label = f.parameterName;
                createFilter = false;
                return true; // break
              }
              // Add new not parameterized operator in condition below - PIR-1251
            } else if (f.operator !== pentaho.pda.Column.CONDITION_TYPES.NOT_NULL && f.operator !== pentaho.pda.Column.CONDITION_TYPES.IS_NULL) {
              f.parameterName = param.name;
              createFilter = false;
              return true; // break
            }
          }
        });
        if (createFilter) {
          // Create a filter for the new parameter name
          var filter = model.createFilter(column.id);
          filter.value = param.defaultValue;
          filter.selectedAggType = column.selectedAggregation;
          filter.parameterName = param.name;
          model.report.filters.push(filter);

          // add filterItem to filterStore
          view.addFilterToRoot(filter);
        }
      }

      pentaho.pir.controller.prototype.GWT_FILTER_CONVERTERS_TO = {
        'select': 'createListParamFromGwtFilter', //'dropdown',
        'selectMultiComponent': 'createListParamFromGwtFilter', //'list',
        'radioComponent': 'createListParamFromGwtFilter', //'radio',
        'checkComponent': 'createListParamFromGwtFilter', //'check',
        'multiButtonComponent': 'createListParamFromGwtFilter', //'togglebutton',
        'textInputComponent': 'createSimpleParamFromGwtFilter', //'textbox',
        'dateInputComponent': 'createDateParamFromGwtFilter' //'datepicker'
      }

      pentaho.pir.controller.prototype.createParamFromGwtFilter = function (columnId, filter) {
        var converter = controller.GWT_FILTER_CONVERTERS_TO[filter.type];
        if (converter) {
          return controller[converter].call(controller, columnId, filter);
        } else {
          if (console) {
            console.log("Unknown filter type: " + filter.type);
          }
        }
      }

      pentaho.pir.controller.prototype.createSimpleParamFromGwtFilter = function (columnId, filter) {
        var result = {
          param: model.createSimpleParameter(columnId, filter)
        }
        var column = controller.datasource.getColumnById(columnId);
        // Set the type based on the column type
        result.param.valueType = controller.getMappedDataType(column);
        if (!filter.dateFormat) {
          if (column.formatMask) {
            result.param.dataFormat = column.formatMask;
          } else {
            result.param.dataFormat = this.simpleReportingDateFormat;
          }
        }
        return result;
      }

      /**
       * PIR-1326
       * Return data type based on column's dataType field
       */
      pentaho.pir.controller.prototype.getMappedDataType = function (column) {
        if (column.dataType === pentaho.pda.Column.DATA_TYPES.DATE) {
          if (column.formatMask) {
            return this.getDateTypeFromFormat(column.formatMask);
          } else {
            return this.getDateTypeFromFormat(this.defaultDateFormat);
          }
        }
        return controller.DATA_TYPE_MAPPING[column.dataType] || controller.DATA_TYPE_MAPPING['default'];
      }

      pentaho.pir.controller.prototype.getDateTypeFromFormat = function (format) {
        var hourRegex = /(H{2})/;
        if(hourRegex.test(format)) {
          return 'java.sql.Timestamp';
        }
        return 'java.sql.Date';
      }

      pentaho.pir.controller.prototype.isDateType = function (type) {
        if (type === this.DATA_TYPE_MAPPING[pentaho.pda.Column.DATA_TYPES.DATE]
            || type === 'java.sql.Date') {
          return true;
        } else {
          return false;
        }
      }

      pentaho.pir.controller.prototype.createListParamFromGwtFilter = function (columnId, filter) {
        var param = this.createSimpleParamFromGwtFilter(columnId, filter).param;
        return this.configureListParameter(param, filter);
      }

      pentaho.pir.controller.prototype.configureListParameter = function (param, filter) {
        param['class'] = 'com.pentaho.iadhoc.model.ThinListParameter';
        param['multiSelect'] = !!filter.isMultiple || (filter.type == "checkComponent"); // PIR-618
        if (filter.size) {
          param['visibleItems'] = filter.size;
        }
        param['layout'] = filter.orientation;
        param['strict'] = true;

        param['autoFillSelection'] = filter.useFirstValue;

        if(filter.valuesArray && filter.valuesArray.length > 0) {
          filter.dataSourceProperties = null;
        }

        var ds = this.createDataSourceFor(param, filter);
        param['query'] = ds.name;
        return {
          param: param,
          dataSource: ds
        }
      }

      /**
       * Determines if a date format is valid by attempting to format the current time and parse it back.
       * @return The formatter if the format is valid, undefined otherwise.
       */
      pentaho.pir.controller.prototype.getDateFormatter = function (format) {
        var mockParam = {type: 'date'};
        var formatter;
        try {
          formatter = ReportFormatUtil.createFormatter(mockParam, format);
          // Attempt to format and parse the current time to verify the date format is correct
          var ds = formatter.parse(formatter.format(new Date()));
          if (!ds) {
            return undefined;
          }
        } catch (e) {
          return undefined;
        }
        return formatter;
      }

      pentaho.pir.controller.prototype.createDateParamFromGwtFilter = function (columnId, filter) {
        var param = this.createSimpleParamFromGwtFilter(columnId, filter).param;

        try {
          var defaultValueAsString = filter.defaultValue != null && filter.defaultValue.length > 0 ? filter.defaultValue[0] : null;
          // BACKLOG-5975
          var format = this.convertFormat(filter['dateFormat']);
          this.updateParameterWithDateValue(param, format, defaultValueAsString);
          return {
            param: param
          }
        } catch (e) {
          if (console) {
            console.log(e);
          }
          return undefined; // do not create parameter
        }
      }

      /**
       * Formats a date value as string into the UTC date format the reporting engine expects it in. If no date value is provided the current
       * time will be used.
       */
      pentaho.pir.controller.prototype.updateParameterWithDateValue = function (param, format, defaultValueAsString) {
        param['dataFormat'] = format;
        // Attempt to create a formatter for this format up front so we know if it will
        // fail when prompting tries to use it.
        var formatter = this.getDateFormatter(param['dataFormat']);
        if (!formatter) {
          throw 'Invalid date format: ' + param['dataFormat'];
        }
        if (defaultValueAsString == null) {
          // Set the default value to NOW if one is not provided since metadata cannot handle null date values
          defaultValueAsString = formatter.format(new Date());
        }
        // Format the default value into UTC so the reporting engine can use it as a String
        var dataTransportFormatter = ReportFormatUtil.createDataTransportFormatter(
            {type: 'date', attributes: {timezone: 'client'}},
            param['dataFormat']);
        // Now parse the value into UTC Date format
        try {
          var p = locale.format(new Date(defaultValueAsString), {datePattern: this.defaultDateFormat, selector: "date"});
          if (p.indexOf('NaN')> 0) {
            p = locale.format(formatter.parse(defaultValueAsString), {datePattern: this.defaultDateFormat, selector: "date"});
          }
          param.defaultValue = [p];
        } catch (e) {
          throw 'Could not parse date string: ' + defaultValueAsString;
        }
      }

      pentaho.pir.controller.prototype.createGwtFilterFromParam = function (param) {
        var filter = {
          columnId: param.columnId,
          type: 'text',
          name: param.name,
          title: param.label || '', // filter dialog cannot handle undefined labels
          showTitle: param.label != undefined && param.label.length > 0
        };

        filter.type = this.getParameterFilterType(param);
        filter.defaultValue = param.defaultValue === null ? [] : param.defaultValue;

        if (this.isDateType(param.valueType)) {
          // BACKLOG-5975
          var format = this.convertFormat(param['dataFormat']);
          filter.dateFormat = format;
          // convert default value to proper date string
          if (filter.defaultValue.length == 1) {
            var formatter = ReportFormatUtil.createFormatter({type: 'date'}, format);
            var dataTransportFormatter = ReportFormatUtil.createDataTransportFormatter(
                {type: 'date', attributes: {timezone: 'client'}},
                format);

            var dateValue;
            try {
              dateValue = formatter.format(filter.defaultValue[0]);
              filter.defaultValue = [dateValue];
            } catch (e) {
              dateValue = new Date(dataTransportFormatter.parse(filter.defaultValue[0]));
              filter.defaultValue = [formatter.format(dateValue)];
            }
          }
        }

        this.updateGwtFilterDataSourceProperties(filter, param);

        return filter;
      }

      pentaho.pir.controller.prototype.updateGwtFilterDataSourceProperties = function (filter, param) {
        if (param['class'] === 'com.pentaho.iadhoc.model.ThinParameter') {
          filter.filterType = 'static';
        } else if (param['class'] === 'com.pentaho.iadhoc.model.ThinListParameter') {
          filter.isMultiple = param['multiSelect'];
          if (param['visibleItems']) {
            filter.size = param['visibleItems'];
          }
          filter.orientation = param['layout'];
          filter.useFirstValue = param['autoFillSelection'] === true;
          var ds = this.getDataSourceByName(model.report, param['query']);
          if (ds['class'] === 'com.pentaho.iadhoc.model.ThinPmdDataSource') {
            filter.filterType = 'mql';

            var findColumnIdx = function (datasource, name) {
              var idx = -1;
              array.some(datasource.columnNames, function (cn, i) {
                if (cn === name) {
                  idx = i;
                  return true; // break
                }
              });
              return idx;
            }

            filter.dataSourceProperties = {
              'validx': param['attributes']['validx'],
              'lblidx': param['attributes']['lblidx'],
              'domainId': ds.domainId,
              'modelId': ds.modelId,
              'mql': ds.query,
              'jsMql': param['attributes']['jsMql']
            }

          } else if (ds['class'] === 'com.pentaho.iadhoc.model.ThinListParameter' || ds['class'] == 'com.pentaho.iadhoc.model.ThinStaticDataSource') {
            filter.filterType = 'static';
            filter.valuesArray = ds.values;
          } else {
            throw 'Invalid data source type for List parameter: ' + ds;
          }
        }
      }

      /**
       * This function will convert the date format to conform with what's being done on the DojoDateTextBoxComponent
       * so that what is being show on the prompt edit dialog is coherent with what the component is displaying.
       *
       * @param pattern The date pattern that will be converted
       */
      pentaho.pir.controller.prototype.convertFormat = function(pattern) {
      if (pattern.match(/(G|qQ|w|E|a|h|H|K|k|s|S|vz|Z)/)) {
        return pattern;
      } else {
          var formattedPattern = pattern;
          var regexConvertMonth = [[/(^|(?!m).)(m{1}(?!m))/, "$1M"],   [/(^|(?!m).)(m{2}(?!m))/, "$1MM"]];

          var replacer = function(i,v){
            if(v[0].test(formattedPattern)) {
              formattedPattern = formattedPattern.replace(v[0], v[1]);
              return false;
            }
          };

          $.each(regexConvertMonth, replacer);
          return formattedPattern;
        }
      };

      /**
       * Call func for each property defined on the object. The function will be passed the following parameters:
       *
       * (property-name, value of property)
       *
       * To terminate the loop, the function should return true. All other return values will be ignored.
       *
       * @param obj Object to iterate through properties of
       * @param func Function to execute.
       * @param scope Scope to execute function in.
       */
      pentaho.pir.controller.prototype.forEachInObject = function (obj, func, scope) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (true === func.call(scope, key, obj[key])) {
              return;
            }
          }
        }
      }

      pentaho.pir.controller.prototype.getParameterFilterType = function (param) {
        var type = undefined;
        this.forEachInObject(model.filterTypeToReportingPromptType, function (key, value) {
          if (value === param.type) {
            type = key;
            return true;
          }
        });
        if (type === undefined) {
          type = 'textInputComponent'; // default type
          if (console) {
            console.log('unknown parameter type: ' + param.type + '. Defaulting to ' + type);
          }
        }
        return type;
      }

      pentaho.pir.controller.prototype.createDataSourceFor = function (param, filterFromGwtDialog) {
        if (filterFromGwtDialog.dataSourceProperties && filterFromGwtDialog.dataSourceProperties.mql) {
          var validx = parseInt(filterFromGwtDialog.dataSourceProperties['validx'], 10);
          var lblidx = parseInt(filterFromGwtDialog.dataSourceProperties['lblidx'], 10);
          var mqlQuery = json.parse(filterFromGwtDialog.dataSourceProperties['jsMql']);
          var cols     = mqlQuery.MQLQuery.cols;
          var COL_BEAN_NAME = 'org.pentaho.commons.metadata.mqleditor.beans.Column';

          // Note: to my knowledge, this JSON serialization has no logic whatsoever,
          //  and the code I wrote in here is fully debug-driven.

          // support old json format as well as new
          // This format is still used, in some situations, when there is only one selected column.
          // (I obtained this format right after adding a new prompt-only parameter.)
          if (cols[COL_BEAN_NAME]) {
            cols = cols[COL_BEAN_NAME];

            param['keyColumn']  = cols[validx].id;
            param['textColumn'] = cols[lblidx].id;
          } else if (cols instanceof Array) {
            // This format is used when there is one or more selected column...
            if(cols.length) {
              cols2 = cols[0][COL_BEAN_NAME];
              if(cols2 instanceof Array) {
                cols = cols2;
                param['keyColumn']  = cols[validx].id;
                param['textColumn'] = cols[lblidx].id;
              } else {
                // If cols2 is not an array, then it is the single column object,
                // and it must also be that validx === lblidx === 0

                // (After adding and removing selected columns,
                //  I was able to obtain a single column coming in this
                //  array enclosured format.)

                param['keyColumn'] = param['textColumn'] = cols2.id;
              }
            }
          }

          // Save the GWT Filter Dialog-specific attributes so we can rehydrate the dialog for editing
          param.attributes = {
            'validx': filterFromGwtDialog.dataSourceProperties['validx'],
            'lblidx': filterFromGwtDialog.dataSourceProperties['lblidx'],
            'jsMql': filterFromGwtDialog.dataSourceProperties['jsMql']
          }

          return model.createPmdDataSource(
              filterFromGwtDialog.name,
              filterFromGwtDialog.dataSourceProperties['domainId'],
              filterFromGwtDialog.dataSourceProperties['modelId'],
              filterFromGwtDialog.dataSourceProperties['domainId'],
              filterFromGwtDialog.dataSourceProperties['mql']
          );
        } else {
          param['keyColumn'] = 'Key';
          param['textColumn'] = 'Value';
          return model.createStaticDataSource(filterFromGwtDialog.name, filterFromGwtDialog.valuesArray);
        }
      }

      /**
       * Assuming all parameters are uniquely named, find the first whose name matches the provided name.
       */
      pentaho.pir.controller.prototype.findParameterIdxByName = function (name) {
        var paramIdx = -1;
        array.some(model.report.parameters, function (p, idx) {
          if (p.name === name) {
            paramIdx = idx;
            return true;
          }
        });
        return paramIdx;
      }

      pentaho.pir.controller.prototype.findParameterForColumn = function (column) {
        var param;
        array.some(model.report.parameters, function (p) {
          if (p.columnId === column) {
            param = p;
            return true; // break
          }
        });
        return param;
      }

      pentaho.pir.controller.prototype.findParameterByName = function (name) {
        // Assuming all parameters are uniquely named, remove the first parameter whose name matches
        var paramIdx = this.findParameterIdxByName(name);
        return paramIdx != -1 ? model.report.parameters[paramIdx] : undefined;
      }

      pentaho.pir.controller.prototype.removeParameter = function (name) {
        var paramIdx = this.findParameterIdxByName(name);
        if (paramIdx != -1) {
          var p = model.report.parameters.splice(paramIdx, 1)[0];

          // Remove old data source for parameter
          if (p.query) {
            var dsIdx = this.findDataSourceIdxByName(model.report, p.query);
            if (dsIdx != -1) {
              model.report.dataSources.splice(dsIdx, 1);
            }
          }
        }
      }

      /**
       * Replace the parameter named {name} with the provided parameter {param}
       */
      pentaho.pir.controller.prototype.replaceParameter = function(name, filterFromGwtDialog) {
        var paramIdx = this.findParameterIdxByName(name);
        if (paramIdx != -1) {
          var p = model.report.parameters[paramIdx];
          var parameters = model.report.parameters;
          model.report.parameters = [];
          var result = controller.createParamFromGwtFilter(p.columnId, filterFromGwtDialog);
          model.report.parameters = parameters;
          model.report.parameters.splice(paramIdx, 1, result.param)[0];

          // Remove old data source for parameter
          if (p.query) {
            var dsIdx = this.findDataSourceIdxByName(model.report, p.query);
            if (dsIdx != -1) {
              model.report.dataSources.splice(dsIdx, 1);
            }
          }

          // Add the new data source if necessary
          if (result.dataSource != undefined) {
            model.report.dataSources.push(result.dataSource);
          }

          // Change current parameter value
          var newParamValue;

          if (!filterFromGwtDialog.useFirstValue) {
            newParamValue = (filterFromGwtDialog.defaultValue &&
            filterFromGwtDialog.defaultValue[0] != '' &&
            filterFromGwtDialog.defaultValue[0] != null) ?
                filterFromGwtDialog.defaultValue[0] : undefined;
          }
          view.promptApi.operation.setParameterValue(p, newParamValue);

          view.refreshParameterPanel(true);
        }
      }

      pentaho.pir.controller.prototype.filterToMqlString = function (filter) {
        if (!this.datasource) {
          return;
        }
        // mock required actions
        var query = this.datasource.createQuery();
        var parameters = query.state.parameters;
        var isParameterized = filter.parameterName && filter.parameterName != null && filter.parameterName.length > 0;
        var value = filter.value;
        if (isParameterized) {
          query.addParameterById(filter.column, filter.parameterName, null, filter.value);
        }
        var column = this.datasource.getColumnById(filter.column);
        var category = column.parent.id;

        var mqlString = query.getFilterConditionString(filter.column, category, filter.operator, value, filter.parameterName, parameters, filter.selectedAggType)

        // support 'excludes'
        var combinationType = filter.combinationType + '';
        if (combinationType.indexOf('NOT') != -1) {
          mqlString = 'NOT(' + mqlString + ')';
        }

        return mqlString;
      };

      pentaho.pir.controller.prototype.sendRequest = function(url, options) {
        return request(url, options);
      };

      pentaho.pir.controller.prototype.cancelCurrentAsyncJob = function() {
        this.resetPageNumber();
        if (controller._isAsync && controller._currentReportUuid !== null) {
          controller.cancel(controller._currentReportStatus, controller._currentReportUuid);
          controller._currentReportStatus = 'CANCELED';
          controller._canceledReportUuid = controller._currentReportUuid;
          var feedbackScreenDlg = registry.byId('feedbackScreen');
          feedbackScreenDlg.hide();
          domClass.add('notification-screen', 'hidden');
          view.hideGlassPane();
        }
      };

      pentaho.pir.controller.prototype.fetchAsyncModeEnabledStatus = function () {
        if (this._isAsync === null) {
          var asyncConf = pentahoGet(CONTEXT_PATH + "plugin/pentaho-interactive-reporting/api/jobs/config", "");
          if (asyncConf) {
            asyncConf = JSON.parse(asyncConf);
            this._isAsync = asyncConf.supportAsync;
            this._pollingInterval = asyncConf.pollingIntervalMilliseconds;
            this._dialogThreshold = asyncConf.dialogThresholdMilliseconds;
          }
        }
      };

      //Textarea here is mandatory to avoid XSS
      pentaho.pir.controller.prototype.decodeHtml = function(encodedString) {
        if (encodedString === null){
          return '';
        }
        try {
          var textArea = document.createElement('textarea');
          textArea.innerHTML = encodedString;
          var res = textArea.value;
          if (textArea.remove !== undefined) {
            textArea.remove();
          }
          return res;
        }catch (e){
          return encodedString;
        }
      };

    });
