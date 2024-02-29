import { Router } from "express"

const route = Router();
import userController from "../controllers/user.controller.js";
import { validateId, validateUser } from "../middlewares/global.middlewares.js"

route.post("/create", userController.create);
route.get("/", userController.findAllUsers);
route.get("/findById/:id", validateId, validateUser, userController.findUser);
route.patch("/update/:id", validateId, validateUser, userController.updateUser);
route.delete("/:id", validateId, validateUser, userController.deleteUser);

export default route