export default () => {
    return {
        port: Number.parseInt(process.env.PORT) || 3000,
        db_host: process.env.DB_HOST,
        db_port: Number.parseInt(process.env.DB_PORT),
        db_user: process.env.DB_USER,
        db_password: process.env.DB_PASSWORD,
        db_name: process.env.DB_NAME,
        jwt_secret: process.env.JWT_SECRET,
        redis_port: process.env.REDIS_PORT,
        redis_host: process.env.REDIS_HOST,
        users_cache_db: process.env.USERS_CACHE_DB,
        blogs_cache_db: process.env.BLOGS_CACHE_DB,
        reactions_cache_db: process.env.REACTIONS_CACHE_DB
    }
}
