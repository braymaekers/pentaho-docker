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

/**
 * This is the global variable for manipulating Analyzer. It provides registration events and special APIs for
 * extended control in Analyzer.
 */
define([
  "dojo/_base/lang",
  "./API"
], function(lang, API) {
  cv = typeof cv === "undefined" ? {analyzerProperties: {}} : cv;

  if (typeof cv.api === "undefined") {
    cv.api = new API();
  }

  var isInIFrame = false;

  // check that we are in a frame
  try {
    // safari doesn't throw exception and returns
    // empty parent, so check for document undefined
    if(!window.parent.document) {
	    isInIFrame = true;
    }
  } catch (e) {
    isInIFrame = true;
  }

  try {
    if (window.customDomain && isInIFrame) {
      document.domain = window.customDomain;
    }
  } catch (e) {
    cv.api.log.error(e);
  }

  try {
    if (window.parent) {
      // onAnalyzerLoad - only api.event is available
      if (window.parent.onAnalyzerLoad) {
        // In unit tests, window.frameElement is null and cannot be set.
        window.parent.onAnalyzerLoad(cv.api, window.frameElement && window.frameElement.id);
      }

      // onAnalyzerReady - registers an init listener
      if (window.parent.onAnalyzerReady) {
        cv.api.event.registerInitListener(function(e, cv) {
          // In unit tests, window.frameElement is null and cannot be set.
          window.parent.onAnalyzerReady(cv.api, window.frameElement && window.frameElement.id);
        });
      }
    }
  } catch (e) {
    cv.api.log.error(e);
  }

  return cv.api;
});
