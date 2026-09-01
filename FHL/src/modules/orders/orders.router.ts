import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { create, changeStatus, listAll, listActive, listByClient } from "./orders.controller.js";

const router = Router();

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Crea una orden de entrega (solo administrador)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, warehouseId, items]
 *             properties:
 *               clientId:
 *                 type: string
 *               warehouseId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Orden creada correctamente
 *       400:
 *         description: Cliente inexistente, bodega invalida o stock insuficiente
 */
router.post("/", requireAuth, requireRole("Admin"), create);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     summary: Cambia el estado de una orden existente (administrador y analista)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendiente, en_transito, entregada]
 *     responses:
 *       200:
 *         description: Estado de la orden actualizado correctamente
 *       400:
 *         description: Estado invalido
 *       404:
 *         description: Orden no encontrada
 */
router.patch("/:id/status", requireAuth, requireRole("Admin", "analyst"), changeStatus);

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Retorna el historial de todas las ordenes registradas (administrador y analista)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las ordenes
 */
router.get("/", requireAuth, requireRole("Admin", "analyst"), listAll);

/**
 * @openapi
 * /orders/active:
 *   get:
 *     summary: Lista las ordenes activas (pendiente o en transito)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ordenes activas
 */
router.get("/active", requireAuth, requireRole("Admin", "analyst"), listActive);

/**
 * @openapi
 * /orders/client/{clientId}:
 *   get:
 *     summary: Consulta el historial de ordenes de un cliente especifico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial de ordenes del cliente
 *       404:
 *         description: Cliente no encontrado
 */
router.get("/client/:clientId", requireAuth, requireRole("Admin", "analyst"), listByClient);

export default router;
