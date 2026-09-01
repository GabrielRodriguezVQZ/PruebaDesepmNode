import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import {
  createProduct,
  listProducts,
  getProductByCode,
  updateProduct,
  deleteProductLogically,
  setProductStock,
} from "./products.service.js";

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ message: "Producto creado correctamente", product });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error al crear producto" });
  }
};

export const list = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await listProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Error al listar productos" });
  }
};

export const getByCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await getProductByCode(req.params.code);
    res.status(200).json(product);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error al consultar producto" });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.status(200).json({ message: "Producto actualizado correctamente", product });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error al actualizar producto" });
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await deleteProductLogically(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error al eliminar producto" });
  }
};

export const setStock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entry = await setProductStock(req.params.id, req.body);
    res.status(200).json({ message: "Stock actualizado correctamente", stock: entry });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error al actualizar stock" });
  }
};
