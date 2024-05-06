// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// this is the route to build the inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;