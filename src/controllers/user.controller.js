import User from "../models/User.js";
import userService from "../services/user.service.js";

const create = async (req, res) => {
    try {
        const { name, username, email, password, avatar, background } = req.body;

        if (!name || !username || !email || !password || !avatar || !background) {
            res.status(400).send({ message: "Submit all fields to register" })
        }

        const user = await userService.createUser(req.body);

        if (!user) {
            return res.status(400).send({ message: "Error creating user" })
        }

        res.status(201).send({ message: "User created successfully", user: { id: user._id, name, username, email, avatar, background } })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const findAllUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();

        if (users.lenght === 0) {
            res.status(400).send({ message: "There's no registered users." })
        }

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const findUser = async (req, res) => {
    try {
        const id = req.id;

        const user = await User.findById(id);

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.id;
        const { name, username, email, password, avatar, background } = req.body

        if (!name && !username && !email && !password && !avatar && !background) {
            res.status(400).send({ message: "Submit at least one field for update" })
        }

        const user = req.user;

        const response = await userService.updateUserService(id, req.body);

        if (!response) {
            return res.status(400).send({ message: "Something went wrong, please try again" })
        }

        res.send({ message: "Successfully updated user.", user });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.id;

        const user = req.user;

        const response = await userService.deleteUserService(id);

        if (!response) {
            return res.status(400).send({ message: "Something went wrong, please try again." })
        }

        res.send({ message: "User successfully deleted.", user })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export default { create, findAllUsers, findUser, updateUser, deleteUser };