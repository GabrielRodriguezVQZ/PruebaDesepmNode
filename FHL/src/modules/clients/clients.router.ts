import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { create, list, search, update, remove } from "./clients.controller.js";

const router = Router();

/**
 * @openapi
 * /clients:
 *   post:
 *     summary: Registra un cliente y su direccion de entrega (solo administrador)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [documentId, name, email, addressLine, city]
 *             properties:
 *               documentId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               addressLine:
 *                 type: string
 *               city:
 *                 type: string
 *               reference:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente registrado correctamente
 *       400:
 *         description: Ya existe un cliente con ese documento
 */
router.post("/", requireAuth, requireRole("Admin"), create);

/**
 * @openapi
 * /clients:
 *   get:
 *     summary: Lista todos los clientes registrados (administrador y analista)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", requireAuth, requireRole("Admin", "analyst"), list);

/**
 * @openapi
 * /clients/search:
 *   post:
 *     summary: Busca un cliente por su numero de documento (cedula)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [documentId]
 *             properties:
 *               documentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 */
router.post("/search", requireAuth, requireRole("Admin", "analyst"), search);

/**
 * @openapi
 * /clients/{id}:
 *   put:
 *     summary: Actualiza los datos de un cliente (solo administrador)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.put("/:id", requireAuth, requireRole("Admin"), update);

/**
 * @openapi
 * /clients/{id}:
 *   delete:
 *     summary: Elimina un cliente (solo administrador)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id", requireAuth, requireRole("Admin"), remove);

export default router;
