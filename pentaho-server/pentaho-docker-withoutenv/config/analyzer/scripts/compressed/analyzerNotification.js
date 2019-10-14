define("pentaho/analyzer/analyzerAngularApi",["common-ui/AnimatedAngularPluginHandler","common-ui/ring","common-ui/angular-resource"],function(n,i){
var e=i.create([n],{init:function(){this.$super(),this.isCloseClicked=!1},
_onRegister:function(n){this.$super(n)},_onUnregister:function(n){this.$super(n)
},open:function(n,i){this.isCloseClicked||this.$super(n,i)}
}),o="angular-notification-wrapper",t=new e,r=t.module(o,["ngResource"]),a=function(n){
r.$rootScope.viewContainer=n,r.$rootScope.$$phase||r.$rootScope.$apply()}
;return r.run(["$rootScope","$location",function(n,i){
n.viewContainer=!1,n.$on("$locationChangeSuccess",function(n,e,t){
i.path().search(o)>-1&&a(!0)}),""!=i.path()&&i.path("/")
}]),$(document).ready(function(){angular.bootstrap(document,[o])}),{
AnalyzerAngularPluginHandler:e,AnalyzerAngularPluginHandlerInstance:t,
moduleName:o}
}),define("pentaho/analyzer/analyzerAngularPlugin",["common-ui/AnimatedAngularPlugin","./analyzerAngularApi","common-ui/ring"],function(n,i,e){
var o=e.create([n],{notificationTimeout:null,init:function(n){
if(n.moduleName||(n.moduleName=i.moduleName),
n.pluginHandler=i.AnalyzerAngularPluginHandlerInstance,
this.$super(n),!e.instance(this.config.pluginHandler,i.AnalyzerAngularPluginHandler))throw o.errMsgs.incorrectHandlerType
},onRegister:function(n){this.config.pluginHandler._onRegister(n),this.$super(n)
},onUnregister:function(n){
this.config.pluginHandler._onUnregister(n),this.$super(n)},toString:function(){
return this.$super()},slideDownTop:function(n,i,e){
if(void 0===i&&(i=1e4),void 0===e&&(e=!0),this.$super(n),e){var o=this
;this.notificationTimeout=setTimeout(function(){o.close()},i)}}})
;return o.errMsgs={},
o.errMsgs.incorrectHandlerType="The attached plugin handler is not an Analyzer Angular Plugin Handler",
o
}),define("pentaho/analyzer/analyzerNotification",["./analyzerAngularPlugin"],function(n){
var i=function(n){n.when("/notification",{
templateUrl:"templates/notification.html",controller:"NotificationController"})
},e="",o=function(n){n("NotificationController",["$scope",function(n){
n.notificationMessage=e,n.notificationOver=function(){
clearTimeout(r.notificationTimeout),r.open("/notification",void 0,!1)
},n.notificationLeave=function(){r.close()},n.close=function(n){
"click"===n.type&&(r.config.pluginHandler.isCloseClicked=!0),r.close()}}])
},t=function(n){n("unsafe",["$sce",function(n){return n.trustAsHtml}])
},r=new n({routerCallback:i,controllerCallback:o,filterCallback:t}).register()
;return{setMessage:function(n){e=n,r.slideDownTop("/notification")},
analyzerAngularPlugin:r}});