/*!
  * HITACHI VANTARA PROPRIETARY AND CONFIDENTIAL
  *
  * Copyright 2019 Hitachi Vantara. All rights reserved.
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

(function() {

  if(typeof document == "undefined" || document.location.href.indexOf("debug=true") > 0) {
    return;
  }

  require.config({
    bundles: {
      "pir/module": [
        "dojo/has",
        "dojo/_base/config",
        "dojo/_base/kernel",
        "dojo/sniff",
        "dojo/_base/lang",
        "dojo/_base/declare",
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/on",
        "dojo/Evented",
        "dojo/topic",
        "dojo/_base/window",
        "dojo/dom",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "dojo/_base/event",
        "dojo/mouse",
        "dojo/_base/sniff",
        "dojo/keys",
        "dojo/_base/connect",
        "dojo/dom-construct",
        "dojo/dom-prop",
        "dojo/dom-attr",
        "dojo/dom-class",
        "dojo/ready",
        "dojo/errors/create",
        "dojo/errors/CancelError",
        "dojo/promise/Promise",
        "dojo/Deferred",
        "dojo/when",
        "dojo/Stateful",
        "dijit/Destroyable",
        "dijit/main",
        "dijit/registry",
        "dijit/_WidgetBase",
        "dojo/text",
        "dojo/cache",
        "dojo/string",
        "dojo/domReady",
        "dojo/touch",
        "dijit/_AttachMixin",
        "dijit/_TemplatedMixin",
        "dojo/_base/url",
        "dojo/promise/all",
        "dojo/date/stamp",
        "dojo/selector/_loader",
        "dojo/query",
        "dojo/parser",
        "dijit/_WidgetsInTemplateMixin",
        "dojox/html/entities",
        "dojo/text!pentaho/common/SmallImageButton.html",
        "pentaho/common/SmallImageButton",
        "dijit/_Templated",
        "dojo/window",
        "dijit/Viewport",
        "dijit/place",
        "dijit/BackgroundIframe",
        "dijit/popup",
        "dojo/text!dijit/templates/Menu.html",
        "dijit/a11yclick",
        "dijit/_OnDijitClickMixin",
        "dijit/a11y",
        "dijit/focus",
        "dijit/_FocusMixin",
        "dojo/uacss",
        "dojo/hccss",
        "dijit/hccss",
        "dijit/_Widget",
        "dijit/_CssStateMixin",
        "dijit/_Container",
        "dijit/_KeyNavMixin",
        "dijit/_KeyNavContainer",
        "dijit/_MenuBase",
        "dijit/DropDownMenu",
        "dijit/Menu",
        "dojo/text!pentaho/common/Menu.html",
        "pentaho/common/Menu",
        "dijit/_Contained",
        "dojo/text!dijit/templates/MenuItem.html",
        "dijit/MenuItem",
        "dojo/text!pentaho/common/ListItem.html",
        "pentaho/common/ListItem",
        "dojo/text!dijit/templates/MenuSeparator.html",
        "dijit/MenuSeparator",
        "dojo/text!pentaho/common/MenuSeparator.html",
        "pentaho/common/MenuSeparator",
        "dojo/json",
        "dojo/i18n",
        "dojo/_base/Deferred",
        "dojo/data/util/sorter",
        "dojo/store/util/QueryResults",
        "dijit/form/_FormWidgetMixin",
        "dijit/form/_FormWidget",
        "dijit/form/_FormValueMixin",
        "dijit/form/_FormValueWidget",
        "dijit/form/_FormSelectWidget",
        "dijit/_HasDropDown",
        "dojo/_base/Color",
        "dojo/_base/fx",
        "dijit/_base/manager",
        "dojo/text!dijit/templates/Tooltip.html",
        "dijit/Tooltip",
        "dojo/text!dijit/form/templates/Select.html",
        "dijit/form/Select",
        "dojo/text!pentaho/common/Select.html",
        "pentaho/common/Select",
        "dojo/text!pentaho/common/ListBox.html",
        "pentaho/common/ListBox",
        "dojo/dnd/common",
        "dojo/dnd/autoscroll",
        "dojo/dnd/Mover",
        "dojo/dnd/Moveable",
        "dojo/dnd/TimedMoveable",
        "dijit/form/_FormMixin",
        "dijit/_DialogMixin",
        "dijit/DialogUnderlay",
        "dijit/layout/utils",
        "dijit/layout/_ContentPaneResizeMixin",
        "dojo/html",
        "dojo/io-query",
        "dojo/dom-form",
        "dojo/_base/json",
        "dojo/errors/RequestError",
        "dojo/request/util",
        "dojo/errors/RequestTimeoutError",
        "dojo/request/watch",
        "dojo/request/handlers",
        "dojo/request/xhr",
        "dojo/_base/xhr",
        "dijit/layout/ContentPane",
        "dojo/text!dijit/templates/Dialog.html",
        "dijit/Dialog",
        "dojo/text!pentaho/common/button.html",
        "pentaho/common/button",
        "dojo/request/default",
        "dojo/request",
        "pentaho/common/Messages",
        "pentaho/common/Dialog",
        "dojo/text!pentaho/common/MessageBox.html",
        "pentaho/common/MessageBox",
        "dojo/text!pentaho/common/datasourceselect.html",
        "pentaho/common/datasourceselect",
        "dojo/text!pentaho/common/MenuItem.html",
        "pentaho/common/MenuItem",
        "pentaho/common/TabSet",
        "dojo/_base/html",
        "dojo/NodeList-dom",
        "dojo/_base/NodeList",
        "dojo/dnd/Container",
        "dojo/dnd/Selector",
        "dojo/dnd/Avatar",
        "dojo/dnd/Manager",
        "dojo/dnd/Source",
        "pentaho/common/FieldList",
        "dijit/form/_ButtonMixin",
        "dojo/text!dijit/form/templates/Button.html",
        "dijit/form/Button",
        "dojo/text!dijit/form/templates/DropDownButton.html",
        "dijit/form/DropDownButton",
        "dojo/text!dijit/form/templates/ComboButton.html",
        "dijit/form/ComboButton",
        "dijit/PopupMenuItem",
        "pentaho/common/PopupMenuItem",
        "dojo/fx",
        "dojo/dnd/move",
        "dijit/selection",
        "dijit/_base/focus",
        "dijit/typematic",
        "dojox/main",
        "dojo/colors",
        "dojox/color/_base",
        "dojox/color",
        "dojo/text!dojox/widget/ColorPicker/ColorPicker.html",
        "dojox/widget/ColorPicker",
        "dojo/text!pentaho/common/CustomColorPicker/CustomColorPicker.html",
        "dojo/text!dijit/templates/ColorPalette.html",
        "dijit/_PaletteMixin",
        "dijit/ColorPalette",
        "pentaho/common/CustomColorPicker",
        "dojo/text!pentaho/common/ComboColorPicker.html",
        "pentaho/common/ComboColorPicker",
        "dojo/text!dijit/templates/CheckedMenuItem.html",
        "dijit/CheckedMenuItem",
        "dojo/text!pentaho/common/CheckedMenuItem.html",
        "pentaho/common/CheckedMenuItem",
        "pentaho/common/ContextHelp",
        "pentaho/common/FilterIndicator",
        "dojo/text!dijit/templates/TooltipDialog.html",
        "dijit/TooltipDialog",
        "dojo/date",
        "dojo/cldr/supplemental",
        "dojo/regexp",
        "dojo/date/locale",
        "dojo/text!dijit/templates/Calendar.html",
        "dijit/CalendarLite",
        "dijit/Calendar",
        "dojo/text!pentaho/common/Calendar.html",
        "dojo/text!pentaho/common/DropDownButton.html",
        "pentaho/common/DropDownButton",
        "pentaho/common/Calendar",
        "dijit/form/_TextBoxMixin",
        "dojo/text!dijit/form/templates/TextBox.html",
        "dijit/form/TextBox",
        "dojo/text!dijit/form/templates/ValidationTextBox.html",
        "dijit/form/ValidationTextBox",
        "dijit/form/MappedTextBox",
        "dijit/form/RangeBoundTextBox",
        "dojo/text!dijit/form/templates/DropDownBox.html",
        "dijit/form/_DateTimeTextBox",
        "dijit/form/DateTextBox",
        "dojo/text!pentaho/common/DropDownBox.html",
        "pentaho/common/DateTextBox",
        "dojo/text!pentaho/common/FilterDialog.html",
        "dijit/form/MultiSelect",
        "pentaho/common/FilterDialog",
        "dojo/text!pentaho/common/SplashScreen.html",
        "pentaho/common/SplashScreen",
        "common-repo/pentaho-thin-app",
        "dojo/text!pentaho/common/TemplatePicker.html",
        "pentaho/common/TemplatePicker",
        "dijit/Toolbar",
        "dijit/ToolbarSeparator",
        "dojo/text!pentaho/common/TextAreaInput.html",
        "dijit/form/_ExpandingTextAreaMixin",
        "dijit/form/SimpleTextarea",
        "dijit/form/Textarea",
        "pentaho/common/TextAreaInput",
        "pir/dojoInit",
        "common-repo/state",
        "common-repo/module",
        "common-data/oop",
        "common-data/app",
        "common-data/controller",
        "common-data/xhr",
        "common-data/cda",
        "common-repo/pentaho-ajax",
        "common-data/models-mql",
        "common-data/module",
        "pir/model",
        "dojo/text!dijit/layout/templates/TabContainer.html",
        "dojo/cookie",
        "dijit/layout/_LayoutWidget",
        "dijit/layout/StackContainer",
        "dijit/layout/_TabContainerBase",
        "dijit/form/_ToggleButtonMixin",
        "dijit/form/ToggleButton",
        "dijit/layout/StackController",
        "dojo/text!dijit/layout/templates/_TabButton.html",
        "dijit/layout/TabController",
        "dojo/text!dijit/layout/templates/ScrollingTabController.html",
        "dojo/text!dijit/layout/templates/_ScrollingTabControllerButton.html",
        "dijit/layout/ScrollingTabController",
        "dijit/layout/TabContainer",
        "dojo/dnd/Target",
        "dojo/store/Observable",
        "dojo/text!pentaho/common/ExpressionTree/ExpressionTree.html",
        "pentaho/common/ExpressionTree",
        "dojo/store/util/SimpleQueryEngine",
        "dojo/store/Memory",
        "pentaho/common/GlassPane",
        "cdf/lib/Base",
        "cdf/Logger",
        "dojo/number",
        "common-ui/util/util",
        "common-ui/util/GUIDHelper",
        "jquery",
        "jquery",
        "cdf/lib/moment",
        "cdf/lib/CCC/def",
        "cdf/lib/CCC/protovis-compat",
        "cdf/lib/CCC/protovis",
        "cdf/lib/CCC/cdo",
        "cdf/lib/sanitizer",
        "cdf/dashboard/Utils",
        "cdf/components/BaseComponent",
        "common-ui/prompting/components/CompositeComponent",
        "common-ui/prompting/components/PromptLayoutComponent",
        "common-ui/prompting/components/ScrollingPromptPanelLayoutComponent",
        "common-ui/prompting/builders/PromptPanelBuilder",
        "common-ui/prompting/components/TableBasedPromptLayoutComponent",
        "common-ui/prompting/components/HorizontalTableBasedPromptLayoutComponent",
        "common-ui/prompting/components/FlowPromptLayoutComponent",
        "common-ui/prompting/components/VerticalTableBasedPromptLayoutComponent",
        "common-ui/prompting/builders/ParameterGroupPanelBuilder",
        "common-ui/prompting/builders/ParameterWidgetBuilderBase",
        "common-ui/prompting/components/PanelComponent",
        "common-ui/prompting/components/ParameterPanelComponent",
        "common-ui/prompting/builders/ParameterPanelBuilder",
        "common-ui/prompting/builders/SubmitPanelBuilder",
        "common-ui/prompting/components/ScopedPentahoButtonComponent",
        "common-ui/prompting/components/SubmitPromptComponent",
        "common-ui/prompting/builders/SubmitComponentBuilder",
        "cdf/components/TextComponent",
        "common-ui/prompting/builders/LabelBuilder",
        "common-ui/prompting/builders/ErrorLabelBuilder",
        "cdf/components/UnmanagedComponent",
        "cdf/components/InputBaseComponent",
        "cdf/components/SelectBaseComponent",
        "cdf/components/SelectComponent",
        "common-ui/prompting/builders/ValueBasedParameterWidgetBuilder",
        "common-ui/prompting/builders/DropDownBuilder",
        "cdf/components/ToggleButtonBaseComponent",
        "cdf/components/RadioComponent",
        "common-ui/prompting/builders/ToggleButtonBaseBuilder",
        "common-ui/prompting/builders/RadioBuilder",
        "cdf/components/CheckComponent",
        "common-ui/prompting/builders/CheckBuilder",
        "cdf/components/MultiButtonComponent",
        "common-ui/prompting/builders/MultiButtonBuilder",
        "cdf/components/SelectMultiComponent",
        "common-ui/prompting/builders/ListBuilder",
        "cdf/lib/moment-timezone",
        "common-ui/util/timeutil",
        "common-ui/util/TextFormatter",
        "common-ui/util/formatting",
        "common-ui/prompting/builders/FormattedParameterWidgetBuilderBase",
        "common-ui/prompting/components/DojoDateTextBoxComponent",
        "common-ui/prompting/builders/DateInputBuilder",
        "common-ui/prompting/components/ExternalInputComponent",
        "common-ui/prompting/builders/ExternalInputBuilder",
        "cdf/components/TextareaInputComponent",
        "common-ui/prompting/builders/TextAreaBuilder",
        "cdf/components/TextInputComponent",
        "common-ui/prompting/builders/TextInputBuilder",
        "common-ui/prompting/components/StaticAutocompleteBoxComponent",
        "common-ui/prompting/builders/StaticAutocompleteBoxBuilder",
        "common-ui/prompting/WidgetBuilder",
        "cdf/dashboard/RefreshEngine",
        "cdf/lib/shims",
        "cdf/dashboard/Dashboard",
        "common-ui/util/URLEncoder",
        "cdf/dashboard/Dashboard.ext",
        "cdf/dashboard/Dashboard.context.ext",
        "cdf/dashboard/Dashboard.context",
        "cdf/dashboard/Container",
        "cdf/dashboard/Dashboard.addIns",
        "cdf/dashboard/Dashboard.bookmarkable",
        "cdf/lib/mustache",
        "cdf/dashboard/Dashboard.components",
        "cdf/lib/cdf.jquery.i18n",
        "cdf/dashboard/Dashboard.i18n",
        "cdf/queries/CdaQuery.ext",
        "cdf/components/XactionComponent.ext",
        "cdf/dashboard/Dashboard.legacy",
        "cdf/dashboard/Dashboard.lifecycle",
        "cdf/dashboard/Dashboard.notifications.ext",
        "cdf/dashboard/Popups",
        "cdf/dashboard/Dashboard.notifications",
        "cdf/dashboard/Utf8Encoder",
        "cdf/dashboard/Dashboard.parameters",
        "cdf/dashboard/Dashboard.storage.ext",
        "cdf/dashboard/Dashboard.storage",
        "cdf/dashboard/Dashboard.dataSources",
        "cdf/dashboard/Dashboard.query",
        "cdf/dashboard/Dashboard.views.ext",
        "cdf/dashboard/Dashboard.views",
        "cdf/dashboard/OptionsManager",
        "cdf/queries/BaseQuery",
        "cdf/queries/CpkQuery",
        "cdf/queries/CdaQuery",
        "cdf/queries/XmlaQuery.ext",
        "cdf/queries/XmlaQuery",
        "cdf/queries/SolrQuery",
        "cdf/Dashboard",
        "cdf/Dashboard.Clean",
        "common-ui/prompting/parameters/ParameterDefinitionDiffer",
        "common-ui/underscore",
        "common-ui/prompting/PromptPanel",
        "common-ui/prompting/api/OperationAPI",
        "common-ui/prompting/api/EventAPI",
        "common-ui/prompting/api/UiAPI",
        "common-ui/util/base64",
        "common-ui/prompting/parameters/Parameter",
        "common-ui/prompting/parameters/ParameterDefinition",
        "common-ui/prompting/parameters/ParameterGroup",
        "common-ui/prompting/parameters/ParameterValue",
        "common-ui/prompting/parameters/ParameterXmlParser",
        "common-ui/prompting/parameters/ParameterValidator",
        "common-ui/prompting/api/UtilAPI",
        "common-ui/prompting/api/PromptingAPI",
        "pir/view",
        "pir/ParameterPanelComponent",
        "pir/ParameterPanelBuilder",
        "dojo/text!dijit/templates/ProgressBar.html",
        "dijit/ProgressBar",
        "dojo/text!pentaho/reportviewer/FeedbackScreen.html",
        "pentaho/reportviewer/FeedbackScreen",
        "pir/controller",
        "dijit/form/NumberTextBox",
        "pir/PageControl",
        "dojo/text!pir/PageSetupDialog.html",
        "pir/PageSetupDialog",
        "pir/AdvancedFilterStore",
        "pir/version",
        "pentaho/reportviewer/ReportDialog",
        "reportviewer/reportviewer",
        "reportviewer/reportviewer-prompt",
        "reportviewer/reportviewer-logging",
        "pentaho/common/PageControl",
        "dojo/text!pentaho/reportviewer/GlassPane.html",
        "pentaho/reportviewer/GlassPane",
        "dojo/text!pentaho/reportviewer/ScheduleScreen.html",
        "pentaho/reportviewer/ScheduleScreen",
        "pentaho/reportviewer/SuccessScheduleScreen",
        "dojo/text!pentaho/common/RowLimitControl.html",
        "pentaho/common/RowLimitControl",
        "dojo/text!pentaho/common/RowLimitMessage.html",
        "pentaho/common/RowLimitMessage",
        "dojo/text!pentaho/common/RowLimitExceededDialog.html",
        "pentaho/common/RowLimitExceededDialog",
        "reportviewer/reportviewer-main-module"
      ]
    }
  });

})();
