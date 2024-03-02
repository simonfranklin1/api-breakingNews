import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userService from "../services/user.service.js";

dotenv.config();

export const validateAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).send({ message: "Invalid token" });
        }

        const parts = authorization.split(" ");

        if (parts.length !== 2) {
            return res.status(401).send({ message: "Invalid token" });
        }

        const [schema, token] = parts;

        if (schema !== "Bearer") {
            return res.status(401).send({ message: "Invalid token" });
        }

        jwt.verify(token, process.env.SECRET_JWT, async(error, decoded) => {
            if (error) {
                return res.status(401).send({ message: "Invalid token" });
            }

            const user = await userService.getUser(decoded.id);

            if (!user || !user._id) {
                return res.status(401).send({ message: "Invalid token"})
            }

            req.userId = user._id;

            return next();
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}