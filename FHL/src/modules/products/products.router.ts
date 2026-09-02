import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { create, list, getByCode, update, remove, setStock } from "./products.controller.js";

const router = Router();

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Crea un producto (solo administrador)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, price]
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 */
router.post("/", requireAuth, requireRole("Admin"), create);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Lista todos los productos activos (administrador y analista)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", requireAuth, requireRole("Admin", "analyst"), list);

/**
 * @openapi
 * /products/{code}:
 *   get:
 *     summary: Retorna la informacion completa de un producto segun su codigo
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: No existe un producto con ese codigo
 */
router.get("/:code", requireAuth, requireRole("Admin", "analyst"), getByCode);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Actualiza un producto (solo administrador)
 *     tags: [Products]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", requireAuth, requireRole("Admin"), update);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Elimina un producto de forma logica (solo administrador)
 *     tags: [Products]
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
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", requireAuth, requireRole("Admin"), remove);

/**
 * @openapi
 * /products/{id}/stock:
 *   post:
 *     summary: Asigna o actualiza el stock de un producto en una bodega (solo administrador)
 *     tags: [Products]
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
 *             required: [warehouseId, stock]
 *             properties:
 *               warehouseId:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock actualizado correctamente
 *       404:
 *         description: Producto o bodega no encontrados
 */
router.post("/:id/stock", requireAuth, requireRole("Admin"), setStock);

export default router;
