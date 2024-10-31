/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/Context/PatternContext.js":
/*!*********************************************!*\
  !*** ./src/admin/Context/PatternContext.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

let PatternContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PatternContext);

/***/ }),

/***/ "./src/admin/component/PatternDependencyModal.js":
/*!*******************************************************!*\
  !*** ./src/admin/component/PatternDependencyModal.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Context_PatternContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Context/PatternContext */ "./src/admin/Context/PatternContext.js");

/**
 * WordPress dependencies
 */




const PatternDependencyModal = () => {
  const patternContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useContext)(_Context_PatternContext__WEBPACK_IMPORTED_MODULE_4__["default"]);
  const isAfterSave = patternContext.useAfterSave();
  const [currentPluginIndex, setCurrentPluginIndex] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [statusMessages, setStatusMessages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [activatedPluginIndex, setActivatedPluginIndex] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [importProceed, setImportProceed] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const depenency_plugins_list = PatLocalize.depenency_plugins_list;
  let pattern_dependency_plugins = [];
  if (patternContext.dependencyPlugins) {
    pattern_dependency_plugins = patternContext.dependencyPlugins.split(',');
  }
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (importProceed) {
      if (currentPluginIndex < pattern_dependency_plugins.length) {
        let pluginSlug = pattern_dependency_plugins[currentPluginIndex];
        activatePlugin(depenency_plugins_list[pluginSlug], pluginSlug);
      } else {
        // After all plugin is activated.
        setStatusMessages(prevMessages => [...prevMessages, 'All plugins activated']);
        setCurrentPluginIndex(false);
        setImportProceed(false);
        let slug = patternContext.dependencyPluginSlug;
        let importBtn = document.querySelector('.pat-proceed-import-btn span');
        importBtn.innerText = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Parsing content..', 'patternly');
        if (slug) {
          setTimeout(function () {
            patternContext.setImportPatternSlug(slug);
            patternContext.setImportAndSave(true);
            patternContext.setImportPattern(true);
          }, 1000);
        }
      }
    }
  }, [currentPluginIndex, importProceed]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (isAfterSave) {
      //after saving the content.
      setTimeout(function () {
        //@TODO display redirect buttons.
        let importBtn = document.querySelector('.pat-proceed-import-btn span');
        importBtn.innerText = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Done!', 'patternly');
      }, 1000);
    }
  }, [isAfterSave]);
  const activatePlugin = async (plugin, pluginSlug) => {
    let url = PatLocalize.homeurl + "/wp-json/optemiz/v1/patternly/activate_plugins";
    const data = {
      'nonce': PatLocalize.nonce,
      'plugin_slug': pluginSlug
    };
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(response => {
      return response.json();
    }).then(function (response) {
      if (response.success) {
        setStatusMessages(prevMessages => [...prevMessages, `${plugin.name} activated`]);
        setCurrentPluginIndex(currentPluginIndex + 1);

        // clone with unique values.
        let cloneActivatedPluginIndex = activatedPluginIndex;
        cloneActivatedPluginIndex.push(currentPluginIndex);
        setActivatedPluginIndex(cloneActivatedPluginIndex);
      } else {
        setStatusMessages(prevMessages => [...prevMessages, `Error activating ${plugin.name}: ${response.message}`]);
      }
    });
  };
  const hideDependencyModal = () => {
    patternContext.setDependencyPluginSlug('');
    patternContext.setDependencyPlugins('');
    patternContext.setDependencyModalStatus(false);
    setActivatedPluginIndex([]);
  };
  const importProceedHandler = event => {
    let importBtn = event.target.closest('.pat-proceed-import-btn span');
    if (importBtn) {
      importBtn.innerText = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Plugins activating..', 'patternly');
    }
    setTimeout(function () {
      setCurrentPluginIndex(0);
      setImportProceed(true);
    }, 1000);
  };
  if (!patternContext.dependencyModalStatus) {
    return;
  }
  const dependencyPluginList = () => {
    let pluginListDisplay = '';
    if (pattern_dependency_plugins.length > 0) {
      let counter = 0;
      pluginListDisplay = pattern_dependency_plugins.map((slug, index) => {
        let plugin = depenency_plugins_list[slug];
        let classes = activatedPluginIndex.includes(counter) ? 'pat-is-plugin-activated' : '';
        counter++;
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
          key: index,
          className: classes
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          "aria-hidden": "true",
          class: "h-7 w-7 "
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
          "fill-rule": "evenodd",
          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
          "clip-rule": "evenodd"
        })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, plugin.name));
      });
    }
    return pluginListDisplay;
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pat-dependency-modal"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pat-dependency-modal-inner"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pat-dependency-modal-inner-content"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Okay, just one last step', 'patternly')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('You are close to importing the template. To complete the process, we need to activate the following dependency plugins first.', 'patternly')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, dependencyPluginList()), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pat-dependency-modal-buttons"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    class: "pat-btn pat-btn-primary pat-proceed-import-btn",
    onClick: importProceedHandler,
    "data-slug": ""
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Proceed Import', 'patternly')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: `${PatLocalize.pat_plugin_url}/src/admin/assets/images/proceed-import.svg`,
    alt: ""
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "pat-btn pat-btn-secondary-link",
    onClick: hideDependencyModal
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Cancel', 'patternly')))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PatternDependencyModal);

/***/ }),

/***/ "./src/admin/component/PatternlyHeader.js":
/*!************************************************!*\
  !*** ./src/admin/component/PatternlyHeader.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Context_PatternContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Context/PatternContext */ "./src/admin/Context/PatternContext.js");

/**
 * WordPress dependencies
 */




