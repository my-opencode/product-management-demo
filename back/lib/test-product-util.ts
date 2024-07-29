import Product, { ProductAsInTheJson } from "../models/product";

export interface DummyProductOptions {
  isSaved?: boolean;
  isReadOnly?: boolean;
  isUpdated?: boolean;
}

function* GenId(){
  let id = 100;
  while (id < 1000000)
    yield id++;
}
const genId = GenId();

/**
 * Returns a dummy Product instance for tests.
 * Accepts constructor options.
 * @param {DummyProductOptions} [options] constructor options
 * @param {boolean|undefined} [options.isSaved] product with an id and flag isSaved set to true.
 * @param {boolean|undefined} [options.isReadOnly] product without categoryId value and flag isReadOnly set to true.
 * @param {boolean|undefined} [options.isUpdated] product with flags isSaved and isUpdated set to true.
 * @returns {Product}
 */
export function getDummyProduct(options?:DummyProductOptions){
  const isSaved = options?.isSaved || options?.isUpdated;
  const id = isSaved ? genId.next().value : undefined;
  const name = randomStr(1024);
  const quantity = Math.max(0,Math.floor(Math.random()*9999));
  const rating = isSaved ? randomRating() : undefined;
  const inventoryStatus = !isSaved ? undefined : quantity === 0 ? `OUTOFSTOCK` : quantity < 10 ? `LOWSTOCK` : `INSTOCK`;
  const category = !!options?.isReadOnly ? undefined: 1;
  const po = {
    id,
    code: randomStr(),
    name,
    description: `Description of ${name}`,
    image: `img/${name}.png`,
    categoryId: category,
    quantity,
    price: parseFloat((Math.random()*9999).toFixed(2)),
    rating,
    inventoryStatus
  } as ProductAsInTheJson;
  const p = new Product(po);
  if(options?.isReadOnly)
    p.category = `Some category`;
    p.resetUpdated();
  if(options?.isUpdated) {
    p.category = 2;
    p.category = randomStr();
  }
  return p;
}

/**
 * Generates a random product rating value between 0 and 5.
 * @returns {number}
 */
function randomRating(){
  return Math.floor(Math.random()*6)
}

/**
 * Generates a random string of controlled length.
 * @param maxLength max length of the string
 * @param minLength min length of the string
 * @returns {String}
 */
export function randomStr(maxLength=255, minLength=10) {
  let str = ``;
  const characters = `-_ ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 '`;
  const charactersLn = characters.length;
  let length = minLength + Math.ceil(Math.random()*(maxLength-1-minLength));
  let counter = 0;
  while (counter < length) {
    str += characters.charAt(Math.floor(Math.random() * charactersLn));
    counter += 1;
  }
  return str;
}