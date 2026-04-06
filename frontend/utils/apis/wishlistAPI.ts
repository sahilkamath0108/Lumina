import { fetchWithAuth } from './fetchWithAuth';

export async function addWishlist(user_id: string, product_id: string) {
  try {
    const response = await fetchWithAuth(`/wishlist/addWishlist`, {
      method: 'POST',
      data: { userID: user_id, productID: product_id }
    });
    console.log("Added wishlist item ", response)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function getWishlist(user_id: string) {
  try {
    const response = await fetchWithAuth(`/wishlist/getWishlist/${user_id}`,
      { method: 'GET' }
    );
    // console.log("Fetched wishlist ", response)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function removeItemFromWishlist(wishlist_item_id: string) {
  try { 
    // console.log("Removing wishlist item id ", wishlist_item_id)
    const response = await fetchWithAuth(`/wishlist/removeItemsFromWishlist/${wishlist_item_id}`, {
      method: 'DELETE'
    });
    // console.log("Removed wishlist item ", response)
    return response
  } catch (error) {
    console.error(error)
  } 
}

export async function clearWishlist(wishlist_id: string) {
  try {
    const response = await fetchWithAuth(`/wishlist/clearWishlist/${wishlist_id}`, {
      method: 'DELETE'
    });
    // console.log("Cleared wishlist ", response)
    return response
  } catch (error) {
    console.error(error)
  }
}

