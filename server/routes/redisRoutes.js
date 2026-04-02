import seedRedis from "../redis/redisAPI.js";
import express from 'express'

const router = express.Router()

router.post('/addProductData', seedRedis.sendProductData)
router.post('/addUserWishlist', seedRedis.addUserWishlist)
router.post('/addUserClicks', seedRedis.addUserClicks)
router.post('/addUserPurchase', seedRedis.addUserPurchase)
router.post('/addMultiUserPurchase', seedRedis.addMultiUserPurchase)
router.post('/addMultiUserClicks', seedRedis.addMultiUserClicks)
router.post('/addMultiUserWishlist', seedRedis.addMultiUserWishlist)

export default router