const followService = require("./followService");
const asyncHandler = require("../../middlewares/asyncHandler");

exports.toggleFollow = asyncHandler(async (req, res) => {
    const followingId = req.params.userId;
    const followerId = req.session.user.id;
    const result = await followService.toggleFollow(followerId, followingId);
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf("json") > -1)) {
        return res.status(200).json({ success: true, status: result.status, message: result.message });
    } else {
        req.flash("success", result.message);
        res.redirect("back");
    }
});

exports.getFollowStatus = asyncHandler(async (req, res) => {
    const followingId = req.params.userId;
    const followerId = req.session.user ? req.session.user.id : null;
    const { isFollowing } = await followService.getFollowStatus(followerId, followingId);
    res.status(200).json({ isFollowing });
});

exports.renderFollowers = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const followers = await followService.getFollowers(userId);
    res.render("followers", { title: "Seguidores", followers });
});

exports.renderFollowing = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const following = await followService.getFollowing(userId);
    res.render("following", { title: "Seguindo", following });
});