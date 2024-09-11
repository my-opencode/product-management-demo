import { HttpClient, HttpHeaders } from "@angular/common/http";
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
        const headers = new HttpHeaders({ "Accept": `application/json` });
        this.http.get<ProductPayload>(`/api/products`, { headers }).subscribe({
            next: (data) => {
                ProductsService.productList = data.data;
                this.products$.next(ProductsService.productList);
            },
            error:  (error: { error: ApiErrorPayload, headers: { status: number } }) => this.broadCastError(error)
        });
        return this.products$;
    }

    create(prod: Product): Observable<Product[]> {
        const headers = new HttpHeaders({ "Accept": `application/json` });
        this.http
            .post<ProductDetailsPayload>(`/api/products`, prod, { headers })
            .subscribe({
                next: (resp) => {
                    ProductsService.productList.push(resp.data);
                    this.products$.next(ProductsService.productList);
                },
                error:  (error: { error: ApiErrorPayload, headers: { status: number } }) => this.broadCastError(error)
            });
        return this.products$;
    }

    update(prod: Product): Observable<Product[]> {
        const updateValues = {
            categoryId: prod.categoryId,
            code: prod.code,
            name: prod.name,
            description: prod.description,
            image: prod.image,
            price: prod.price,
            quantity: prod.quantity,
        };
        const headers = new HttpHeaders({ "Accept": `application/json` });
        this.http
            .patch<ProductDetailsPayload>(`/api/products/${prod.id}`, updateValues, { headers })
            .subscribe({
                next: (resp) => {
                    const targetIndex = ProductsService.productList.findIndex(
                        (p) => p.id === prod.id
                    );
                    if (targetIndex < 0)
                        throw new Error(`Product to update must be in productList.`);
                    const updated = resp.data;
                    console.log(
                        `About to replace product index ${targetIndex} = ${JSON.stringify(
                            ProductsService.productList[targetIndex]
                        )} with ${JSON.stringify(updated)}`
                    );
                    ProductsService.productList.splice(targetIndex, 1, updated);
                    this.products$.next(ProductsService.productList);
                },
                error:  (error: { error: ApiErrorPayload, headers: { status: number } }) => this.broadCastError(error)
            });
        return this.products$;
    }

    delete(id: number): Observable<Product[]> {
        const headers = new HttpHeaders({ "Accept": `application/json` });
        this.http.delete<void>(`/api/products/${id}`, { headers }).subscribe({
            next: () => {
                ProductsService.productList = ProductsService.productList.filter(
                    (value) => {
                        return value.id !== id;
                    }
                );
                this.products$.next(ProductsService.productList);
            },
            error:  (error: { error: ApiErrorPayload, headers: { status: number } }) => this.broadCastError(error)
        });
        return this.products$;
    }
}