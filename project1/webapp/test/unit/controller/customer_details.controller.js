/*global QUnit*/

sap.ui.define([
	"project1/controller/customer_details.controller"
], function (Controller) {
	"use strict";

	QUnit.module("customer_details Controller");

	QUnit.test("I should test the customer_details controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
