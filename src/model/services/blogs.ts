import BlogDB from "../Repositories/collections/blog";
import Blog from "../entities/Blog";
import userService from "./users";

const blogDb = new BlogDB();

const blogService = {
    async AllBlogs(): Promise<Blog[]> {
        const blogs = await blogDb.findAll();
        return blogs;
    },

    findOneBlog(id: string): Promise<Blog> {
        // validation here
        return blogDb.findOne(id);
    },

    async newBlog(userId: string, blog: Blog): Promise<any> {
        // validation here
        const user = await userService.userExists(userId);
        if (!user) {
            throw new Error("user not found");
        }
        return await blogDb.addOne({...blog, author: user});
    },

    async updateBlog(userId: string, newBlog: Blog): Promise<any> {
        // validation here
        const blog = await blogDb.findOne(newBlog.id);
        if (blog.author._id != userId) {
            throw new Error("You are not authorized");
        }
        return await blogDb.updateOne(newBlog.id, newBlog);
    },

    async deleteBlog(userId: string, id: string): Promise<any> {
        const blog = await blogDb.findOne(id);
        if (blog.author._id != userId) {
            throw new Error("You are not authorized");
        }
        return await blogDb.deleteOne(id);
    }
};

export default blogService;