const PatternlyHeader = () => {
  const patternContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useContext)(_Context_PatternContext__WEBPACK_IMPORTED_MODULE_4__["default"]);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isVisible, setIsVisible] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const activeItem = event => {
    //remove active class.
    let activeItem = document.querySelector('.pat-main-li-active');
    activeItem.classList.remove('pat-main-li-active');

    //add active class.
    event.currentTarget.parentElement.classList.add('pat-main-li-active');
    let type = event.currentTarget.getAttribute('type');
    patternContext.setPostType(type);
    patternContext.setCurrentPage(1);
    patternContext.setQueryType('all');
    patternContext.setLoadData(true);
    patternContext.setLoadTermData(true);
  };
  const getDefaultData = event => {
    //active item.
    activeItem(event);
    patternContext.setQueryType('all');
    patternContext.setQueryTypeValue(false);
    patternContext.setCurrentPage(1);
    patternContext.setLoadData(true);
    patternContext.setLoadMoreButton(true);
  };
  function renderMenuItem() {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
      className: "pat-main-ul"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      className: patternContext.postType === 'pattern' ? "pat-main-li pat-main-li-active" : "pat-main-li"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      class: "pat-main-li-anchor",
      type: "pattern",
      onClick: activeItem
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 18 18",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M2.25 0C1.01625 0 0 1.01625 0 2.25V15.75C0 16.9838 1.01625 18 2.25 18H11.75C11.9489 18 12.1396 17.9209 12.2803 17.7803C12.2829 17.7777 12.2855 17.7751 12.2881 17.7725L17.7803 12.2803C17.9209 12.1396 18 11.9489 18 11.75V2.25C18 1.01625 16.9838 0 15.75 0H2.25ZM2.25 1.5H15.75C16.1733 1.5 16.5 1.82675 16.5 2.25V11H13.25C12.0162 11 11 12.0162 11 13.25V16.5H2.25C1.82675 16.5 1.5 16.1733 1.5 15.75V2.25C1.5 1.82675 1.82675 1.5 2.25 1.5ZM4.75 3.99902C4.65062 3.99762 4.55194 4.01598 4.45972 4.05304C4.36749 4.0901 4.28355 4.14512 4.21277 4.2149C4.142 4.28469 4.08579 4.36784 4.04743 4.45953C4.00907 4.55123 3.98932 4.64963 3.98932 4.74902C3.98932 4.84842 4.00907 4.94682 4.04743 5.03851C4.08579 5.13021 4.142 5.21336 4.21277 5.28314C4.28355 5.35293 4.36749 5.40795 4.45972 5.44501C4.55194 5.48207 4.65062 5.50043 4.75 5.49902H13.25C13.3494 5.50043 13.4481 5.48207 13.5403 5.44501C13.6325 5.40795 13.7164 5.35293 13.7872 5.28314C13.858 5.21336 13.9142 5.13021 13.9526 5.03851C13.9909 4.94682 14.0107 4.84842 14.0107 4.74902C14.0107 4.64963 13.9909 4.55123 13.9526 4.45953C13.9142 4.36784 13.858 4.28469 13.7872 4.2149C13.7164 4.14512 13.6325 4.0901 13.5403 4.05304C13.4481 4.01598 13.3494 3.99762 13.25 3.99902H4.75ZM4.75 7.49902C4.65062 7.49762 4.55194 7.51598 4.45972 7.55304C4.36749 7.5901 4.28355 7.64512 4.21277 7.7149C4.142 7.78469 4.08579 7.86784 4.04743 7.95953C4.00907 8.05123 3.98932 8.14963 3.98932 8.24902C3.98932 8.34842 4.00907 8.44682 4.04743 8.53851C4.08579 8.63021 4.142 8.71336 4.21277 8.78314C4.28355 8.85293 4.36749 8.90795 4.45972 8.94501C4.55194 8.98207 4.65062 9.00043 4.75 8.99902H11.25C11.3494 9.00043 11.4481 8.98207 11.5403 8.94501C11.6325 8.90795 11.7164 8.85293 11.7872 8.78314C11.858 8.71336 11.9142 8.63021 11.9526 8.53851C11.9909 8.44682 12.0107 8.34842 12.0107 8.24902C12.0107 8.14963 11.9909 8.05123 11.9526 7.95953C11.9142 7.86784 11.858 7.78469 11.7872 7.7149C11.7164 7.64512 11.6325 7.5901 11.5403 7.55304C11.4481 7.51598 11.3494 7.49762 11.25 7.49902H4.75ZM13.25 12.5H15.4395L12.5 15.4395V13.25C12.5 12.8268 12.8268 12.5 13.25 12.5Z",
      fill: "#717D86"
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Patterns', 'faq-for-woocommerce')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      className: patternContext.postType === 'page' ? "pat-main-li pat-main-li-active" : "pat-main-li"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      class: "pat-main-li-anchor",
      type: "page",
      onClick: activeItem
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "14",
      height: "20",
      viewBox: "0 0 14 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M2.25 0C1.01625 0 0 1.01625 0 2.25V17.75C0 18.9838 1.01625 20 2.25 20H11.75C12.9838 20 14 18.9838 14 17.75V2.25C14 1.01625 12.9838 0 11.75 0H2.25ZM2.25 1.5H11.75C12.1732 1.5 12.5 1.82675 12.5 2.25V17.75C12.5 18.1733 12.1732 18.5 11.75 18.5H2.25C1.82675 18.5 1.5 18.1733 1.5 17.75V2.25C1.5 1.82675 1.82675 1.5 2.25 1.5ZM3.75 3.5C3.55109 3.5 3.36032 3.57902 3.21967 3.71967C3.07902 3.86032 3 4.05109 3 4.25C3 4.44891 3.07902 4.63968 3.21967 4.78033C3.36032 4.92098 3.55109 5 3.75 5C3.94891 5 4.13968 4.92098 4.28033 4.78033C4.42098 4.63968 4.5 4.44891 4.5 4.25C4.5 4.05109 4.42098 3.86032 4.28033 3.71967C4.13968 3.57902 3.94891 3.5 3.75 3.5ZM6.25 3.5C6.15062 3.49859 6.05194 3.51696 5.95972 3.55402C5.86749 3.59108 5.78355 3.6461 5.71277 3.71588C5.642 3.78566 5.58579 3.86882 5.54743 3.96051C5.50907 4.0522 5.48932 4.15061 5.48932 4.25C5.48932 4.34939 5.50907 4.4478 5.54743 4.53949C5.58579 4.63118 5.642 4.71434 5.71277 4.78412C5.78355 4.8539 5.86749 4.90892 5.95972 4.94598C6.05194 4.98304 6.15062 5.00141 6.25 5H10.25C10.3494 5.00141 10.4481 4.98304 10.5403 4.94598C10.6325 4.90892 10.7164 4.8539 10.7872 4.78412C10.858 4.71434 10.9142 4.63118 10.9526 4.53949C10.9909 4.4478 11.0107 4.34939 11.0107 4.25C11.0107 4.15061 10.9909 4.0522 10.9526 3.96051C10.9142 3.86882 10.858 3.78566 10.7872 3.71588C10.7164 3.6461 10.6325 3.59108 10.5403 3.55402C10.4481 3.51696 10.3494 3.49859 10.25 3.5H6.25ZM3.75 6.5C3.55109 6.5 3.36032 6.57902 3.21967 6.71967C3.07902 6.86032 3 7.05109 3 7.25C3 7.44891 3.07902 7.63968 3.21967 7.78033C3.36032 7.92098 3.55109 8 3.75 8C3.94891 8 4.13968 7.92098 4.28033 7.78033C4.42098 7.63968 4.5 7.44891 4.5 7.25C4.5 7.05109 4.42098 6.86032 4.28033 6.71967C4.13968 6.57902 3.94891 6.5 3.75 6.5ZM6.25 6.5C6.15062 6.49859 6.05194 6.51696 5.95972 6.55402C5.86749 6.59108 5.78355 6.6461 5.71277 6.71588C5.642 6.78566 5.58579 6.86882 5.54743 6.96051C5.50907 7.0522 5.48932 7.15061 5.48932 7.25C5.48932 7.34939 5.50907 7.4478 5.54743 7.53949C5.58579 7.63118 5.642 7.71434 5.71277 7.78412C5.78355 7.8539 5.86749 7.90892 5.95972 7.94598C6.05194 7.98304 6.15062 8.00141 6.25 8H10.25C10.3494 8.00141 10.4481 7.98304 10.5403 7.94598C10.6325 7.90892 10.7164 7.8539 10.7872 7.78412C10.858 7.71434 10.9142 7.63118 10.9526 7.53949C10.9909 7.4478 11.0107 7.34939 11.0107 7.25C11.0107 7.15061 10.9909 7.0522 10.9526 6.96051C10.9142 6.86882 10.858 6.78566 10.7872 6.71588C10.7164 6.6461 10.6325 6.59108 10.5403 6.55402C10.4481 6.51696 10.3494 6.49859 10.25 6.5H6.25ZM3.75 9.5C3.55109 9.5 3.36032 9.57902 3.21967 9.71967C3.07902 9.86032 3 10.0511 3 10.25C3 10.4489 3.07902 10.6397 3.21967 10.7803C3.36032 10.921 3.55109 11 3.75 11C3.94891 11 4.13968 10.921 4.28033 10.7803C4.42098 10.6397 4.5 10.4489 4.5 10.25C4.5 10.0511 4.42098 9.86032 4.28033 9.71967C4.13968 9.57902 3.94891 9.5 3.75 9.5ZM6.25 9.5C6.15062 9.49859 6.05194 9.51696 5.95972 9.55402C5.86749 9.59108 5.78355 9.6461 5.71277 9.71588C5.642 9.78566 5.58579 9.86882 5.54743 9.96051C5.50907 10.0522 5.48932 10.1506 5.48932 10.25C5.48932 10.3494 5.50907 10.4478 5.54743 10.5395C5.58579 10.6312 5.642 10.7143 5.71277 10.7841C5.78355 10.8539 5.86749 10.9089 5.95972 10.946C6.05194 10.983 6.15062 11.0014 6.25 11H10.25C10.3494 11.0014 10.4481 10.983 10.5403 10.946C10.6325 10.9089 10.7164 10.8539 10.7872 10.7841C10.858 10.7143 10.9142 10.6312 10.9526 10.5395C10.9909 10.4478 11.0107 10.3494 11.0107 10.25C11.0107 10.1506 10.9909 10.0522 10.9526 9.96051C10.9142 9.86882 10.858 9.78566 10.7872 9.71588C10.7164 9.6461 10.6325 9.59108 10.5403 9.55402C10.4481 9.51696 10.3494 9.49859 10.25 9.5H6.25ZM3.75 15C3.55109 15 3.36032 15.079 3.21967 15.2197C3.07902 15.3603 3 15.5511 3 15.75C3 15.9489 3.07902 16.1397 3.21967 16.2803C3.36032 16.421 3.55109 16.5 3.75 16.5C3.94891 16.5 4.13968 16.421 4.28033 16.2803C4.42098 16.1397 4.5 15.9489 4.5 15.75C4.5 15.5511 4.42098 15.3603 4.28033 15.2197C4.13968 15.079 3.94891 15 3.75 15ZM6.25 15C6.15062 14.9986 6.05194 15.017 5.95972 15.054C5.86749 15.0911 5.78355 15.1461 5.71277 15.2159C5.642 15.2857 5.58579 15.3688 5.54743 15.4605C5.50907 15.5522 5.48932 15.6506 5.48932 15.75C5.48932 15.8494 5.50907 15.9478 5.54743 16.0395C5.58579 16.1312 5.642 16.2143 5.71277 16.2841C5.78355 16.3539 5.86749 16.4089 5.95972 16.446C6.05194 16.483 6.15062 16.5014 6.25 16.5H10.25C10.3494 16.5014 10.4481 16.483 10.5403 16.446C10.6325 16.4089 10.7164 16.3539 10.7872 16.2841C10.858 16.2143 10.9142 16.1312 10.9526 16.0395C10.9909 15.9478 11.0107 15.8494 11.0107 15.75C11.0107 15.6506 10.9909 15.5522 10.9526 15.4605C10.9142 15.3688 10.858 15.2857 10.7872 15.2159C10.7164 15.1461 10.6325 15.0911 10.5403 15.054C10.4481 15.017 10.3494 14.9986 10.25 15H6.25Z",
      fill: "#717D86"
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Pages', 'faq-for-woocommerce')))));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-main-heading-wrapper"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-main-menu"
  }, renderMenuItem()), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    class: "pat-main-header"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('All Templates', 'patternly'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PatternlyHeader);

