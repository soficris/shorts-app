const Like = require("./likeModel");
const Video = require("../video/videoModel");

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

module.exports = {
    toggleLike,
    checkLikeStatus
};