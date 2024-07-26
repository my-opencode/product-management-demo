import { ProcedureCallPacket, QueryError, QueryResult, RowDataPacket } from "mysql2";
import { RichApp } from "../types";
import AppSymbols from "../AppSymbols";
import Id from "./Id";
import { validateFloat, validateInt, validateString, validateTinyInt, ValidationError, ValidationErrorStack } from "../lib/validators";
import Logger from "../lib/winston";
const logger = Logger(`models/Product`, `debug`);

type InventoryStatus = "OUTOFSTOCK" | "LOWSTOCK" | "INSTOCK";

export interface ProductAsInTheJson extends RowDataPacket, ProductBase {
}

export interface ProductBase {
  id: number;
  code: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  categoryId: number;
  category: string;
  quantity: number;
  inventoryStatus: InventoryStatus;
  rating?: number;
}

/**
 * Returns the select all products sql statement
 * @returns {String}
 */
const SQL_SELECT_ALL_PRODUCTS = () => `SELECT 
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
LEFT JOIN ProductCategories ON p.Category_id = ProductCategories.id
RIGHT JOIN (
	SELECT Product_id, price ,
    RANK() OVER (PARTITION BY Product_id ORDER BY date_start DESC) date_rank
    FROM ProductsPrices WHERE date_start <= NOW() AND (date_end IS NULL OR date_end > NOW())
) AS prices ON p.id = prices.Product_id 
RIGHT JOIN (
	SELECT Product_id, rating,
    RANK() OVER (PARTITION BY Product_id ORDER BY date DESC) rating_rank
    FROM ProductsRatings
) AS ratings ON p.id = ratings.Product_id 
RIGHT JOIN (
	SELECT Product_id, quantity, inventory_status,
    RANK() OVER (PARTITION BY Product_id ORDER BY date DESC) inv_rank
    FROM ProductsInventory
) AS inventory ON p.id = inventory.Product_id 
WHERE deleted = 0;`
/**
 * Returns the select one product by id sql statement
 * @param {Number} id product id
 * @returns {String}
 */
const SQL_SELECT_PRODUCT_BY_ID = (id: number) => SQL_SELECT_ALL_PRODUCTS().slice(0, -1) + ` AND p.id = ${id} LIMIT 1;`;
type UpdatableFieldKey = "category" | "code" | "name" | "description" | "image" | "price" | "quantity";
const updatableFields: UpdatableFieldKey[] = [`category`, `code`, `name`, `description`, `image`, `price`, `quantity`];
/**
 * Datbase String. Wraps a string value inside quotation marks
 * @param {any} s string value
 * @returns {String}
 */
const ds = (s:any) => `"${s}"`;
export const SQL_CALL_UPDATE_FIELDS_LIST = (p: Product) => 
  `CALL update_product(${p.id
  }, ${p.updatedFields.has(`code`) ? ds(p.code) : `NULL`
  }, ${p.updatedFields.has(`name`) ? ds(p.name) : `NULL`
  }, ${p.updatedFields.has(`description`) ? ds(p.description) : `NULL`
  }, ${p.updatedFields.has(`image`) ? ds(p.image) : `NULL`
  }, ${p.updatedFields.has(`category`) ? p.categoryId : `NULL`
  }, ${p.updatedFields.has(`price`) ? p.price : `NULL`
  }, ${p.updatedFields.has(`quantity`) ? p.quantity : `NULL`
  });`;
function handleProcedureSqlSignals(err: Error) {
  //TO-DO mock up class for QueryError in order to check with instanceof
  let _err = err as unknown as QueryError;
  if (
    _err.errno === 1216/* mysqlErCodes[`ER_NO_REFERENCED_ROW`] */ || _err.code === `ER_NO_REFERENCED_ROW` ||
    _err.errno === 1452/* mysqlErCodes[`ER_NO_REFERENCED_ROW_2`] */ || _err.code === `ER_NO_REFERENCED_ROW_2`
  ) // 1216, 1452
    throw new ValidationErrorStack(
      [new ValidationError(`Product Category does not exist.`, `product.categoryId`)],
      `Conflicting Product`
    );
  if (
    _err.errno === 1062/* mysqlErCodes[`ER_DUP_ENTRY`] */ || _err.code === `ER_DUP_ENTRY` ||
    _err.errno === 1169/* mysqlErCodes[`ER_DUP_UNIQUE`] */ || _err.code === `ER_DUP_UNIQUE`
  ) // 1062, 1169
    throw new ValidationErrorStack(
      [new ValidationError(`Duplicate value for code.`, `product.code`)],
      `Conflicting Product`
    );
  if (
    _err.errno === 1032/* mysqlErCodes[`ER_DUP_ENTRY`] */ || _err.code === `ER_KEY_NOT_FOUND`
  ) // 1032
    throw new ValidationErrorStack(
      [new ValidationError(`Product not found.`, `product.id`)],
      `Conflicting Product`
    );
}
/**
 * Product Class
 * Note: rating is updated/saved independently to the product.
 */
