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

define([
  "dojo/_base/declare",
  "dojo/on",
  "dojo/query",
  "dojo/_base/lang",
  "dojo/window"
], function(declare, on, query, lang, win) {

  /**
   * @name cv.HelpDialog
   *
   * @class
   * @extends cv.Dialog
   *
   * @private
   */
  return declare("cv.HelpDialog", [cv.Dialog], /** @lends cv.HelpDialog# */{
    constructor: function() {
      this.dlgTemplate = "helpDlg.html";
      this.prefix = "";
    },

    // member functions

    helpIframe : null,
    destroy : function() {

    },

    init : function() {
      this.load();
    },

    showDlg : function(topic) {
      this.showDialog();

      if (this.helpIframe == null) {
        this.helpIframe = this.byId("helpIframe");
      }
      var viewport = win.getBox();

      this.helpIframe.style.height = parseInt(viewport.h * 0.8) + "px"
      this.helpIframe.style.width = parseInt(viewport.w * 0.8) + "px"
      this.helpIframe.src = topic;
    }
  });
});
