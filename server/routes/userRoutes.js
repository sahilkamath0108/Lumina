import UserController from "../controller/userController.js";
import express from 'express';

const router = express.Router()

router.get('/allUsers', UserController.fetchAllUsers);
router.get('/getUserByEmail', UserController.fetchUserByEmail);
router.get('/getUserById', UserController.fetchUserById);

export default router;