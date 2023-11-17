import { Router } from "express";
import { executeQuery } from "../pgClient.js";

const router = Router();

router.post("/follow/:followingsID", async (req, res, next) => {
    try {
        const { followingsID } = req.params;
        const followersID = req.user.userID;

        if (!followersID || !followingsID)
            return res.status(422).send({ message: "followersid or followingsid not found" });

        await executeQuery(
            `INSERT INTO follows (followersid, followingsid) VALUES ($1, $2)`,
            [followersID,
                followingsID]
        );

        res.send({ message: "following process succeed." });
    } catch (error) {
        next(error);
    }
});

router.get("/get-followers/:userID", async (req, res, next) => {
    try {
        const { userID } = req.params;
        const followers = await executeQuery(
            `SELECT userid, username, firstname 
        FROM users AS u JOIN follows AS ff 
        ON ff.followersid = u.userid WHERE ff.followingsid = $1`,
            [userID]);
        res.send(followers);
    } catch (error) {
        next(error);
    }
});

router.get("/get-followings/:userID", async (req, res, next) => {
    try {
        const { userID } = req.params;
        const followings = await executeQuery(
            `SELECT userid, username, firstname 
            FROM users AS u JOIN follows AS ff 
            ON ff.followingsid = u.userid WHERE ff.followersid = $1`,
            [userID]
        );
        res.send(followings);
    } catch (error) {
        next(error);
    }
});


router.delete("/unfollow/:followingsID", async (req, res, next) => {
    try {
        const { followingsID } = req.params;
        const userID = req.user.userID;

        const unfollowed = await executeQuery(
            `DELETE FROM follows WHERE followersid = $1 AND followingsid = $2`,
            [userID, followingsID]
        );

        if (!unfollowed)
            throw new Error("Error while unfollowing.");

        res.send({ message: "Successfully unfollowed." });
    } catch (error) {
        next(error);
    }
})

export default router;