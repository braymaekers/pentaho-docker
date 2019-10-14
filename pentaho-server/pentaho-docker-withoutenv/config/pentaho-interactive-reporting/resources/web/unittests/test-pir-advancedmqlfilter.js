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

doh.register('Advanced MQL Filter', [
  {
    name: "Create Advanced MQL Filter",
    timeout: 10000,
    runTest: function() {
      controller = new pentaho.pir.controller();
      model = new pentaho.pir.model();
      view = new pentaho.pir.view();
      view.init();
      model.init();
      
      var mql1 = 'AND(NOT(ISNA([BC_OFFICES_.BC_OFFICES_TERRITORY])))';
      var mql2 = 'AND(NOT(ISNA([BC_OFFICES_.BC_OFFICES_TERRITORY]));EQUALS([BC_OFFICES_.BC_OFFICES_TERRITORY];"APAC"))';

      model.report.filters.push(model.createMqlFilter(mql1));
      model.report.filters.push(model.createMqlFilter(mql2));

      doh.assertEqual(2, model.report.filters.length);
      controller.removeFilter(0);
      doh.assertEqual(1, model.report.filters.length);
      doh.assertEqual(mql2, model.report.filters[0].mqlCondition);
      model.report.filters.push(model.createMqlFilter(mql1));
      doh.assertEqual(2, model.report.filters.length);
      
      controller.removeFilter(1);
      doh.assertEqual(1, model.report.filters.length);
      doh.assertEqual(mql2, model.report.filters[0].mqlCondition);
      controller.removeFilter(0);
      doh.assertEqual(0, model.report.filters.length);
    }
  },
  {
    name: "Convert Advanced MQL Filter to MQL Condition",
    timeout: 10000,
    runTest: function() {
      
      model = new pentaho.pir.model();
      model.init();

      var filter = model.createMqlFilter('AND(NOT(ISNA([BC_OFFICES_.BC_OFFICES_TERRITORY])))');

      var query = new pentaho.pda.query.mql();
      var condition = query.createCondition();
      condition.value = "::mql::"+filter.mqlCondition;
      query.addCondition(condition);

      doh.assertEqual(1, query.state.conditions.length);
      doh.assertEqual('AND(NOT(ISNA([BC_OFFICES_.BC_OFFICES_TERRITORY])))', 
                      query.state.conditions[0].value.replace('::mql::',''));

      doh.assertEqual('<constraint>\n<operator>AND</operator>\n'+
                      '<condition><![CDATA[::mql::AND(NOT(ISNA([BC_OFFICES_.BC_OFFICES_TERRITORY])))]]></condition>\n'+
                      '</constraint>\n', 
                     query.getMQLFilterXML(query.state.conditions[0].value));
    }
  }
]);
