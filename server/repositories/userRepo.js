import supabase from "../supabase/configure.js";

class UserRepo {
    static fetchAllUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
        if (error){
            console.log("Failed to fetch users ", error)
        }
        return data
    }

    static fetchUserByEmail = async(email) => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('email', email)
        if (error){
            console.log("Failed to fetch users ", error)
        }
        return data
    }

    static fetchUserById = async(uid) => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', uid)
        if (error){
            console.log("Failed to fetch users ", error)
        }
        return data
    }
}

export default UserRepo;