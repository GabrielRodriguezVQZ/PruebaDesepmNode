import bcrypt from "bcryptjs";
import { User, UserRole } from "../../models/user.model.js";
import { generateToken } from "../../utils/jwt.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

// Registra un nuevo usuario (administrador o analista)
export const registerUser = async (data: RegisterInput) => {
  const { name, email, password, role } = data;

  if (!["Admin", "analyst"].includes(role)) {
    throw { status: 400, message: "The role must be 'Admin' or 'analyst'" };
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw { status: 400, message: "A user with that email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

// Autentica un usuario y devuelve un token JWT
export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};
