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
define(["dojo/_base/declare", "dojo/on", "dojo/query", "dojo/_base/array", "dojo/_base/lang", "dojo/store/Memory"],
    function(declare, on, query, array, lang, Memory){
      return declare(
  "pentaho.pir.AdvancedFilterStore",
  [Memory],
  {
    constructor : function() {
      this.inherited(arguments);
    },
    data:[
      {id: 'root', type: 'operator', value:'AND', parent:null}
    ],
    resetData: function(){
      this.setData( [{id: 'root', type: 'operator', value:'AND', parent:null}] );
    },
    getRootItem: function(){
      return this.getRootItems()[0];
    },
    getRootItems: function(){
      return this.query({parent:null});
    },
    getParent: function(object){
      if(object.parent){
        return this.get(object.parent);
      }
      else{
        return null;
      }
    },
    getConditions: function(){
      return this.query({type: 'condition'});
    },
    getChildren: function(object){
      return this.query({parent: this.getIdentity(object)});
    },
    hasChildren: function(object){
      return (this.getChildren(object).length > 0);
    },
    getSiblings: function(object, includeSelf){
      var parent = this.getParent(object);
      if(parent){
        return this.getChildren(parent).filter(function(item, index){
          if(includeSelf == true){
            return true;
          }
          else{
            return item != object;
          }
        });
      }
      else{
        return [];
      }
    },
    hasSiblings: function(object, includeSelf){
      return (this.getSiblings(object, includeSelf).length > 0);
    },
    getParentsSiblings: function(object, includeParent){
      var parent = this.getParent(object);
      if(parent){
        return this.getSiblings(parent, includeParent);
      }
      else{
        return [];
      }
    },
    getPosition: function(object){
      return {
        currentIdx: this.getCurrentIdx(object),
        parentIdx: this.getCurrentIdx(this.getParent(object))
      };
    },
    getCurrentIdx: function(object){
      return array.indexOf(this.getSiblings(object, true), object);
    },
    getSiblingAtIndex: function(object, idx){
      return this.getSiblings(object, true)[idx];
    },
    getFirstSibling: function(object){
      var siblings = this.getSiblings(object, true);
      if(siblings.length > 0){
        return this.getSiblingAtIndex(object, 0);
      }
      else{
        return null;
      }
    },
    getLastSibling: function(object){
      var siblings = this.getSiblings(object, false);
      if(siblings.length > 0){
        return this.getSiblingAtIndex(object, siblings.length -1);
      }
      else{
        return null;
      }
    },
    getOperators: function(){
      return this.query({type: 'operator'});
    },
    getConditions: function(){
      return this.query({type: 'condition'});
    },
    insertBefore: function(object, before, updateParent){
      // this is dangerous!!!
      var objectIdx = this.index[object.id];
      var beforeIdx = this.index[before.id];
      if(beforeIdx < objectIdx){
        this.data.splice(objectIdx, 1);         // remove
        if(updateParent){
          object.parent = before.parent;
        }
        this.data.splice(beforeIdx, 0, object); // insert  

        //update indexes
		for (var i = 0; i < this.data.length; i++) {
		  this.index[this.data[i].id] = i
		}
      }
    }
  }
);
    });
