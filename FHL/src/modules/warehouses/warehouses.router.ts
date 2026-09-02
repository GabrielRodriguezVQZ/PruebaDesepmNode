import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { create, list, listActive, update, toggleStatus } from "./warehouses.controller.js";

const router = Router();

/**
 * @openapi
 * /warehouses:
 *   post:
 *     summary: Crea una bodega de despacho (solo administrador)
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location]
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bodega creada correctamente
 */
router.post("/", requireAuth, requireRole("Admin"), create);

/**
 * @openapi
 * /warehouses:
 *   get:
 *     summary: Lista todas las bodegas (administrador y analista)
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bodegas
 */
router.get("/", requireAuth, requireRole("Admin", "analyst"), list);

/**
 * @openapi
 * /warehouses/active:
 *   get:
 *     summary: Lista las bodegas activas incluyendo su stock registrado
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bodegas activas con su stock
 */
router.get("/active", requireAuth, requireRole("Admin", "analyst"), listActive);

/**
 * @openapi
 * /warehouses/{id}:
 *   put:
 *     summary: Actualiza los datos de una bodega (solo administrador)
 *     tags: [Warehouses]
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
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bodega actualizada correctamente
 *       404:
 *         description: Bodega no encontrada
 */
router.put("/:id", requireAuth, requireRole("Admin"), update);

/**
 * @openapi
 * /warehouses/{id}/toggle:
 *   patch:
 *     summary: Activa o inactiva una bodega, validando que exista (solo administrador)
 *     tags: [Warehouses]
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
 *         description: Estado de la bodega actualizado
 *       404:
 *         description: La bodega indicada no existe
 */
router.patch("/:id/toggle", requireAuth, requireRole("Admin"), toggleStatus);

export default router;
