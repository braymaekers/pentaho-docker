/*!
 * Copyright 2010 - 2019 Hitachi Vantara.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

define([ "common-ui/prompting/components/PanelComponent" ],
  function(PanelComponent) {
    return PanelComponent.extend({
      getClassFor : function(component) {
        if (component.promptType === 'label') {
          return 'parameter-label';
        }
      },

      getMarkupFor : function(component) {
        var html = this.base(component);
        if (component.isErrorIndicator !== true
          && (this.controller.command === 'new' || this.controller.command === 'edit')
          && component.promptType == 'label') {
          html = '<table cellpadding="0" cellspacing="0" class="edit-buttons-container"><tr><td>' + html + '</td><td>';
          html += '<div id="' + component.name + '-edit" class="edit-buttons">';
          html += '<div class="parameterCommon parameterEdit" onclick="view.editParameter(\'' + component.param.name + '\');"';
          html += ' title="' + view.getLocaleString("EditParameter") + '"/>';
          html += '<div class="parameterCommon parameterRemove" onclick="view.removeParameter(\'' + component.param.name + '\');"';
          html += ' title="' + view.getLocaleString("RemoveParameter") + '"/>';
          html += '</div></td></tr></table>';
        }
        return html;
      },

      update : function() {
        this.cssClass = (this.cssClass || '').replace('edit', '');
        if (this.controller.command === 'new' || this.controller.command === 'edit') {
          this.cssClass = (this.cssClass || '') + ' edit';
        }
        this.base();
      },

      removeErrorClass: function(){
        var $htmlObject = this.placeholder();
        $htmlObject.removeClass('error');
      },

      addErrorClass: function(){
        var $htmlObject = this.placeholder();
        $htmlObject.addClass('error');
      },

      addErrorLabel: function(errComponent){
        var $htmlObject = this.placeholder();
        if(!errComponent)
          return;

        var errorLabelHtml = '<div id="' + errComponent.htmlObject + '" class="parameter-label"></div>';

        if(this.controller.command === 'view'){
          $("#" + this.htmlObject + " > div:nth-child(1)").after(errorLabelHtml);
        } else if(this.controller.command === 'new' || this.controller.command === 'edit') {
          $("#" + this.htmlObject + " > table:nth-child(1)").after(errorLabelHtml);
        }
      }
    });
  });
