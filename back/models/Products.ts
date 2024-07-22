import { RowDataPacket } from "mysql2";
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
  category: number;
  quantity: number;
  inventoryStatus: InventoryStatus;
  rating?: number;
}

/**
 * Product Class
 * Note: rating is updated/saved independently to the product.
 */
export class Product {
  isSaved = false;
  isReadOnly = true;
  _id: number | undefined = undefined;
  _code = ``;
  _name = ``;
  _description = ``;
  _image: string | undefined = ``;
  _price = -1;
  _category: number | undefined = -1;
  _category_name = ``;
  _quantity = -1;
  _inventoryStatus = ``;
  _rating = -1;
  get id(): number | undefined {
    return this._id;
  }
  set id(val: number | undefined) {
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
    this._code = validateString(val, 255, 1, `product.code`);
  }
  get name(): string {
    return this._name;
  }
  set name(val: string) {
    this._name = validateString(val, 1024, 1, `product.name`);
  }
  get description(): string {
    return this._description;
  }
  set description(val: string) {
    this._description = validateString(val, 5120, 1, `product.description`);
  }
  get image(): string | undefined {
    return this._image;
  }
  set image(val: string | undefined) {
    if (val === undefined)
      this._image = undefined;
    else
      this._image = validateString(val, 2048, undefined, `product.image`) || undefined;
  }
  get category(): number | string {
    return this._category || this._category_name;
  }
  set category(val: number | string) {
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
    this._category = Id.validator(val, undefined, `product.category`);
    this.isReadOnly = false;
  }
  get categoryName(): string {
    return this._category_name;
  }
  set categoryName(val: string) {
    this._category_name = validateString(val, 1024, undefined, `product.categoryName`);
    if (!this._category || this._category < 1)
      this.isReadOnly = true;
  }
  get quantity(): number {
    return this._quantity;
  }
  set quantity(val: number) {
    this._quantity = validateInt(val, 16777215, 0, `product.quantity`);
  }
  get price(): number {
    return this._price;
  }
  set price(val: number | string) {
    this._price = validateFloat(val, undefined, 0.01, `product.price`);
  }
  get rating(): number {
    return this._rating;
  }
  set rating(val: number | undefined) {
    if (val === undefined)
      this._rating = 0;
    else
      this._rating = validateTinyInt(val, 5, 0, `product.rating`);
  }
  get inventoryStatus() {
    return this._inventoryStatus;
  }
  set inventoryStatus(val: string) {
    const inventoryStatusValues: InventoryStatus[] = [
      `OUTOFSTOCK`,
      `LOWSTOCK`,
      `INSTOCK`
    ];
    if (val && inventoryStatusValues.includes(val.toUpperCase() as any))
      this._inventoryStatus = val.toUpperCase();
  }
  constructor(val: Partial<ProductBase>) {
    // invalid id is breaking
    // empty id is allowed (new product)
    if(!val) throw new TypeError(`Missing product value in Product constructor.`);
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
    try { this.category = val.category || -1; } catch (e) { valErrHandler(e); }
    try { this.quantity = val.quantity || -1; } catch (e) { valErrHandler(e); }
    try { this.price = val.price || -1; } catch (e) { valErrHandler(e); }
    try { this.rating = val.rating; } catch (e) { valErrHandler(e); }
    try { this.inventoryStatus = val.inventoryStatus || ``; } catch (e) { valErrHandler(e); }
    // throw for invalid fields
    if (validationErrors.length) {
      throw new ValidationErrorStack(validationErrors, `Invalid Product`);
    }
  }
  /**
   * Saves a new Product
   * Updates an existing Product
   * @param {RichApp} app express application
   * @returns {Promise<Product>}
   */
  async save(app: RichApp) {
    if (this.isSaved)
      return await this.update(app);
    const pool = app.get(AppSymbols.connectionPool);
    const [result] = await pool.execute(`CALL product_new( "${this.code}", "${this.name}", "${this.description}", ${this.image ? `, "${this.image}"` : `NULL`}, ${this.category}, ${this.price.toFixed(2)}, ${this.quantity});`);
    const productId: number = (result as RowDataPacket)[0].id;
    this.id = productId;
    this.isSaved = true;
    return this;
  }
  async update(app: RichApp): Promise<Product> {
    throw new Error(`Not implemented`);
  }
  static async list(app: RichApp) {
    return await this.listFromDatabase(app);
  }
  static async listFromDatabase(app: RichApp) {
    const pool = app.get(AppSymbols.connectionPool);
    const [rows] = await pool.execute(`SELECT 
      p.id, 
      p.code, 
      p.name, 
      p.description, 
      p.image, 
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
    FROM ProductsPrices WHERE date_start <= NOW()
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
WHERE deleted = 0;`);
    return rows as ProductAsInTheJson[];
  }
  static async getById(app: RichApp, id: number) {
    return await this.getFromDatabaseById(app, id);
  }
  static async getFromDatabaseById(app: RichApp, id: number): Promise<ProductAsInTheJson | undefined> {
    const pool = app.get(AppSymbols.connectionPool);
    const [rows] = await pool.execute(`SELECT 
      p.id, 
      p.code, 
      p.name, 
      p.description, 
      p.image, 
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
    FROM ProductsPrices WHERE date_start <= NOW()
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
WHERE deleted = 0 AND p.id = ${id} LIMIT 1;`);
    return (rows as ProductAsInTheJson[])[0];
  }
}

export default Product;