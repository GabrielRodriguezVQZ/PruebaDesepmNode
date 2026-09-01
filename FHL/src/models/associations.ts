import { User } from "./user.model.js";
import { Client } from "./client.model.js";
import { Address } from "./address.model.js";
import { Warehouse } from "./warehouse.model.js";
import { Product } from "./product.model.js";
import { ProductWarehouse } from "./productWarehouse.model.js";
import { Order } from "./order.model.js";
import { OrderItem } from "./orderItem.model.js";

// Cliente a Direcciones 
Client.hasMany(Address, { foreignKey: "clientId", as: "addresses" });
Address.belongsTo(Client, { foreignKey: "clientId", as: "client" });

// Producto a Bodega, por medio de ProductWarehouse 
Product.belongsToMany(Warehouse, {
  through: ProductWarehouse,
  foreignKey: "productId",
  otherKey: "warehouseId",
  as: "warehouses",
});
Warehouse.belongsToMany(Product, {
  through: ProductWarehouse,
  foreignKey: "warehouseId",
  otherKey: "productId",
  as: "products",
});
ProductWarehouse.belongsTo(Product, { foreignKey: "productId", as: "product" });
ProductWarehouse.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });
Product.hasMany(ProductWarehouse, { foreignKey: "productId", as: "stockEntries" });
Warehouse.hasMany(ProductWarehouse, { foreignKey: "warehouseId", as: "stockEntries" });

// Orden a Cliente / Bodega
Client.hasMany(Order, { foreignKey: "clientId", as: "orders" });
Order.belongsTo(Client, { foreignKey: "clientId", as: "client" });

Warehouse.hasMany(Order, { foreignKey: "warehouseId", as: "orders" });
Order.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });

// Orden a Items a Producto
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

export { User, Client, Address, Warehouse, Product, ProductWarehouse, Order, OrderItem };
