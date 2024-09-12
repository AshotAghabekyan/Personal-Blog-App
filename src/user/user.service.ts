import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { CreateUserDto } from "./user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { HashGenerator } from "src/utils/crypto/crypto";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";




@Injectable()
export class UserService {

    private readonly userModel: typeof User;
    private readonly hashGenerator: HashGenerator;
    constructor(@InjectModel(User) userModel: typeof User) {
        this.userModel = userModel;
        this.hashGenerator = new HashGenerator();
    }

    public async allUsers(): Promise<User[]> {
        return await this.userModel.findAll();
    }

    public async findUserByEmail(email: string): Promise<User> {
        const targetUser = await this.userModel.findOne({"where": {email}});
        return targetUser || null;
    }


    public async findUserById(id: number): Promise<User> {
        const targetUser = await this.userModel.findByPk(id);
        return targetUser || null;
    }


    public async createUser(userDto: CreateUserDto): Promise<User> {
        const isUserExist: User = await this.findUserByEmail(userDto.email);
        if (isUserExist) {
            throw new BadRequestException("user with this email already exits");
        }

        const hashedPassword = await this.hashGenerator.genHash(userDto.password);
        if (!hashedPassword) {
            console.log('internal server error');
            throw new InternalServerErrorException("oops, some error, try again later");
        }
        
        const user = {
            password: hashedPassword,
            username: userDto.username,
            email: userDto.email
        }

        const createdUser: User = await this.userModel.create<User>(user, {
            "validate": true,
        });
        return createdUser;
    }



    public async deleteUser(user: {id: number, email: string}): Promise<boolean> {
        const targetUser = await this.findUserById(user.id);
        if (!targetUser) {
            throw new NotFoundException("user not found");
        }

        const isDeleted = await this.userModel.destroy<User>({where: { id: user.id }});
        return Boolean(isDeleted);
    }

};