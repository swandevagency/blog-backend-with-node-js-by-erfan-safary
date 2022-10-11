import { Collection, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

import User from "../../entities/User";
import Col from "../../entities/collection";
import DB from '../db';

class UserRepo implements Col<User> {

    private users: Collection;

    constructor() {
        this.users = DB.getInstance().getDB().collection("user");
    }

    async findAll(): Promise<User[]> {
        try {
            const cursor = this.users.find();
            return cursor.map((user) => {
                return {id: user._id, username: user.username, password: user.password};
            }).toArray();
        } catch(err) {
            console.error(err);
            throw new Error("couldnt find any Users");
        }
    }

    async findOne(id: any): Promise<User> {
        try {
            const query = { _id: new ObjectId(id) };

            const user = await this.users.findOne(query);
            if (user == null) {
                throw new Error("not Found");
            }
            return {_id: user._id, username: user.username, password: user.password};
        } catch(err) {
            console.error(err);
            throw new Error("couldnt find the user");
        }
    }

    async findOneByUsername(username: string): Promise<User> {
        try {
            const query = { username };

            const user = await this.users.findOne(query);
            if (user == null) {
                return null;
            }
            return {_id: user._id, username: user.username, password: user.password};
        } catch(err) {
            console.error(err);
            throw new Error("couldnt find the user");
        }
    }

    async addOne(user: User): Promise<any> {
        try {
            const {_id, ...newUser} = user;
    
            const res = await this.users.insertOne(newUser);

            console.log("added");
            return res.insertedId;
        } catch(err) {
            console.error(err);
            throw new Error("couldnt add new user");
        }
    }

    async updateOne(id: any, newOne: User): Promise<any> {
        try {
            const filter = { _id: id };
            
            const updateUser = {
                $set: newOne
            }

            const result = await this.users.updateOne(filter, updateUser);
            return result.upsertedId;
        } catch(err) {
            console.error(err);
            throw new Error("Couldnt update user");
        }
    }

    async deleteOne(id: any): Promise<any> {
        try {
            const query = { _id: id };

            const result = await this.users.deleteOne(query);
            return result.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("couldnt update blog");
        }
    }

    
}

export default UserRepo;