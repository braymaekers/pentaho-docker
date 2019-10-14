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

dojo.require("pentaho.pir.PageControl");
doh.register("PIR Page Control Tests", [
  {
    name: "1. Create page control & defaults",
    runTest: function() {
      var pc = new pentaho.pir.PageControl();
      doh.assertTrue(pc != null);

      doh.assertEqual(1, pc.getPageNumber());
      doh.assertEqual(1, pc.getPageTotal());
    }
  },
  {
    name: "2. Localization Registration",
    runTest: function() {
      var pc = new pentaho.pir.PageControl();

      pc.registerLocalizationLookup(function(s) {
        return '!!!' + s + '!!!';
      });

      doh.assertEqual("/ " + pc.getPageTotal(), pc.pageTotalSpan.innerHTML);
      // Handle error will set the total page count to the localized value of
      // key 'PageControlErrorTotal'
      doh.assertEqual("!!!PageControlPreviousPage_title!!!", dojo.attr(pc.prevPageControl, "title"));
      doh.assertEqual("!!!PageControlNextPage_title!!!", dojo.attr(pc.nextPageControl, "title"));
    }
  },
  {
    name: "3. Page Change Callback",
    runTest: function() {
      var pc = new pentaho.pir.PageControl();
      pc.setPageCount(2);

      var page = -1;

      pc.registerPageNumberChangeCallback(function(pageNumber) {
        page = pageNumber;
      });

      doh.assertEqual(1, pc.getPageNumber());
      pc.setPageNumber(2, pc.getPageNumber());
      doh.assertEqual(2, pc.getPageNumber());
      doh.assertEqual(2, page);
    }
  },
  {
    name: "4. Page Change With Callback Error",
    runTest: function() {
      var pc = new pentaho.pir.PageControl();
      pc.setPageCount(2);

      var page = pc.getPageNumber();
      pc.registerPageNumberChangeCallback(function(pageNumber) {
        throw "Bad page " + pageNumber;
      });

      pc.setPageNumber(2);
      doh.assertEqual(1, pc.getPageNumber());
    }
  },
  {
    name: "5. Reset",
    runTest: function() {
      var pc = new pentaho.pir.PageControl();
      var callbackRun = false;
      pc.setPageCount(2);
      pc.setPageNumber(2);
      doh.assertEqual(2, pc.getPageNumber());

      pc.registerPageNumberChangeCallback(function() {
        callbackRun = true;
      });

      pc.reset();
      // Make sure the page number changed callback is run when we reset
      // the component
      doh.assertTrue(callbackRun);
    }
  },
  {
    name: "6. Set Invalid Page Number",
    runTest: function() {
      var pc = new pentaho.pir.PageControl();
      doh.assertEqual(1, pc.getPageNumber());
      pc.setPageNumber(-1);
      doh.assertEqual(1, pc.getPageNumber());
      
      pc.setPageNumber(2);
      doh.assertEqual(1, pc.getPageNumber());
      
      pc._prevPage();
      doh.assertEqual(1, pc.getPageNumber());
      
      pc._nextPage();
      doh.assertEqual(1, pc.getPageNumber());
    }
  },
  {
    name: "7. Prev/Next page",
    runTest: function() {
      var pc = new pentaho.pir.PageControl();
      pc.setPageCount(10);
      pc._nextPage();
      doh.assertEqual(2, pc.getPageNumber());
      pc._prevPage();
      doh.assertEqual(1, pc.getPageNumber());
    }
  },
  {
    name: "8. Set Page Count",
    runTest: function() {
      var pc = new pentaho.pir.PageControl();
      pc.setPageCount(10);
      doh.assertEqual(10, pc.getPageTotal());
    }
  },
  {
    name: "9. Simulated user input",
    runTest: function() {
      var pc = new pentaho.pir.PageControl();
      pc.pageNumberInput.set("value", 5);
      pc.setPageCount(10);
      pc._pageNumberKeyUp({keyCode: dojo.keys.ENTER});
      doh.assertEqual(5, pc.getPageNumber());
      pc.pageNumberInput.set("value", 1);
      pc._pageNumberKeyUp({keyCode: dojo.keys.ESCAPE});
      doh.assertEqual(5, pc.getPageNumber());
      doh.assertEqual(5, pc.pageNumberInput.get("value"));
      pc.pageNumberInput.set("value", "a");
      pc._pageNumberKeyUp({keyCode: dojo.keys.ENTER});
      doh.assertEqual(5, pc.getPageNumber());
      doh.assertEqual(5, pc.pageNumberInput.get("value"));
    }
  }
]);
