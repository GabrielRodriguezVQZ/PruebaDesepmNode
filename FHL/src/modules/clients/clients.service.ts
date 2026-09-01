import { Client } from "../../models/client.model.js";
import { Address } from "../../models/address.model.js";

interface CreateClientInput {
  documentId: string;
  name: string;
  email: string;
  addressLine: string;
  city: string;
  reference?: string;
}

// Crea un cliente junto con su direccion de entrega.
// Valida que no exista ya un cliente con el mismo documento (cedula).
export const createClient = async (data: CreateClientInput) => {
  const { documentId, name, email, addressLine, city, reference } = data;

  const existing = await Client.findOne({ where: { documentId } });
  if (existing) {
    throw {
      status: 400,
      message: "A client with that document ID already exists",
    };
  }

  const client = await Client.create({ documentId, name, email });

  if (addressLine && city) {
    await Address.create({ clientId: client.id, addressLine, city, reference });
  }

  return getClientById(client.id);
};

export const listClients = async () => {
  return Client.findAll({
    include: [{ model: Address, as: "addresses" }],
    order: [["createdAt", "DESC"]],
  });
};

export const getClientById = async (id: string) => {
  const client = await Client.findByPk(id, {
    include: [{ model: Address, as: "addresses" }],
  });
  if (!client) {
    throw { status: 404, message: "Client not found" };
  }
  return client;
};

// Busca un cliente por su numero de documento (cedula)
export const findClientByDocumentId = async (documentId: string) => {
  const client = await Client.findOne({
    where: { documentId },
    include: [{ model: Address, as: "addresses" }],
  });
  if (!client) {
    throw { status: 404, message: "No client found with that document ID" };
  }
  return client;
};

interface UpdateClientInput {
  name?: string;
  email?: string;
}

export const updateClient = async (id: string, data: UpdateClientInput) => {
  const client = await Client.findByPk(id);
  if (!client) {
    throw { status: 404, message: "Client not found" };
  }
  await client.update(data);
  return getClientById(id);
};

export const deleteClient = async (id: string) => {
  const client = await Client.findByPk(id);
  if (!client) {
    throw { status: 404, message: "Client not found" };
  }
  await client.destroy();
  return { message: "Client deleted successfully" };
};
