import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import config from "../../config/config";

import User from "../entities/User";
import UserRepo from "../Repositories/collections/user";

const userRepo = new UserRepo();

const userService = {
    
    async authenticate(username: string, password: string): Promise<any> {
        const user = await userRepo.findOneByUsername(username);

        if (!(user && await bcrypt.compareSync(password, user.password))) {
            throw new Error("Username or Password is not correct");
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, config.TOKEN_KEY,
        {
            expiresIn: "5h"
        });

        user.token = token

        await userRepo.updateOne(user._id, user);
        return user;
    },

    async signUp(username: string, password: string): Promise<User> {
        const oldUser = await userRepo.findOneByUsername(username);
        if (oldUser) {
            throw new Error("User already Exists");
        }

        const passHash = await bcrypt.hash(password, 10);
        console.log(passHash)

        const userId = await userRepo.addOne({username, password: passHash, token: ""});
        const token = jwt.sign({
            id: userId,
            username
        }, config.TOKEN_KEY,
        {
            expiresIn: "5h"
        });

        const user = {username, password: passHash, token};
        await userRepo.updateOne(userId, user);
        return user;
    },

    async userExists(id: string): Promise<User> {
        const user = await userRepo.findOne(id);
        return user;
    }
};

export default userService;