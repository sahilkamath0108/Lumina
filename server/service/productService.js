import ProductRepo from "../repositories/productRepo.js";
import kProducers from "../kafka/kproducerAPI.js";

class ProductsService {
    static async fetchProduct(productID, userID, email){
        const products = await ProductRepo.fetchProduct(productID)
        const data = {userID: userID, productID: productID, title: products[0]?.title, email: email};
        await kProducers.addUserClicks(data);

        return products
    }

    static async fetchAllProducts(){
        const products = await ProductRepo.fetchAllProducts()
        // console.log("The list of products returned in service ", products)
        return products
    }

    static async addProducts(data){
        const products = await ProductRepo.addProducts(data)
        return products
    }
}

export default ProductsService;