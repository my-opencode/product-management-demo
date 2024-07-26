import connector, {waitForDbServer} from "./connector";
import { describe, it, after, before } from "node:test";
import * as assert from "node:assert";
import mysql, { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ProductAsInTheJson } from "../models/Products";
import { DirectInsertUpdateDeleteExecuteResponse, DirectProductSelectExecuteResponse, NewProductStoredProcedureExecuteResponse, UpdateProductStoredProcedureExecuteResponse } from "./adapter-response-format";



describe(`Validate Adapter Responses`, async function () {
  let pool: mysql.Pool;
  let result: [mysql.RowDataPacket[], mysql.FieldPacket[]];
  before(async function () {
    // Waiting for the database server
    // TODO add env flag to trigger this behavior
    await waitForDbServer();
    pool = connector();
  });
  after(function () {
    if (pool)
      pool.end();
  });

  describe(`confirm mysql2 conn.execute response format`, async function(){
    await it(`direct select products`, async function(){
      const response = await pool.execute<DirectProductSelectExecuteResponse>(`SELECT * FROM Products LIMIT 2;`);
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(Array.isArray(response[0]),true,`Result[] should be an array.`);
      assert.strictEqual(Array.isArray(response[1]), true, `FieldPacket[] should be an array.`);
      assert.strictEqual(response[0].length, 2, `Expecting 2 products as response.`);
      assert.strictEqual(response[0][0].id, 1000, `Expecting product 1 with id 1000.`);
      assert.strictEqual(response[0][1].id, 1001, `Expecting product 2 with id 1001.`);
      assert.strictEqual(!Array.isArray(response[1][0]) && typeof response[1][0] === `object`, true, `FieldPacket should be an object.`);
    });
    await it(`direct insert category`, async function(){
      const response = await pool.execute<DirectInsertUpdateDeleteExecuteResponse>(`INSERT INTO ProductCategories (id, name) VALUES (10, "cars");`);
      console.log(JSON.stringify(response));
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(!Array.isArray(response[0]) && typeof response[0] === `object`, true, `ResultSetHeader should be an object.`);
      assert.strictEqual(response[0].fieldCount, 0, `Expecting ResultSetHeader.fieldCount 0.`);
      assert.strictEqual(response[0].warningStatus, 0, `Expecting ResultSetHeader.warningStatus 0.`);
      assert.strictEqual(response[0].affectedRows, 1, `Expecting ResultSetHeader.affectedRows 1.`);
      assert.strictEqual(response[0].serverStatus, 2, `Expecting ResultSetHeader.serverStatus 2.`);
    });
    await it(`direct update category`, async function(){
      const response = await pool.execute<DirectInsertUpdateDeleteExecuteResponse>(`UPDATE ProductCategories SET name = "Cars" WHERE id = 10;`);
      console.log(JSON.stringify(response));
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(!Array.isArray(response[0]) && typeof response[0] === `object`, true, `ResultSetHeader should be an object.`);
      assert.strictEqual(response[0].fieldCount, 0, `Expecting ResultSetHeader.fieldCount 0.`);
      assert.strictEqual(response[0].warningStatus, 0, `Expecting ResultSetHeader.warningStatus 0.`);
      assert.strictEqual(response[0].affectedRows, 1, `Expecting ResultSetHeader.affectedRows 1.`);
      assert.strictEqual(response[0].serverStatus, 2, `Expecting ResultSetHeader.serverStatus 2.`);
    });
    await it(`direct delete category`, async function(){
      const response = await pool.execute<DirectInsertUpdateDeleteExecuteResponse>(`DELETE FROM ProductCategories WHERE id = 10;`);
      console.log(JSON.stringify(response));
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(!Array.isArray(response[0]) && typeof response[0] === `object`, true, `ResultSetHeader should be an object.`);
      assert.strictEqual(response[0].fieldCount, 0, `Expecting ResultSetHeader.fieldCount 0.`);
      assert.strictEqual(response[0].warningStatus, 0, `Expecting ResultSetHeader.warningStatus 0.`);
      assert.strictEqual(response[0].affectedRows, 1, `Expecting ResultSetHeader.affectedRows 1.`);
      assert.strictEqual(response[0].serverStatus, 2, `Expecting ResultSetHeader.serverStatus 2.`);
    });
    await it(`SP insert product`, async function(){
      const response = await pool.execute<NewProductStoredProcedureExecuteResponse>(`CALL new_product("test","test","test","test.png",1,123.45,9,4,@id);`);
      console.log(JSON.stringify(response));
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(Array.isArray(response[0]),true,`[SspNewProductResult[],ResultSetHeader] should be an array.`);
      assert.strictEqual(Array.isArray(response[1]), true, `FieldPacket[] should be an array.`);
      assert.strictEqual(Array.isArray(response[0][0]),true,`SspNewProductResult[] should be an array.`);
      assert.strictEqual(response[0][0].length, 1, `Expecting 1 product as response.`);
      assert.strictEqual(response[0][0][0].id, 1030, `Expecting product 1 with id 1030.`);
      assert.strictEqual(!Array.isArray(response[0][1]) && typeof response[0] === `object`, true, `ResultSetHeader should be an object.`);
      assert.strictEqual(response[0][1].fieldCount, 0, `Expecting ResultSetHeader.fieldCount 0.`);
      assert.strictEqual(response[0][1].warningStatus, 0, `Expecting ResultSetHeader.warningStatus 0.`);
      assert.strictEqual(response[0][1].affectedRows, 0, `Expecting ResultSetHeader.affectedRows 0.`);
      assert.strictEqual(response[0][1].serverStatus, 16386, `Expecting ResultSetHeader.serverStatus 16386.`);
    });
    await it(`SP update product`, async function(){
      const response = await pool.execute<UpdateProductStoredProcedureExecuteResponse>(`CALL update_product(1030, "testcode", "testname", NULL, NULL, NULL, 98.76, 0);`);
      console.log(JSON.stringify(response));
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(!Array.isArray(response[0]) && typeof response[0] === `object`, true, `ResultSetHeader should be an object.`);
      assert.strictEqual(response[0].fieldCount, 0, `Expecting ResultSetHeader.fieldCount 0.`);
      assert.strictEqual(response[0].warningStatus, 0, `Expecting ResultSetHeader.warningStatus 0.`);
      assert.strictEqual(response[0].affectedRows, 0, `Expecting ResultSetHeader.affectedRows 0.`);
      assert.strictEqual(response[0].serverStatus, 16386, `Expecting ResultSetHeader.serverStatus 16386.`);
    });
    await it(`direct delete rating`, async function(){
      const response = await pool.execute<DirectInsertUpdateDeleteExecuteResponse>(`DELETE FROM ProductsRatings WHERE Product_id = 1030;`);
      console.log(JSON.stringify(response));
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(!Array.isArray(response[0]) && typeof response[0] === `object`, true, `ResultSetHeader should be an object.`);
      assert.strictEqual(response[0].fieldCount, 0, `Expecting ResultSetHeader.fieldCount 0.`);
      assert.strictEqual(response[0].warningStatus, 0, `Expecting ResultSetHeader.warningStatus 0.`);
      assert.strictEqual(response[0].affectedRows, 1, `Expecting ResultSetHeader.affectedRows 1.`);
      assert.strictEqual(response[0].serverStatus, 2, `Expecting ResultSetHeader.serverStatus 2.`);
    });
    await it(`direct delete inventory`, async function(){
      const response = await pool.execute<DirectInsertUpdateDeleteExecuteResponse>(`DELETE FROM ProductsInventory WHERE Product_id = 1030;`);
      console.log(JSON.stringify(response));
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(!Array.isArray(response[0]) && typeof response[0] === `object`, true, `ResultSetHeader should be an object.`);
      assert.strictEqual(response[0].fieldCount, 0, `Expecting ResultSetHeader.fieldCount 0.`);
      assert.strictEqual(response[0].warningStatus, 0, `Expecting ResultSetHeader.warningStatus 0.`);
      assert.strictEqual(response[0].affectedRows, 2, `Expecting ResultSetHeader.affectedRows 2.`);
      assert.strictEqual(response[0].serverStatus, 2, `Expecting ResultSetHeader.serverStatus 2.`);
    });
    await it(`direct delete prices`, async function(){
      const response = await pool.execute<DirectInsertUpdateDeleteExecuteResponse>(`DELETE FROM ProductsPrices WHERE Product_id = 1030;`);
      console.log(JSON.stringify(response));
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(!Array.isArray(response[0]) && typeof response[0] === `object`, true, `ResultSetHeader should be an object.`);
      assert.strictEqual(response[0].fieldCount, 0, `Expecting ResultSetHeader.fieldCount 0.`);
      assert.strictEqual(response[0].warningStatus, 0, `Expecting ResultSetHeader.warningStatus 0.`);
      assert.strictEqual(response[0].affectedRows, 2, `Expecting ResultSetHeader.affectedRows 2.`);
      assert.strictEqual(response[0].serverStatus, 2, `Expecting ResultSetHeader.serverStatus 2.`);
    });
    await it(`direct delete product`, async function(){
      const response = await pool.execute<DirectInsertUpdateDeleteExecuteResponse>(`DELETE FROM Products WHERE id = 1030;`);
      console.log(JSON.stringify(response));
      assert.strictEqual(Array.isArray(response),true,`QueryResponse should be an array.`);
      assert.strictEqual(!Array.isArray(response[0]) && typeof response[0] === `object`, true, `ResultSetHeader should be an object.`);
      assert.strictEqual(response[0].fieldCount, 0, `Expecting ResultSetHeader.fieldCount 0.`);
      assert.strictEqual(response[0].warningStatus, 0, `Expecting ResultSetHeader.warningStatus 0.`);
      assert.strictEqual(response[0].affectedRows, 1, `Expecting ResultSetHeader.affectedRows 1.`);
      assert.strictEqual(response[0].serverStatus, 2, `Expecting ResultSetHeader.serverStatus 2.`);
    });
  });
});

