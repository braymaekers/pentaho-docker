/*
 * This program is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License, version 2.1 as published by the Free Software
 * Foundation.
 *
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, you can obtain a copy at http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 * or from the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * Copyright 2014 - 2019 Hitachi Vantara. All rights reserved.
 */

/*
 * GLOBAL Callback Registration Example. Simply require 'pentaho/analyzer/cv_api' to register callbacks
 */
require([
  "pentaho/analyzer/cv_api"
], function(api) {
  // ####### START REGISTER EVENTS #######

  api.event.registerInitListener(function(e, cv) {
    console.log("Init callback executed");
    // e.stopImmediatePropagation();
  });

  api.event.registerTableClickListener(function(e, api, td, ctx, filterCtx) {
    var type = td.getAttribute("type");
    console.log("Table clicked! with type = " + type);
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });

  api.event.registerTableContextMenuListener(function(e, api, td, ctx, filterCtx) {
    var type = td.getAttribute("type");
    console.log("Table context menu clicked! with type = " + type);
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });

  api.event.registerRenderListener(function(e, api, reportArea) {
    console.log("Render callback executed");
    // e.stopImmediatePropagation();
  });

  api.event.registerActionEventListener(function(e, api, actionCode, actionCtx) {
    console.log("Action event callback executed with action code " + actionCode + (actionCtx.formula ? " for " + actionCtx.formula : ""));
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });

  api.event.registerChartSelectItemsListener(function(e, api, ctxs) {
    console.log("Chart selection items callback executed");
    // e.stopImmediatePropagation();
  });

  api.event.registerDropEventListener(function(e, api, formula, dropClass) {
    console.log("Drop event callback executed for " + formula + " on " + dropClass);
    // e.stopImmediatePropagation();
  });

  api.event.registerDragEventListener(function(e, api, formula) {
    console.log("Drag event callback executed for " + formula);
    // e.stopImmediatePropagation();
  });

  api.event.registerChartDoubleClickListener(function(e, api, ctx) {
    console.log("Chart double click callback executed");
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });

  api.event.registerTableDoubleClickListener(function(e, api, td, ctx, filterCtx) {
    var type = td.getAttribute("type");
    console.log("Table double click cell callback executed! with type = " + type);
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });

  api.event.registerTableMouseOverListener(function(e, api, td, ctx, filterCtx) {
    var type = td.getAttribute("type");
    console.log("Table cell mouse over callback executed! with type = " + type);
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });

  api.event.registerTableMouseMoveListener(function(e, api, td, ctx, filterCtx) {
    var type = td.getAttribute("type");
    console.log("Table cell mouse move callback executed! with type = " + type);
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });

  api.event.registerBuildMenuListener(function(e, api, menuId, menu, x, y) {
    console.log("Build menu callback executed! with menu id = " + menuId);
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });

  api.event.registerPreExecutionListener(function(e, api) {
    console.log("Pre execution callback executed!");
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });

  api.event.registerPostExecutionListener(function(e, api, message) {
    console.log("Post execution callback executed!");
    // e.preventDefault();
    // e.stopImmediatePropagation();
  });
  // ####### END REGISTER EVENTS #######
});
