const Follow = require("./followModel");
const User = require("../user/userModel");
const { Op } = require("sequelize");

async function toggleFollow(followerId, followingId) {
    if (followerId === followingId) {
        throw new Error("Você não pode seguir a si mesmo.");
    }
    const [follow, created] = await Follow.findOrCreate({
        where: { followerId, followingId },
        defaults: { followerId, followingId }
    });
    if (!created) {
        // Se já existia, remove o follow (unfollow)
        await follow.destroy();
        await User.decrement("followersCount", { where: { id: followingId } });
        await User.decrement("followingCount", { where: { id: followerId } });
        return { status: "unfollowed", message: "Deixou de seguir com sucesso." };
    } else {
        // Se foi criado, adiciona o follow
        await User.increment("followersCount", { where: { id: followingId } });
        await User.increment("followingCount", { where: { id: followerId } });
        return { status: "followed", message: "Seguindo com sucesso." };
    }
}

async function getFollowStatus(followerId, followingId) {
    if (!followerId || !followingId) {
        return { isFollowing: false };
    }
    const follow = await Follow.findOne({
        where: { followerId, followingId }
    });
    return { isFollowing: !!follow };
}

async function getFollowers(userId) {
    const user = await User.findByPk(userId, {
        include: [{
            model: User,
            as: "Followers",
            attributes: ["id", "username", "fullName", "profilePicture"]
        }]
    });
    return user ? user.Followers : [];
}

async function getFollowing(userId) {
    const user = await User.findByPk(userId, {
        include: [{
            model: User,
            as: "Following",
            attributes: ["id", "username", "fullName", "profilePicture"]
        }]
    });
    return user ? user.Following : [];
}

module.exports = {
    toggleFollow,
    getFollowStatus,
    getFollowers,
    getFollowing
};