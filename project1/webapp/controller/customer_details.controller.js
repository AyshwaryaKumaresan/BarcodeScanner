sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ndc/BarcodeScanner"
], function (Controller, MessageBox, MessageToast, JSONModel, BarcodeScanner) {
    "use strict";

    return Controller.extend("project1.controller.customer_details", {
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

        ongetdata: function () {
            var oModel = this.getOwnerComponent().getModel(); // Get OData model
            console.log(oModel);
        },

        onBeforeRebindTable: function (oEvent) {
            var Zcid = this.getView().byId("customerid").getValue();
            var Znamee = this.getView().byId("customername").getValue();

            var aFilters = [
                new sap.ui.model.Filter("Zcid", sap.ui.model.FilterOperator.EQ, Zcid),
                new sap.ui.model.Filter("Znamee", sap.ui.model.FilterOperator.EQ, Znamee)
            ];

            // Combine filters with AND condition
            var oCombinedFilter = new sap.ui.model.Filter({
                filters: aFilters,
                and: true // Ensures both conditions must match
            });

            oEvent.getParameter("bindingParams").filters.push(oCombinedFilter);
        },

        ongetdata: function () {
            var that = this;
            var Zcid = this.getView().byId("customerid").getValue();
            var Znamee = this.getView().byId("customername").getValue();

            debugger;
            if (!Zcid || !Znamee) {
                MessageToast.show("Scanned data is incomplete. Please scan again.");
                return;
            }

            var oTable = that.getView().byId("smarttable");
            oTable.rebindTable();
            var oModel = this.getOwnerComponent().getModel(); // Get OData model
        },

        NEXT: function () {
            this.getOwnerComponent().getRouter().navTo("Routesecondview");
        },
        onRowSelection: function(oEvent) {
            var oSelectedItem = oEvent.getSource().getSelectedContexts()[0];
            if (!oSelectedItem) {
                sap.m.MessageToast.show("No row selected!");
                return;
            }
       
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oSelectedData = oSelectedItem.getObject(); // Get selected row data
 
            var oModel = new sap.ui.model.json.JSONModel(oSelectedData);
            this.getOwnerComponent().setModel(oModel, "employeeData");
 
            // oRouter.navTo("Routedestination");
            oRouter.navTo("Routesecondview");
 
        },
    });
});
