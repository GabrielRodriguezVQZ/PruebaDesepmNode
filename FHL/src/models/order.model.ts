import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export type OrderStatus = "pendiente" | "en_transito" | "entregada";

interface OrderAttributes {
  id: string;
  clientId: string;
  warehouseId: string;
  status: OrderStatus;
}

type OrderCreationAttributes = Optional<OrderAttributes, "id" | "status">;

// Orden de entrega
export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: string;
  public clientId!: string;
  public warehouseId!: string;
  public status!: OrderStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "client_id",
    },
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "warehouse_id",
    },
    status: {
      type: DataTypes.ENUM("pendiente", "en_transito", "entregada"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
  }
);