export class Product {
  isSaved = false;
  isReadOnly = true;
  updatedFields: Set<UpdatableFieldKey> = new Set();
  get isUpdated(): boolean {
    return this.updatedFields.size > 0;
  }
  setUpdated(v: UpdatableFieldKey) {
    if (this.isSaved) this.updatedFields.add(v);
  }
  resetUpdated() {
    this.updatedFields = new Set();
  }
  _id: number | undefined = undefined;
  _code!:string;
  _name!:string;
  _description!:string;
  _image: string | undefined;
  _price!:number;
  _category: number | undefined;
  _categoryName = ``;
  _quantity!:number;
  _inventoryStatus: InventoryStatus | "" = ``;
  _rating = -1;
  get id(): number | undefined {
    return this._id;
  }
  set id(val: number | undefined) {
    if (val === this._id) return;
    if (val === undefined) {
      this._id = undefined;
      this.isSaved = false;
    } else {
      this._id = Id.validator(val, undefined, `product.id`);
      if (this._id)
        this.isSaved = true;
    }
  }
  get code(): string {
    return this._code;
  }
  set code(val: string) {
    val = val.trim();
    if (val === this._code) return;
    this._code = validateString(val, 255, 1, `product.code`);
    this.setUpdated(`code`);
  }
  get name(): string {
    return this._name;
  }
  set name(val: string) {
    val = val.trim();
    if (val === this._name) return;
    this._name = validateString(val, 1024, 1, `product.name`);
    this.setUpdated(`name`);
  }
  get description(): string {
    return this._description;
  }
  set description(val: string) {
    val = val.trim();
    if (val === this._description) return;
    this._description = validateString(val, 5120, 1, `product.description`);
    this.setUpdated(`description`);
  }
  get image(): string | undefined {
    return this._image;
  }
  set image(val: string | undefined) {
    if (!this._image && !val) return;
    else if (val === undefined) {
      this._image = undefined;
      this.setUpdated(`image`);
      return;
    }
    val = val.trim();
    if (val === this._image) return;
    else {
      this._image = validateString(val, 2048, undefined, `product.image`) || undefined;
      this.setUpdated(`image`);
    }
  }
  get category(): number | string {
    return this._category || this._categoryName;
  }
  set category(val: number | string | undefined) {
    if (val === this._category) return;
    if (!this._category && val === undefined)
      return;
    if (val === undefined)
      throw new ValidationError(`Cannot reset existing category value to undefined.`, `product.categoryId`);
    let isSet = false;
    let error: ValidationError | undefined = undefined;
    try {
      this.categoryId = val;
      isSet = true;
    } catch (err) {
      if (err instanceof ValidationError) error = err;
      else throw err;
    }
    if (!isSet && typeof val === `string`) {
      this.categoryName = val;
    }
    else if (error !== undefined)
      throw error;
  }
  get categoryId(): number | undefined {
    return this._category;
  }
  set categoryId(val: number | string) {
    if (val === this._category) return;
    this._category = Id.validator(val, undefined, `product.categoryId`);
    this.isReadOnly = false;
    this.setUpdated(`category`);
  }
  get categoryName(): string {
    return this._categoryName;
  }
  set categoryName(val: string) {
    val = val.trim();
    if (val === this._categoryName) return;
    this._categoryName = validateString(val, 1024, undefined, `product.categoryName`);
    if (!this._category || this._category < 1)
      this.isReadOnly = true;
  }
  get quantity(): number {
    return this._quantity;
  }
  set quantity(val: number) {
    if (val === this._quantity) return;
    this._quantity = validateInt(val, 16777215, 0, `product.quantity`);
    this.setUpdated(`quantity`);
  }
  get price(): number {
    return this._price;
  }
  set price(val: number | string) {
    const prevPrice = this._price;
    this._price = validateFloat(val, 999999.99, 0.01, `product.price`);
    // prevPrice is undefined when constructor is called
    if (prevPrice !== undefined && this._price.toFixed(2) !== (prevPrice?.toFixed?.(2)||``)){
      logger.log(`debug`, `Price is updated: previous value was: "${prevPrice}"; val is "${val}"; new value is "${this._price}".`);
      this.setUpdated(`price`);
    }
  }
  get rating(): number {
    return this._rating;
  }
  set rating(val: number | undefined) {
    if (val === this._rating) return;
    if (val === undefined)
      this._rating = 0;
    else
      this._rating = validateTinyInt(val, 5, 0, `product.rating`);
  }
  get inventoryStatus(): InventoryStatus | "" {
    return this._inventoryStatus;
  }
  set inventoryStatus(val: InventoryStatus | "") {
    if (val === this._inventoryStatus) return;
    const inventoryStatusValues: InventoryStatus[] = [
      `OUTOFSTOCK`,
      `LOWSTOCK`,
      `INSTOCK`
    ];
    if (val && inventoryStatusValues.includes(val.toUpperCase() as any))
      this._inventoryStatus = val.toUpperCase() as InventoryStatus;
  }
  constructor(val: Partial<ProductBase>) {
    // invalid id is breaking
    // empty id is allowed (new product)
    if (!val) throw new TypeError(`Missing product value in Product constructor.`);
    if (val.id !== undefined)
      this.id = val.id;
    // aggregate validation errors
    const validationErrors: ValidationError[] = [];
    const valErrHandler = (e: any) => {
      if (e instanceof ValidationError)
        validationErrors.push(e);
      else throw e;
    };
    // validate & set fields
    try { this.code = val.code || ``; } catch (e) { valErrHandler(e); }
    try { this.name = val.name || ``; } catch (e) { valErrHandler(e); }
    try { this.description = val.description || ``; } catch (e) { valErrHandler(e); }
    try { this.image = val.image; } catch (e) { valErrHandler(e); }
    try { this.category = val.categoryId || undefined; } catch (e) { valErrHandler(e); }
    try { this.category = val.category || ``; } catch (e) { valErrHandler(e); }
    try { this.quantity = val.quantity || -1; } catch (e) { valErrHandler(e); }
    try { this.price = val.price || -1; } catch (e) { valErrHandler(e); }
    try { this.rating = val.rating; } catch (e) { valErrHandler(e); }
    try { this.inventoryStatus = val.inventoryStatus || ``; } catch (e) { valErrHandler(e); }
    // reset updated (triggered when id is set)
    this.resetUpdated();
    // throw for invalid fields
    if (validationErrors.length) {
      throw new ValidationErrorStack(validationErrors, `Invalid Product`);
    }
  }
  /**
   * Saves a new Product
   * Updates an existing Product
   * (alias for saveNewToDatabase)
   * @param {RichApp} app express application
   * @returns {Promise<Product>}
   */
  async save(app: RichApp) {
    const newProduct = await Product.insertNewToDatabase(app, this);
    return this.productFieldUpdateAfterSave(newProduct);
  }
  async update(app: RichApp): Promise<Product> {
    const updatedProduct = await Product.updateInDatabase(app, this);
    return this.productFieldUpdateAfterSave(updatedProduct);
  }
  async delete(app: RichApp){
    if (!this.isSaved || !this.id)
      throw new Error(`Delete called on unsaved product.`);
    await Product.deleteById(app, this.id);
    this._id = undefined;
    this.isSaved = false;
  }
  productFieldUpdateAfterSave(updatedProduct: Product) {
    this._id = updatedProduct._id;
    this._code = updatedProduct._code;
    this._name = updatedProduct._name;
    this._description = updatedProduct._description;
    this._image = updatedProduct._image;
    this._quantity = updatedProduct._quantity;
    this._price = updatedProduct._price;
    this._rating = updatedProduct._rating;
    this._inventoryStatus = updatedProduct._inventoryStatus;
    this._category = updatedProduct._category;
    this._categoryName = updatedProduct._categoryName;
    this.isSaved = updatedProduct.isSaved;
    this.isReadOnly = updatedProduct.isReadOnly;
    this.resetUpdated();
    return this;
  }
  /**
   * Saves a new Product
   * Updates an existing Product
   * @param {RichApp} app express application
   * @param {Product} product Product instance
   * @returns {Promise<Product>}
   */
  static async insertNewToDatabase(app: RichApp, product: Product): Promise<Product> {
    if (!product || !(product instanceof Product))
      throw new Error(`Missing product to save.`);
    if (product.isReadOnly)
      throw new Error(`Product is read only. Please provide a valid category id.`);
    if (product.isSaved)
      return await this.updateInDatabase(app, product);
    const pool = app.get(AppSymbols.connectionPool);
    let procedureResult: QueryResult | undefined = undefined;
    try {
      const callStatement = `CALL new_product( ${ds(product.code)}, ${ds(product.name)}, ${ds(product.description)}, ${product.image ? `, ${ds(product.image)}` : `NULL`}, ${product.categoryId}, ${product.price.toFixed(2)}, ${product.quantity}, 0, @id);`;
      logger.log(`debug`, callStatement);
      ([procedureResult] =
        await pool.execute<ProcedureCallPacket<{ id: number }[]>>(callStatement));
    } catch (err) {
      logger.log(`debug`, `Product InsertNewToDatabase received QueryErr: "${JSON.stringify(err)}"`);
      if (err instanceof Error)
        handleProcedureSqlSignals(err);
      throw err;
    }

    logger.log(`debug`, `Product insertNewToDatabase received QueryResult: (${typeof procedureResult}) "${JSON.stringify(procedureResult)}"`);
    const productId: number = (procedureResult as RowDataPacket)?.[0]?.id;

    const newProduct = await this.getFromDatabaseById(app, productId);
    if (!newProduct) throw new Error(`Unable to retrieve new product from Database.`);
    return newProduct;
  }
  static async updateInDatabase(app: RichApp, product: Product): Promise<Product> {
    if (!product || !(product instanceof Product))
      throw new Error(`Missing product to save.`);
    else if (product.isReadOnly)
      throw new Error(`Product is read only. Please provide a valid category id.`);
    else if (!product.isSaved || !product.id)
      throw new Error(`Update called on unsaved product.`);
    else if (!product.isUpdated)
      throw new Error(`Update called on product without updates.`);

    const pool = app.get(AppSymbols.connectionPool);
    let procedureResult: QueryResult | undefined = undefined;
    try {
      const callStatement = SQL_CALL_UPDATE_FIELDS_LIST(product);
      logger.log(`debug`, callStatement);
      ([procedureResult] = await pool.execute(callStatement));
    } catch (err) {
      logger.log(`debug`, `Product updateInDatabase received QueryErr: "${JSON.stringify(err)}"`);
      if (err instanceof Error)
        handleProcedureSqlSignals(err);
      throw err;
    }
    logger.log(`debug`, `Product InsertNewToDatabase received QueryResult: (${typeof procedureResult}) "${JSON.stringify(procedureResult)}"`);

    const updatedProduct = await this.getFromDatabaseById(app, product.id);
    if (!updatedProduct) throw new Error(`Unable to retrieve updated product from Database.`);
    return updatedProduct;
  }
  static async list(app: RichApp) {
    return await this.listFromDatabase(app);
  }
  static async listFromDatabase(app: RichApp) {
    const pool = app.get(AppSymbols.connectionPool);
    const [rows] = await pool.execute(SQL_SELECT_ALL_PRODUCTS());
    return rows as ProductAsInTheJson[];
  }
  static async getById(app: RichApp, id: number) {
    return await this.getFromDatabaseById(app, id);
  }
  static async getFromDatabaseById(app: RichApp, id: number): Promise<Product | undefined> {
    const pool = app.get(AppSymbols.connectionPool);
    logger.log(`debug`, `Querying DB for Product with id = ${id}.`);
    const query = SQL_SELECT_PRODUCT_BY_ID(id);
    logger.log(`debug`, query);
    const response = await pool.execute(query);
    const [rows] = response || [];
    if (!(rows as ProductAsInTheJson[])?.[0]) return undefined;
    logger.log(`debug`, `getFromDatabaseById Database QueryResult is ${JSON.stringify(rows)}`);
    const product = new Product((rows as ProductAsInTheJson[])[0]);
    return product;
  }
  static async setDeletedInDatabase(app:RichApp, id: number){
    const pool = app.get(AppSymbols.connectionPool);
    const query = `UPDATE Products SET deleted = 1 WHERE id = ${id};`;
    logger.log(`debug`, query);
    try {
    await pool.execute(query);
    } catch(err){
      logger.log(`debug`, `Product setDeletedInDatabase received QueryErr: "${JSON.stringify(err)}"`);
      if (err instanceof Error)
        handleProcedureSqlSignals(err);
      throw err;
    }
    logger.log(`debug`, `Product id = ${id} — set to deleted.`);
  }
  static async deleteById(app:RichApp, id: number){
    return await this.setDeletedInDatabase(app, id);
  }
}

export default Product;