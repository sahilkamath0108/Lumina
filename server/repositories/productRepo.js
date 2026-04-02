import supabase from "../supabase/configure.js";

class ProductRepo {
    static fetchProduct = async(productID) => {
        // console.log("Required product is ", productID)
        const { data, error } = await supabase
                                .from('products')
                                .select()
                                .eq('product_id', productID)
        if (error) {
            console.log("Failed to fetch the required product ", error)
        }

        return data
    }

    static fetchAllProducts = async() => {
        const { data, error } = await supabase.from('products').select('*')
        if (error) {
            console.log("Failed to fetch all the products ", error)
        }
        // console.log("Fetched data is: ", data)
        return data
    }

    static addProducts = async(products) => {
        console.log("These are the products to add ", products)
        const { data, error } = await supabase
                                .from('products')
                                .insert(products)
                                .select('*')
        if (error) {
            console.log("Failed to add the product ", error)
        }

        return data
    }
}

export default ProductRepo;