(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home~monitor~system"],{

/***/ "./src/components/MenuCustom.svelte":
/*!******************************************!*\
  !*** ./src/components/MenuCustom.svelte ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/svelte-loader/index.js):\nError: ParseError: </span> attempted to close an element that was not open (28:37)\n26: {/each}\n27: {:catch error}\n28: <p style=\"color: red\">{error.message}</span>\n                                         ^\n29: {/await}\n30: \n    at preprocess.then.catch.err (/home/edwinspire/Documentos/Desarrollo/open-monitoring-system/node_modules/svelte-loader/index.js:181:12)");

/***/ }),

/***/ "./src/components/NavSystem.svelte":
/*!*****************************************!*\
  !*** ./src/components/NavSystem.svelte ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal/index.mjs");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! svelte */ "./node_modules/svelte/index.mjs");
/* harmony import */ var _MenuDivisions_svelte__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MenuDivisions.svelte */ "./src/components/MenuDivisions.svelte");
/* harmony import */ var _MenuCustom_svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MenuCustom.svelte */ "./src/components/MenuCustom.svelte");
/* src/components/NavSystem.svelte generated by Svelte v3.23.2 */


const { console: console_1 } = svelte_internal__WEBPACK_IMPORTED_MODULE_0__["globals"];



const file = "src/components/NavSystem.svelte";
const get_title_slot_changes = dirty => ({});
const get_title_slot_context = ctx => ({});

