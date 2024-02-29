import mongoose from "mongoose";
import userService from "../services/user.service.js";

const validateId = (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid Id." })
    }

    req.id = id;

    next();
}

const validateUser = async (req, res, next) => {
    const id = req.params.id;

    const user = await userService.getUser(id);

    if (!user) {
        return res.status(400).send({ message: "User doesn't exists." })
    }

    req.user = user;

    next();
}

export { validateId, validateUser }