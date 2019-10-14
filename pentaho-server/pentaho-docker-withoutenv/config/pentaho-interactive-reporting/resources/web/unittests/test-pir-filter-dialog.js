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

dojo.require("pentaho.common.FilterDialog");
doh.register("PIR Filter Dialog Tests", [
  {
    name: "1. Create",
    runTest: function() {
      var fd = new pentaho.common.FilterDialog();
      doh.assertTrue(fd != "undefined");
      doh.assertEqual(500, fd.searchListLimit);
    }
  },
  {
    name: "2. Localization",
    runTest: function() {
      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      doh.assertEqual("@@filterDialogTypePicklistSpan_content@@", fd.typePicklistSpan.innerHTML);
      doh.assertEqual("@@filterDialogTypeMatchSpan_content@@", fd.typeMatchSpan.innerHTML);
      doh.assertEqual("@@filterDialogPicklistHeadingSpan_content@@", fd.picklistHeadingSpan.innerHTML);
      doh.assertEqual("@@filterDialogFindButton_content@@", fd.picklistFindButton.innerHTML);
      doh.assertEqual("@@filterDialogAddSelected_title@@", fd.picklistAddSelected.title);
      doh.assertEqual("@@filterDialogRemoveSelected_title@@", fd.picklistRemoveSelected.title);
      doh.assertEqual("@@filterDialogAddAll_title@@", fd.picklistAddAll.title);
      doh.assertEqual("@@filterDialogRemoveAll_title@@", fd.picklistRemoveAll.title);
      doh.assertEqual("@@filterDialogParameterName_content@@", fd.parameterNameLabel.innerHTML);
      doh.assertEqual("@@filterDialogTypePicklistCombinationTypeLinksIncludeLink_content@@", fd.typePicklistCombinationTypeLinksIncludeLink.innerHTML);
      doh.assertEqual("@@filterDialogTypePicklistCombinationTypeLinksExcludeLink_content@@", fd.typePicklistCombinationTypeLinksExcludeLink.innerHTML);
      doh.assertEqual("@@filterDialogTypePicklistCombinationTypeIncluded_content@@", fd.picklistCombinationTypeIncludeOption.innerHTML);
      doh.assertEqual("@@filterDialogTypePicklistCombinationTypeExcluded_content@@", fd.picklistCombinationTypeExcludeOption.innerHTML);
      doh.assertEqual("@@filterDialogTypePicklistCombinationType_label@@", fd.picklistCombinationTypeSpan.innerHTML);
    }
  },
  {
    name: "3. Configure for a filter",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      filter.value = ["Testing"];
      fd.configureFor(filter);
      
      doh.assertEqual("@@FilterDialogTitle@@ Product Line", fd.title);
      doh.assertEqual("MATCH", fd.filterType);
    }
  },
  {
    name: "4. Set filter type - match",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      filter.value = ["Testing"];
      fd.configureFor(filter);
      
//      dojo.attr(fd.typeMatchInput, "checked", true);
      doh.assertEqual("MATCH", fd.filterType);
      doh.assertEqual("@@FilterDialogTitle@@ Product Line", fd.title);
      doh.assertEqual(filter.operator, fd.matchComparator.value);
      doh.assertEqual(filter.value[0], fd.matchValueInput.value);
    }
  },
  {
    name: "5. Set filter type - picklist",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      filter.value = ["Test", "ing"];
      fd.configureFor(filter);
      
      doh.assertEqual("PICKLIST", fd.filterType);
      doh.assertEqual("@@FilterDialogTitle@@ Product Line", fd.title);
      doh.assertEqual(filter.combinationType, dojo.attr(fd.picklistCombinationType, "value"));
      var usedOptions = dojo.query("option", fd.picklistUsedValues.containerNode);
      doh.assertEqual(2, usedOptions.length);
      doh.assertEqual(filter.value[0], usedOptions[0].value);
      doh.assertEqual(filter.value[1], usedOptions[1].value);
    }
  },
  {
    name: "6. Build filter text",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      filter.value = ["testing"];
      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      // Simple equals
      doh.assertEqual("Product Line " + pentaho.pda.Column.COMPARATOR.STRING[0][0] + " testing", fd.buildFilterText(filter));
      // IN
      filter.value = ["test", "ing"];
      doh.assertEqual("Product Line @@FilterCombinationTypeIn@@ test, ing", fd.buildFilterText(filter));
      // NOT IN
      filter.value = ["test", "ing"];
      filter.combinationType = pentaho.pda.Column.OPERATOR_TYPES.AND_NOT;
      doh.assertEqual("Product Line @@FilterCombinationTypeNotIn@@ test, ing", fd.buildFilterText(filter));
      // <=
      filter.column = "BC_PRODUCTS_BUYPRICE";
      filter.value = ["testing"];
      filter.combinationType = pentaho.pda.Column.OPERATOR_TYPES.AND;
      filter.operator = pentaho.pda.Column.CONDITION_TYPES.LESS_THAN_OR_EQUAL;
      doh.assertEqual("Buy Price " + pentaho.pda.Column.COMPARATOR.NUMERIC[2][0] + " testing", fd.buildFilterText(filter));
      // IN with > 10 values
      filter.column = "BC_PRODUCTS_PRODUCTLINE";
      filter.operator = pentaho.pda.Column.CONDITION_TYPES.EQUAL;
      filter.value = new Array(11);
      doh.assertEqual("Product Line @@FilterCombinationTypeIn@@ " + filter.value.length + " values", fd.buildFilterText(filter));
      // Unknown IN Combination Type, test fail safe output
      filter.value = ["test", "ing"];
      filter.combinationType = pentaho.pda.Column.OPERATOR_TYPES.OR;
      doh.assertEqual("Product Line EQUAL test, ing", fd.buildFilterText(filter));
    }
  },
  {
    name: "7. Picklist Add/Remove All/Selected",
    timeout: 3000,
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      fd.configureFor(filter);
      fd.setFilterType("PICKLIST");

      doh.assertEqual("PICKLIST", fd.filterType);
      doh.assertEqual("@@FilterDialogTitle@@ Product Line", fd.title);

      var deferred = new doh.Deferred();
      setTimeout(function() {
        // Make sure we all values for product line
        doh.assertEqual(7, fd.picklistAvailableValues.containerNode.options.length);

        // select the first two
        var availableOptions = dojo.query("option", fd.picklistAvailableValues.containerNode);
        availableOptions[2].selected = true;
        availableOptions[4].selected = true;
        fd._picklistAddSelected();
        // We should still have all values in the available list
        doh.assertEqual(7, fd.picklistAvailableValues.containerNode.options.length);
        // Make sure the selected ones were copied over
        var usedOptions = fd.picklistUsedValues.containerNode.options;
        doh.assertEqual(2, usedOptions.length);
        doh.assertEqual(availableOptions[2].value, usedOptions[0].value);
        doh.assertEqual(availableOptions[4].value, usedOptions[1].value);

        fd._picklistRemoveAll();
        doh.assertEqual(7, fd.picklistAvailableValues.containerNode.options.length);
        doh.assertEqual(0, fd.picklistUsedValues.containerNode.options.length);

        fd._picklistAddAll();
        doh.assertEqual(7, fd.picklistAvailableValues.containerNode.options.length);

        doh.assertEqual(7, fd.picklistUsedValues.containerNode.options.length);

        var usedOptions = fd.picklistUsedValues.containerNode.options;
        var removedOption1 = usedOptions[1];
        var removedOption2 = usedOptions[5];
        removedOption1.selected = true;
        removedOption2.selected = true;

        fd._picklistRemoveSelected();
        doh.assertEqual(7, fd.picklistAvailableValues.containerNode.options.length);

        doh.assertEqual(5, fd.picklistUsedValues.containerNode.options.length);
        var foundRemovedOptions = false;
        dojo.some(fd.picklistUsedValues.containerNode.options, function(option) {
          if (option.value == removedOption1.value || option.value == removedOption2.value) {
            foundRemovedOptions = true;
            return true;
          }
        }, this);
        doh.assertTrue(!foundRemovedOptions);

        // Add already used values
        fd.picklistAvailableValues.reset();
        doh.assertEqual(5, fd.picklistUsedValues.containerNode.options.length);
        availableOptions = fd.picklistAvailableValues.containerNode.options;
        availableOptions[0].selected = true;
        fd._picklistAddSelected();
        doh.assertEqual(5, fd.picklistUsedValues.containerNode.options.length);
        deferred.callback(true);
      }, 1000);
      return deferred;
    }
  },
  {
    name: "8. Save - MATCH - NUMERIC",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_BUYPRICE");
      fd.configureFor(filter);
      fd.show();
      doh.assertTrue(fd.popup.open);

      // TODO Need to register a callback to perform error prompting or we can't test this in a headless, non-interactive environment
      // Save without a value shouldn't actually save anything
//      fd.save();
//      doh.assertTrue(fd.popup.open);

      // Set a value so we can save it
      dojo.attr(fd.matchValueInput, "value", "100");
      fd.save();
      doh.assertTrue(!fd.popup.open);

      doh.assertEqual(filter.value[0], "100");
    }
  },
  {
    name: "9. Save - MATCH - DATE",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_ORDERS_ORDERDATE");
      fd.configureFor(filter);
      fd.show();
      doh.assertTrue(fd.popup.open);

      // TODO Need to register a callback to perform error prompting or we can't test this in a headless, non-interactive environment
      // Save without a value shouldn't actually save anything
//      fd.save();
//      doh.assertTrue(fd.popup.open);

      // Set a value so we can save it
      fd.matchValueInputDate.setValue(new Date(2003, 0, 13));
      // Select the second option
      var comparator = dojo.query("option", fd.matchComparator)[1];
      comparator.selected = true;
      fd.save();
      doh.assertTrue(!fd.popup.open);

      doh.assertEqual(filter.value[0], "2003-01-13");
      doh.assertEqual(filter.operator, comparator.value);
    }
  },
  {
    name: "10. Save - MATCH - STRING",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      fd.configureFor(filter);
      fd.show();
      doh.assertTrue(fd.popup.open);

      // TODO Need to register a callback to perform error prompting or we can't test this in a headless, non-interactive environment
      // Save without a value shouldn't actually save anything
//      fd.save();
//      doh.assertTrue(fd.popup.open);

      // Set a value so we can save it
      dojo.attr(fd.matchValueInput, "value", "Classic Cars");
      fd.save();
      doh.assertTrue(!fd.popup.open);

      doh.assertEqual(filter.value[0], "Classic Cars");
    }
  },
  {
    name: "11. Save - PICKLIST",
    timeout: 3000,
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      fd.configureFor(filter);
      fd.show();
      fd.setFilterType("PICKLIST");
      doh.assertTrue(fd.popup.open);

      // TODO Need to register a callback to perform error prompting or we can't test this in a headless, non-interactive environment
      // Save without a value shouldn't actually save anything
//      fd.save();
//      doh.assertTrue(fd.popup.open);

      var deferred = new doh.Deferred();
      setTimeout(function() {
        // Set a value so we can save it
        var availableOptions = dojo.query("option", fd.picklistAvailableValues.containerNode);
        availableOptions[2].selected = true;
        availableOptions[4].selected = true;
        fd._picklistAddSelected();
        
        fd.save();
        doh.assertTrue(!fd.popup.open);

        doh.assertEqual(2, filter.value.length);
        doh.assertEqual(availableOptions[2].value, filter.value[0]);
        doh.assertEqual(availableOptions[4].value, filter.value[1]);
        deferred.callback(true);
      }, 1000);
      return deferred;
    }
  },
  {
    name: "13. Filter Picklist",
    timeout: 10000,
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      fd.configureFor(filter);
      fd.setFilterType("PICKLIST");
      
      doh.assertEqual("PICKLIST", fd.filterType);
      doh.assertEqual("@@FilterDialogTitle@@ Product Line", fd.title);

      var deferred = new doh.Deferred();
      setTimeout(function() {
        // Make sure we all values for product line
        doh.assertEqual(7, dojo.query("option", fd.picklistAvailableValues.containerNode).length);
        
        fd.picklistFindInput.set("value", "C");
        fd._picklistFindKeyPressed({keyCode: dojo.keys.ENTER});
        setTimeout(function() {
          doh.assertEqual(2, dojo.query("option", fd.picklistAvailableValues.containerNode).length);
          
          fd.picklistFindInput.set("value", "");
          fd._picklistFindKeyPressed({keyCode: dojo.keys.ENTER});
          setTimeout(function() {
            doh.assertEqual(7, dojo.query("option", fd.picklistAvailableValues.containerNode).length);
            deferred.callback(true);
          }, 1000);
        }, 1000);
      }, 1000);
      return deferred;
    }
  },
  {
    name: "14. Cancel",
    timeout: 3000,
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      fd.configureFor(filter);
      fd.show();
      fd.setFilterType("PICKLIST");
      doh.assertTrue(fd.popup.open);

      // TODO Need to register a callback to perform error prompting or we can't test this in a headless, non-interactive environment
      // Save without a value shouldn't actually save anything
//      fd.save();
//      doh.assertTrue(fd.popup.open);

      var deferred = new doh.Deferred();
      setTimeout(function() {
        // Set a value so we can save it
        var availableOptions = dojo.query("option", fd.picklistAvailableValues.containerNode);
        availableOptions[2].selected = true;
        availableOptions[4].selected = true;
        fd._picklistAddSelected();
        
        fd.cancel();
        doh.assertTrue(!fd.popup.open);

        doh.assertEqual(null, filter.value);
        deferred.callback(true);
      }, 2000);
      
      return deferred;
    }
  },
  {
    name: "15. Configure for a filter - date",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_ORDERS_ORDERDATE");
      fd.configureFor(filter);
      
      doh.assertEqual("@@FilterDialogTitle@@ Order Date", fd.title);
      doh.assertEqual("MATCH", fd.filterType);
      doh.assertEqual(null, fd.matchValueInputDate.getValue());
      
      filter.value = ["2000-01-10"];
      fd.configureFor(filter);
      doh.assertEqual(new Date(2000, 0, 10), fd.matchValueInputDate.getValue());
    }
  },
  {
    name: "16. onSuccess/onCancel Callbacks",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var filter = model.createFilter("BC_PRODUCTS_BUYPRICE");
      
      var onSuccessFilter;
      var onSuccess = function(f) {
        onSuccessFilter = f;
      }
      
      var onCancelFilter;
      var onCancel = function(f) {
        onCancelFilter = f;
      }
      
      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.registerOnSuccessCallback(onSuccess);
      fd.registerOnCancelCallback(onCancel);
      fd.setDatasource(controller.datasource);
      
      fd.configureFor(filter);
      
      fd.cancel();
      doh.assertEqual(undefined, onSuccessFilter);
      doh.assertEqual(filter, onCancelFilter);
      onCancelFilter = undefined;

      // TODO Need to register a callback to perform error prompting or we can't test this in a headless, non-interactive environment
      // Save without a value shouldn't actually save anything
//      fd.save();
//      doh.assertTrue(fd.popup.open);

      // Set a value so we can save it
      dojo.attr(fd.matchValueInput, "value", "100");
      fd.save();
      doh.assertEqual(filter, onSuccessFilter);
      doh.assertEqual(undefined, onCancelFilter);

      doh.assertEqual(filter.value[0], "100");
    }
  },
  {
    name: "17. Save - MATCH - STRING - Is Null",
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      controller.init();
      controller.setModel('steel-wheels:BV_ORDERS');

      var fd = new pentaho.common.FilterDialog();
      fd.setLocalizationLookupFunction(function(key) {
        return "@@" + key + "@@";
      });
      fd.setDatasource(controller.datasource);
      
      var filter = model.createFilter("BC_PRODUCTS_PRODUCTLINE");
      fd.configureFor(filter);
      fd.show();
      doh.assertTrue(fd.popup.open);

      // TODO Need to register a callback to perform error prompting or we can't test this in a headless, non-interactive environment
      // Save without a value shouldn't actually save anything
//      fd.save();
//      doh.assertTrue(fd.popup.open);

      // Set a value so we can save it
      dojo.attr(fd.matchValueInput, "value", "Classic Cars");
      dojo.query("option", fd.matchComparator)[5].selected = true; // Select "Is null"
      fd.save();
      doh.assertTrue(!fd.popup.open);

      doh.assertTrue(dojo.isArray(filter.value));
      doh.assertEqual(filter.value[0], "");
    }
  }
]);
