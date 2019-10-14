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

/*globals requireCfg, CONTEXT_PATH */

(function() {
  var hasSources = ("false" === "true");
  var prefix = typeof CONTEXT_PATH !== "undefined" ? CONTEXT_PATH + "content/analyzer/scripts" : "analyzer";

  if(typeof document == "undefined" || (hasSources && document.location.href.indexOf("debug=true") > 0)) {
    requireCfg.paths["pentaho/analyzer"] = prefix;
  } else {
    requireCfg.paths["pentaho/analyzer"] = prefix + "/compressed";
  }

  requireCfg.paths["pentaho/analyzer/resources"] = CONTEXT_PATH + "content/analyzer/resources";

  // This file is always in the non-compressed location.
  requireCfg.paths["pentaho/analyzer/visual/config"] = prefix + "/visual/config";

  // For backwards compatibility of Analyzer API.
  requireCfg.map["*"]["analyzer"] = "pentaho/analyzer";

  var requireModules = requireCfg.config["pentaho/modules"];

  requireModules["pentaho/analyzer/visual/OptionsAnnotation"] = {
    base: "pentaho/module/Annotation"
  };

  requireModules["pentaho/analyzer/visual/config"] = {
    type: "pentaho/config/spec/IRuleSet"
  };

})();
