const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
};
/* ***************************
 *  Build inventory by for vehicle detail
 * ************************** */
invCont.buildByInventoryId = async function(req, res) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const detail = await utilities.buildInvGrid(data);
  const nav = await utilities.getNav();
  const year = data[0].inv_year
  const make = data[0].inv_make
  const model = data[0].inv_model
  res.render("./inventory/detail", {
    title: year + " " + make + " " + model,
    nav,
    detail,
    errors: null,
  });
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInvManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  // res.flash("info", "Classification Added Successfully");
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect,
  });
};



/* ***************************
 *   Add classification view
 * ************************** */
invCont.addClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Add classification 
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const regResults = await invModel.addClassification(classification_name);

  if (regResults) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      "New classification: " + classification_name + " added."
    );
    res.status(201).render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    });
  } else { 
    let nav = await utilities.getNav();
    req.flash("notice","Sorry, there was an error in adding a classification.");
    res.status(501).render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    });
  }
  
}

/* ***************************
 *  Add inventory view
 * ************************** */
invCont.addInventoryView = async function (req, res, next) {
  const classificationList = await utilities.buildClassificationList();
  const nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    classificationList,
    errors: null,
  });
};
/* ***************************
 *  Add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const regResults = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (regResults) {
    const classificationList = await utilities.buildClassificationList();
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      "A New inventory item called " + inv_make + " " + inv_model + " added"
    );
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationList,
      errors: null,
    });
  } else { 
    let nav = await utilities.getNav();
    req.flash("notice","Sorry, there was an error in adding an inventory item.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInvItemView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  console.log(`inv_id is: ${inv_id}`)
  let nav = await utilities.getNav()
  const invDataArray = await invModel.getInventoryByInvId(inv_id)
  const invData = invDataArray[0]
  console.log(`invData is: ${invData}`)
  const classificationSelect = await utilities.buildClassificationList(invData.classification_id)
  console.log(`classificationSelect is: ${classificationSelect}`)
  const itemName = `${invData.inv_make} ${invData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    classification_id: invData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
  
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice",`The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id);
      const itemName = `${inv_make} ${inv_model}`
      let nav = await utilities.getNav();
      req.flash("notice","Sorry, the insert failed")
      req.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
  };


module.exports = invCont