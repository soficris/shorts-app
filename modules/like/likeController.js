const likeService = require("./likeService");
const asyncHandler = require("../../middlewares/asyncHandler");

exports.toggleLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.session.user.id;

    const result = await likeService.toggleLike(userId, videoId);
    res.status(result.liked ? 201 : 200).json(result);
});

exports.checkLikeStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.session.user.id;
    
    const liked = await likeService.checkLikeStatus(userId, videoId);
    res.status(200).json({ liked });
});