import News from "../models/News.js";

const createNews = (news) => News.create(news);

const getNews = (limit, offset) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

const countNews = () => News.countDocuments();

const getNewsById = (id) => News.findById(id).populate("user");

const searchNews = (title) => {
    return News.find({
        title: { $regex: `${title || ""}`, $options: "i" },
    }).sort({ _id: -1 }).populate("user");
};

const updateNews = (id, news) => News.findByIdAndUpdate(id, news);

const deleteNews = (id) => News.findByIdAndDelete(id);

const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

const findPostsByUserId = (id) => {
    return News.find({
        user: id
    }).sort({ _id: -1 }).populate("user")
};

const likeNewService = (id, userId) => {
    return News.findOneAndUpdate(
        { _id: id, "likes.userId": { $nin: [userId] } },
        { $push: { likes: { userId, createdAt: new Date() } } }
    )
}

const dislikeNewService = (id, userId) => {
    return News.findOneAndUpdate(
        { _id: id },
        { $pull: { likes: { userId } } }
    )
}

const commentService = (id, userId, comment) => {
    let idComment = Math.floor(Math.floor(Date.now() * Math.random())).toString();
    return News.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { idComment, userId, comment: comment.comment, createdAt: new Date() } } }
    )
}

const deleteCommentService = (id, userId, idComment) => {
    return News.findOneAndUpdate(
        { _id: id },
        { $pull: { comments: { userId, idComment }}}
    )
}

const updateCommentService = (id, userId, idComment, newComment) => {
    return News.findOneAndUpdate(
        { _id: id, },
        { $rename: { comments: { userId, idComment, comment: newComment }}}
    )
}

export {
    createNews,
    getNews,
    getNewsById,
    updateNews,
    deleteNews,
    countNews,
    topNewsService,
    searchNews,
    findPostsByUserId,
    likeNewService,
    dislikeNewService,
    commentService,
    deleteCommentService
}