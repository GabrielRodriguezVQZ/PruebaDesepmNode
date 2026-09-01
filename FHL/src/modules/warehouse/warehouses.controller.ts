import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import {
  createWarehouse,
  listWarehouses,
  listActiveWarehousesWithStock,
  updateWarehouse,
  toggleWarehouseStatus,
} from "./warehouses.service.js";

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const warehouse = await createWarehouse(req.body);
    res.status(201).json({ message: "Bodega creada correctamente", warehouse });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error al crear bodega" });
  }
};

export const list = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const warehouses = await listWarehouses();
    res.status(200).json(warehouses);
  } catch (error: any) {
    res.status(500).json({ message: "Error al listar bodegas" });
  }
};

export const listActive = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const warehouses = await listActiveWarehousesWithStock();
    res.status(200).json(warehouses);
  } catch (error: any) {
    res.status(500).json({ message: "Error al listar bodegas activas" });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const warehouse = await updateWarehouse(req.params.id, req.body);
    res.status(200).json({ message: "Bodega actualizada correctamente", warehouse });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error al actualizar bodega" });
  }
};

export const toggleStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const warehouse = await toggleWarehouseStatus(req.params.id);
    res.status(200).json({
      message: `Bodega ${warehouse.active ? "activada" : "inactivada"} correctamente`,
      warehouse,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error al cambiar estado de bodega" });
  }
};
