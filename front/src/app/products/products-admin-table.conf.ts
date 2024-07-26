import { ScreenWidth } from 'app/shared/utils/crud-item-options/screen-width.model';
import { CrudItemOptions } from 'app/shared/utils/crud-item-options/crud-item-options.model';
import { ControlType } from 'app/shared/utils/crud-item-options/control-type.model';
import { TypeInput } from 'app/shared/utils/crud-item-options/type.model';


export const PRODUCT_TABLE_CONF: CrudItemOptions[] = [
  {
    key: 'id',
    controlType: ControlType.INPUT,
    type: TypeInput.TEXT,
    label: 'ID',
    columnOptions: {
      minScreenSize: ScreenWidth.large,
      hidden: true
    },
    controlOptions: {      
      hideOnCreate: false,
      hideOnUpdate: false,
      disableOnCreate: true,
      disableOnUpdate: true
    }
  },
  {
    key: 'code',
    controlType: ControlType.INPUT,
    type: TypeInput.TEXT,
    label: 'Code',
    columnOptions: {
      minScreenSize: ScreenWidth.small,
      default: true
    },
  },
  {
    key: 'name',
    controlType: ControlType.INPUT,
    type: TypeInput.TEXT,
    label: 'Name',
    columnOptions: {
      minScreenSize: ScreenWidth.small,
      default: true
    },
  },
  {
    key: 'description',
    controlType: ControlType.INPUT,
    type: TypeInput.TEXT,
    label: 'Description',
    columnOptions: {
      minScreenSize: ScreenWidth.large,
    },
  },
  {
    key: 'categoryId',
    controlType: ControlType.SELECT,
    label: 'Category',
    options: [],

    columnOptions: {
      minScreenSize: ScreenWidth.small,
    }
  },
  {
    key: 'inventoryStatus',
    controlType: ControlType.SELECT,
    label: 'Inventory Status',
    options: [{value: "INSTOCK",label: "INSTOCK" },
    {value:"LOWSTOCK",label: "LOWSTOCK" }, 
    {value: "OUTOFSTOCK",label: "OUTOFSTOCK"}],
    columnOptions: {
      minScreenSize: ScreenWidth.small,
    }
  },
  {
    key: 'price',
    controlType: ControlType.INPUT,
    type: TypeInput.DECIMAL,
    label: 'Price',
    columnOptions: {
      minScreenSize: ScreenWidth.small,
    },
  },
  {
    key: 'quantity',
    controlType: ControlType.INPUT,
    type: TypeInput.NUMBER,
    label: 'Quantity',
    columnOptions: {
      minScreenSize: ScreenWidth.small,
    },
    controlOptions: {
    }
  }

]; 