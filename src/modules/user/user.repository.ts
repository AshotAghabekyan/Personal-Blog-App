import { Injectable } from "@nestjs/common"
import { UserCreationAttrs } from "./model/user.model"
import { User } from "./model/user.model"
import { InjectModel } from "@nestjs/sequelize/dist/common/sequelize.decorators"
import { HashGenerator } from "src/utils/crypto/crypto"
import { Blog } from "../blog/model/blog.model"



interface RepositoryI {
    allUsers(): Promise<User[]>
    findUserByEmail(email: string): Promise<User>
    findUserById(id: number): Promise<User>
    changeUsername(id: number, newUsername: string): Promise<number>
    createUser(userDto: UserCreationAttrs): Promise<User>
    deleteUser(userId: number): Promise<boolean>
}



@Injectable()
export class UserRepository implements RepositoryI {
    private readonly userModel: typeof User;
    private readonly hashGenerator: HashGenerator;


    constructor(@InjectModel(User) userModel: typeof User) {
        this.userModel = userModel;
        this.hashGenerator = new HashGenerator();
    }


    public async allUsers(): Promise<User[]> {
        const allUsers: User[] = await this.userModel.findAll({"include": [Blog]});
        return allUsers;
    }


    public async findUserByEmail(email: string): Promise<User> {    
        const targetUser = await this.userModel.findOne({"where": {email}, include: [Blog]});
        return targetUser || null;
    }


    public async findUserById(id: number): Promise<User> {
        const targetUser = await this.userModel.findByPk(id, {include: [Blog]});
        return targetUser || null;
    }


    public async changeUsername(id: number, newUsername: string) {
        const result = await this.userModel.update({"username": newUsername}, {
            "where": { id },
        });
        return result[0]
    }


    public async createUser(userAttrs: UserCreationAttrs): Promise<User> {
        const createdUser: User = await this.userModel.create<User>(userAttrs, {
            "validate": true,
        });
        return createdUser;
    }



    public async deleteUser(userId: number): Promise<boolean> {
        const targetUser = await this.findUserById(userId);
        if (!targetUser) {
            return null;
        }

        const isDeleted = await this.userModel.destroy<User>({where: { id: userId }});
        return Boolean(isDeleted);
    }


}