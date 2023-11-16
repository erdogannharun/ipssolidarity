import express from "express";
import bodyParser from "body-parser";
import usersRoute from "./routes/users.js";
import blogsRoute from "./routes/blogs.js";
import followRoute from "./routes/follows.js";
import signUpRoute from "./routes/signUp.js";
import { authorization } from "./middlewares/authorization.js";
import { PORT } from "./config.js";
import cors from 'cors';

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, type: "application/json"}));

app.get("/", (req, res) => res.send({ message: "server is on" }));

app.use("/sign-up", signUpRoute);
app.use(authorization);
app.use("/blogs", blogsRoute);
app.use("/follows", followRoute);
app.use("/users", usersRoute);

app.use("*", (req, res) => {
    res.status(404).send({ message: "not found" });
})
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).send({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log("server listennig...");
});