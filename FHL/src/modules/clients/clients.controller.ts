import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import {
  createClient,
  listClients,
  findClientByDocumentId,
  updateClient,
  deleteClient,
} from "./clients.service.js";

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await createClient(req.body);
    res.status(201).json({ message: "CClient created successfully", client });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error to create client" });
  }
};

export const list = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const clients = await listClients();
    res.status(200).json(clients);
  } catch (error: any) {
    res.status(500).json({ message: "Error to list clients" });
  }
};

export const search = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.body;
    if (!documentId) {
      res.status(400).json({ message: "You must send the ID (documentId) in the body" });
      return;
    }
    const client = await findClientByDocumentId(documentId);
    res.status(200).json(client);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error to search client" });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await updateClient(req.params.id, req.body);
    res.status(200).json({ message: "Client updated successfully", client });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error to update client" });
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await deleteClient(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Error to delete client" });
  }
};
