import { Milliseconds } from "cache-manager";


export interface RedisCacheProvider<T> {
    setValue(key: string | number, value: T | T[], ttlMiliseconds: Milliseconds): Promise<void>
    getValue(key: string | number): Promise<T>
    getAllValues(key: string | number): Promise<T[]>
    deleteValue(key: string | number): Promise<void>
}