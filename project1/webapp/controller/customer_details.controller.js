sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ndc/BarcodeScanner"
], function (Controller, MessageBox, MessageToast, JSONModel, BarcodeScanner) {
    "use strict";

    return Controller.extend("project1.controller.customer_details", {
        onInit: function () {
            // Ensure all records are displayed initially
            this.getView().byId("smarttable").rebindTable();
        },

        onScan: function (oEvent) {
            var that = this;
            BarcodeScanner.scan(
                function (mResult) {
                    if (!mResult.cancelled) {
                        that.getView().byId("customerid").setValue(mResult.text);
                        MessageBox.show(
                            "We got a QR code\n" +
                            "Result: " + mResult.text + "\n" +
                            "Format: " + mResult.format + "\n"
                        );
                    }
                },
                function (Error) {
                    alert("Scanning failed: " + Error);
                }
            );
        },

        onBeforeRebindTable: function (oEvent) {
            // Only apply filters if requested by the user
            if (!this._bApplyFilter) {
                return; // If false, do nothing (initial load)
            }

            var Zcid = this.getView().byId("customerid").getValue();
            var Znamee = this.getView().byId("customername").getValue();
            var aFilters = [];

            if (Zcid) {
                aFilters.push(new sap.ui.model.Filter("Zcid", sap.ui.model.FilterOperator.EQ, Zcid));
            }
            if (Znamee) {
                aFilters.push(new sap.ui.model.Filter("Znamee", sap.ui.model.FilterOperator.Contains, Znamee));
            }

            if (aFilters.length > 0) {
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: true
                });
                oEvent.getParameter("bindingParams").filters.push(oCombinedFilter);
            }
        },

        ongetdata: function () {
            // Enable filtering on table rebind
            this._bApplyFilter = true;
            this.getView().byId("smarttable").rebindTable();
        },

        DELETE: function () {
            this.getOwnerComponent().getRouter().navTo("Routesecondview");
        },

        onRowSelection: function (oEvent) {
            var oSelectedItem = oEvent.getSource().getSelectedContexts()[0];
            if (!oSelectedItem) {
                sap.m.MessageToast.show("No row selected!");
                return;
            }

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oSelectedData = oSelectedItem.getObject();
            var oModel = new sap.ui.model.json.JSONModel(oSelectedData);
            this.getOwnerComponent().setModel(oModel, "employeeData");

            oRouter.navTo("Routesecondview");
        },

        onCreatePress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Routethirdview");
        }
    });
});
