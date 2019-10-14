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

define([
  "dojo/_base/declare",
  "dojo/on",
  "dojo/query",
  "dojo/_base/lang",
  "dojo/html",
  "dojo/dom-class",
  "dojo/dom"
], function(declare, on, query, lang, html, domClass, dom) {

  /**
   * @class  cv.ReportHighlighter
   *
   * @private
   */
  cv.ReportHighlighter = function(obj) {
    this.currentCell = null;

    this.columnHeaders =
        dom.byId("pivotTableColumnHeaderContainer").childNodes[0];
    this.rowLabels =
        dom.byId("pivotTableRowLabelContainer").childNodes[0];

    this.dataTable = dom.byId("pivotTableDataContainer").childNodes[0];
    this.handles = [];

    this.enable();
  };

  cv.ReportHighlighter.prototype = /** @lends cv.ReportHighlighter# */{

    enable: function() {
      this.handles.push(on(this.dataTable, "mousemove", lang.hitch(this, "_highlight")));
      this.handles.push(on(this.dataTable, "mouseout", lang.hitch(this, "_unHighlight")));
    },

    disable: function() {
      array.forEach(this.handles,
          function(handle){
            handle.remove();
          }
      );

      this._unHighlight(null);
    },

    _highlight: function(e) {
      var obj = e.target;

      while (obj.tagName != "TD") {
        obj = obj.parentNode;
      }

      if (this.currentCell != obj) {
        if (this.currentCell != null) {
          this._unHighlight(null);
        }

        this.currentCell = obj;
        this._highlightRow(this.currentCell, true);
        this._highlightColumn(this.currentCell, true);
        this._highlightRowLabels(this.currentCell, true);
        this._highlightColumnLabels(this.currentCell, true);

        this._setClass(this.currentCell, "highlightedCell", true);
      }

    },

    _unHighlight: function(e) {
      var cell = this.currentCell;
      this.currentCell = null;
      if (cell == null) {
        return;
      }
      this._highlightRow(cell, false);
      this._highlightColumn(cell, false);
      this._highlightRowLabels(cell, false);
      this._highlightColumnLabels(cell, false);
      this._setClass(cell, "highlightedCell", false);
    },

    _setClass: function(obj, style, use) {
      if (use) {
        domClass.add(obj, style);
      } else {
        domClass.remove(obj, style);
      }
    },

    _highlightRow: function(obj, use) {
      var row = obj.parentNode;
      var cells = row.childNodes;

      for (var i = 0; i < cells.length; i++) {
        if (cells[i] != obj) {
          this._setClass(cells[i], "highlightedRow", use);
        }
      }
    },

    _highlightColumn: function(obj, use) {
      var colIndex = obj.getAttribute("colindex") * 1;

      var rows = this.dataTable.getElementsByTagName("TR");
      for (var i = 0; i < rows.length; i++) {
        var cell = rows[i].childNodes[colIndex];
        if (cell != obj) {
          this._setClass(cell, "highlightedColumn", use);
        }
      }
    },

    _highlightRowLabels: function(obj, use) {
      var rowIndex = obj.getAttribute("rowindex") * 1;

      var rows = this.rowLabels.getElementsByTagName("TR");

      if (rows.length == 0) {
        return;
      }

      var numCols = rows[0].childNodes.length;

      var i = 0;
      var numHighlightedLabels = 0;

      for (i = 0; i < rows[rowIndex].childNodes.length; i++) {
        var cell = rows[rowIndex].childNodes[i];
        var colspan = cell.getAttribute("colspan") * 1;
        numHighlightedLabels += colspan;

        this._setClass (cell, "highlighted", use);
      }

      var curRowIndex = rowIndex - 1;

      while (true) {
        if (numHighlightedLabels == numCols) {
          break;
        }

        for (var j = 0; j < rows[curRowIndex].childNodes.length; j++) {
          var cell = rows[curRowIndex].childNodes[j];
          var rowspan = cell.getAttribute("rowspan") * 1;
          if (curRowIndex + rowspan > rowIndex) {
            var colspan = cell.getAttribute("colspan") * 1;
            numHighlightedLabels += colspan;
            this._setClass (cell, "highlighted", use);
          }
        }

        curRowIndex--;
      }



    },

    _highlightColumnLabels: function(obj, use) {
      var parentHeaders =
          cv.resizer.getParentHeaders (
              this.columnHeaders.getElementsByTagName("TR"),
              obj.getAttribute("colindex") * 1);
      for (var i = 0; i < parentHeaders.length; i++) {
        this._setClass (parentHeaders[i].parentNode, "highlighted", use);
      }
    }
  };
});
