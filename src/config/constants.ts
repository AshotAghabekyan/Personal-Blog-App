


export default {
    cacheKeys: {
        blogs: {
            blogs() {
                return 'blogs';
            },

            blogById(id: number) {
                return `blog:${id}`;
            },

            blogsOfUser(userId: number) {
                return `blog:user:${userId}`;
            }
        },


        users: {

        },


        reactions: {

        },

    }
}