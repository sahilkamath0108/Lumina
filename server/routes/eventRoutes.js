import ProductsController from "../controller/productController.js";
import express from 'express';

const router = express.Router();

router.get("/getSession/:id", ProductsController.fetchProduct);
router.get("/allSessions", ProductsController.fetchAllProducts);
router.post("/addSessions", ProductsController.addProducts);

export default router;
