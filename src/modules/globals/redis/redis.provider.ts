import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";


@Injectable()
export class RedisCacheProvider<T> {
    protected readonly cacheManager: Cache;
    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
        this.cacheManager = cacheManager;
    } 

    public async setValue(key: string | number, value: T | T[]): Promise<void> {
        if (typeof key === "number") {
            key = String(key);
        }
        await this.cacheManager.set(key, value, 0);
    }


    public async getValue(key: string | number): Promise<T> {
        if (typeof key === "number") {
            key = String(key);
        }

        return await this.cacheManager.get(key);
    }

    public async getValues(key: string | number): Promise<T[]> {
        if (typeof key === "number") {
            key = String(key);
        }

        return await this.cacheManager.get(key);
    }

    public async deleteValue(key: string | number): Promise<void> {
        if (typeof key === "number") {
            key = String(key);
        }
        return await this.cacheManager.del(key);
    }
}