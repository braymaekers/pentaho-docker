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
define(function() {

  "use strict";

  var exports = {
    generateOptionsFromAnalyzerState: ccc_generateOptionsFromAnalyzerState,
    isIgnoredChartOption:             ccc_isIgnoredChartOption,
    propsImpliedDefault:              ccc_propsImpliedDefault,
    convertSizeByNegativesMode:       ccc_convertSizeByNegativesMode,
    willPlotOverflow:                 ccc_plotOverflow,
    willOverflow:                     ccc_visualizationWillOverflow
  };

  return exports;

  // region CCC Vizs Helpers

  function ccc_generateOptionsFromAnalyzerState(report) {

    var vizPropsImplied = exports.propsImpliedDefault();

    var options = report.reportDoc.getChartOptions().attributes;
    for(var i = 0, L = options.length; i < L; i++) {
      var option = options[i];
      var name = option.nodeName;
      if(!exports.isIgnoredChartOption(name)) {
        var value = option.nodeValue;

        // Value conversions
        switch(name) {
            // boolean
          case "autoRange":
          case "autoRangeSecondary":
          case "showLegend":
            value = (value === "true");
            break;

          case "sizeByNegativesMode":
            value = ccc_convertSizeByNegativesMode(value);
            break;

            // lower-cased strings
          case "legendPosition":
          case "displayUnits":
          case "displayUnitsSecondary":
          case "backgroundFill":
          case "labelStyle":
          case "legendStyle":
          case "multiChartRangeScope":
          case "emptyCellMode":
            if(value) value = value.toLowerCase();
            break;

          case "maxChartsPerRow":
            value = parseFloat(value);
            break;
        }

        vizPropsImplied[name] = value;
      }
    }

    return vizPropsImplied;
  }

  function ccc_isIgnoredChartOption(name) {
    switch(name) {
      case "vizApiVersion":

      case "customChartType":
      case "chartType":
      case "maxValues":

      case "lineShape":
      case "lineWidth":
      case "scatterPattern":
      case "scatterColorSet":
      case "scatterReverseColors":
        return true;
    }
    return false;
  }

  /**
   * Gets the default CCC implied properties from Analyzer state.
   *
   * These correspond to the default Analyzer chart options.
   *
   * Unfortunately, the Analyzer report XML does not always
   * contain all attributes with the default values.
   *
   * @return {!Object} All of the implied properties with default values.
   */
  function ccc_propsImpliedDefault() {
    return {
      legendPosition:        "right",
      showLegend:            true,
      autoRange:             true,
      displayUnits:          "units_0",
      autoRangeSecondary:    true,
      displayUnitsSecondary: "units_0",
      backgroundColor:       "#ffffff",
      labelColor:            "#000000",
      labelSize:             "12",
      backgroundFill:        "none",
      maxChartsPerRow:       3,
      backgroundColorEnd:    "#ffffff",
      labelStyle:            "plain",
      legendBackgroundColor: "#ffffff",
      legendSize:            "12",
      legendColor:           "#000000",
      legendStyle:           "plain",
      labelFontFamily:       "Default",
      legendFontFamily:      "Default",
      multiChartRangeScope:  "global",
      sizeByNegativesMode:   "negLowest",
      emptyCellMode:         "gap",
      valueAxisLowerLimit: null,
      valueAxisLowerLimitSecondary: null,
      valueAxisUpperLimit: null,
      valueAxisUpperLimitSecondary: null
    };
  }

  function ccc_convertSizeByNegativesMode(code) {
    switch(code) {
      case "NEG_LOWEST": return "negLowest";
      case "USE_ABS":    return "useAbs";
    }
  }

  function ccc_visualizationWillOverflow(view, targetWidth, targetHeight) {
    var plotOverflow = ccc_plotOverflow(view, targetWidth, targetHeight);

    var container = view && view.domContainer;
    var hasVerticalScroll = container && container.scrollHeight > targetHeight;
    var hasHorizontalScroll = container && container.scrollWidth > targetWidth;

    return {
      vertical: plotOverflow.vertical || hasVerticalScroll,
      horizontal: plotOverflow.horizontal || hasHorizontalScroll
    }

  }

  function ccc_plotOverflow(view, targetWidth, targetHeight) {
    var plotSizeMin = view.extensionEffective &&
      view.extensionEffective.plotSizeMin;

    return {
      vertical:   plotSizeMin && plotSizeMin.height > targetHeight,
      horizontal: plotSizeMin && plotSizeMin.width > targetWidth
    };

  }

  // endregion

});
