import { QueryError } from "mysql2";
import { RichApp } from "../types";
import AppSymbols from "../AppSymbols";
import Id from "./id";
import { validateFloat, validateInt, validateString, validateTinyInt, ValidationError, ValidationErrorStack } from "../lib/validators";
import Logger from "../lib/winston";
import { DirectInsertUpdateDeleteExecuteResponse, DirectProductSelectExecuteResponse, NewProductStoredProcedureExecuteResponse, UpdateProductStoredProcedureExecuteResponse } from "../database/adapter-response-format";
import { InventoryStatus, ProductBase, UpdatableFieldKey } from "./product.types";
import { sqlCallNewProductStatement, sqlCallUpdateFieldsListStatement, sqlSelectAllProductsStatement, sqlSelectProductByIdStatement, sqlUpdateSetDeletedById } from "./product.queries";
const logger = Logger(`models/Product`, `debug`);

const updatableFields: UpdatableFieldKey[] = [`category`, `code`, `name`, `description`, `image`, `price`, `quantity`];

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
 * @class Product
 * Note: rating is updated/saved independently to the product.
 */
export class Product {
  _id: Id | undefined = undefined;
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
  isReadOnly = true;
  updatedFields: Set<UpdatableFieldKey> = new Set();
  get isSaved(): boolean {
    return !!this._id;
  }
  get isUpdated(): boolean {
    return this.updatedFields.size > 0;
  }
  setUpdated(v: UpdatableFieldKey) {
    if (this.isSaved) this.updatedFields.add(v);
  }
  resetUpdated() {
    this.updatedFields = new Set();
  }
  get id(): number | undefined {
    return this._id?.valueOf();
  }
  set id(val: Id | number | undefined) {
    if (val === this._id) return;
    else if (val === undefined) {
      this._id = undefined;
    } else if (val instanceof Id) {
      this._id = val;
    } else {
      this._id = new Id(val, `product.id`);
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
    // try as category id first
    try {
      this.categoryId = val;
      isSet = true;
    } catch (err) {
      if (err instanceof ValidationError) error = err;
      else throw err;
    }
    // then try as category name
    if (!isSet && typeof val === `string`) {
      this.categoryName = val;
    }
    // or throw id validation error
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
    try { this.quantity = val.quantity ?? -1; } catch (e) { valErrHandler(e); }
    try { this.price = val.price ?? -1; } catch (e) { valErrHandler(e); }
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
   * Saves a Product:
   * - Inserts new Product OR updates an existing Product.
   * - Updates Product property values.
   * @param {RichApp} app express application
   * @returns {Promise<Product>}
   */
  async save(app: RichApp): Promise<Product> {
    const newProduct = await Product.insertNewToDatabase(app, this);
    return this.productFieldUpdateAfterSave(newProduct);
  }
  /**
   * Saves an updated Product:
   * - Updates an existing Product
   * - Updates Product property values.
   * @param {RichApp} app express application
   * @returns {Promise<Product>}
   */
  async update(app: RichApp): Promise<Product> {
    const updatedProduct = await Product.updateInDatabase(app, this);
    return this.productFieldUpdateAfterSave(updatedProduct);
  }
  /**
   * Deletes a Product:
   * - Sets existing Product as deleted
   * - Updates Product to be isSaved===false.
   * @param {RichApp} app express application
   * @returns {Promise<void>}
   */
  async delete(app: RichApp): Promise<void> {
    if (!this.isSaved || !this.id)
      throw new Error(`Delete called on unsaved product.`);
    await Product.deleteById(app, this._id);
    this._id = undefined;
  }
  /**
   * Updates Product property values using values from updatedProduct.
   * Clears Product's updatedFields value.
   * @param {Product} updatedProduct updated product instance
   * @returns {Product}
   */
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
    logger.log(`verbose`, `Entering insertNewToDatabase`);
    if (!product || !(product instanceof Product))
      throw new Error(`Missing product to save.`);
    if (product.isReadOnly)
      throw new Error(`Product is read only. Please provide a valid category id.`);
    if (product.isSaved)
      return await this.updateInDatabase(app, product);
    logger.log(`verbose`, `Proceeding with insertNewToDatabase.`);
    const pool = app.get(AppSymbols.connectionPool);
    let procedureResult: NewProductStoredProcedureExecuteResponse | undefined = undefined;
    try {
      const callStatement = sqlCallNewProductStatement(product);
      logger.log(`debug`, `insertNewToDatabase query: ` + callStatement);
      ([procedureResult] =
        (await pool.execute<NewProductStoredProcedureExecuteResponse>(callStatement))||[]);
    } catch (err) {
      logger.log(`debug`, `Product InsertNewToDatabase received QueryErr: "${JSON.stringify(err)}"`);
      if (err instanceof Error)
        handleProcedureSqlSignals(err);
      throw err;
    }

    const productId = new Id(procedureResult?.[0]?.[0]?.id);
    logger.log(`debug`, `insertNewToDatabase new id: ` + productId);
    if(!productId) throw new Error(`New product id undefined. Check SP execution logs.`);

    let newProduct:Product|undefined = undefined;
    try {
      logger.log(`verbose`, `Retrieving new product.`);
      newProduct = await this.getFromDatabaseById(app, productId);
    } catch (err) {
      logger.log(`warn`, `Error in retrieving new product.`);
      logger.log(`debug`, `Error: ${err instanceof Error ? err.message : err} – ${err instanceof Error ? err.stack : `no stack`}`);
    }
    if (!newProduct) throw new Error(`Unable to retrieve new product from Database.`);
    logger.log(`verbose`, `Exiting insertNewToDatabase.`);
    return newProduct;
  }
  /**
   * Updates an existing Product
   * @param {RichApp} app express application
   * @param {Product} product Product instance
   * @returns {Promise<Product>}
   */
  static async updateInDatabase(app: RichApp, product: Product): Promise<Product> {
    logger.log(`verbose`, `Entering updateInDatabase`);
    if (!product || !(product instanceof Product))
      throw new Error(`Missing product to save.`);
    else if (product.isReadOnly)
      throw new Error(`Product is read only. Please provide a valid category id.`);
    else if (!product.isSaved || !product.id)
      throw new Error(`Update called on unsaved product.`);
    else if (!product.isUpdated)
      throw new Error(`Update called on product without updates.`);

    logger.log(`verbose`, `Proceeding with updateInDatabase.`);
    const pool = app.get(AppSymbols.connectionPool);
    try {
      const callStatement = sqlCallUpdateFieldsListStatement(product);
      logger.log(`debug`, `updateInDatabase query: ` + callStatement);
      await pool.execute<UpdateProductStoredProcedureExecuteResponse>(callStatement);
    } catch (err) {
      logger.log(`debug`, `Product updateInDatabase received QueryErr: "${JSON.stringify(err)}"`);
      if (err instanceof Error)
        handleProcedureSqlSignals(err);
      throw err;
    }

    let updatedProduct:Product|undefined = undefined;
    try {
      logger.log(`verbose`, `Retrieving updated product.`);
      updatedProduct = await this.getFromDatabaseById(app, product._id!);
    } catch (err) {
      logger.log(`warn`, `Error in retrieving updated product.`);
      logger.log(`debug`, `Error: ${err instanceof Error ? err.message : err} – ${err instanceof Error ? err.stack : `no stack`}`);
    }
    if (!updatedProduct) throw new Error(`Unable to retrieve updated product from Database.`);
    logger.log(`verbose`, `Exiting updateInDatabase.`);
    return updatedProduct;
  }
  /**
   * Fetches the list of products from database
   * Alias for Product.listFromDatabase
   * @param {RichApp} app express application
   * @returns {Promise<DirectProductSelectExecuteResponse>}
   */
  static async list(app: RichApp): Promise<DirectProductSelectExecuteResponse> {
    return await this.listFromDatabase(app);
  }
  /**
   * Fetches the list of products from database
   * @param {RichApp} app express application
   * @returns {Promise<DirectProductSelectExecuteResponse>}
   */
  static async listFromDatabase(app: RichApp): Promise<DirectProductSelectExecuteResponse> {
    const pool = app.get(AppSymbols.connectionPool);
    const [rows] = await pool.execute<DirectProductSelectExecuteResponse>(sqlSelectAllProductsStatement());
    return rows;
  }
  /**
   * Fetches a product's detailed information from database
   * Alias for Product.getFromDatabaseById
   * @param {RichApp} app express application
   * @returns {Promise<Product|undefined>}
   */
  static async getById(app: RichApp, id: Id): Promise<Product | undefined> {
    return await this.getFromDatabaseById(app, id);
  }
  /**
   * Fetches a product's detailed information from database
   * Alias for Product.getFromDatabaseById
   * @param {RichApp} app express application
   * @returns {Promise<Product|undefined>}
   */
  static async getFromDatabaseById(app: RichApp, id: Id): Promise<Product | undefined> {
    logger.log(`verbose`, `Entering getFromDatabaseById.`);
    const pool = app.get(AppSymbols.connectionPool);
    logger.log(`debug`, `Querying DB for Product with id = ${id}.`);
    const query = sqlSelectProductByIdStatement(id);
    logger.log(`debug`, `getFromDatabaseById query: ` + query);
    const response = await pool.execute<DirectProductSelectExecuteResponse>(query);
    logger.log(`debug`, `getFromDatabaseById Database QueryResult is [${JSON.stringify(response?.[0])}]`);
    if(!response || !Array.isArray(response) || !response[0])
        throw new Error(`Received malformed response from db server. [${JSON.stringify(response?.[0])}]`);
    const value = response[0][0];
    if (!value) {
      logger.log(`debug`, `Querying DB for Product with id = ${id} got no result.`);
      return undefined;
    }
    try {
      logger.log(`verbose`, `Converting database response to Product instance.`);
      const product = new Product(value);
      logger.log(`verbose`, `Exiting getFromDatabaseById.`);
      return product;
    } catch(err){
      logger.log(`warn`, `Unable to instantiate product with value form db.`);
      logger.log(`debug`, `Value from db: ${JSON.stringify(value)}`);
      logger.log(`debug`, `Error: ${JSON.stringify(err)}`);
      throw new Error(`Unable to parse product from database in getFromDatabaseById.`);
    }
  }
  /**
   * Sets a product as deleted in database
   * @param {RichApp} app express application
   * @param {Id} id id of the product to 'delete'
   * @returns {Promise<void> }
   */
  static async setDeletedInDatabase(app: RichApp, id: Id): Promise<void> {
    logger.log(`verbose`, `Entering setDeletedInDatabase`);
    const pool = app.get(AppSymbols.connectionPool);
    const query = sqlUpdateSetDeletedById(id);
    logger.log(`debug`, query);
    try {
      await pool.execute<DirectInsertUpdateDeleteExecuteResponse>(query);
      logger.log(`debug`, `Product id = ${id} — set to deleted.`);
    } catch(err){
      logger.log(`debug`, `Product setDeletedInDatabase received QueryErr: "${JSON.stringify(err)}"`);
      if (err instanceof Error)
        handleProcedureSqlSignals(err);
      throw err;
    }
    logger.log(`verbose`, `Exiting setDeletedInDatabase`);
  }
  /**
   * Sets a product as deleted in database
   * Alias for setDeletedInDatabase
   * @param {RichApp} app express application
   * @param {Id} id id of the product to 'delete'
   * @returns {Promise<void> }
   */
  static async deleteById(app: RichApp, id: Id): Promise<void> {
    return await this.setDeletedInDatabase(app, id);
  }
}

export default Product;