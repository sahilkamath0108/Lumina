import UserRepo from '../repositories/userRepo.js'

class UserService{
    static async fetchAllUsers(){
        const users = await UserRepo.fetchAllUsers()
        return users
    }

    static async fetchUserByEmail(email){
        const user = await UserRepo.fetchUserByEmail(email)
        return user
    }

    static async fetchUserById(uid){
        const user = await UserRepo.fetchUserById(uid)
        return user
    }
}

export default UserService;