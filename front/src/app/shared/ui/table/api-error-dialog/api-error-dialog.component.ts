import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiErrorPayload, ApiErrorPayloadError, ProductsService } from 'app/products/products.service';

@Component({
  selector: 'app-api-error-dialog',
  templateUrl: './api-error-dialog.component.html'
})
export class ApiErrorDialogComponent<T> {
  @Input() public readonly header = `Server Response`;
  @Input() public readonly visible = false;

  public isVisible = false;
  public message = ``;
  public errors: ApiErrorPayloadError[] = [];

  constructor(
    private readonly productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productsService.apiError.subscribe((err: ApiErrorPayload) => this.handleApiError(err));
  }

  ngOnChange(changes: SimpleChanges) {
    if(changes.visible){
      this.isVisible = !!changes.visible.currentValue;
    }
  }

  private handleApiError(pl: ApiErrorPayload) {
    this.message = pl.description || `Error`;
    this.errors = pl.errors || [];
    this.isVisible = true;
  }

  public onHide(): void {
    this.isVisible = false;
  }
}
