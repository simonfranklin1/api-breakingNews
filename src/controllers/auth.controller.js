import bcrypt from "bcryptjs";
import { generateToken, loginService } from "../services/auth.service.js";

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await loginService(email);

        if(!user) {
            return res.status(404).send({ message: "User or password not found"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).send({ message: "User or password not found"})
        }

        const token = generateToken(user._id);
        
        res.status(200).send({ message: "Login Successfull!", token})
    } catch (error) {
        res.status(500).send(error.message) 
    }
}

export default {
    login
}