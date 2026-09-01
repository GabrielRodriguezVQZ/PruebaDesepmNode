import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error to register" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error to login" });
  }
};
