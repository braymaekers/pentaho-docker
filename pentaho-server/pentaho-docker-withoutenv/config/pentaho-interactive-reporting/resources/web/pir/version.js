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
define(["dojo/_base/declare"],
    function(declare){

        pentaho = typeof pentaho == "undefined" ? {} : pentaho;
        pentaho.pir = pentaho.pir || {};

        pentaho.pir.version = {};
        pentaho.pir.version.buildNumber = "1601"
        pentaho.pir.version.jobName = "pentaho-interactive-reporting";
        pentaho.pir.version.buildId = "2013-12-31_10-20-28";
        pentaho.pir.version.svnRevision = "${env.SVN_REVISION}";
        pentaho.pir.version.pluginRevision = "TRUNK-SNAPSHOT"

        pentaho.pir.version.isConfigured = function() {
          return this.buildNumber.indexOf("@") == -1 && this.buildNumber.indexOf("$") == -1;
        }

        pentaho.pir.version.getBuildTag = function() {
          if (!this.isConfigured()) {
            return "devbuild";
          }
          return this.pluginRevision + ": " + this.buildNumber + " (r" + this.svnRevision + ")";
        }

        pentaho.pir.version.injectBuildTag = function(node) {
          node.innerHTML = this.getBuildTag();
        }
      });