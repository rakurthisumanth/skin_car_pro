import express from "express";
import { getSkincareAdvice } from "../controllers/skincareController.js";

const router = express.Router();

/**
 * @swagger
 * /api/skincare/advice:
 *   post:
 *     summary: Get skincare advice
 *     description: Returns rule-based and AI-generated skincare recommendations.
 *     tags:
 *       - Skincare
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skinType:
 *                 type: string
 *                 example: oily
 *               moisturizer:
 *                 type: string
 *                 example: Neutrogena Hydro Boost
 *               problem:
 *                 type: string
 *                 example: acne
 *     responses:
 *       200:
 *         description: Skincare advice generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rule_based:
 *                   type: string
 *                 ai_response:
 *                   type: string
 */
router.post("/advice", getSkincareAdvice);

export default router;
