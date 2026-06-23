const Like = require("./likeModel");
const Video = require("../video/videoModel");
const User = require("../user/userModel");

async function toggleLike(userId, videoId) {
    const [like, created] = await Like.findOrCreate({
        where: { userId, videoId },

        defaults: {
            userId,
            videoId
        }
    });

    if (!created) {
        await like.destroy();

        await Video.decrement("likesCount", {
            where: { id: videoId }
        });

        return {
            liked: false,
            message: "Unlike realizado com sucesso."
        };

    } else {
        await Video.increment("likesCount", {
            where: { id: videoId }
        });

        return {
            liked: true,
            message: "Like realizado com sucesso."
        };
    }
}

async function checkLikeStatus(userId, videoId) {
    const like = await Like.findOne({
        where: { userId, videoId }
    });

    return !!like;
}

async function getLikedVideos(userId) {
    const likedVideos = await Like.findAll({
        where: { userId }, include: [{
            model: Video,
            attributes: ["id", "title", "thumbnailPath", "views", "createdAt"],
            include: [{
                model: User,
                attributes: ["id", "username", "fullName", "profilePicture"]
            }]
        }],
        order: [["createdAt", "DESC"]]
    });
    return likedVideos.map(like => like.Video);
}

module.exports = {
    toggleLike,
    checkLikeStatus, 
    getLikedVideos
};