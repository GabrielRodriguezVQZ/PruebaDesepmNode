import { Product } from "../../models/product.model.js";
import { ProductWarehouse } from "../../models/productWarehouse.model.js";
import { Warehouse } from "../../models/warehouse.model.js";

interface CreateProductInput {
  code: string;
  name: string;
  description?: string;
  price: number;
}

export const createProduct = async (data: CreateProductInput) => {
  const existing = await Product.findOne({ where: { code: data.code } });
  if (existing) {
    throw { status: 400, message: "Ya existe un producto con ese codigo" };
  }
  return Product.create(data);
};

export const listProducts = async () => {
  return Product.findAll({
    where: { active: true },
    order: [["createdAt", "DESC"]],
  });
};

// Retorna la informacion completa de un producto a partir de su codigo
export const getProductByCode = async (code: string) => {
  const product = await Product.findOne({
    where: { code },
    include: [
      {
        model: ProductWarehouse,
        as: "stockEntries",
        include: [{ model: Warehouse, as: "warehouse" }],
      },
    ],
  });
  if (!product) {
    throw { status: 404, message: "No existe un producto con ese codigo" };
  }
  return product;
};

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
}

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw { status: 404, message: "Producto no encontrado" };
  }
  await product.update(data);
  return product;
};

// Elimina el producto de forma logica (active = false)
export const deleteProductLogically = async (id: string) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw { status: 404, message: "Producto no encontrado" };
  }
  product.active = false;
  await product.save();
  return { message: "Producto eliminado correctamente" };
};

interface SetStockInput {
  warehouseId: string;
  stock: number;
}

// Asigna o actualiza el stock de un producto en una bodega especifica
export const setProductStock = async (productId: string, data: SetStockInput) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw { status: 404, message: "Producto no encontrado" };
  }

  const warehouse = await Warehouse.findByPk(data.warehouseId);
  if (!warehouse) {
    throw { status: 404, message: "La bodega indicada no existe" };
  }

  const [entry] = await ProductWarehouse.findOrCreate({
    where: { productId, warehouseId: data.warehouseId },
    defaults: { productId, warehouseId: data.warehouseId, stock: 0 },
  });

  entry.stock = data.stock;
  await entry.save();
  return entry;
};
