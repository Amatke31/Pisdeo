/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../../../../nexwebeditor-extension/dist/index.js":
/*!***********************************************************!*\
  !*** ../../../../../nexwebeditor-extension/dist/index.js ***!
  \***********************************************************/
/***/ (function(module) {

eval("(()=>{var e={766:(e,n,t)=>{const o=t(961),r=t(538);let s=!1,i=null;e.exports={template:o,framework:r,registExtensionAPI:function(e){s||(i=e,s=!0)}}},538:e=>{e.exports={register:function(e){e={name:e.name,extension:extensionInfo},nweExtensionAPI.registerFramework(e)}}},961:e=>{e.exports={copyTemplate:function(e,n){templatepath=path.join(extensionInfo.path,e),nweExtensionAPI.copyTemplateToProject(templatepath,extensionInfo,n)},add:function(e){e={name:e.name,id:e.id,require:e.require?e.require:[],framework:e.framework?e.framework:\"\",extension:extensionInfo},nweExtensionAPI.registerTemplate(e)}}},554:e=>{e.exports=class{onInit(){}useTemplate(){}}},10:(e,n,t)=>{const o=t(766),r=t(554);e.exports={...o,Extension:r}}},n={},t=function t(o){var r=n[o];if(void 0!==r)return r.exports;var s=n[o]={exports:{}};return e[o](s,s.exports,t),s.exports}(10);module.exports=t})();\n\n//# sourceURL=webpack://nexwebeditor-extension-base/../../../../../nexwebeditor-extension/dist/index.js?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("const { template, Extension } = __webpack_require__(/*! nexwebeditor-extension */ \"../../../../../nexwebeditor-extension/dist/index.js\")\n\nclass StaticExtension extends Extension {\n    onInit() {\n        template.add({\n            name: 'My HomePage',\n            id: \"org.nexwebeditor.template.myhomepage\"\n        })\n    }\n\n    useTemplate(project, templateInfo, complete) {\n        console.log(project)\n        template.copyTemplate('./template', project)\n        complete({\n            complete: \"success\"\n        })\n    }\n}\n\nmodule.exports = StaticExtension\n\n\n//# sourceURL=webpack://nexwebeditor-extension-base/./main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./main.js");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;