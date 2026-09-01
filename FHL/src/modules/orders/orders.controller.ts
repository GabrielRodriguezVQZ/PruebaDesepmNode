import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import {
  createOrder,
  updateOrderStatus,
  listAllOrders,
  listActiveOrders,
  listOrdersByClient,
} from "./orders.service.js";

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error to create order" });
  }
};

export const changeStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await updateOrderStatus(req.params.id, req.body.status);
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error to update order status" });
  }
};

export const listAll = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await listAllOrders();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Error to list orders" });
  }
};

export const listActive = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await listActiveOrders();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Error to list active orders" });
  }
};

export const listByClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await listOrdersByClient(req.params.clientId);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error to list client orders" });
  }
};
