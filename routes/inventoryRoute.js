// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")

/* ***************************
 * a route to inventory management controller
 * ************************** */

router.get("/inv", utilities.handleErrors
(invController.buildInvManagementView));

/* ***************************
 *  classification controllers to add inventory
 * ************************** */

// route to build the add classification view
router.get("/add-classification", utilities.handleErrors(invController.addClassificationView));

router.post( // process the add classification data
    "/add-classification", 
    regValidate.classificationRules(), 
    regValidate.checkClassificationData, 
    utilities.handleErrors(invController.addClassification)
);

/* ***************************
 *  inventory controllers to add inventory
 * ************************** */
// route to build the add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.addInventoryView));

// process the add inventory data
router.post( 
    "/add-inventory", 
    regValidate.inventoryRules(), 
    regValidate.checkInventoryData, 
    utilities.handleErrors(invController.addInventory)  
);

// this is the route to build the inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));


module.exports = router;