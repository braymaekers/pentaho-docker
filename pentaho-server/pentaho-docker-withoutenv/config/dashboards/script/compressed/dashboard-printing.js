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

!function(){function e(e){var t=document.getElementById("ruler");return void 0===e&&(e=1),t.clientWidth*e}function t(){return document.images.item(0)}function n(){var e=t();l=e.width,u=e.height}function i(){var e=document,t=e.getElementById("portrait");return e.getElementById("landscape").checked?"landscape":t.checked?"portrait":null}function d(){var n,d,a,c,r,p,m,s=(document,t()),g=o(),f=i(),y=e();n="landscape"===f?g.height:g.width,d="landscape"===f?g.width:g.height,n-=h,d-=h,a=l/y*10,c=u/y*10,p=n/a,m=d/c,r=p<m?p:m,r>1&&(r=1),s.width=l*r,s.height=u*r}function o(){var e=document.getElementById("paperSize"),t=e.options[e.selectedIndex];return p[t.value]}function a(){return document.getElementById("reportControlPanel")}function c(){var e,t,n=document,i=document.getElementById("paperSize"),o=document.getElementById("portrait"),c=document.getElementById("landscape"),r=document.getElementById("printButton");for(e in p)t=n.createElement("OPTION"),t.innerHTML=e,t.label=e,t.value=e,p[e].isDefault&&(t.selected=!0),i.appendChild(t);o.name=c.name="orientation",o.type=c.type="radio",o.id="portrait",c.id="landscape",o.checked="checked",r.onclick=function(){var e=a();e.style.display="none",e.style.visibility="hidden",window.print(),e.style.visibility="",e.style.display=""},i.onchange=o.onclick=c.onclick=function(){d()}}function r(){c(),n(),d()}var l,u,h=20,p={A4:{width:210,height:297},A3:{width:297,height:420},"US-Letter":{width:215.9,height:279.4,isDefault:!0}};window.onload=r}(),define("dashboards/pentaho-dashboard-printing",function(){}),define("dashboard-printing",function(){});