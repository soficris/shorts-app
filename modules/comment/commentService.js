const Comment = require("./commentModel");
const Video = require("../video/videoModel");
const User = require("../user/userModel");

async function addComment(videoId, userId, content) {
    if (!content || content.trim() === "") {
        throw new Error("O comentário não pode ser vazio.");
    }

    const comment = await Comment.create({
        content: content.trim(),
        userId,
        videoId
    });

    await Video.increment("commentsCount", {
        where: { id: videoId }
    });

    const newComment = await Comment.findByPk(comment.id, {
        include: [
            {
                model: User,
                attributes: [
                    "username",
                    "fullName",
                    "profilePicture"
                ]
            }
        ]
    });

    return newComment;
}

async function getCommentsByVideoId(videoId) {
    const comments = await Comment.findAll({
        where: { videoId },

        include: [
            {
                model: User,
                attributes: [
                    "username",
                    "fullName",
                    "profilePicture"
                ]
            }
        ],

        order: [["createdAt", "DESC"]]
    });

    return comments;
}

module.exports = {
    addComment,
    getCommentsByVideoId
};