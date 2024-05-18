const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
};
/* ***************************
 *  Get inventory by ID
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`, [inv_id]);
    // console.log(rows); debuuging this works!!
    return data.rows; // Assuming inv_id is unique
  } catch (error) {
    console.error("Error retrieving vehicle by ID: " + error);
  }
};
/* ***************************
 *  Add new classification to the database
 * ************************** */
async function addClassification(classification_name){
  try{
  const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
  return await pool.query(sql,
    [classification_name]
  );
  } catch (error) {
    return error.message
  }
};

/* ***************************
 *  Add new inventory to the database
 * ************************** */
async function addInventory(
  inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, 
  inv_miles, inv_color, classification_id
) {
  try {
    const sql = `INSERT INTO public.inventory (
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *`;
    const values = [
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
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
}

module.exports = {getClassifications, getInventoryByClassificationId,  getInventoryByInvId, addClassification, addInventory};