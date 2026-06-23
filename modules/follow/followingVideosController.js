const videoService = require("../video/videoService");
const asyncHandler = require("../../middlewares/asyncHandler");

exports.renderFollowingVideos = asyncHandler(async (req, res) => {
    const userId = req.session.user.id;
    const videos = await videoService.getVideosFromFollowing(userId);
    res.render("following-videos", { title: "Vídeos de Quem Você Segue", videos });
});