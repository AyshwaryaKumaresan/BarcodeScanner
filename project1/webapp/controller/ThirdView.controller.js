sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ndc/BarcodeScanner"
], function (Controller, MessageBox, MessageToast, JSONModel, BarcodeScanner) {
    "use strict";

    return Controller.extend("project1.controller.ThirdView", {
        onScanPress: function (oEvent) {
            var that = this;
            BarcodeScanner.scan(
                function (mResult) {
                    if (!mResult.cancelled) {
                        that.getView().byId("addr").setValue(mResult.text);
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
                this.getView().byId("custid").setValue(oData.Zcid || "");
                this.getView().byId("namecus").setValue(oData.Znamee || "");
                this.getView().byId("addr").setValue(oData.Zaddress || "");
                this.getView().byId("phoneno").setValue(oData.Zpno || "");
               
            } else {
                sap.m.MessageToast.show("No employee data found!");
            }
        },
          
        GenerateQRCode: function () {
            var baseURL = "https://quickchart.io/qr?text=";
            
            // Creating an object with entity set name
            var dataObject = {
                
               ztable_akSet: {
                  "Zcid": this.byId("custid").getValue(),
                  "Znamee": this.byId("namecus").getValue(),
                  "Zaddress": this.byId("addr").getValue(),
                  "Zpno": this.byId("phoneno").getValue()
                  
                 

               }
            };
         
            var allString = escape(JSON.stringify(dataObject));
            var url = baseURL + allString;
         
            // You can use this URL to display or process further
            console.log(url);
            this.byId("imgId1").setSrc(url);
         },
      
    //  Create Function
    oncreate: function () {
        var oModel = this.getView().getModel();
        var oView = this.getView();

        // Get input values
        var phone = oView.byId("phoneno").getValue();
        var uzcid = oView.byId("custid").getValue();
        var uzname = oView.byId("namecus").getValue();
        var uaddress = oView.byId("addr").getValue();

        // Validate required fields
        if (!uzcid || !uzname || !uaddress || !phone) {
            MessageToast.show("Please fill in all required fields.");
            return;
        }

        // Prepare data for OData service
        var oEntry = {
            Zcid: uzcid,
            Znamee: uzname,
            Zaddress: uaddress,
            Zpno: phone
        };

        console.log("Creating entry:", oEntry);

        //  entity set path (no keys)
        var sPath = "/ztable_akSet";  

        // Call OData create method
        oModel.create(sPath, oEntry, {
            success: function () {
                MessageToast.show("Record created successfully!");
                oModel.refresh(true);
            },
            error: function (oError) {
                console.error("Create Error Details:", oError);
                MessageBox.error("Error creating record: " + JSON.stringify(oError.responseText));
            }
        });
    }
         
    });
});