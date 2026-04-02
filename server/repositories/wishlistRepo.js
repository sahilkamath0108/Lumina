import supabase from "../supabase/configure.js";

class WishlistRepo {
    static fetchWishlist = async(userID) => {
        const { data, error } = await supabase
                                .from('wishlists')
                                .select('wishlist_id')
                                .eq('user_id', userID)
                                .single()
        if (error) {
            console.log("Failed to fetch the wishlist ", error)
        }

        return data
    }

    static fetchWishlistItems = async(wishlistID) => {
        const { data, error } = await supabase.from('wishlist_items').select().eq('wishlist_id', wishlistID)
        if (error){
            console.log("Failed to fetch the wishlist items ", error)
        }

        return data
    }

    static addWishlistItem = async(wishlistID, productID) => {
        const { data, error } = await supabase
                        .from('wishlist_items')
                        .insert({ wishlist_id: wishlistID, product_id: productID })
                        .select('wishlist_item_id')
                        .single()
        if (error) {
            console.log("Failed to add the wishlist ", error)
        }

        return data
    }

    static addWishlist = async(userID) => {
        const { data, error } = await supabase
                        .from('wishlists')
                        .insert({ user_id: userID })
                        .select('wishlist_id')
                        .single()
        if (error) {
            console.log("Failed to add the wishlist ", error)
        }

        return data
    }

    static removeItemFromWishlist = async(itemID) => {
        const { data, error } = await supabase
                                .from('wishlist_items')
                                .delete()
                                .eq('wishlist_item_id', itemID)
                                .select()
        if (error) {
            console.log("Failed to remove the element ", error)
        }

        return data
    }

    static clearWishlist = async(wishlistID) => {
        const { data, error } = await supabase
                                .from('wishlists')
                                .delete() 
                                .eq('wishlist_id', wishlistID)
                                .select()           
        if (error) {
            console.log("Failed to remove the wishlist ", error)
        }

        return data 
    }

    static clearWishlistItems = async(wishlistID) => {
        const { data, error } = await supabase
                                .from('wishlist_items')
                                .delete() 
                                .eq('wishlist_id', wishlistID)
                                .select()
        if (error) {
            console.log("Failed to remove the element ", error)
        }
        return data
    }
}

export default WishlistRepo;