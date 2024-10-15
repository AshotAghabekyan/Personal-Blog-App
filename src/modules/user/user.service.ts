import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { CreateUserDto } from "./model/user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./model/user.model";
import { HashGenerator } from "src/utils/crypto/crypto";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Blog } from "src/modules/blog/model/blog.model";
import errorResponse from "src/config/errorResponse";
import { Reaction } from "../reaction/model/reaction.model";


@Injectable()
export class UserService {

    private readonly userModel: typeof User;
    private readonly hashGenerator: HashGenerator;
    constructor(@InjectModel(User) userModel: typeof User) {
        this.userModel = userModel;
        this.hashGenerator = new HashGenerator();
    }

    public async allUsers(): Promise<User[]> {
        return await this.userModel.findAll({"include": [Blog]});
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
            "where": { id }
        });
        return result[0];
    }


    public async createUser(userDto: CreateUserDto): Promise<User> {
        const isUserExist: User = await this.findUserByEmail(userDto.email);
        if (isUserExist) {
            throw new BadRequestException(errorResponse.user_exist);
        }

        const hashedPassword = await this.hashGenerator.genHash(userDto.password);
        if (!hashedPassword) {
            throw new InternalServerErrorException(errorResponse.internal_server_error);
        }
        
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
            throw new NotFoundException(errorResponse.user_not_found);
        }

        const isDeleted = await this.userModel.destroy<User>({where: { id: user.id }});
        return Boolean(isDeleted);
    }

};