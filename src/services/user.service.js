import User from "../models/User.js";

const createUser = (user) => User.create(user);
const getUsers = () => User.find();
const getUser = (id) => User.findById(id);
const updateUserService = (id, user) => User.findByIdAndUpdate(id, user);
const deleteUserService = (id) => User.findByIdAndDelete(id);

export default {
    createUser,
    getUsers,
    getUser,
    updateUserService,
    deleteUserService
}