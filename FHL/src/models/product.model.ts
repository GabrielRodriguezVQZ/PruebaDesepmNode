import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface ProductAttributes {
  id: string;
  code: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
}

type ProductCreationAttributes = Optional<
  ProductAttributes,
  "id" | "active" | "description"
>;

// Productos 
export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public code!: string;
  public name!: string;
  public description?: string;
  public price!: number;
  public active!: boolean;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
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
    tableName: "products",
    timestamps: true,
  }
);
