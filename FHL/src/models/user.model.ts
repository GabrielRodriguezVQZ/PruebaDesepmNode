import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export type UserRole = "administrador" | "analista";

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

type UserCreationAttributes = Optional<UserAttributes, "id">;

// Usuarios 
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("administrador", "analista"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
