import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema ({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    avatar: {
        type: String,
        require: true,
    },
    background: {
        type: String,
        require: true,
    }
})

UserSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User = model("User", UserSchema);

export default User;