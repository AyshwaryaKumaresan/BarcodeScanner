sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ndc/BarcodeScanner"
], function (Controller, MessageBox, MessageToast, JSONModel, BarcodeScanner) {
    "use strict";

    return Controller.extend("project1.controller.SecondView", {
        onScanPress: function (oEvent) {
            var that = this;
            BarcodeScanner.scan(
                function (mResult) {
                    if (!mResult.cancelled) {
                        that.getView().byId("input5").setValue(mResult.text);
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
        },
        handleGenerateQRCode: function () {
            var baseURL = "https://quickchart.io/qr?text=";
            
            // Creating an object with entity set name
            var dataObject = {
                
               ztable_akSet: {
                  "Zcid": this.byId("cid").getValue(),
                  "Znamee": this.byId("name").getValue(),
                  "Zaddress": this.byId("address").getValue(),
                  "Zpno": this.byId("pno").getValue()
                  
                 

               }
            };
         
            var allString = escape(JSON.stringify(dataObject));
            var url = baseURL + allString;
         
            // You can use this URL to display or process further
            console.log(url);
            this.byId("imgId").setSrc(url);
         },
         onDeletePress: function () {
            var oModel = this.getView().getModel(); // Get OData model
            var oView = this.getView();
        
            // Get values from input fields
            var sZcid = oView.byId("cid").getValue();
            var sZnamee = oView.byId("name").getValue();
            var sZaddress = oView.byId("address").getValue();
            var sZpno = oView.byId("pno").getValue();
        
            // Validation: Ensure required values are present
            if (!sZcid || !sZnamee) {
                sap.m.MessageToast.show("Please provide ID and Name to delete a record.");
                return;
            }
        
            // Construct the OData path using the primary key fields
            var sPath = "/ztable_akSet(Zcid='" + sZcid + "',Znamee='" + sZnamee + "')";
        
            // Confirmation Dialog
            sap.m.MessageBox.confirm("Are you sure you want to delete this record?", {
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.YES) {
                        oModel.remove(sPath, {
                            success: function () {
                                sap.m.MessageToast.show("Record deleted successfully!");
        
                                // Clear the input fields after successful deletion
                                oView.byId("cid").setValue("");
                                oView.byId("name").setValue("");
                                oView.byId("address").setValue("");
                                oView.byId("pno").setValue("");
        
                                oModel.refresh(true);
                            },
                            error: function (oError) {
                                console.error("Delete Error Details:", oError);
                                sap.m.MessageBox.error("Error deleting record: " + JSON.stringify(oError.responseText));
                            }
                        });
                    }
                }
            });
        }
        
        
         
    });
});
