import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";

import { UserRepository } from "./user.repository";
import { UserCacheProvider } from "./user.cacheProvider"

import { User } from "./model/user.model";
import { CreateUserDto } from "./model/user.dto";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import errorResponse from "src/config/errorResponse";




@Injectable()
export class UserService {

    private readonly userRepository: UserRepository;
    private readonly userCacheProvider: UserCacheProvider;

    constructor(userRepository: UserRepository, userCacheProvider: UserCacheProvider) {
        this.userCacheProvider = userCacheProvider;
        this.userRepository = userRepository;
    }

    public async allUsers(): Promise<User[]> {
        const cacheData: User[] = await this.userCacheProvider.getAllValues('users');
        if (cacheData) {
            return cacheData;
        }

        const allUsers: User[] = await this.userRepository.allUsers();
        if (allUsers.length == 0) {
            throw new NotFoundException(errorResponse.resource_not_found)
        }
        this.userCacheProvider.setValue("users", allUsers);
        return allUsers;
    }


    public async findUserByEmail(email: string): Promise<User> {    
        const cachedUser: User = await this.userCacheProvider.getValue(email);
        if (cachedUser) {
            return cachedUser;
        }

        const targetUser = await this.userRepository.findUserByEmail(email);
        if (!targetUser) {
            throw new NotFoundException(errorResponse.user.user_not_found)
        }

        this.userCacheProvider.setValue(email, targetUser);
        return targetUser || null;
    }


    public async findUserById(id: number): Promise<User> {
        const cachedUser: User = await this.userCacheProvider.getValue(id);
        if (cachedUser) {
            return cachedUser;
        }

        const targetUser = await this.userRepository.findUserById(id);
        if (!targetUser) {
            throw new NotFoundException(errorResponse.user.user_not_found)
        }

        await this.userCacheProvider.setValue(id, targetUser);
        return targetUser || null;
    }


    public async changeUsername(id: number, newUsername: string) {
        const isChanged: number = await this.userRepository.changeUsername(id, newUsername);
        if (!isChanged) {
            throw new Error(errorResponse.bad_request);
        }

        const changedUser: User = await this.findUserById(id);
        return changedUser;
    }


    public async createUser(userDto: CreateUserDto): Promise<User> {
        const isUserExist: User = await this.findUserByEmail(userDto.email);
        if (isUserExist) {
            throw new BadRequestException(errorResponse.user.user_exist);
        }

        const createdUser: User = await this.userRepository.createUser(userDto)
        this.userCacheProvider.setValue(createdUser.id, createdUser);
        return createdUser;
    }



    public async deleteUser(user: {id: number, email: string}): Promise<boolean> {
        const targetUser = await this.findUserById(user.id);
        if (!targetUser) {
            throw new NotFoundException(errorResponse.user.user_not_found);
        }

        const isDeleted = await this.userRepository.deleteUser(user);
        return Boolean(isDeleted);
    }

};