/***/ }),

/***/ "./src/admin/component/PatternlySearchbox.js":
/*!***************************************************!*\
  !*** ./src/admin/component/PatternlySearchbox.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Context_PatternContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Context/PatternContext */ "./src/admin/Context/PatternContext.js");

/**
 * WordPress dependencies
 */



const PatternlySearchbox = () => {
  const patternContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useContext)(_Context_PatternContext__WEBPACK_IMPORTED_MODULE_3__["default"]);
  const searchPatterns = event => {
    let searchValue = event.currentTarget.value;
    if (searchValue.length > 0 && searchValue.length < 3) {
      return;
    }

    //remove category active class.
    let activeCategoryItem = document.querySelector('.pat-sidebar-active');
    activeCategoryItem.classList.remove('pat-sidebar-active');
    let firstCatItem = document.querySelector('.pat-sidebar-ul li:first-child');
    firstCatItem.classList.add('pat-sidebar-active');

    //reset favourite values.
    patternContext.setFavouriteValue(false);
    if (searchValue.length === 0) {
      patternContext.setSearchValue(false);
      patternContext.setQueryType('all');
      patternContext.setCurrentPage(1);
      patternContext.setLoadData(true);
      patternContext.setLoadMoreButton(true);
    } else {
      patternContext.setSearchValue(searchValue);
      patternContext.setQueryType(false);
      patternContext.setCurrentPage(1);
      patternContext.setLoadData(true);
      patternContext.setLoadMoreButton(true);
    }
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-searchbox-wrap"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/search.png`,
    alt: ""
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    class: "pat-search-box",
    type: "text",
    onChange: searchPatterns,
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Search', 'patternly')
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PatternlySearchbox);

/***/ }),

/***/ "./src/admin/component/PatternlySidebar.js":
/*!*************************************************!*\
  !*** ./src/admin/component/PatternlySidebar.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Context_PatternContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Context/PatternContext */ "./src/admin/Context/PatternContext.js");
/* harmony import */ var _PatternlySearchbox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PatternlySearchbox */ "./src/admin/component/PatternlySearchbox.js");

/**
 * WordPress dependencies
 */





