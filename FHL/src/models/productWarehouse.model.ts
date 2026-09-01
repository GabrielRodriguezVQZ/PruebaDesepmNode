import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface ProductWarehouseAttributes {
  id: string;
  productId: string;
  warehouseId: string;
  stock: number;
}

type ProductWarehouseCreationAttributes = Optional<
  ProductWarehouseAttributes,
  "id"
>;

export class ProductWarehouse
  extends Model<ProductWarehouseAttributes, ProductWarehouseCreationAttributes>
  implements ProductWarehouseAttributes
{
  public id!: string;
  public productId!: string;
  public warehouseId!: string;
  public stock!: number;
}

ProductWarehouse.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
    },
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "warehouse_id",
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "product_warehouses",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["product_id", "warehouse_id"],
      },
    ],
  }
);
