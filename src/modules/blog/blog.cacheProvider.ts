import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { RedisCacheProvider } from "../globals/redis/redis.provider";
import { Blog } from "./model/blog.model";
import { Milliseconds } from "cache-manager";
import { Inject } from "@nestjs/common/decorators/core/inject.decorator";
import { CACHE_MANAGER } from "@nestjs/cache-manager/dist/cache.constants";
import { Cache } from "cache-manager";


@Injectable()
export class BlogCacheProvider implements RedisCacheProvider<Blog> {
    private readonly cacheManager: Cache;

    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
        this.cacheManager = cacheManager;
    } 


    public async getValue(key: string | number): Promise<Blog> {
        try {
            if (typeof key == "number") {
                key = String(key);
            }
    
            const blog: Blog = await this.cacheManager.get(key);
            return blog || null;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public async getAllValues(key: string | number): Promise<Blog[]> {
        try {
            if (typeof key == "number") {
                key = String(key);
            }
    
            const blogs: Blog[] = await this.cacheManager.get(key);
            return blogs;
        }
        catch(error) {
            console.error(error);
        }
    }


    public async setValue(key: string | number, blog: Blog | Blog[], ttlMiliseconds: Milliseconds = 0): Promise<void> {
        try {
            if (typeof key == "number") {
                key = String(key);
            }
    
            await this.cacheManager.set(key, blog, ttlMiliseconds);
        }
        catch(error) {
            console.error(error);
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
            console.error(error);
        }
    }
}