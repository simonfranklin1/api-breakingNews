import { createNews, getNews, getNewsById, deleteNews, updateNews, countNews, topNewsService, searchNews, findPostsByUserId, likeNewService, dislikeNewService, commentService, deleteCommentService } from "../services/news.service.js";

const getAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) {
            limit = 5
        }

        if (!offset) {
            offset = 0
        }

        const news = await getNews(limit, offset);
        const total = await countNews();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const newUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previews = offset - limit < 0 ? null : offset - limit;

        if (!news) {
            return res.status(400).send({ message: "There's no news registered" })
        }

        res.status(200).send({
            newUrl,
            previewsUrl: previews,
            results: news.map(newsItem => ({
                id: newsItem._id,
                title: newsItem.title,
                text: newsItem.text,
                banner: newsItem.banner,
                likes: newsItem.likes,
                comments: newsItem.comments,
                creator: {
                    name: newsItem.user.name,
                    username: newsItem.user.username,
                    id: newsItem.user._id,
                    avatar: newsItem.user.avatar
                }
            })),
            limit,
            offset,
            total
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body;

        if (!title || !text || !banner) {
            return res.status(400).send({ message: "Submit all fields for registration" })
        }

        const response = await createNews({
            title,
            text,
            banner,
            user: req.userId
        });

        res.status(201).send({ message: "News created successfully" })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const get = async (req, res) => {
    try {
        const id = req.params.id;

        const news = await getNewsById(id);

        if (!news) {
            return res.status(404).send({ message: "Not found" })
        }

        res.status(200).send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                creator: {
                    name: news.user.name,
                    username: news.user.username,
                    id: news.user._id,
                    avatar: news.user.avatar
                }
            }
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const topNews = async (req, res) => {
    try {
        const news = await topNewsService();

        if (!news) {
            return res.status(400).send({ message: "There's no registered post!" })
        }

        res.status(200).send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                creator: {
                    name: news.user.name,
                    username: news.user.username,
                    id: news.user._id,
                    avatar: news.user.avatar
                }
            }
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        console.log(title)

        if (!title) {
            return res.status(400).send({ message: "Type something to search!" });
        }

        const news = await searchNews(title);

        if (news.length === 0) {
            return res.status(404).send({ message: "Not found" })
        }

        res.status(200).send({
            results: news.map(newsItem => ({
                id: newsItem._id,
                title: newsItem.title,
                text: newsItem.text,
                banner: newsItem.banner,
                likes: newsItem.likes,
                comments: newsItem.comments,
                creator: {
                    name: newsItem.user.name,
                    username: newsItem.user.username,
                    id: newsItem.user._id,
                    avatar: newsItem.user.avatar
                }
            })),
        })

    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id;

        const news = await getNewsById(id);

        if (!news) {
            return res.status(400).send({ message: "Submit all fields for registration" })
        }

        if (String(news.user._id) !== String(req.userId)) {
            return res.status(401).send({ message: "You can't update this post!" })
        }

        const response = await updateNews(id, req.body);

        if (!response) {
            return res.status(400).send({ message: "Something went wrong, please try again" })
        }

        res.status(200).send({ message: "News updated successfully", news: req.body })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const remove = async (req, res) => {
    try {
        const id = req.params.id;

        const news = await getNewsById(id);

        if (!news) {
            return res.status(404).send({ message: "News not found" })
        }

        if (String(news.user._id) !== String(req.userId)) {
            return res.status(401).send({ message: "You can't delete this post!" })
        }

        const response = await deleteNews(id);

        if (!response) {
            return res.status(400).send({ message: "Something went wrong, please try again" })
        }

        res.status(200).send({ message: "News deleted succesfully", })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const getPostByUserId = async (req, res) => {
    try {
        const id = req.params.id;

        const news = await findPostsByUserId(id);

        if (!news || news.length === 0) {
            res.status(404).send({ message: "Not Found!" })
        }

        res.status(200).send({
            results: news.map(newsItem => ({
                id: newsItem._id,
                title: newsItem.title,
                text: newsItem.text,
                banner: newsItem.banner,
                likes: newsItem.likes,
                comments: newsItem.comments,
                creator: {
                    name: newsItem.user.name,
                    username: newsItem.user.username,
                    id: newsItem.user._id,
                    avatar: newsItem.user.avatar
                }
            }))
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const likeNews = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;

        const newsLiked = await likeNewService(id, userId);

        if (!newsLiked) {
            await dislikeNewService(id, userId);
            res.status(200).send({ message: "Like successfull removed." })
        }

        res.status(200).send({ message: "Liked post successfully." })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const commentNews = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const comment = req.body;

        if(!comment) {
            return res.status(400).send({ message: "Write a message to comment"})
        }

        const response = await commentService(id, userId, comment);

        if(!response) {
            return res.status(400).send({ message: "Something went wrong"})
        }

        res.status(200).send({ message: "Comment registered successfully!", news: response})
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const deleteComment = async(req, res) => {
    try {
        const { id, idComment } = req.params;
        const userId = req.userId;

        const news = await getNewsById(id);

        if(!news) return res.status(400).send({ message: "Something went wrong, please try again"});

        const commentFinder = news.comments.find((comment) => comment.idComment === idComment);

        console.log(commentFinder.userId);
        console.log(userId)

        if(commentFinder.userId.toString() !== userId.toString()) {
            return res.status(400).send({ message: "You can't delete this comment"});
        }

        const response = await deleteCommentService(id, userId, idComment);

        res.status(200).send({ message: "Comment deleted successfully!", news: response});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export {
    getAll,
    create,
    get,
    update,
    remove,
    topNews,
    searchByTitle,
    getPostByUserId,
    likeNews,
    commentNews,
    deleteComment
}