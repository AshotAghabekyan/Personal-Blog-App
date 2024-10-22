import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";

import { UserRepository } from "./user.repository";
import { UserCacheProvider } from "./user.cacheProvider"

import { User } from "./model/user.model";
import { CreateUserDto } from "./model/user.dto";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import errorResponse from "src/config/errorResponse";
import cacheKeys from "src/config/cacheKeys";
import { HashGenerator } from "src/utils/crypto/crypto";




@Injectable()
export class UserService {

    private readonly userRepository: UserRepository;
    private readonly userCacheProvider: UserCacheProvider;
    private readonly hashGenerator: HashGenerator = new HashGenerator();

    constructor(userRepository: UserRepository, userCacheProvider: UserCacheProvider) {
        this.userCacheProvider = userCacheProvider;
        this.userRepository = userRepository;
    }

    public async allUsers(): Promise<User[]> {
        const cacheKey: string = cacheKeys.users.allUsers();
        const cacheData: User[] = await this.userCacheProvider.getAllValues(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const allUsers: User[] = await this.userRepository.allUsers();
        if (allUsers.length == 0) {
            throw new NotFoundException(errorResponse.resource_not_found)
        }
        this.userCacheProvider.setValue(cacheKey, allUsers);
        return allUsers;
    }


    public async findUserByEmail(email: string): Promise<User> {    
        const cacheKey: string = cacheKeys.users.userByEmail(email);
        const cachedUser: User = await this.userCacheProvider.getValue(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }

        const targetUser = await this.userRepository.findUserByEmail(email);
        if (!targetUser) {
            throw new NotFoundException(errorResponse.user.user_not_found)
        }

        this.userCacheProvider.setValue(cacheKey, targetUser);
        return targetUser || null;
    }


    public async findUserById(id: number): Promise<User> {
        const cacheKey: string = cacheKeys.users.userById(id);

        const cachedUser: User = await this.userCacheProvider.getValue(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }

        const targetUser = await this.userRepository.findUserById(id);
        if (!targetUser) {
            throw new NotFoundException(errorResponse.user.user_not_found)
        }

        await this.userCacheProvider.setValue(cacheKey, targetUser);
        return targetUser || null;
    }


    public async changeUsername(id: number, newUsername: string) {
        const isChanged: number = await this.userRepository.changeUsername(id, newUsername);
        if (!isChanged) {
            throw new Error(errorResponse.bad_request);
        }

        const changedUser: User = await this.findUserById(id);
        const cacheKey: string = cacheKeys.users.userById(id);
        this.userCacheProvider.setValue(cacheKey, changedUser);
        return changedUser;
    }


    public async createUser(userDto: CreateUserDto): Promise<User> {
        const isUserExist: User = await this.findUserByEmail(userDto.email);
        if (isUserExist) {
            throw new BadRequestException(errorResponse.user.user_exist);
        }

        userDto.password = await this.hashGenerator.genHash(userDto.password);
        const createdUser: User = await this.userRepository.createUser(userDto);
        const cacheKey: string = cacheKeys.users.userById(createdUser.id);
        this.userCacheProvider.setValue(cacheKey, createdUser);
        return createdUser;
    }



    public async deleteUser(user: {id: number, email: string}): Promise<boolean> {
        const targetUser = await this.findUserById(user.id);
        if (!targetUser) {
            throw new NotFoundException(errorResponse.user.user_not_found);
        }

        const isDeleted = await this.userRepository.deleteUser(user.id);
        const cacheKey: string = cacheKeys.users.userById(user.id);
        this.userCacheProvider.deleteValue(cacheKey);
        return Boolean(isDeleted);
    }

};