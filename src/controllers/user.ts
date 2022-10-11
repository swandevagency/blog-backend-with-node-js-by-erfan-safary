import express, { Router } from "express";
import userService from "../model/services/users"

const users: Router = express.Router();

users.post('/login', async (req, res) => {
    const { user } = req.body;

    if (!user) {
        return res.status(400).send({ error: "check your input"} );
    }

    try {
        const {password, ...logedUser} = await userService.authenticate(user.username, user.password);
        res.status(200).json(logedUser);
    } catch(err) {
        res.status(400).send(err);
    }
});

users.post('/signup', async (req, res) => {
    const { user } = req.body;

    if (!user) {
        return res.status(400).send("check your input");
    }

    try {
        const newUser = await userService.signUp(user.username, user.password);
        res.status(201).json({id: newUser._id, username: newUser.username, token: newUser.token});
    } catch(err) {
        res.status(500).json({ error: "User Exists" });
    }
});

export default users;