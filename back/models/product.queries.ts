import Id from "./id";
import Product from "./product";

/**
 * Returns the select all products sql statement
 * @returns {String}
 */
export function sqlSelectAllProductsStatement() {
  return `SELECT 
      p.id, 
      p.code, 
      p.name, 
      p.description, 
      p.image, 
      p.Category_id as categoryId,
      ProductCategories.name as category, 
      prices.price, 
      ratings.rating, 
      inventory.quantity, 
      inventory.inventory_status AS inventoryStatus 
FROM \`Products\`  AS p
LEFT JOIN ProductCategories 
ON p.Category_id = ProductCategories.id
RIGHT JOIN (
	SELECT * FROM (
        SELECT Product_id, price,
    	RANK() OVER (PARTITION BY Product_id ORDER BY date_start DESC) date_rank
    	FROM ProductsPrices WHERE date_start <= NOW() AND (date_end IS NULL OR date_end > NOW())
    ) AS sp WHERE sp.date_rank = 1) AS prices 
ON p.id = prices.Product_id 
RIGHT JOIN (
	SELECT * FROM (
        SELECT Product_id, rating,
    	RANK() OVER (PARTITION BY Product_id ORDER BY date DESC) rating_rank
    	FROM ProductsRatings
    ) AS sr WHERE sr.rating_rank = 1) AS ratings 
ON p.id = ratings.Product_id 
RIGHT JOIN (
	SELECT * FROM (
        SELECT Product_id, quantity, inventory_status,
    	RANK() OVER (PARTITION BY Product_id ORDER BY date DESC) inv_rank
    	FROM ProductsInventory
    ) AS si WHERE si.inv_rank = 1) AS inventory 
ON p.id = inventory.Product_id 
WHERE deleted = 0;`;
}
/**
 * Returns the select one product by id sql statement
 * @param {Number} id product id
 * @returns {String}
 */
export function sqlSelectProductByIdStatement(id: Id) {
  return sqlSelectAllProductsStatement().slice(0, -1) + ` AND p.id = ${id} LIMIT 1;`;
}

/**
 * Datbase String. Wraps a string value inside quotation marks
 * @param {any} s string value
 * @returns {String}
 */
export function ds(s: any) { return `"${s}"`; }
export function sqlCallUpdateFieldsListStatement(p: Product) {
  return `CALL update_product(${p.id
    }, ${p.updatedFields.has(`code`) ? ds(p.code) : `NULL`
    }, ${p.updatedFields.has(`name`) ? ds(p.name) : `NULL`
    }, ${p.updatedFields.has(`description`) ? ds(p.description) : `NULL`
    }, ${p.updatedFields.has(`image`) ? ds(p.image) : `NULL`
    }, ${p.updatedFields.has(`category`) ? p.categoryId : `NULL`
    }, ${p.updatedFields.has(`price`) ? p.price : `NULL`
    }, ${p.updatedFields.has(`quantity`) ? p.quantity : `NULL`
    });`
};

export function sqlCallNewProductStatement(product: Product) {
  return `CALL new_product( ${ds(product.code)}, ${ds(product.name)}, ${ds(product.description)}, ${product.image ? `, ${ds(product.image)}` : `NULL`}, ${product.categoryId}, ${product.price.toFixed(2)}, ${product.quantity}, 0, @id);`;
}

export function sqlUpdateSetDeletedById(id:Id){
  return `UPDATE Products SET deleted = 1 WHERE id = ${id};`;
}