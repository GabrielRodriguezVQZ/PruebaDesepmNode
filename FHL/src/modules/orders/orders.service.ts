import { sequelize } from "../../config/db.js";
import { Order, OrderStatus } from "../../models/order.model.js";
import { OrderItem } from "../../models/orderItem.model.js";
import { Client } from "../../models/client.model.js";
import { Warehouse } from "../../models/warehouse.model.js";
import { Product } from "../../models/product.model.js";
import { ProductWarehouse } from "../../models/productWarehouse.model.js";

const VALID_STATUSES: OrderStatus[] = ["pendiente", "en_transito", "entregada"];

interface OrderItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  clientId: string;
  warehouseId: string;
  items: OrderItemInput[];
}

const orderIncludes = [
  { model: Client, as: "client" },
  { model: Warehouse, as: "warehouse" },
  {
    model: OrderItem,
    as: "items",
    include: [{ model: Product, as: "product" }],
  },
];

// Crea una orden de entrega validando cliente, bodega, stock suficiente y descontando inventario
export const createOrder = async (data: CreateOrderInput) => {
  const { clientId, warehouseId, items } = data;

  if (!items || items.length === 0) {
    throw { status: 400, message: "La orden debe incluir al menos un producto" };
  }

  const client = await Client.findByPk(clientId);
  if (!client) {
    throw { status: 400, message: "El cliente indicado no existe" };
  }

  const warehouse = await Warehouse.findByPk(warehouseId);
  if (!warehouse || !warehouse.active) {
    throw { status: 400, message: "La bodega indicada no existe o no esta activa" };
  }

  return sequelize.transaction(async (t) => {
    // Validamos stock suficiente de cada producto en la bodega seleccionada
    const stockEntries: { entry: ProductWarehouse; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (!product || !product.active) {
        throw { status: 400, message: `El producto ${item.productId} no existe o no esta disponible` };
      }

      const stockEntry = await ProductWarehouse.findOne({
        where: { productId: item.productId, warehouseId },
        transaction: t,
      });

      if (!stockEntry || stockEntry.stock < item.quantity) {
        throw {
          status: 400,
          message: `Stock insuficiente para el producto "${product.name}" en la bodega seleccionada`,
        };
      }

      stockEntries.push({ entry: stockEntry, quantity: item.quantity, price: Number(product.price) });
    }

    const order = await Order.create(
      { clientId, warehouseId, status: "pendiente" },
      { transaction: t }
    );

    for (let i = 0; i < items.length; i++) {
      const { entry, quantity, price } = stockEntries[i];

      await OrderItem.create(
        {
          orderId: order.id,
          productId: items[i].productId,
          quantity,
          unitPrice: price,
        },
        { transaction: t }
      );

      // Descontamos el stock disponible en la bodega
      entry.stock -= quantity;
      await entry.save({ transaction: t });
    }

    return Order.findByPk(order.id, { include: orderIncludes, transaction: t });
  });
};

// Cambia el estado de una orden existente, validando que el estado sea valido
export const updateOrderStatus = async (id: string, status: string) => {
  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    throw {
      status: 400,
      message: `Estado invalido. Los estados permitidos son: ${VALID_STATUSES.join(", ")}`,
    };
  }

  const order = await Order.findByPk(id);
  if (!order) {
    throw { status: 404, message: "Orden no encontrada" };
  }

  order.status = status as OrderStatus;
  await order.save();

  return Order.findByPk(id, { include: orderIncludes });
};

// Historial completo de todas las ordenes registradas
export const listAllOrders = async () => {
  return Order.findAll({ include: orderIncludes, order: [["createdAt", "DESC"]] });
};

// Ordenes activas (no entregadas)
export const listActiveOrders = async () => {
  return Order.findAll({
    where: { status: ["pendiente", "en_transito"] },
    include: orderIncludes,
    order: [["createdAt", "DESC"]],
  });
};

// Historial de ordenes de un cliente especifico
export const listOrdersByClient = async (clientId: string) => {
  const client = await Client.findByPk(clientId);
  if (!client) {
    throw { status: 404, message: "Cliente no encontrado" };
  }

  return Order.findAll({
    where: { clientId },
    include: orderIncludes,
    order: [["createdAt", "DESC"]],
  });
};
