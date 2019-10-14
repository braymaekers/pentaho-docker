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
define(["dojo/_base/declare", "dojo/on", "dojo/query", "dojo/_base/lang","dijit/_WidgetBase"
  ,"dijit/_Templated"
  ,"dijit/form/NumberTextBox", "dojo/dom-class", "dojo/keys"],
    function(declare, on, query, lang, _WidgetBase, _Templated, NumberTextBox, domClass, keys){

      /**
       * Pentaho Interactive Reporting Page Control Component.
       *
       * To declare:
       * <div dojoType="pentaho.pir-page-control" id="mypagecontrol"></div>
       *   or
       * var pc = new pentaho.pir.PageControl();
       *
       * To initialize before use (for example):
       * var pc = registry.byId("mypagecontrol");
       * pc.registerLocalizationLookup(mylocaleservice.getString);
       * pc.registerPageNumberChangeCallback(controller.updatePageNumber);
       *
       */
      return declare(
  "pentaho.pir.PageControl",
  [_WidgetBase, _Templated],
{
  // Parse widgets in template string
  widgetsInTemplate: true,
  // Template for this widget
  templateString: "<div class='pc_pageControlContainer' data-dojo-attach-point='containerNode'><div class='pc_pagePrev' data-dojo-attach-point='prevPageControl'></div><div class='pc_pageNext' data-dojo-attach-point='nextPageControl'></div><div data-dojo-attach-point='pageNumberInput' data-dojo-type='dijit.form.NumberTextBox' class='pc_pageNumberInput' constraints='{min:1}'></div><div class='pc_pageTotal contrast-color' data-dojo-attach-point='pageTotalSpan'>/ ##</div></div>",

  // Function for retrieving localized strings
  getLocaleString: null,

  // Callback to set page number
  changePageNumberCallback: null,

  // Current page number
  pageNumber: 1,

  // Total pages in this report
  pageTotal: 1,

  // Called once per instance
  postCreate: function() {
    this._resetPageNumber();
    this.setPageCount(this.pageTotal);
    on(this.pageNumberInput, "change", lang.hitch( this,  this._changePageNumber));
    on(this.pageNumberInput, "keyup", lang.hitch( this,  this._pageNumberKeyUp));
    on(this.prevPageControl, "click", lang.hitch( this,  this._prevPage));
    on(this.nextPageControl, "click", lang.hitch( this,  this._nextPage));
    on(this.pageTotalSpan, "mousedown", lang.hitch( this,  this._pageTotalMouseDown));
  },

  registerLocalizationLookup: function(f) {
    this.getLocaleString = f;
    this._localize();
  },

  registerPageNumberChangeCallback: function(f) {
    this.changePageNumberCallback = f;
  },

  setPageNumber: function(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.pageTotal) {
      // TODO Alert user of invalid entry
      this._resetPageNumber();
      return;
    }
    try {
      this._updateInternalPageNumber(pageNumber);
    } catch (err) {
      console.error("Unable to update page number: " + err);
      this._resetPageNumber();
    }
  },
  
  getPageNumber: function() {
    return this.pageNumberInput.get("value");
  },

  getPageTotal: function() {
    return this.pageTotal;
  },

  setPageCount: function(pageCount) {
	    if (typeof(pageCount) == 'number') {
	      this.pageTotal = pageCount;
	    } else {
	      this.pageTotal = 1; // Reset to default
	    }
	    this.pageTotalSpan.innerHTML = '/ ' + pageCount;
	    this._updatePageButtonState();
  },

  reset: function() {
    this._updateInternalPageNumber(1);
  },
  
  _localize: function() {
    this.prevPageControl.setAttribute( "title", this.getLocaleString("PageControlPreviousPage_title"));
    this.nextPageControl.setAttribute( "title", this.getLocaleString("PageControlNextPage_title"));
  },

  _updatePageButtonState: function() {
    this.pagePrevDisabled = this.pageNumber == 1;
    this.pageNextDisabled = this.pageTotal == this.pageNumber;
    if (this.pagePrevDisabled) {
      domClass.add(this.prevPageControl, "pc_pagePrevDisabled");
    } else {
      domClass.remove(this.prevPageControl, "pc_pagePrevDisabled");
    }
    if (this.pageNextDisabled) {
      domClass.add(this.nextPageControl, "pc_pageNextDisabled");
    } else {
      domClass.remove(this.nextPageControl, "pc_pageNextDisabled");
    }
  },

  _changePageNumber: function() {
    if (this.ignorePageNumberUpdate) {
      return;
    }
    if (!this.pageNumberInput.isValid()) {
      this._resetPageNumber();
      return;
    }
    this.setPageNumber(this.pageNumberInput.get("value"));
  },

  _updateInternalPageNumber: function(pageNumber) {
    this.ignorePageNumberUpdate = true;
    try {
      if (this.changePageNumberCallback) {
        this.changePageNumberCallback(pageNumber);
      }
      this.pageNumber = pageNumber;
      this.pageNumberInput.set("value", this.pageNumber);
      this._updatePageButtonState();
    } finally {
       this.ignorePageNumberUpdate = false;
    }
    this.pageNumber = pageNumber;
    this.pageNumberInput.set("value", this.pageNumber);
    this._updatePageButtonState();
  },

  _pageNumberKeyUp: function(event) {
    switch (event.keyCode) {
      case keys.ENTER:
        this._changePageNumber();
        break;
      case keys.ESCAPE:
        this._resetPageNumber();
        break;
      default:
        // We don't care about any other key
        break;
    }
  },

  _resetPageNumber: function() {
    this.ignorePageNumberUpdate = true;
    try {
      this.pageNumberInput.set("value", this.pageNumber);
    } finally {
      this.ignorePageNumberUpdate = false;
    }
    this._updatePageButtonState();
  },

  // Change to the previous page
  _prevPage: function() {
    if (this.pagePrevDisabled) {
      return;
    }
    this.setPageNumber(this.pageNumber - 1);
  },

  // Change to the next page
  _nextPage: function() {
    if (this.pageNextDisabled) {
      return;
    }
    this.setPageNumber(this.pageNumber + 1);
  },

  _pageTotalMouseDown: function(e) {
    e.preventDefault();
  }
});
    });