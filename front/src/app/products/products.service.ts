import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
    Product,
    ProductDetailsPayload,
    ProductPayload,
} from "./product.class";
export interface ApiErrorPayloadError {
    [fieldName: string]: string;
}
export interface ApiErrorPayload {
    id?: number; // used for inter-component communication as a meaningless identifier
    description?: string;
    errors: ApiErrorPayloadError[];
}
@Injectable({
    providedIn: "root",
})
export class ProductsService {
    private static productList: Product[] = null;
    private products$: BehaviorSubject<Product[]> = new BehaviorSubject<
        Product[]
    >([]);
    private apiErrorSource = new Subject<ApiErrorPayload>();
    apiError = this.apiErrorSource.asObservable();

    constructor(private http: HttpClient) { }

    private broadCastError(error: { error: ApiErrorPayload, headers: { status: number } }){
        console.log(`Caught server response with code ${error.headers.status}`);
        console.log(`Server error stack: ${error.error.description}: \n${
            Object.entries(error.error.errors||{}).map(([f,v])=>`${f}: ${v}`).join(`, \n`)
        }`);
        this.apiErrorSource.next(error.error);
    }

    getProducts(): Observable<Product[]> {
        if( ! ProductsService.productslist )
        {
            this.http.get<any>(`/products`).subscribe(data => {
                console.log(data);
                ProductsService.productslist = data;
                
                this.products$.next(ProductsService.productslist);
            });
        }
        else
        {
            this.products$.next(ProductsService.productslist);
        }

        return this.products$;
    }

    create(prod: Product): Observable<Product[]> {

        ProductsService.productslist.push(prod);
        this.products$.next(ProductsService.productslist);
        
        return this.products$;
    }

    update(prod: Product): Observable<Product[]>{
        ProductsService.productslist.forEach(element => {
            if(element.id == prod.id)
            {
                element.name = prod.name;
                element.category = prod.category;
                element.code = prod.code;
                element.description = prod.description;
                element.image = prod.image;
                element.inventoryStatus = prod.inventoryStatus;
                element.price = prod.price;
                element.quantity = prod.quantity;
                element.rating = prod.rating;
            }
        });
        this.products$.next(ProductsService.productslist);

        return this.products$;
    }
    

    delete(id: number): Observable<Product[]>{
        ProductsService.productslist = ProductsService.productslist.filter(value => { return value.id !== id } );
        this.products$.next(ProductsService.productslist);
        return this.products$;
    }
}