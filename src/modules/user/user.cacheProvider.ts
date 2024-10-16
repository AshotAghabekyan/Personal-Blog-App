import { Milliseconds } from "cache-manager";
import { RedisCacheProvider } from "../globals/redis/redis.provider";
import { User } from "./model/user.model";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class UserCacheProvider implements RedisCacheProvider<User> {
    private readonly cacheManager: Cache;

    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
        this.cacheManager = cacheManager;
    } 

    public async getValue(key: string | number): Promise<User> {
        try {
            if (typeof key == "number") {
                key = String(key);
            }
            const targetUser: User = await this.cacheManager.get(key);
            return targetUser;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public async getAllValues(key: string | number): Promise<User[]> {
        try {
            if (typeof key == "number") {
                key = String(key);
            }
            const targetUser: User[] = await this.cacheManager.get(key);
            return targetUser;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public async setValue(key: string | number, value: User | User[], ttlMiliseconds: Milliseconds = 0): Promise<void> {
        try {
            if (typeof key == "number") {
                key = String(key);
            }
            await this.cacheManager.set(key, ttlMiliseconds);
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }

    public async deleteValue(key: string | number): Promise<void> {
        try {
            if (typeof key == "number") {
                key = String(key);
            }
            await this.cacheManager.del(key);
        }
        catch(error) {
            console.log(error);
        }
    }
}