const PatternlySidebar = () => {
  const patternContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useContext)(_Context_PatternContext__WEBPACK_IMPORTED_MODULE_4__["default"]);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isVisible, setIsVisible] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const getDefaultData = event => {
    //active item.
    activeItem(event);

    // patternContext.setQueryType('all');
    // patternContext.setQueryTypeValue(false);

    let termName = event.currentTarget.getAttribute('termName');
    if (termName === 'color') {
      patternContext.setColorValue(false);
    } else if (termName === 'license') {
      patternContext.setLicenseValue(false);
    } else if (termName === 'mode') {
      patternContext.setModeValue(false);
    } else if (termName === 'section') {
      patternContext.setSectionValue(false);
    } else if (termName === 'category') {
      patternContext.setCategoryValue(false);
    }
    patternContext.setFavouriteValue(false);
    patternContext.setCurrentPage(1);
    patternContext.setLoadData(true);
    patternContext.setLoadMoreButton(true);
  };
  const getFavouriteItems = event => {
    patternContext.setLoadFavouriteData(true);
  };
  const activeItem = event => {
    let $this = event.currentTarget;
    let list = $this.parentElement;

    //remove active class.
    let activeCategoryItem = list.querySelector('.pat-sidebar-active');
    activeCategoryItem.classList.remove('pat-sidebar-active');

    //add active class.
    $this.classList.add('pat-sidebar-active');
  };
  const getTemplatesByTerm = event => {
    //active item.
    activeItem(event);
    let termName = event.currentTarget.getAttribute('termName');
    let termValue = event.currentTarget.getAttribute('termValue');

    // console.log(termName);
    // console.log(termValue);

    if (termName === 'color') {
      patternContext.setColorValue(termValue);
    } else if (termName === 'license') {
      patternContext.setLicenseValue(termValue);
    } else if (termName === 'mode') {
      patternContext.setModeValue(termValue);
    } else if (termName === 'section') {
      patternContext.setSectionValue(termValue);
      patternContext.setCategoryValue(false);
    } else if (termName === 'category') {
      patternContext.setCategoryValue(termValue);
      patternContext.setSectionValue(false);
    }
    patternContext.setQueryType(false);
    patternContext.setCurrentPage(1);
    patternContext.setLoadData(true);
    patternContext.setLoadMoreButton(true);
  };
  function renderTerms(termName) {
    if (Object.keys(patternContext.termData).length > 0 && patternContext.letsPrintTermData) {
      let termKey = '';
      if (termName === 'section') {
        termKey = 'sections';
      } else if (termName === 'category') {
        termKey = 'categories';
      } else if (termName === 'mode') {
        termKey = 'modes';
      } else if (termName === 'license') {
        termKey = 'licenses';
      }
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
        className: "pat-sidebar-ul"
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
        class: "pat-sidebar-li pat-sidebar-active",
        termName: termName,
        onClick: getDefaultData
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        class: "text"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('All', 'patternly'))), patternContext.termData[termKey].map(termItem => {
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
          class: "pat-sidebar-li",
          key: termItem.slug,
          termValue: termItem.slug,
          termName: termName,
          onClick: getTemplatesByTerm
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          class: "text"
        }, termItem.name));
      }));
    }
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-sidebar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-sidebar-item"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_PatternlySearchbox__WEBPACK_IMPORTED_MODULE_5__["default"], null)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-sidebar-item"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    class: "pat-fav-button",
    onClick: getFavouriteItems
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "20",
    height: "18",
    viewBox: "0 0 20 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M5.5 0.5C2.47122 0.5 0 2.97122 0 6C0 8.04808 1.54382 9.97645 3.42578 11.9541C5.30774 13.9318 7.62419 15.9347 9.46973 17.7803C9.61038 17.9209 9.80112 17.9999 10 17.9999C10.1989 17.9999 10.3896 17.9209 10.5303 17.7803C12.3758 15.9347 14.6923 13.9318 16.5742 11.9541C18.4562 9.97645 20 8.04808 20 6C20 2.97122 17.5288 0.5 14.5 0.5C12.7618 0.5 11.2484 1.43324 10 3.01855C8.75159 1.43324 7.23822 0.5 5.5 0.5Z",
    fill: "url(#paint0_linear_489_819)"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
    id: "paint0_linear_489_819",
    x1: "10.0059",
    y1: "-1.15276",
    x2: "10.0059",
    y2: "18.4082",
    gradientUnits: "userSpaceOnUse"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
    "stop-color": "#F1693C"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
    offset: "1",
    "stop-color": "#F13F05"
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Favorites', 'patternly'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", {
    class: "pat-sidebar-menu-header"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Color Mode", "patternly")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    class: "pat-color-items"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "pat-sidebar-li pat-sidebar-active",
    key: "light",
    termValue: "light",
    termName: "mode",
    onClick: getTemplatesByTerm
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "pat-color-item",
    style: {
      background: '#fff'
    }
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "pat-sidebar-li",
    key: "dark",
    termValue: "dark",
    termName: "mode",
    onClick: getTemplatesByTerm
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "pat-color-item",
    style: {
      background: '#000'
    }
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-sidebar-item"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", {
    class: "pat-sidebar-menu-header"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Licenses", "patternly")), renderTerms('license')), patternContext.postType !== 'pattern' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-sidebar-item"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", {
    class: "pat-sidebar-menu-header"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Categories", "patternly")), renderTerms('category')), patternContext.postType === 'pattern' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-sidebar-item"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", {
    class: "pat-sidebar-menu-header"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Sections", "patternly")), renderTerms('section')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    class: "pat-skeleton-sidebar-ul"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    class: "pat-skeleton-saidbar-li"
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PatternlySidebar);

/***/ }),

/***/ "./src/admin/component/PatternlyWrap.js":
/*!**********************************************!*\
  !*** ./src/admin/component/PatternlyWrap.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_responsive_masonry__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-responsive-masonry */ "./node_modules/react-responsive-masonry/es/index.js");
/* harmony import */ var _Context_PatternContext__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Context/PatternContext */ "./src/admin/Context/PatternContext.js");
/* harmony import */ var _PatternlyHeader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./PatternlyHeader */ "./src/admin/component/PatternlyHeader.js");
/* harmony import */ var _PatternlySidebar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./PatternlySidebar */ "./src/admin/component/PatternlySidebar.js");
/* harmony import */ var _PatternDependencyModal__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./PatternDependencyModal */ "./src/admin/component/PatternDependencyModal.js");

/**
 * WordPress dependencies
 */











