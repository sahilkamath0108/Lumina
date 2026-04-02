import kProducer from "../kafka/kproducerAPI.js"
import express from 'express'

const router = express.Router()

router.post('/addUserWishlist', kProducer.addUserWishlist)
router.post('/addUserClicks', kProducer.addUserClicks)
router.post('/addUserPurchase', kProducer.addUserPurchase)
// router.post('/addMultiUserPurchase', seedRedis.addMultiUserPurchase)
// router.post('/addMultiUserClicks', seedRedis.addMultiUserClicks)
// router.post('/addMultiUserWishlist', seedRedis.addMultiUserWishlist)

export default router