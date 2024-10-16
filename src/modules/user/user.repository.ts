import { Injectable } from "@nestjs/common"
import { CreateUserDto } from "./model/user.dto"
import { User } from "./model/user.model"
import { InjectModel } from "@nestjs/sequelize/dist/common/sequelize.decorators"
import { HashGenerator } from "src/utils/crypto/crypto"
import { Blog } from "../blog/model/blog.model"



interface RepositoryI {
    allUsers(): Promise<User[]>
    findUserByEmail(email: string): Promise<User>
    findUserById(id: number): Promise<User>
    changeUsername(id: number, newUsername: string): Promise<number>
    createUser(userDto: CreateUserDto): Promise<User>
    deleteUser(user: {id: number, email: string}): Promise<boolean>
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


    public async createUser(userDto: CreateUserDto): Promise<User> {
        const hashedPassword = await this.hashGenerator.genHash(userDto.password);
        const user = {
            password: hashedPassword,
            username: userDto.username,
            email: userDto.email
        };

        const createdUser: User = await this.userModel.create<User>(user, {
            "validate": true,
        });
        return createdUser;
    }



    public async deleteUser(user: {id: number, email: string}): Promise<boolean> {
        const targetUser = await this.findUserById(user.id);
        if (!targetUser) {
            return null;
        }

        const isDeleted = await this.userModel.destroy<User>({where: { id: user.id }});
        return Boolean(isDeleted);
    }


}