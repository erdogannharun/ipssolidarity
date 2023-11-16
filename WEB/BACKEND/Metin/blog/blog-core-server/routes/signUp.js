import { Router } from "express";
import { executeQuery } from "../pgClient.js";
import bcrypt from 'bcrypt';

const router = Router();

router.post("/", async (req, res, next) => {
    try {
        if (!req.body)
            throw new Error("Body not found.");

        const { username, firstName, password } = req.body;
        if (!username || !firstName || !password) {
            return res.status(422).send({ message: "missing field" });
        }

        let { lastName } = req.body;
        if (!lastName) {
            lastName = null;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPasswword = await bcrypt.hash(password, salt);

        await executeQuery(
            `INSERT INTO users 
            (username, firstname, lastname, hashedpassword) 
            VALUES($1, $2, $3, $4)`,
            [username, firstName, lastName, hashedPasswword]
        );

        res.send({ message: "user successfully signed up" });
    } catch (error) {
        next(error);
    }
})

export default router;