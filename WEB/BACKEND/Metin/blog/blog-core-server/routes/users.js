import { executeQuery } from "../pgClient.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const users = await executeQuery(
            `SELECT 
            userid, username, firstname, lastname, joinedat, blogscount, 
            followerscount, followingscount 
            FROM users`);

        res.send(users);
    } catch (error) {
        next(error)
    }
});

router.get("/:usernameorid", async (req, res, next) => {
    try {
        const { usernameorid } = req.params;
        const { by } = req.query;

        let queryText = "SELECT userid, username, firstname,lastname, joinedat,blogscount, followerscount, followingscount FROM users WHERE ";

        if (by == "id")
            queryText = queryText + `userid = $1`;
        else if (by == "username")
            queryText = queryText + `username = $1`;
        else
            return res.status(422).send({ message: "please check the query named 'by'" });

        const users = await executeQuery(queryText, [usernameorid]);
        if (users.length == 0)
            return res.status(404).send({ message: "user not found" });

        res.send(users[0]);
    } catch (error) {
        next(error)
    }
});

export default router;