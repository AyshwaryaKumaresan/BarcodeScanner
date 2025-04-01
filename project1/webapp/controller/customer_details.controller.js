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
            if (!this._bApplyFilter) {
                return;
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
            this._bApplyFilter = true;
            this.getView().byId("smarttable").rebindTable();
        },

        // ** DELETE ROW FROM ENTITY SET**
        onDeletePress: function () {
            var oTable = this.getView().byId("tablel1");// Get the table control
            var aSelectedItems = oTable.getSelectedItems();// Get selected rows

            if (aSelectedItems.length === 0) {// Check if no row is selected
                MessageToast.show("Please select at least one row to delete.");
                return;
            }

            var oModel = this.getView().getModel();// Get the OData model

            // Loop through selected rows and delete each record from OData
            aSelectedItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext();// Get binding context of row
                var sPath = oContext.getPath(); // Get the entity path (e.g., "/ztable_akset(1)")

                // Confirmation before delete
                MessageBox.confirm("Are you sure you want to delete the selected record?", {
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {// If user confirms deletion
                            oModel.remove(sPath, {
                                success: function () {// Success callback
                                    MessageToast.show("Record deleted successfully.");
                                    oTable.removeSelections(true);// Clear row selection
                                    oModel.refresh(true); // Refresh model to reflect changes or updates
                                },
                                error: function (oError) {// Error callback
                                    MessageBox.error("Failed to delete record.");
                                }
                            });
                        }
                    }
                });
            });
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