// (47:27)            
function fallback_block(ctx) {
	let strong;
	let t;

	const block = {
		c: function create() {
			strong = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("strong");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("OPEN MONITORING SYSTEM");
			this.h();
		},
		l: function claim(nodes) {
			strong = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(nodes, "STRONG", {});
			var strong_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(strong);
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_text"])(strong_nodes, "OPEN MONITORING SYSTEM");
			strong_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			this.h();
		},
		h: function hydrate() {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(strong, file, 47, 10, 1344);
		},
		m: function mount(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert_dev"])(target, strong, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(strong, t);
		},
		d: function destroy(detaching) {
			if (detaching) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"])(strong);
		}
	};

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["dispatch_dev"])("SvelteRegisterBlock", {
		block,
		id: fallback_block.name,
		type: "fallback",
		source: "(47:27)            ",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let nav;
	let div0;
	let a0;
	let img;
	let img_src_value;
	let t0;
	let a1;
	let span0;
	let t1;
	let span1;
	let t2;
	let span2;
	let t3;
	let div7;
	let div1;
	let a2;
	let t4;
	let div6;
	let div3;
	let a3;
	let span3;
	let i0;
	let t5;
	let span4;
	let t6;
	let t7;
	let div2;
	let a4;
	let t8;
	let t9;
	let a5;
	let t10;
	let t11;
	let a6;
	let t12;
	let t13;
	let menudivisions;
	let t14;
	let menucustom;
	let t15;
	let div5;
	let div4;
	let a7;
	let span5;
	let i1;
	let t16;
	let span6;
	let t17;
	let current;
	let mounted;
	let dispose;
	const title_slot_template = /*$$slots*/ ctx[4].title;
	const title_slot = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["create_slot"])(title_slot_template, ctx, /*$$scope*/ ctx[3], get_title_slot_context);
	const title_slot_or_fallback = title_slot || fallback_block(ctx);
	menudivisions = new _MenuDivisions_svelte__WEBPACK_IMPORTED_MODULE_2__["default"]({ $$inline: true });
	menucustom = new _MenuCustom_svelte__WEBPACK_IMPORTED_MODULE_3__["default"]({ $$inline: true });

	const block = {
		c: function create() {
			nav = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("nav");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			a0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			img = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("img");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			span0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			span1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			span2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			a2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			if (title_slot_or_fallback) title_slot_or_fallback.c();
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			a3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			span3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			i0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			span4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Sistema");
			t7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			a4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Eventos");
			t9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Endpoints");
			t11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t12 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Divisiones");
			t13 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["create_component"])(menudivisions.$$.fragment);
			t14 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["create_component"])(menucustom.$$.fragment);
			t15 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			a7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			span5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			i1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t16 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			span6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			t17 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Salir");
			this.h();
		},
		l: function claim(nodes) {
			nav = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(nodes, "NAV", {
				class: true,
				role: true,
				"aria-label": true
			});

			var nav_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(nav);
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(nav_nodes, "DIV", { class: true });
			var div0_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(div0);
			a0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div0_nodes, "A", { class: true, href: true });
			var a0_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(a0);
			img = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(a0_nodes, "IMG", { src: true, width: true, height: true });
			a0_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(div0_nodes);

			a1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div0_nodes, "A", {
				role: true,
				class: true,
				"aria-label": true,
				"aria-expanded": true
			});

			var a1_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(a1);
			span0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(a1_nodes, "SPAN", { "aria-hidden": true });
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(span0).forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(a1_nodes);
			span1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(a1_nodes, "SPAN", { "aria-hidden": true });
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(span1).forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(a1_nodes);
			span2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(a1_nodes, "SPAN", { "aria-hidden": true });
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(span2).forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			a1_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			div0_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(nav_nodes);
			div7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(nav_nodes, "DIV", { class: true });
			var div7_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(div7);
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div7_nodes, "DIV", { class: true });
			var div1_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(div1);
			a2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div1_nodes, "A", { class: true });
			var a2_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(a2);
			if (title_slot_or_fallback) title_slot_or_fallback.l(a2_nodes);
			a2_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			div1_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(div7_nodes);
			div6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div7_nodes, "DIV", { class: true });
			var div6_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(div6);
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div6_nodes, "DIV", { class: true });
			var div3_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(div3);
			a3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div3_nodes, "A", { class: true });
			var a3_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(a3);
			span3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(a3_nodes, "SPAN", { class: true });
			var span3_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(span3);
			i0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(span3_nodes, "I", { class: true, "aria-hidden": true });
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(i0).forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			span3_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(a3_nodes);
			span4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(a3_nodes, "SPAN", {});
			var span4_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(span4);
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_text"])(span4_nodes, "Sistema");
			span4_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			a3_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(div3_nodes);
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div3_nodes, "DIV", { class: true });
			var div2_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(div2);
			a4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div2_nodes, "A", { class: true, "data-button": true });
			var a4_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(a4);
			t8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_text"])(a4_nodes, "Eventos");
			a4_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(div2_nodes);
			a5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div2_nodes, "A", { class: true, "data-button": true });
			var a5_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(a5);
			t10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_text"])(a5_nodes, "Endpoints");
			a5_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(div2_nodes);
			a6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div2_nodes, "A", { class: true, "data-button": true });
			var a6_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(a6);
			t12 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_text"])(a6_nodes, "Divisiones");
			a6_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			div2_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			div3_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t13 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(div6_nodes);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_component"])(menudivisions.$$.fragment, div6_nodes);
			t14 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(div6_nodes);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_component"])(menucustom.$$.fragment, div6_nodes);
			t15 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(div6_nodes);
			div5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div6_nodes, "DIV", { class: true });
			var div5_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(div5);
			div4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div5_nodes, "DIV", { class: true });
			var div4_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(div4);
			a7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(div4_nodes, "A", { class: true, href: true });
			var a7_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(a7);
			span5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(a7_nodes, "SPAN", { class: true });
			var span5_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(span5);
			i1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(span5_nodes, "I", { class: true });
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(i1).forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			span5_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			t16 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_space"])(a7_nodes);
			span6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_element"])(a7_nodes, "SPAN", {});
			var span6_nodes = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["children"])(span6);
			t17 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["claim_text"])(span6_nodes, "Salir");
			span6_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			a7_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			div4_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			div5_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			div6_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			div7_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			nav_nodes.forEach(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"]);
			this.h();
		},
		h: function hydrate() {
			if (img.src !== (img_src_value = "logo.png")) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(img, "src", img_src_value);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(img, "width", "25");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(img, "height", "25");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(img, file, 25, 6, 720);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a0, "class", "navbar-item");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a0, "href", "/home");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(a0, file, 23, 4, 625);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(span0, "aria-hidden", "true");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(span0, file, 36, 6, 1013);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(span1, "aria-hidden", "true");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(span1, file, 37, 6, 1047);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(span2, "aria-hidden", "true");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(span2, file, 38, 6, 1081);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a1, "role", "button");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a1, "class", "navbar-burger burger");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a1, "aria-label", "menu");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a1, "aria-expanded", "false");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(a1, "is-active", /*MenuOpen*/ ctx[0]);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(a1, file, 29, 4, 830);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(div0, "class", "navbar-brand");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(div0, file, 22, 2, 594);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a2, "class", "navbar-item");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(a2, file, 45, 6, 1282);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(div1, "class", "navbar-start is-size-7");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(div1, file, 43, 4, 1187);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(i0, "class", "fa fa-cogs");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(i0, "aria-hidden", "true");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(i0, file, 59, 12, 1651);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(span3, "class", "icon");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(span3, file, 58, 10, 1619);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(span4, file, 61, 10, 1723);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a3, "class", "navbar-link");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(a3, file, 57, 8, 1585);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a4, "class", "navbar-item");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a4, "data-button", "system.events");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(a4, file, 66, 10, 1880);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a5, "class", "navbar-item");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a5, "data-button", "system.endpoints");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(a5, file, 74, 10, 2152);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a6, "class", "navbar-item");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a6, "data-button", "system.divisions");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(a6, file, 81, 10, 2373);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(div2, "class", "navbar-dropdown is-boxed is-right");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(div2, file, 64, 8, 1766);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(div3, "class", "navbar-item has-dropdown is-hoverable ");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(div3, file, 55, 6, 1470);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(i1, "class", "fas fa-sign-out-alt");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(i1, file, 97, 14, 2773);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(span5, "class", "icon");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(span5, file, 96, 12, 2739);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(span6, file, 99, 12, 2839);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a7, "class", "bd-tw-button button is-small is-primary");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(a7, "href", "/");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(a7, file, 95, 10, 2666);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(div4, "class", "buttons");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(div4, file, 93, 8, 2633);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(div5, "class", "navbar-item");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(div5, file, 92, 6, 2599);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(div6, "class", "navbar-end is-size-7");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(div6, file, 53, 4, 1428);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(div7, "class", "navbar-menu");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(div7, "is-active", /*MenuOpen*/ ctx[0]);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(div7, file, 42, 2, 1130);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(nav, "class", "navbar gbackground-silver");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(nav, "role", "navigation");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr_dev"])(nav, "aria-label", "main navigation");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_location"])(nav, file, 18, 0, 499);
		},
		m: function mount(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert_dev"])(target, nav, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(nav, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div0, a0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a0, img);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div0, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div0, a1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a1, span0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a1, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a1, span1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a1, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a1, span2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(nav, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(nav, div7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div7, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div1, a2);

			if (title_slot_or_fallback) {
				title_slot_or_fallback.m(a2, null);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div7, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div7, div6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div6, div3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div3, a3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a3, span3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(span3, i0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a3, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a3, span4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(span4, t6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div3, t7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div3, div2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div2, a4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a4, t8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div2, t9);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div2, a5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a5, t10);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div2, t11);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div2, a6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a6, t12);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div6, t13);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(menudivisions, div6, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div6, t14);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(menucustom, div6, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div6, t15);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div6, div5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div5, div4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(div4, a7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a7, span5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(span5, i1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a7, t16);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(a7, span6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append_dev"])(span6, t17);
			current = true;

			if (!mounted) {
				dispose = [
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen_dev"])(a1, "click", /*ToggleClassMenu*/ ctx[1], false, false, false),
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen_dev"])(a4, "click", /*HandleClickMenu*/ ctx[2], false, false, false),
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen_dev"])(a5, "click", /*HandleClickMenu*/ ctx[2], false, false, false),
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen_dev"])(a6, "click", /*HandleClickMenu*/ ctx[2], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*MenuOpen*/ 1) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(a1, "is-active", /*MenuOpen*/ ctx[0]);
			}

			if (title_slot) {
				if (title_slot.p && dirty & /*$$scope*/ 8) {
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["update_slot"])(title_slot, title_slot_template, ctx, /*$$scope*/ ctx[3], dirty, get_title_slot_changes, get_title_slot_context);
				}
			}

			if (dirty & /*MenuOpen*/ 1) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(div7, "is-active", /*MenuOpen*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["transition_in"])(title_slot_or_fallback, local);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["transition_in"])(menudivisions.$$.fragment, local);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["transition_in"])(menucustom.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["transition_out"])(title_slot_or_fallback, local);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["transition_out"])(menudivisions.$$.fragment, local);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["transition_out"])(menucustom.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_dev"])(nav);
			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["destroy_component"])(menudivisions);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["destroy_component"])(menucustom);
			mounted = false;
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["dispatch_dev"])("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let MenuOpen = false;
	const dispatch = Object(svelte__WEBPACK_IMPORTED_MODULE_1__["createEventDispatcher"])();

	function ToggleClassMenu() {
		console.log("Toogle");
		$$invalidate(0, MenuOpen = !MenuOpen);
	}

	function HandleClickMenu(event) {
		console.log("Emite", event.target.dataset.button);
		dispatch("button", { button: event.target.dataset.button });
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<NavSystem> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["validate_slots"])("NavSystem", $$slots, ['title']);

	$$self.$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		onMount: svelte__WEBPACK_IMPORTED_MODULE_1__["onMount"],
		createEventDispatcher: svelte__WEBPACK_IMPORTED_MODULE_1__["createEventDispatcher"],
		MenuDivisions: _MenuDivisions_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
		MenuCustom: _MenuCustom_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
		MenuOpen,
		dispatch,
		ToggleClassMenu,
		HandleClickMenu
	});

	$$self.$inject_state = $$props => {
		if ("MenuOpen" in $$props) $$invalidate(0, MenuOpen = $$props.MenuOpen);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [MenuOpen, ToggleClassMenu, HandleClickMenu, $$scope, $$slots];
}

class NavSystem extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponentDev"] {
	constructor(options) {
		super(options);
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], {});

		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["dispatch_dev"])("SvelteRegisterComponent", {
			component: this,
			tagName: "NavSystem",
			options,
			id: create_fragment.name
		});
	}
}

/* harmony default export */ __webpack_exports__["default"] = (NavSystem);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9OYXZTeXN0ZW0uc3ZlbHRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUMwRDtBQUNMO0FBQ047Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NHQTZCeEIsR0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7d0dBVWEsR0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5R0FacEMsR0FBZTt5R0F1Q1QsR0FBZTt5R0FRZixHQUFlO3lHQU9qQixHQUFlOzs7Ozs7Ozt1R0FwRFosR0FBUTs7Ozs7Ozs7Ozt5R0FVYSxHQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXJDOUMsUUFBUSxHQUFHLEtBQUs7T0FDZCxRQUFRLEdBQUcsb0VBQXFCOztVQUM3QixlQUFlO0VBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtrQkFDcEIsUUFBUSxJQUFJLFFBQVE7OztVQUdiLGVBQWUsQ0FBQyxLQUFLO0VBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU07RUFDaEQsUUFBUSxDQUFDLFFBQVEsSUFBSSxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSIsImZpbGUiOiIzNGZiMjYwZTQ5OWNkYWMxODFlYS9ob21lfm1vbml0b3J+c3lzdGVtLmhvbWV+bW9uaXRvcn5zeXN0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBpbXBvcnQgeyBvbk1vdW50LCBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwic3ZlbHRlXCI7XG4gIGltcG9ydCBNZW51RGl2aXNpb25zIGZyb20gXCIuL01lbnVEaXZpc2lvbnMuc3ZlbHRlXCI7XG4gIGltcG9ydCBNZW51Q3VzdG9tIGZyb20gXCIuL01lbnVDdXN0b20uc3ZlbHRlXCI7XG5cbiAgbGV0IE1lbnVPcGVuID0gZmFsc2U7XG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG4gIGZ1bmN0aW9uIFRvZ2dsZUNsYXNzTWVudSgpIHtcbiAgICBjb25zb2xlLmxvZyhcIlRvb2dsZVwiKTtcbiAgICBNZW51T3BlbiA9ICFNZW51T3BlbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIEhhbmRsZUNsaWNrTWVudShldmVudCkge1xuICAgIGNvbnNvbGUubG9nKFwiRW1pdGVcIiwgZXZlbnQudGFyZ2V0LmRhdGFzZXQuYnV0dG9uKTtcbiAgICBkaXNwYXRjaChcImJ1dHRvblwiLCB7IGJ1dHRvbjogZXZlbnQudGFyZ2V0LmRhdGFzZXQuYnV0dG9uIH0pO1xuICB9XG48L3NjcmlwdD5cblxuPG5hdlxuICBjbGFzcz1cIm5hdmJhciBnYmFja2dyb3VuZC1zaWx2ZXJcIlxuICByb2xlPVwibmF2aWdhdGlvblwiXG4gIGFyaWEtbGFiZWw9XCJtYWluIG5hdmlnYXRpb25cIj5cbiAgPGRpdiBjbGFzcz1cIm5hdmJhci1icmFuZFwiPlxuICAgIDxhIGNsYXNzPVwibmF2YmFyLWl0ZW1cIiBocmVmPVwiL2hvbWVcIj5cbiAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW1pc3NpbmctYXR0cmlidXRlIC0tPlxuICAgICAgPGltZyBzcmM9XCJsb2dvLnBuZ1wiIHdpZHRoPVwiMjVcIiBoZWlnaHQ9XCIyNVwiIC8+XG4gICAgPC9hPlxuXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktbWlzc2luZy1hdHRyaWJ1dGUgLS0+XG4gICAgPGFcbiAgICAgIG9uOmNsaWNrPXtUb2dnbGVDbGFzc01lbnV9XG4gICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzOmlzLWFjdGl2ZT17TWVudU9wZW59XG4gICAgICBjbGFzcz1cIm5hdmJhci1idXJnZXIgYnVyZ2VyXCJcbiAgICAgIGFyaWEtbGFiZWw9XCJtZW51XCJcbiAgICAgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz5cbiAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XG4gICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiAvPlxuICAgIDwvYT5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cIm5hdmJhci1tZW51XCIgY2xhc3M6aXMtYWN0aXZlPXtNZW51T3Blbn0+XG4gICAgPGRpdiBjbGFzcz1cIm5hdmJhci1zdGFydCBpcy1zaXplLTdcIj5cbiAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW1pc3NpbmctYXR0cmlidXRlIC0tPlxuICAgICAgPGEgY2xhc3M9XCJuYXZiYXItaXRlbVwiPlxuICAgICAgICA8c2xvdCBuYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICA8c3Ryb25nPk9QRU4gTU9OSVRPUklORyBTWVNURU08L3N0cm9uZz5cbiAgICAgICAgPC9zbG90PlxuICAgICAgPC9hPlxuXG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwibmF2YmFyLWVuZCBpcy1zaXplLTdcIj5cblxuICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhci1pdGVtIGhhcy1kcm9wZG93biBpcy1ob3ZlcmFibGUgXCI+XG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW1pc3NpbmctYXR0cmlidXRlIC0tPlxuICAgICAgICA8YSBjbGFzcz1cIm5hdmJhci1saW5rXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNvZ3NcIiBhcmlhLWhpZGRlbj1cInRydWVcIiAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3Bhbj5TaXN0ZW1hPC9zcGFuPlxuICAgICAgICA8L2E+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhci1kcm9wZG93biBpcy1ib3hlZCBpcy1yaWdodFwiPlxuICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW1pc3NpbmctYXR0cmlidXRlIC0tPlxuICAgICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzcz1cIm5hdmJhci1pdGVtXCJcbiAgICAgICAgICAgIGRhdGEtYnV0dG9uPVwic3lzdGVtLmV2ZW50c1wiXG4gICAgICAgICAgICBvbjpjbGljaz17SGFuZGxlQ2xpY2tNZW51fT5cbiAgICAgICAgICAgIEV2ZW50b3NcbiAgICAgICAgICA8L2E+XG4gICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktbWlzc2luZy1hdHRyaWJ1dGUgLS0+XG4gICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktaW52YWxpZC1hdHRyaWJ1dGUgLS0+XG4gICAgICAgICAgPGFcbiAgICAgICAgICAgIGNsYXNzPVwibmF2YmFyLWl0ZW1cIlxuICAgICAgICAgICAgZGF0YS1idXR0b249XCJzeXN0ZW0uZW5kcG9pbnRzXCJcbiAgICAgICAgICAgIG9uOmNsaWNrPXtIYW5kbGVDbGlja01lbnV9PlxuICAgICAgICAgICAgRW5kcG9pbnRzXG4gICAgICAgICAgPC9hPlxuICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW1pc3NpbmctYXR0cmlidXRlIC0tPlxuICAgICAgICAgIDxhXG4gICAgICAgICAgY2xhc3M9XCJuYXZiYXItaXRlbVwiXG4gICAgICAgICAgZGF0YS1idXR0b249XCJzeXN0ZW0uZGl2aXNpb25zXCJcbiAgICAgICAgICBvbjpjbGljaz17SGFuZGxlQ2xpY2tNZW51fT5cbiAgICAgICAgICBEaXZpc2lvbmVzXG4gICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPE1lbnVEaXZpc2lvbnMgLz5cbiAgICAgIDxNZW51Q3VzdG9tIC8+XG4gICAgICA8ZGl2IGNsYXNzPVwibmF2YmFyLWl0ZW1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cblxuICAgICAgICAgIDxhIGNsYXNzPVwiYmQtdHctYnV0dG9uIGJ1dHRvbiBpcy1zbWFsbCBpcy1wcmltYXJ5XCIgaHJlZj1cIi9cIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1zaWduLW91dC1hbHRcIiAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+U2FsaXI8L3NwYW4+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uYXY+XG4iXSwic291cmNlUm9vdCI6IiJ9