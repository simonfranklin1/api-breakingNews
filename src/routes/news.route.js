import { Router } from "express";
import { create, getAll, get, update, remove, topNews, searchByTitle, getPostByUserId, likeNews, commentNews, deleteComment } from "../controllers/news.controller.js";
import { validateAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAll);
router.get("/top", topNews);
router.get("/search", searchByTitle);

router.post("/create", validateAuth, create);

router.use(validateAuth);
router.get("/user", getPostByUserId);

router.get("/find/:id", validateAuth, get);

router.patch("/update/:id", validateAuth, update);

router.delete("/delete/:id", validateAuth, remove);

router.patch("/like/:id", validateAuth, likeNews);

router.patch("/comment/:id", validateAuth, commentNews);

router.patch("/comment/delete/:id/:idComment", validateAuth, deleteComment);

//router.patch("/comment/update/:id/:idComment", validateAuth, updateComment);


export default router