import { Component, OnInit } from "@angular/core";
import { Product, ProductPayload } from "./product.class";
import { PRODUCT_TABLE_CONF } from "./products-admin-table.conf";
import { ProductsService } from "./products.service";

import { BehaviorSubject, Observable } from "rxjs";

import { BaseTableLoader } from "app/shared/ui/table/base-table-loader.class";
import { CrudItemOptions } from "app/shared/utils/crud-item-options/crud-item-options.model";
import { ProductCategoriesService } from "app/productcategories/productcategories.service";

@Component({
  selector: "app-products-admin",
  templateUrl: "./products-admin.component.html",
  styleUrls: ["./products-admin.component.scss"],
})
export class ProductsAdminComponent extends BaseTableLoader implements OnInit {
  public payload$: BehaviorSubject<ProductPayload> =
    new BehaviorSubject<ProductPayload>({ data: [], total: 0 });
  public conf: CrudItemOptions[] = PRODUCT_TABLE_CONF;
  public entity = Product;

  constructor(
    private readonly productsService: ProductsService,
    private readonly productCategoriesService: ProductCategoriesService
  ) {
    super();
  }
  message: string = ``;

  ngOnInit(): void {
    // Fetch categories
    this.productCategoriesService.getCategories().subscribe((categories) => {
      console.log(`Received categories from server`);
      const newConf = JSON.parse(JSON.stringify(PRODUCT_TABLE_CONF));
      const target = newConf.find((c) => c.key === `categoryId`);
      if (!target) return;
      target.options = categories.map((c) => ({ value: c.id, label: c.name }));
      console.log(
        `Setting new config value with altered category: "${JSON.stringify(
          target
        )}".`
      );
      this.conf = newConf;
    });
    // Display data table
    this.productsService.getProducts().subscribe((products) => {
      this.payload$.next({ data: products, total: products.length });
    });
  }

  public onDeleteProduct(ids: number[]): void {
    this.delete(ids[0]);
  }

  public onSave(product: Product): void {
    product.id ? this.update(product) : this.create(product);
  }

  private create(product: Product): void {
    this.handleReload(this.productsService.create(product));
  }

  private update(product: Product): void {
    this.handleReload(this.productsService.update(product));
  }

  private delete(id: number): void {
    this.handleReload(this.productsService.delete(id));
  }
}
