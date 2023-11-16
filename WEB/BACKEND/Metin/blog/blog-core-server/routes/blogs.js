import { executeQuery } from "../pgClient.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const blogs = await executeQuery(`SELECT * FROM blogs`);
        if (blogs.length == 0) {
            return res.status(404).send({ message: "No blogs." });
        }
        res.send(blogs);
    } catch (error) {
        next(error);
    }
});

router.get("/from-author/:authorID", async (req, res, next) => {
    try {
        const { authorID } = req.params;
        const blogs = await executeQuery(
            `SELECT * FROM blogs WHERE authorid = $1`,
            [authorID]
        );
        if (blogs.length == 0) {
            return res.status(404).send({ message: "No blogs." });
        }
        res.send(blogs[0]);
    } catch (error) {
        next(error);
    }
});

router.get("/:blogID", async (req, res, next) => {
    try {
        const { blogID } = req.params;

        const blogs = await executeQuery(
            `SELECT blogtitle, blogcontent, createdat, editedat FROM blogs WHERE blogid = $1`,
            [blogID]
        );
        if (blogs.length == 0)
            return res.status(404).send({ message: "Blog not found." });

        res.send(blogs[0]);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        if (!req.body)
            return res.status(422).send({ message: "Body not found." });

        const { blogTitle, blogContent } = req.body;
        if (!blogTitle || !blogContent)
            return res.status(422).send({ message: "Missing field." });
        const authorID = req.user.userID;

        await executeQuery(
            `INSERT INTO blogs 
            (blogtitle, blogcontent, authorid) 
            VALUES($1, $2, $3)`,
            [blogTitle, blogContent, authorID]
        );

        res.send({ message: "Blog post added successfully." });
    } catch (error) {
        next(error);
    }

});

router.delete("/:blogID", async (req,   res, next) => {
    try {
        const { blogID } = req.params;
        const userID = req.user.userID;

        await executeQuery(
            `DELETE FROM blogs 
            where authorid = $1 AND blogid = $2`,
            [userID, blogID]
        );

        res.send({ message: "Blog post deleted successfully." });
    } catch (error) {
        next(error);
    }

})

export default router;