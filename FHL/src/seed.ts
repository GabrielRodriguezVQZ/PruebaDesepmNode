import bcrypt from "bcryptjs";
import { sequelize, connectDB } from "./config/db.js";
import "./models/associations.js";
import { User } from "./models/user.model.js";
import { Client } from "./models/client.model.js";
import { Address } from "./models/address.model.js";
import { Warehouse } from "./models/warehouse.model.js";
import { Product } from "./models/product.model.js";
import { ProductWarehouse } from "./models/productWarehouse.model.js";

const seed = async () => {
  await connectDB();
  await sequelize.sync();

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const [admin] = await User.findOrCreate({
    where: { email: "admin@fhl.com" },
    defaults: {
      name: "Admin FHL",
      email: "admin@fhl.com",
      password: hashedPassword,
      role: "Admin",
    },
  });

  const [analista] = await User.findOrCreate({
    where: { email: "analista@fhl.com" },
    defaults: {
      name: "Analista FHL",
      email: "analista@fhl.com",
      password: hashedPassword,
      role: "Analyst",
    },
  });

  const [bodegaNorte] = await Warehouse.findOrCreate({
    where: { name: "Bodega Norte" },
    defaults: { name: "Bodega Norte", location: "Zona Industrial Norte", active: true },
  });

  const [bodegaSur] = await Warehouse.findOrCreate({
    where: { name: "Bodega Sur" },
    defaults: { name: "Bodega Sur", location: "Zona Industrial Sur", active: true },
  });

  const [productoA] = await Product.findOrCreate({
    where: { code: "PRD-001" },
    defaults: { code: "PRD-001", name: "Caja de herramientas", description: "Caja metalica 20 piezas", price: 45.5, active: true },
  });

  const [productoB] = await Product.findOrCreate({
    where: { code: "PRD-002" },
    defaults: { code: "PRD-002", name: "Router WiFi", description: "Router doble banda", price: 89.9, active: true },
  });

  const [productoC] = await Product.findOrCreate({
    where: { code: "PRD-003" },
    defaults: { code: "PRD-003", name: "Silla ergonomica", description: "Silla de oficina ajustable", price: 120.0, active: true },
  });

  const stockSeeds: [Product, Warehouse, number][] = [
    [productoA, bodegaNorte, 50],
    [productoA, bodegaSur, 20],
    [productoB, bodegaNorte, 15],
    [productoB, bodegaSur, 0],
    [productoC, bodegaSur, 8],
  ];

  for (const [product, warehouse, stock] of stockSeeds) {
    const [entry] = await ProductWarehouse.findOrCreate({
      where: { productId: product.id, warehouseId: warehouse.id },
      defaults: { productId: product.id, warehouseId: warehouse.id, stock },
    });
    entry.stock = stock;
    await entry.save();
  }

  const [clienteUno] = await Client.findOrCreate({
    where: { documentId: "1000123456" },
    defaults: { documentId: "1000123456", name: "Laura Gomez", email: "laura.gomez@example.com" },
  });

  await Address.findOrCreate({
    where: { clientId: clienteUno.id },
    defaults: {
      clientId: clienteUno.id,
      addressLine: "Calle 45 # 12-34",
      city: "Bogota",
      reference: "Cerca al parque principal",
    },
  });

  const [clienteDos] = await Client.findOrCreate({
    where: { documentId: "1000654321" },
    defaults: { documentId: "1000654321", name: "Carlos Ramirez", email: "carlos.ramirez@example.com" },
  });

  await Address.findOrCreate({
    where: { clientId: clienteDos.id },
    defaults: {
      clientId: clienteDos.id,
      addressLine: "Carrera 10 # 20-15",
      city: "Medellin",
      reference: "Edificio Torre Azul, apto 502",
    },
  });

  console.log("Seed ejecutado correctamente");
  console.log("Usuario administrador -> email: admin@fhl.com | password: Password123!");
  console.log("Usuario analista      -> email: analysr@fhl.com | password: Password123!");
  console.log(`Bodega Norte id: ${bodegaNorte.id}`);
  console.log(`Bodega Sur id:   ${bodegaSur.id}`);
  console.log(`Producto PRD-001 id: ${productoA.id}`);
  console.log(`Producto PRD-002 id: ${productoB.id}`);
  console.log(`Producto PRD-003 id: ${productoC.id}`);
  console.log(`Cliente 1000123456 id: ${clienteUno.id}`);
  console.log(`Cliente 1000654321 id: ${clienteDos.id}`);

  process.exit(0);
};

seed().catch((error) => {
  console.error("Error al ejecutar el seed:", error);
  process.exit(1);
});
