//@ts-check
const fs = require(`node:fs/promises`);
const path = require(`node:path`);

/**
 * Note:
 * All but one rating of the source products.json data were lesser than 6. The last value is 8.
 * Assumed to be an error, all ratings are maxed at 5.
 */
const sourcePath = path.resolve(__dirname, `../../front/src/assets/products.json`);
const destPath = path.resolve(__dirname,`../../docker-entrypoint-initdb.d/002-database-state-insert.sql`);
const NOW = `NOW()`;

/**
 * @typedef ProductInJson Product in products.json
 * @type {Object}
 * @property {Number} id
 * @property {String} code
 * @property {String} name
 * @property {String} description
 * @property {String} [image]
 * @property {Number} price
 * @property {String} category
 * @property {Number} quantity
 * @property {"INSTOCK"|"LOWSTOCK"|"OUTOFSTOCK"} inventoryStatus
 * @property {Number} rating
 */

/** @type {Array<String>} */
const categoryIds = [];
/**
 * Returns the id of a category.
 * @param {String} category category name
 */
function getCategoryId(category) {
  if (categoryIds.includes(category))
    return categoryIds.indexOf(category)+1;
  else
    categoryIds.push(category);
  return categoryIds.length;
}

/**
 * @typedef Product Product in the database
 * @type {Object}
 * @property {Number} id
 * @property {String} code
 * @property {String} name
 * @property {String} description
 * @property {String|null} image
 * @property {Number} ProductsCategories_id
 * @property {Boolean} deleted
 */
/** @type {Array<Product>} */
const products = [];
/**
 * @typedef InventoryRecord An inventory record of a product in the database
 * @type {Object}
 * @property {Number} id
 * @property {Number} Products_id
 * @property {Date} date
 * @property {Number} quantity
 * @property {"INSTOCK"|"LOWSTOCK"|"OUTOFSTOCK"} inventoryStatus
 */
/** @type {Array<Partial<InventoryRecord>>} */
const inventory = [];

/**
 * @typedef Price A price of a product in the database
 * @type {Object}
 * @property {Number} id
 * @property {Number} Products_id
 * @property {Date} date_start
 * @property {Date} date_end
 * @property {Number} price
 */
/** @type {Array<Partial<Price>>} */
const prices = [];

/**
 * @typedef Rating A rating of a product in the database
 * @type {Object}
 * @property {Number} id
 * @property {Number} Products_id
 * @property {Date} date
 * @property {Number} rating
 * @property {Number} rating_count_1
 * @property {Number} rating_count_2
 * @property {Number} rating_count_3
 * @property {Number} rating_count_4
 * @property {Number} rating_count_5
 */
/** @type {Array<Partial<Rating>>} */
const ratings = [];
/** @type {Omit<Rating,"id"|"Products_id"|"date"|"rating">} */
const zeroRating = {
  rating_count_1: 0,
  rating_count_2: 0,
  rating_count_3: 0,
  rating_count_4: 0,
  rating_count_5: 0
}

async function main() {
  await extractState();
  const script = writeScript();
  await saveScript(script);
}

/**
 * Extracts the database state from the products json file
 */
async function extractState() {
  const json = /** @type {{data:Array<ProductInJson>}} */ (JSON.parse(await fs.readFile(sourcePath, { encoding: `utf8` })));
  for (const p of json.data) {
    /** @type {Product} */
    const product = {
      id: p.id,
      code: p.code,
      name: p.name,
      description: p.description,
      image: p.image || null,
      ProductsCategories_id: getCategoryId(p.category),
      deleted: false
    };
    products.push(product);
    /** @type {Omit<InventoryRecord,"id"|"inventoryStatus"|"date">} */
    const inventoryRecord = {
      Products_id: product.id,
      quantity: p.quantity
    };
    inventory.push(inventoryRecord);
    /** @type {Omit<Price,"id"|"date_start"|"date_end">} */
    const price = {
      Products_id: product.id,
      price: p.price
    };
    prices.push(price);
    const ratingValue = Math.min(p.rating, 5);
    /** @type {Omit<Rating,"id"|"date">} */
    const rating = {
      ...zeroRating,
      Products_id: product.id,
      rating: ratingValue,
      ...(ratingValue > 0 ? {[`rating_count_${ratingValue}`]: 1} : {})
    };
    ratings.push(rating);
  }
}

/**
 * Converts the database state into insert statements
 * @returns {String}
 */
function writeScript(){
  let script = ``;
  script += writeCategoriesInsert() + `\n\n`;
  script += writeProductsInsert() + `\n\n`;
  script += writeProductsPricesInsert() + `\n\n`;
  script += writeProductsRatingsInsert() + `\n\n`;
  script += writeProductsInventoryInsert() + `\n\n`;
  return script;
}

function writeCategoriesInsert(){
  let statement = `INSERT INTO ProductCategories (id, name) VALUES `;
  categoryIds.forEach((name,id) => statement+= `\n(${id+1}, "${name}"),`);
  statement = statement.slice(0,-1) + `;`;
  return statement;
}

function writeProductsInsert(){
  let statement = `INSERT INTO Products (id, code, name, description, image, ProductsCategories_id, deleted ) VALUES `;
  statement += `\n` + products.map(p => `(${p.id},"${p.code}","${p.name}","${p.description}", "${p.image}", ${p.ProductsCategories_id}, ${p.deleted?1:0})`).join(`,\n`);
  statement += `;`;
  return statement;
}

function writeProductsPricesInsert(){
  let statement = `INSERT INTO ProductsPrices (Products_id, date_start, date_end, price ) VALUES `;
  statement += `\n` + prices.map(p => `(${p.Products_id},${NOW},NULL, "${p.price}")`).join(`,\n`);
  statement += `;`;
  return statement;
}

const ratingCounts = [
"rating_count_1",
"rating_count_2",
"rating_count_3",
"rating_count_4",
"rating_count_5"
];

function writeProductsRatingsInsert(){
  let statement = `INSERT INTO ProductsRatings (Products_id, date, rating, ${ratingCounts.join(`, `)} ) VALUES `;
  statement += `\n` + ratings.map(p => `(${p.Products_id},${NOW},${p.rating}, ${ratingCounts.map(k => p[k]).join(`, `)})`).join(`,\n`);
  statement += `;`;
  return statement;
}

function writeProductsInventoryInsert(){
  let statement = `INSERT INTO ProductsInventory (Products_id, date, quantity) VALUES `;
  statement += `\n` + inventory.map(p => `(${p.Products_id},${NOW},${p.quantity})`).join(`,\n`);
  statement += `;`;
  return statement;
}

/**
 * Save script to file
 * @param {String} script SQL insert scripts
 */
async function saveScript(script){
  await fs.writeFile(destPath, script, {encoding:`utf-8`});
}

/**
 * Formats a number into a two digit string.
 * @param {Number} nbr number to format
 * @returns {String}
 */
function formatDD(nbr){
  return String(nbr).padStart(2,`0`);
}

/**
 * Converts a JSDate into a SQL friendly datetime string
 * @param {Date} date Date to format for SQL
 * @returns {String}
 */
function formatDate(date){
  // YYYY-MM-DD hh:mm:ss
  return `${date.getFullYear()}-${formatDD(date.getMonth()+1)}-${formatDD(date.getDate())} ${formatDD(date.getHours())}:${formatDD(date.getMinutes())}:${formatDD(date.getSeconds())}`;
}

main();