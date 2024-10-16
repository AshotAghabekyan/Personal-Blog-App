import { CreateUserDto } from "./model/user.dto"
import { User } from "./model/user.model"



export interface UserRepositoryI {
    allUsers(): Promise<User[]>
    findUserByEmail(email: string): Promise<User>
    findUserById(id: number): Promise<User>
    changeUsername(id: number, newUsername: string): Promise<number>
    createUser(userDto: CreateUserDto): Promise<User>
    deleteUser(user: {id: number, email: string}): Promise<boolean>
}

