
export default {
    blogs: {
        allBlogs() {
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
        allUsers() {
            return "users";
        },

        userById(id: number) {
            return `user:${id}`;
        },

        userByEmail(email: string) {
            return `user:email:${email}`;
        },

        
    },


    reactions: {

    },

}