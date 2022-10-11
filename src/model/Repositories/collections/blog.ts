import { Collection, Db, ObjectId } from 'mongodb';

import Blog from "../../entities/Blog";
import Col from "../../entities/collection";
import DB from '../db';

class BlogRepo implements Col<Blog> {

    private blogs: Collection;

    constructor() {
        this.blogs = DB.getInstance().getDB().collection("blog");
    }

    async findAll(): Promise<Blog[]> {
        try {
            const cursor = await this.blogs.find();
            const blogs = await cursor.map((blog) => {
                return {id: blog._id, title: blog.title,
                        content: blog.content, category: blog.category,
                        cover: blog.cover, author: {_id: blog.author._id, username: blog.author.username}};
            });
            return await blogs.toArray();
        } catch(err) {
            console.error(err);
            return [];
        }
    }

    async findOne(id: any): Promise<Blog> {
        try {
            const query = { _id: new ObjectId(id) };

            const blog = await this.blogs.findOne(query);
            if (blog == null) {
                throw new Error("not Found");
            }
            const author = await DB.getInstance().getDB().collection("user")
                                        .findOne({_id: blog.author._id});
            return {id: blog._id, title: blog.title,
                content: blog.content, category: blog.category,
                cover: blog.cover, author: {_id: author._id, username: author.username}};
        } catch(err) {
            throw err;
        }
    }

    async addOne(blog: Blog): Promise<any> {
        try {
            const {id, ...newBlog} = blog;
    
            const res = await this.blogs.insertOne(newBlog);

            console.log("added");
            return res.insertedId;
        } catch(err) {
            console.error(err);
            throw new Error("couldnt add new Blog");
        }
    }

    async updateOne(id: any, newOne: Blog): Promise<any> {
        try {
            const filter = { _id: new ObjectId(id) };
            
            const updateBlog = {
                $set: newOne
            }

            const result = await this.blogs.updateOne(filter, updateBlog);
            return result.upsertedId;
        } catch(err) {
            console.error(err);
            throw new Error("Couldnt update blog");
        }
    }

    async deleteOne(id: any): Promise<any> {
        try {
            const query = { _id: new ObjectId(id) };

            const result = await this.blogs.deleteOne(query);
            return result.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("couldnt update blog");
        }
    }
}

export default BlogRepo;