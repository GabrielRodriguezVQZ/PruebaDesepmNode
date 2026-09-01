import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface WarehouseAttributes {
  id: string;
  name: string;
  location: string;
  active: boolean;
}

type WarehouseCreationAttributes = Optional<WarehouseAttributes, "id" | "active">;

// Bodegas 
export class Warehouse
  extends Model<WarehouseAttributes, WarehouseCreationAttributes>
  implements WarehouseAttributes
{
  public id!: string;
  public name!: string;
  public location!: string;
  public active!: boolean;
}

Warehouse.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "warehouses",
    timestamps: true,
  }
);
