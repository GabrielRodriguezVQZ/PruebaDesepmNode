import { Warehouse } from "../../models/warehouse.model.js";
import { ProductWarehouse } from "../../models/productWarehouse.model.js";
import { Product } from "../../models/product.model.js";

interface CreateWarehouseInput {
  name: string;
  location: string;
}

export const createWarehouse = async (data: CreateWarehouseInput) => {
  return Warehouse.create({ name: data.name, location: data.location });
};

export const listWarehouses = async () => {
  return Warehouse.findAll({ order: [["createdAt", "DESC"]] });
};

// Lista solo las bodegas activas, incluyendo el stock de productos registrado en cada una
export const listActiveWarehousesWithStock = async () => {
  return Warehouse.findAll({
    where: { active: true },
    include: [
      {
        model: ProductWarehouse,
        as: "stockEntries",
        include: [{ model: Product, as: "product" }],
      },
    ],
    order: [["name", "ASC"]],
  });
};

interface UpdateWarehouseInput {
  name?: string;
  location?: string;
}

export const updateWarehouse = async (id: string, data: UpdateWarehouseInput) => {
  const warehouse = await Warehouse.findByPk(id);
  if (!warehouse) {
    throw { status: 404, message: "Bodega no encontrada" };
  }
  await warehouse.update(data);
  return warehouse;
};

// Activa o inactiva una bodega, validando que exista
export const toggleWarehouseStatus = async (id: string) => {
  const warehouse = await Warehouse.findByPk(id);
  if (!warehouse) {
    throw { status: 404, message: "La bodega indicada no existe" };
  }
  warehouse.active = !warehouse.active;
  await warehouse.save();
  return warehouse;
};
