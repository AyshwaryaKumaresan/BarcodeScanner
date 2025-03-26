sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ndc/BarcodeScanner"
], function (Controller, MessageBox, MessageToast, JSONModel, BarcodeScanner) {
    "use strict";

    return Controller.extend("project1.controller.SecondView", {
    
        onInit: function () {
            // Get OData model from Component
            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel, "mainModel");

            // Load data from OData EntitySet
            this._loadData();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Routesecondview").attachPatternMatched(this._onObjectMatched2, this);
        },

        _loadData: function () {
            var oModel = this.getView().getModel("mainModel");

            // Define entity set name
            var sEntitySet = "/ztable_akSet"; 

            // Read data
            oModel.read(sEntitySet, {
                success: function (oData) {
                    // Bind the first record (Assuming it's a single object)
                    var oJsonModel = new sap.ui.model.json.JSONModel(oData.results[0]);
                    this.getView().setModel(oJsonModel, "mainModel");
                }.bind(this),
                error: function (oError) {
                    console.error("Failed to load data:", oError);
                },
            });
        },

        _onObjectMatched2: function (oEvent) {
            var oModel = this.getView().getModel("employeeData"); // Get JSON model
            var oData = oModel.getData();

            if (oData) {
                this.getView().byId("cid").setValue(oData.Zcid || "");
                this.getView().byId("name").setValue(oData.Znamee || "");
                this.getView().byId("address").setValue(oData.Zaddress || "");
                this.getView().byId("pno").setValue(oData.Zpno || "");
                this.getView().byId("input5").setValue(oData.Zaddress || "");
                this.getView().byId("input6").setValue(oData.Znamee || "");
                this.getView().byId("exceptionHandling").setValue(oData.Zcid || "");
            } else {
                sap.m.MessageToast.show("No employee data found!");
            }
        },

        // Save Button Function
        onSavePress: function () {
            var oModel = this.getView().getModel();
            // var oModel = this.getView().getModel("mainModel"); // OData model
            var oView = this.getView();

            var phone = oView.byId("pno").getValue();
            // var uphone = parseFloat(phone) || 0;
            var uzcid = oView.byId("cid").getValue();
            var uzname = oView.byId("name").getValue();
            var uaddress = oView.byId("input5").getValue();

            // Get values from input fields
            var oEntry = {

                Zcid: uzcid,
                Znamee: uzname,
                Zaddress: uaddress,
                Zpno: phone
                // ZdestinationBin: oView.byId("input5").getValue(),
                // ZtargetQty: oView.byId("input6").getValue(),
                // ZexceptionHandling: oView.byId("exceptionHandling").getSelectedKey()
            };
            console.log(oEntry);
            // Validate required fields
            // if (!oEntry.Zpno || !oEntry.ZdestinationBin || !oEntry.ZtargetQty) {
            //     MessageToast.show("Please fill in all required fields.");
            //     return;
            // }
            // var spath = "/ztable_akSet(Zcid='" + Zcid + "',Znamee='" + Znamee + "')"; 
            var sPath = "/ztable_akSet(Zcid='" + uzcid + "',Znamee='" + uzname + "')";
            console.log(sPath);
            // update data to OData entity set
            oModel.update( sPath , oEntry , {
                success: function() {
                    sap.m.MessageToast.show("Record updated successfully!");
                    oModel.refresh(true);
                },
                error: function(oError) {
                    console.error("Update Error Details:", oError);
                    sap.m.MessageBox.error("Error updating record: " + JSON.stringify(oError.responseText));
                }
            });
        }
    });
});