const PatternlyWrap = () => {
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isVisible, setIsVisible] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [currentPage, setCurrentPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
  const [queryType, setQueryType] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [queryTypeValue, setQueryTypeValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [patternContent, setPatternContent] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [importItem, setImportPattern] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [importItemSlug, setImportPatternSlug] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [importAndSave, setImportAndSave] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [loadFavouriteData, setLoadFavouriteData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [favouriteItems, setFavouriteItems] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [postType, setPostType] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('page');
  const [templateData, setTemplateData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [loadData, setLoadData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [loadMoreButton, setLoadMoreButton] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const [letsPrintData, setLetsPrintData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [searchValue, setSearchValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [colorValue, setColorValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [licenseValue, setLicenseValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [modeValue, setModeValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [sectionValue, setSectionValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [categoryValue, setCategoryValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [favouriteValue, setFavouriteValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isSingle, setIsSingle] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [singlePageImage, setSinglePageImage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [singlePageSlug, setSinglePageSlug] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [singlePageTitle, setSinglePageTitle] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [termData, setTermData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [loadTermData, setLoadTermData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [letsPrintTermData, setLetsPrintTermData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [dependencyModalStatus, setDependencyModalStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [dependencyPlugins, setDependencyPlugins] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [dependencyPluginSlug, setDependencyPluginSlug] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const {
    savePost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useDispatch)('core/editor');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (isVisible) {
      document.querySelector('body').classList.add('pat-disable-scroll');
    } else {
      document.querySelector('body').classList.remove('pat-disable-scroll');
    }
  }, [isVisible]);
  const showLibrary = () => {
    setIsVisible(!isVisible);
    setQueryType('all');
    setLoadData(true);
    setLoadTermData(true);
  };
  const hideLibrary = () => {
    setIsVisible(!isVisible);
    setQueryType(false);
    setDependencyPluginSlug('');
    setDependencyPlugins('');
    setDependencyModalStatus(false);
    setImportAndSave(false);
  };
  const loadMorePatterns = event => {
    let target_page = event.currentTarget.getAttribute('target_page');
    setCurrentPage(target_page);
    setLoadData(true);
  };
  const previewPattern = event => {
    //add disable scroll class for library.
    // let libraryWrap = document.querySelector('.pat-wrapper');
    // libraryWrap.classList.add('pat-disable-scroll');

    //add active class.
    // let popupWrap = document.querySelector('.pat-popup-wrapper');
    // popupWrap.classList.add('pat-popup-active');

    //set img url to popup img.
    let patternItem = event.currentTarget.closest('.pat-item-background');
    let patternItemImg = patternItem.querySelector('img');
    let imageURL = patternItemImg.getAttribute('src');
    // let popupImg = document.querySelector('.pat-popup-item-wrapper img');
    // popupImg.src = imageURL;

    //set slug to import button.
    let slug = event.currentTarget.getAttribute('slug');
    let license = event.currentTarget.getAttribute('license');
    let title = event.currentTarget.getAttribute('templateTitle');

    // let popupImportBtn = document.querySelector('.pat-popup-header .pat-import-button');
    // popupImportBtn.setAttribute('slug', slug);

    // if(license == 'pro') {
    //     if(PatLocalize.is_pro_activated.length === 0) {
    //         popupImportBtn.style.display = 'none';
    //     }
    // }else {
    //     popupImportBtn.style.display = 'flex';
    // }

    setSinglePageImage(imageURL);
    setSinglePageSlug(slug);
    setSinglePageTitle(title);
    setIsSingle(true);
  };
  const hidePreviewPattern = event => {
    //remove disable scroll class for library.
    let libraryWrap = document.querySelector('.pat-wrapper');
    libraryWrap.classList.remove('pat-disable-scroll');

    //remove active class.
    let popupActive = document.querySelector('.pat-popup-active');
    popupActive.classList.remove('pat-popup-active');
  };
  const syncLibrary = event => {
    setQueryType('all');
    setQueryTypeValue(false);
    setCurrentPage(1);
    setLoadData(true);
    setLoadTermData(true);
  };
  const saveAsFavourite = event => {
    //pattern slug.
    let patItem = event.target.closest('.pat-item-background');
    let itemSlug = patItem.getAttribute('data-slug');
    if (!itemSlug) {
      return;
    }

    //api data.
    let data = {
      'nonce': PatLocalize.nonce,
      'post_type': postType,
      'template_slug': itemSlug
    };
    fetch(PatLocalize.save_as_fav_api_url, {
      method: "POST",
      body: JSON.stringify(data)
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data) {
        //add favourite class to the item.
        patItem.classList.add('pat-fav-pattern');
      }
    }).catch(error => {
      console.log('-- after favourite item is saved: error() --');
      console.error(error);
    });
  };
  const backToLibrary = event => {
    event.preventDefault();
    setIsSingle(false);
  };

  //get term data.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    async function fetchTermAPIData() {
      if (loadTermData) {
        await getTermData();
      }
    }
    fetchTermAPIData();
  }, [termData, loadTermData]);

  //get pattern data.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    async function fetchAPIData() {
      if (currentPage && loadData) {
        await getData();
      }
    }
    fetchAPIData();
  }, [queryType, loadData, currentPage]);

  //get favourite data.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    async function fetchFavAPIData() {
      if (loadFavouriteData) {
        await getFavouriteData();
      }
    }
    fetchFavAPIData();
  }, [loadFavouriteData]);

  //get pattern content.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    async function fetchPatternContent() {
      if (importItem && importItemSlug) {
        await getContent();
      }
    }
    fetchPatternContent();
  }, [importItem, importItemSlug]);
  async function getTermData(url = '') {
    if (!PatLocalize.pat_plugin_url) {
      return;
    }
    if (!url) {
      url = PatLocalize.pat_plugin_url + 'src/json/template-terms.json';
    }
    let patSidebar = document.querySelector(".pat-sidebar");
    if (patSidebar) {
      patSidebar.classList.add('pat-skeleton-sidebar-active');
    }
    await Promise.all([fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache'
      }
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      setTermData(response);
      if (patSidebar) {
        patSidebar.classList.remove('pat-skeleton-sidebar-active');
      }
    })]);
    setLetsPrintTermData(true);
    setLoadTermData(false);
  }
  async function getData(apiURL = '') {
    if (!PatLocalize.remoteurl) {
      return;
    }
    if (!apiURL) {
      if (queryType === 'all' && currentPage === 1) {
        apiURL = PatLocalize.pat_plugin_url + 'src/json/default-' + postType + '-templates.json';
      } else {
        //@TODO need to change 'homeurl' to 'remoteurl'.
        const url = new URL(PatLocalize.remoteurl + "/wp-json/optemiz/v1/patternly/templates");
        const params = new URLSearchParams(url.search);
        params.set('post_type', postType);
        if (searchValue) {
          params.set('search', searchValue);
        } else {
          params.delete('search');
        }
        if (colorValue) {
          params.set('color', colorValue);
        } else {
          params.delete('color');
        }
        if (licenseValue) {
          params.set('license', licenseValue);
        } else {
          params.delete('license');
        }
        if (modeValue) {
          params.set('mode', modeValue);
        } else {
          params.delete('mode');
        }
        if (categoryValue) {
          params.set('category', categoryValue);
        } else {
          params.delete('category');
        }
        if (sectionValue) {
          params.set('section', sectionValue);
        } else {
          params.delete('section');
        }
        if (favouriteValue) {
          params.set('favourite', favouriteValue);
        } else {
          params.delete('favourite');
        }
        if (currentPage > 1) {
          params.set('page', currentPage);
          if (templateData['data'].length > 0) {
            let ids = templateData['data'].map(item => {
              return item.id;
            });
            var serializedIds = JSON.stringify(ids);
            params.set('exclude_posts', serializedIds);
          }
        }

        //set final params.
        url.search = params.toString();

        //set final url.
        apiURL = url.toString();
      }

      // display loader.
      let entryContent = document.querySelector('.pat-grid-items-entry-content');
      if (entryContent) {
        entryContent.classList.add('pat-skeleton-grid-items-active');
      }

      // display sync loader.
      let syncBtn = document.querySelector('.pat-sync-btn');
      if (syncBtn) {
        syncBtn.classList.add('pat-sync-btn-active');
      }
    }
    await Promise.all([fetch(apiURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      let oldData = templateData['data'];
      let newData = response['data'];
      if (oldData && currentPage > 1) {
        response['data'] = [...oldData, ...newData];
      }
      if (response['load_more'] == 'no') {
        setLoadMoreButton(false);
      }
      setTemplateData(response);
      let waitTime = 0;
      if (queryType !== 'all') {
        waitTime = 200;
      }
      setTimeout(function () {
        // hide loader.
        let entryContent = document.querySelector('.pat-grid-items-entry-content');
        if (entryContent) {
          entryContent.classList.remove('pat-skeleton-grid-items-active');
        }

        // hide sync loader.
        let syncBtn = document.querySelector('.pat-sync-btn');
        if (syncBtn) {
          syncBtn.classList.remove('pat-sync-btn-active');
        }
      }, waitTime);
    })]);
    setLetsPrintData(true);
    setLoadData(false);
  }

  /**
   * Get farourite patterns
   * 
   * @param {string} url Api URL 
   * 
   * @returns mixed
   */
  async function getFavouriteData() {
    if (!PatLocalize.homeurl) {
      return;
    }
    let url = PatLocalize.homeurl + "/wp-json/optemiz/v1/patternly/get-favourite-templates";

    //api data.
    let data = {
      'nonce': PatLocalize.nonce,
      'post_type': postType
    };
    await Promise.all([fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      // console.log(response);

      setFavouriteValue(response.templates);
      setQueryType(false);
      setLoadData(true);
      setLoadFavouriteData(false);
    })]);
  }

  /**
   * Get template content.
   * 
   * @param {string} apiURL  API URL
   * 
   * @returns mixed
   */
  async function getContent(apiURL = '') {
    if (!PatLocalize.homeurl) {
      return;
    }
    if (!apiURL) {
      const url = new URL(PatLocalize.homeurl + "/wp-json/optemiz/v1/patternly/get_template");
      const params = new URLSearchParams(url.search);

      //add slug to the URL.
      if (importItemSlug.length > 0) {
        params.set('template_slug', importItemSlug);
        params.set('post_type', postType);

        //set final params.
        url.search = params.toString();

        //set final url.
        apiURL = url.toString();
      }
    }
    await Promise.all([fetch(apiURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      if (response.content.length > 0) {
        let parsedBlocks = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.parse)(response.content);

        //insert blocks.
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.store).insertBlocks(parsedBlocks);
        if (!importAndSave) {
          hideLibrary();
        }
        if (importAndSave) {
          //save the post.
          savePost();
          hideLibrary();
        }
      }

      // enable items after importing.
      let patItems = document.querySelectorAll('.pat-item-background');
      if (patItems) {
        patItems.forEach(patItem => {
          if (patItem) {
            patItem.classList.remove('pat-item-disable');
          }
        });
      }
    })]);
    setImportPattern(false);
    setImportPatternSlug('');
    setImportAndSave(false);
  }
  function getTemplateContent(event) {
    event.preventDefault();
    let importButton = event.target;
    if (!importButton.classList.contains('pat-import-button')) {
      importButton = importButton.parentElement;
    }
    let patItem = importButton.closest('.pat-item');
    let dependencies = patItem.getAttribute('data-dependency');
    let patternSlug = patItem.getAttribute('data-slug');

    // Check dependecy plugins are activated or not, display dependency modal if needed.
    if (PatLocalize.activated_plugins && dependencies && dependencies.length > 0) {
      let dependenciesList = dependencies.split(',');

      //check if any of the dependency plugin is previously activated or not.
      let anyPluginIsNotActivated = dependenciesList.some(value => !PatLocalize.activated_plugins.includes(value));
      if (anyPluginIsNotActivated) {
        setDependencyPluginSlug(patternSlug);
        setDependencyPlugins(dependencies);
        setDependencyModalStatus(true);
        return;
      }
    }
    importButton.querySelector('span').innerText = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Importing...', 'patternly');

    // Disable other items when importing.
    let patItems = document.querySelectorAll('.pat-item-background');
    if (patItems) {
      let patCurrentItem = importButton.closest('.pat-item-background');
      patItems.forEach(patItem => {
        if (patItem !== patCurrentItem) {
          if (patItem) {
            patItem.classList.add('pat-item-disable');
          }
        }
      });
    }
    let slug = importButton.getAttribute('slug');
    if (slug) {
      setImportPattern(true);
      setImportPatternSlug(slug);
    }
  }
  function formatUrl(url) {
    //check if `?` mark exist in the URL or not.
    if (!url.includes('?')) {
      url += "?";
    } else {
      url += "&";
    }
    return url;
  }
  function renderItem() {
    if (templateData && letsPrintData) {
      return templateData['data'].map(item => {
        let itemImage = '';
        let className = 'pat-item-background pat-item';
        let isProPattern = false;
        let patternLicense = 'free';
        if (!PatLocalize.is_pro_activated) {
          if (!("license" in item)) {
            item.license = 'free';
          }
          if (item.license.length > 0 && item.license === "pro") {
            className += ' pro-badge';
            isProPattern = true;
            patternLicense = 'pro';
          }
        }

        //check if favourite pattern.
        if (favouriteItems.includes(item.slug)) {
          className += ' pat-fav-pattern';
        }
        let defaultData = PatLocalize.default_page_data;
        if ('pattern' === postType) {
          defaultData = PatLocalize.default_pattern_data;
        }
        if (defaultData.includes(item.slug)) {
          if (item.thumbnail.includes(PatLocalize.remoteurl)) {
            itemImage = item.thumbnail;
          } else {
            itemImage = PatLocalize.pat_plugin_url + 'src/admin/assets/images/template-thumbnails/' + postType + '/' + item.thumbnail;
          }
        } else {
          itemImage = item.thumbnail;
        }
        let patBtn = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          class: "pat-hover-import-button pat-hover-btn pat-import-button",
          onClick: getTemplateContent,
          slug: item.slug
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
          src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/downloading.png`,
          alt: ""
        }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Import', 'patternly')));
        if (isProPattern) {
          patBtn = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
            class: "pat-hover-import-button pat-hover-btn pat-import-button",
            href: PatLocalize.pat_pro_url,
            slug: item.slug
          }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
            src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/gift.png`,
            alt: ""
          }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Get Pro', 'patternly')));
        }
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: className,
          "data-slug": item.slug,
          "data-license": item.license,
          "data-category": item.category,
          "data-tag": item.tag,
          "data-dependency": item.dependency_plugins
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "pat-item-image"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
          src: itemImage,
          alt: item.title
        })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "pat-item-title"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, item.title)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          class: "pat-favourite-icon",
          onClick: saveAsFavourite
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
          width: "18",
          height: "18",
          viewBox: "0 0 20 18",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
          d: "M5.5 0.5C2.47122 0.5 0 2.97122 0 6C0 8.04808 1.54382 9.97645 3.42578 11.9541C5.30774 13.9318 7.62419 15.9347 9.46973 17.7803C9.61038 17.9209 9.80112 17.9999 10 17.9999C10.1989 17.9999 10.3896 17.9209 10.5303 17.7803C12.3758 15.9347 14.6923 13.9318 16.5742 11.9541C18.4562 9.97645 20 8.04808 20 6C20 2.97122 17.5288 0.5 14.5 0.5C12.7618 0.5 11.2484 1.43324 10 3.01855C8.75159 1.43324 7.23822 0.5 5.5 0.5Z",
          fill: "url(#paint0_linear_489_819)"
        }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
          id: "paint0_linear_489_819",
          x1: "10.0059",
          y1: "-1.15276",
          x2: "10.0059",
          y2: "18.4082",
          gradientUnits: "userSpaceOnUse"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
          "stop-color": "#F1693C"
        }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
          offset: "1",
          "stop-color": "#F13F05"
        }))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          class: "pat-hover-buttons"
        }, patBtn, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          class: "pat-hover-preview-button pat-hover-btn",
          onClick: previewPattern,
          license: patternLicense,
          templateTitle: item.title,
          slug: item.slug
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
          src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/eye.png`,
          alt: ""
        }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Preview', 'patternly')))));
      });
    }
  }

  /**
   * Returns `true` if the post is done saving, `false` otherwise.
   *
   * @returns {Boolean}
   */
  const useAfterSave = () => {
    const [isPostSaved, setIsPostSaved] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const isPostSavingInProgress = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
    const {
      isSavingPost,
      isAutosavingPost
    } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(__select => {
      return {
        isSavingPost: __select('core/editor').isSavingPost(),
        isAutosavingPost: __select('core/editor').isAutosavingPost()
      };
    });
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
      if ((isSavingPost || isAutosavingPost) && !isPostSavingInProgress.current) {
        setIsPostSaved(false);
        isPostSavingInProgress.current = true;
        let importBtn = document.querySelector('.pat-proceed-import-btn span');
        importBtn.innerText = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Pattern saving...', 'patternly');
      }
      if (!(isSavingPost || isAutosavingPost) && isPostSavingInProgress.current) {
        // Code to run after post is done saving.
        setIsPostSaved(true);
        isPostSavingInProgress.current = false;
      }
    }, [isSavingPost, isAutosavingPost]);
    return isPostSaved;
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    className: "pat-library-button",
    onClick: () => showLibrary()
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/logo-white.png`,
    alt: "Patternly"
  })), isVisible && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Context_PatternContext__WEBPACK_IMPORTED_MODULE_8__["default"].Provider, {
    value: {
      templateData,
      loadData,
      termData,
      letsPrintTermData,
      setCurrentPage,
      setSearchValue,
      setColorValue,
      setLicenseValue,
      setModeValue,
      setSectionValue,
      setCategoryValue,
      setFavouriteValue,
      setQueryType,
      setQueryTypeValue,
      setLoadData,
      setLoadMoreButton,
      setLoadFavouriteData,
      dependencyModalStatus,
      setDependencyModalStatus,
      dependencyPlugins,
      setDependencyPlugins,
      dependencyPluginSlug,
      setDependencyPluginSlug,
      setImportAndSave,
      setImportPattern,
      setImportPatternSlug,
      useAfterSave,
      postType,
      setPostType,
      setLoadTermData
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-wrapper"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-logo"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: PatLocalize.pat_pro_url
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/logo.png`,
    alt: "Patternly"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-header-wrapper"
  }, !isSingle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    class: "pat-header-btn pat-sync-btn",
    onClick: syncLibrary
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/sync.png`,
    alt: ""
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Sync', 'patternly'))), !isSingle && !PatLocalize.is_pro_activated && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    class: "pat-header-btn pat-pro-btn",
    href: PatLocalize.pat_pro_url
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/gift.png`,
    alt: ""
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Upgrade to Pro', 'patternly'))), isSingle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    class: "pat-header-btn pat-pro-btn pat-import-button",
    onClick: getTemplateContent,
    slug: singlePageSlug
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/downloading.png`,
    alt: ""
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Import', 'patternly'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    class: "pat-header-icon",
    href: PatLocalize.pat_pro_url
  }, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    class: "close-btn",
    src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/info.png`,
    alt: ""
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    class: "pat-header-icon pat-hide-library",
    href: "#",
    onClick: () => hideLibrary()
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    class: "close-btn",
    src: `${PatLocalize.pat_plugin_url}src/admin/assets/images/close.png`,
    alt: ""
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-body"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_PatternDependencyModal__WEBPACK_IMPORTED_MODULE_11__["default"], null), !isSingle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pat-body-inner"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_PatternlySidebar__WEBPACK_IMPORTED_MODULE_10__["default"], null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-main"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_PatternlyHeader__WEBPACK_IMPORTED_MODULE_9__["default"], null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-grid-items-entry-content"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-grid-items-background"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_responsive_masonry__WEBPACK_IMPORTED_MODULE_7__["default"], {
    columnsCount: 3,
    gutter: "30px"
  }, renderItem())), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeleton-grid-items-background"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-skeletion-grid-item"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-load-more-btn-wrapper"
  }, templateData && loadMoreButton && letsPrintData && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    class: "pat-load-more-btn",
    onClick: loadMorePatterns,
    current_offset: templateData['offset'],
    target_page: templateData['current_page'] + 1
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Load More', 'patternly'))))), isSingle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-single-item-wrapper"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-single-page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    class: "pat-single-page-back-btn",
    onClick: backToLibrary
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "11",
    height: "19",
    viewBox: "0 0 11 19",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M9.99625 -0.0097652C10.1951 -0.00951896 10.3894 0.0499998 10.5542 0.161188C10.7191 0.272376 10.8471 0.430185 10.9218 0.614457C10.9965 0.798728 11.0146 1.0011 10.9738 1.19571C10.933 1.39032 10.835 1.56834 10.6925 1.70703L3.39957 9L10.6925 16.293C10.7885 16.3851 10.8651 16.4955 10.9179 16.6176C10.9707 16.7397 10.9986 16.8712 10.9999 17.0042C11.0013 17.1373 10.9761 17.2692 10.9258 17.3924C10.8755 17.5156 10.8012 17.6275 10.7071 17.7216C10.613 17.8157 10.5011 17.89 10.3779 17.9403C10.2547 17.9906 10.1228 18.0158 9.98972 18.0144C9.85668 18.0131 9.72525 17.9852 9.60312 17.9324C9.48099 17.8796 9.37062 17.803 9.27848 17.707L1.27848 9.70703C1.09101 9.51949 0.9857 9.26517 0.9857 9C0.9857 8.73483 1.09101 8.48051 1.27848 8.29297L9.27848 0.292969C9.37178 0.197057 9.48338 0.120844 9.60667 0.0688431C9.72997 0.0168425 9.86244 -0.00988797 9.99625 -0.0097652Z",
    fill: "#717D86"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, singlePageTitle)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-single-body"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-single-browser-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "pat-browser-dotted"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "pat-browser-dotted-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "pat-browser-dotted-item"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "pat-browser-dotted-item"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: singlePageImage
  })))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PatternlyWrap);

/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _component_PatternlyWrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component/PatternlyWrap */ "./src/admin/component/PatternlyWrap.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/admin/style.scss");




/**
 * Import the stylesheet
 */

document.addEventListener('DOMContentLoaded', function () {
  // create patternly button
  const patternWrapper = document.createElement('div');
  patternWrapper.classList.add('pat-library-button-wrapper');
  ReactDOM.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_component_PatternlyWrap__WEBPACK_IMPORTED_MODULE_2__["default"], null), patternWrapper);
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.subscribe)(() => {
    const toolbar = document.querySelector('.edit-post-header-toolbar');
    if (toolbar) {
      toolbar.appendChild(patternWrapper);
    }
  });
});

/***/ }),

/***/ "./src/admin/style.scss":
/*!******************************!*\
  !*** ./src/admin/style.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/prop-types/node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/prop-types/node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/prop-types/node_modules/react-is/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/prop-types/node_modules/react-is/index.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/react-responsive-masonry/es/Masonry/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/react-responsive-masonry/es/Masonry/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Masonry = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Masonry, _React$Component);

  function Masonry() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Masonry.prototype;

  _proto.getColumns = function getColumns() {
    var _this$props = this.props,
        children = _this$props.children,
        columnsCount = _this$props.columnsCount;
    var columns = Array.from({
      length: columnsCount
    }, function () {
      return [];
    });
    var validIndex = 0;
    react__WEBPACK_IMPORTED_MODULE_0___default().Children.forEach(children, function (child) {
      if (child && react__WEBPACK_IMPORTED_MODULE_0___default().isValidElement(child)) {
        columns[validIndex % columnsCount].push(child);
        validIndex++;
      }
    });
    return columns;
  };

  _proto.renderColumns = function renderColumns() {
    var _this$props2 = this.props,
        gutter = _this$props2.gutter,
        itemTag = _this$props2.itemTag,
        itemStyle = _this$props2.itemStyle;
    return this.getColumns().map(function (column, i) {
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(itemTag, {
        key: i,
        style: _extends({
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignContent: "stretch",
          flex: 1,
          width: 0,
          gap: gutter
        }, itemStyle)
      }, column.map(function (item) {
        return item;
      }));
    });
  };

  _proto.render = function render() {
    var _this$props3 = this.props,
        gutter = _this$props3.gutter,
        className = _this$props3.className,
        style = _this$props3.style,
        containerTag = _this$props3.containerTag;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(containerTag, {
      style: _extends({
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "stretch",
        boxSizing: "border-box",
        width: "100%",
        gap: gutter
      }, style),
      className: className
    }, this.renderColumns());
  };

  return Masonry;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

Masonry.propTypes =  true ? {
  children: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_1___default().node)), (prop_types__WEBPACK_IMPORTED_MODULE_1___default().node)]).isRequired,
  columnsCount: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number),
  gutter: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  className: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  style: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
  containerTag: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  itemTag: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  itemStyle: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object)
} : 0;
Masonry.defaultProps = {
  columnsCount: 3,
  gutter: "0",
  className: null,
  style: {},
  containerTag: "div",
  itemTag: "div",
  itemStyle: {}
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Masonry);

/***/ }),

/***/ "./node_modules/react-responsive-masonry/es/ResponsiveMasonry/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/react-responsive-masonry/es/ResponsiveMasonry/index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);


var DEFAULT_COLUMNS_COUNT = 1;
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect;

var useHasMounted = function useHasMounted() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
      hasMounted = _useState[0],
      setHasMounted = _useState[1];

  useIsomorphicLayoutEffect(function () {
    setHasMounted(true);
  }, []);
  return hasMounted;
};

var useWindowWidth = function useWindowWidth() {
  var hasMounted = useHasMounted();

  var _useState2 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(typeof window !== "undefined" ? window.innerWidth : 0),
      width = _useState2[0],
      setWidth = _useState2[1];

  var handleResize = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    if (!hasMounted) return;
    setWidth(window.innerWidth);
  }, [hasMounted]);
  useIsomorphicLayoutEffect(function () {
    if (hasMounted) {
      window.addEventListener("resize", handleResize);
      handleResize();
      return function () {
        return window.removeEventListener("resize", handleResize);
      };
    }
  }, [hasMounted, handleResize]);
  return width;
};

var MasonryResponsive = function MasonryResponsive(_ref) {
  var _ref$columnsCountBrea = _ref.columnsCountBreakPoints,
      columnsCountBreakPoints = _ref$columnsCountBrea === void 0 ? {
    350: 1,
    750: 2,
    900: 3
  } : _ref$columnsCountBrea,
      children = _ref.children,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? null : _ref$className,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? null : _ref$style;
  var windowWidth = useWindowWidth();
  var columnsCount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    var breakPoints = Object.keys(columnsCountBreakPoints).sort(function (a, b) {
      return a - b;
    });
    var count = breakPoints.length > 0 ? columnsCountBreakPoints[breakPoints[0]] : DEFAULT_COLUMNS_COUNT;
    breakPoints.forEach(function (breakPoint) {
      if (breakPoint < windowWidth) {
        count = columnsCountBreakPoints[breakPoint];
      }
    });
    return count;
  }, [windowWidth, columnsCountBreakPoints]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: className,
    style: style
  }, react__WEBPACK_IMPORTED_MODULE_0___default().Children.map(children, function (child, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default().cloneElement(child, {
      key: index,
      columnsCount: columnsCount
    });
  }));
};

MasonryResponsive.propTypes =  true ? {
  children: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_1___default().node)), (prop_types__WEBPACK_IMPORTED_MODULE_1___default().node)]).isRequired,
  columnsCountBreakPoints: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
  className: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  style: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object)
} : 0;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MasonryResponsive);

/***/ }),

/***/ "./node_modules/react-responsive-masonry/es/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-responsive-masonry/es/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResponsiveMasonry: () => (/* reexport safe */ _ResponsiveMasonry__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Masonry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Masonry */ "./node_modules/react-responsive-masonry/es/Masonry/index.js");
/* harmony import */ var _ResponsiveMasonry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResponsiveMasonry */ "./node_modules/react-responsive-masonry/es/ResponsiveMasonry/index.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_Masonry__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"backend": 0,
/******/ 			"./style-backend": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkoptemiz_base_plugin"] = self["webpackChunkoptemiz_base_plugin"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-backend"], () => (__webpack_require__("./src/admin/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map