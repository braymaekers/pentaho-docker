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

define(["dojo/_base/declare", "dojo/on", "dojo/query", "dojo/_base/lang","dijit/_WidgetBase"
  ,"dijit/_Templated"
  ,"dijit/form/DateTextBox"
  ,'pentaho/common/Dialog', "dojo/text!pir/PageSetupDialog.html", "dojo/dom-class"],
    function(declare, on, query, lang, _WidgetBase, _Templated, DateTextBox, Dialog, templateStr, domClass){
      return declare("pentaho.pir.PageSetupDialog",[Dialog],
{
  templateString: templateStr,
  widgetsInTemplate: true,
  buttons: ['Ok','Cancel'],
  
  ORIENTATION_LANDSCAPE: 0,
  ORIENTATION_PORTRAIT: 1,
  orientation: undefined,
  _onCancelCallback: undefined,
  
  postMixInProperties: function() {
    this.inherited(arguments);
  },

  postCreate: function() {
    this.inherited(arguments);
  },

  /**
   * Function to call when the user has canceled out of the dialog.
   */
  registerOnCancelCallback: function(f) {
    this._onCancelCallback = f;
  },
  
  onCancel: function() {
	  this.cancel();
  },
	  
  cancel: function() {
    if (this._onCancelCallback) {
      try {
        this._onCancelCallback(this.currentFilter);
      } catch (e) {
        console.warn("Error in onCancelCallback of PageSetup Dialog: " + e);
      }
    }
    this.hide();
  },  
  
  setTitle: function(title) {
    this.set("title",title);
  },

  setOrientation: function(o) {
    this.orientation = o;
    switch(o) {
      case this.ORIENTATION_PORTRAIT:
        domClass.add(this.portraitContainer, "pageSetupDialogPortraitSelected");
        domClass.remove(this.landscapeContainer, "pageSetupDialogLandscapeSelected");
        break;
      case this.ORIENTATION_LANDSCAPE:
        domClass.remove(this.portraitContainer, "pageSetupDialogPortraitSelected");
        domClass.add(this.landscapeContainer, "pageSetupDialogLandscapeSelected");
        break;
      default:
        // Unknown, deselect both
        domClass.remove(this.portraitContainer, "pageSetupDialogPortraitSelected");
        domClass.remove(this.landscapeContainer, "pageSetupDialogLandscapeSelected");
    }
  },
  
  getOrientation: function() {
    return this.orientation;
  },
  
  _orientationClicked: function(event) {
    if (event.target === this.portraitContainer) {
      this.setOrientation(this.ORIENTATION_PORTRAIT);
    } else if (event.target === this.landscapeContainer) {
      this.setOrientation(this.ORIENTATION_LANDSCAPE);
    } else {
      this.setOrientation(-1);
    }
  }
});
    });
