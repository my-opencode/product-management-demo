import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductCategory, ProductCategoryPayload } from './productcategory.class';

@Injectable({
    providedIn: 'root'
})
export class ProductCategoriesService {

    private static categoryList: ProductCategory[] = null;
    private categories$: BehaviorSubject<ProductCategory[]> = new BehaviorSubject<ProductCategory[]>([]);

    constructor(private http: HttpClient) { }

    getCategories(): Observable<ProductCategory[]> {
        // ProductCategoriesService.categoryList = [
        //     { id: 1, name: "Accessories" },
        //     { id: 2, name: "Fitness" }
        //     { id: 3, name: "Clothing" },
        //     { id: 4, name: "Electronics" },
        // ]
        this.http.get<ProductCategoryPayload>(`/api/categories`).subscribe(data => {
            console.log(data);
            ProductCategoriesService.categoryList = data.data;

            this.categories$.next(ProductCategoriesService.categoryList);
        });
        return this.categories$;
    }

    create(cat: ProductCategory): Observable<ProductCategory[]> {
        this.http.post<ProductCategoryPayload>(`/api/categories`, cat).subscribe(resp => {
            ProductCategoriesService.categoryList.push(resp.data[0]);
            this.categories$.next(ProductCategoriesService.categoryList);
        });
        return this.categories$;
    }

    update(cat: ProductCategory): Observable<ProductCategory[]> {
        const updateValues = {
            name: cat.name
        };
        this.http.post<{ data: ProductCategory[] }>(`/api/categories/${cat.id}`, updateValues).subscribe(resp => {
            const target = ProductCategoriesService.categoryList.find(p => p.id === cat.id);
            if (!target) throw new Error(`Category to update must be in categoryList.`);
            const updated = resp.data[0];
            target.name = updated.name;
            this.categories$.next(ProductCategoriesService.categoryList);
        });
        return this.categories$;
    }

    delete(id: number): Observable<ProductCategory[]> {
        this.http.delete<{ data: ProductCategory[] }>(`/api/categories/${id}`).subscribe(() => {
            ProductCategoriesService.categoryList = ProductCategoriesService.categoryList.filter(value => { return value.id !== id });
            this.categories$.next(ProductCategoriesService.categoryList);
        });
        return this.categories$;
    }
}