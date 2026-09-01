import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface ClientAttributes {
  id: string;
  documentId: string;
  name: string;
  email: string;
}

type ClientCreationAttributes = Optional<ClientAttributes, "id">;

// Clientes de FHL 
export class Client
  extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes
{
  public id!: string;
  public documentId!: string;
  public name!: string;
  public email!: string;
}

Client.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "document_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
  },
  {
    sequelize,
    tableName: "clients",
    timestamps: true,
  }
);
