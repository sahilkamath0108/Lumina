import WishlistRepo from '../repositories/wishlistRepo.js'
import ProductRepo from '../repositories/productRepo.js'
import kProducers from '../kafka/kproducerAPI.js'

class WishlistService {
    static async fetchWishlist(userID) {
        let wishlistID = await WishlistRepo.fetchWishlist(userID)
        wishlistID = wishlistID?.wishlist_id

        if (wishlistID) {
            let wishlistItems = await WishlistRepo.fetchWishlistItems(wishlistID)
            wishlistItems = await Promise.all(
                wishlistItems.map(async (item) => {
                    const productDetails = await ProductRepo.fetchProduct(item.product_id);
                    // console.log("Product details are ", productDetails)
                    const { product_id, title, price, original_price, discount, image } = productDetails[0];
                    // console.log("Image is ", image)
                    return {
                        wishlist_id: wishlistID,
                        wishlist_item_id: item.wishlist_item_id,
                        product_id, title, price, original_price, discount, image
                    };
                })
            );

            console.log("Fetched wishlist items are ", wishlistItems);
            return wishlistItems;
        }
        else {
            console.log("Could not fetch wishlist items :(")
        }
    }

    static async addWishlist(data, email) {
        const { userID, productID } = data
        const productDetails = await ProductRepo.fetchProduct(productID);

        let wishlistID = await WishlistRepo.fetchWishlist(userID)
        wishlistID = wishlistID?.wishlist_id
        let wishlistItem = null

        if (wishlistID) {
            wishlistItem = await WishlistRepo.addWishlistItem(wishlistID, productID)
            console.log("Inserted item ", wishlistItem, " in already existing wishlist ", wishlistID)
        }
        else {
            const newWishlist = await WishlistRepo.addWishlist(userID)
            wishlistID = newWishlist?.wishlist_id
            wishlistItem = await WishlistRepo.addWishlistItem(wishlistID, productID)
            console.log("Inserted item ", wishlistItem, " in newly created wishlist ", wishlistID)
        }
        data = {...data, title: productDetails[0]?.title, email: email}
        await kProducers.addUserWishlist(data)
        
        return wishlistItem
    }

    static async removeItemFromWishlist(itemID) {
        const item = await WishlistRepo.removeItemFromWishlist(itemID)
        return item
    }

    static async clearWishlist(wishlistID) {
        if (wishlistID) {
            const wishlist = await WishlistRepo.clearWishlist(wishlistID)
            const items = await WishlistRepo.clearWishlistItems(wishlistID)
            return wishlist
        }
        else {
            console.log("Could not find wishlist to clear :(")
        }
    }
}

export default WishlistService;
