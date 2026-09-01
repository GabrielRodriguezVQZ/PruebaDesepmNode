import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface AddressAttributes {
  id: string;
  clientId: string;
  addressLine: string;
  city: string;
  reference?: string;
}

type AddressCreationAttributes = Optional<AddressAttributes, "id" | "reference">;

// Direcciones de entrega de un cliente 
export class Address
  extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes
{
  public id!: string;
  public clientId!: string;
  public addressLine!: string;
  public city!: string;
  public reference?: string;
}

Address.init(
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
    addressLine: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "address_line",
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "addresses",
    timestamps: true,
  }
);
