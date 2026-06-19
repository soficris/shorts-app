const Video = require("./videoModel");
const User = require("../user/userModel");
const { Op } = require("sequelize"); 
const Like = require("../like/likeModel");
const Follow = require("../follow/followModel");

const fs = require("fs");
const path = require("path");
const sequelize = require("sequelize");

async function uploadVideo(
    title,
    description,
    videoFile,
    thumbnailFile,
    userId
) {
    if (!videoFile || !thumbnailFile) {
        throw new Error("Por favor, envie o vídeo e a capa.");
    }

    const newVideo = await Video.create({
        title,
        description,
        videoPath: videoFile.filename,
        thumbnailPath: thumbnailFile.filename,
        userId,
    });

    await User.increment("videosCount", {
        where: { id: userId }
    });

    return newVideo;
}

async function streamVideo(videoId) {
    const video = await Video.findByPk(videoId);

    if (!video) {
        throw new Error("Vídeo não encontrado.");
    }

    await video.increment("views");

    return video;
}

async function getAllVideos() {
    const videos = await Video.findAll({
        include: [
            {
                model: User,
                attributes: [
                    "id",
                    "username",
                    "fullName",
                    "profilePicture"
                ]
            }
        ],
        order: [["createdAt", "DESC"]],
        limit: 20
    });

    return videos;
}

async function getFeedVideos(currentUserId = null, offset = 0, limit = 20) {
    let whereClause = {};
    let followedUserIds = [];

    if (currentUserId) {
        // Encontrar IDs dos usuários que o currentUserId segue
        const follows = await Follow.findAll({
            where: { followerId: currentUserId },
            attributes: ["followingId"]
        });
        followedUserIds = follows.map(follow => follow.followingId);
        if (followedUserIds.length > 0) {
            // Se segue alguém, prioriza vídeos desses usuários
            whereClause = { userId: { [Op.in]: followedUserIds } };
        }
    }

    // Primeiro, tenta buscar vídeos de usuários seguidos (se houver)
    let videos = await Video.findAll({
        where: whereClause,
        include: [{
            model: User,
            attributes: ["id", "username", "fullName", "profilePicture"]
        }],
        order: [["createdAt", "DESC"]],
        offset, limit
    });

    // Se não houver vídeos de seguidos ou se o usuário não segue ninguém, ou se não preencheu o limite, busca vídeos globais
    if (videos.length < limit && (currentUserId === null || followedUserIds.length === 0 || videos.length === 0)) {
        const globalVideosToFetch = limit - videos.length;
        const globalVideos = await Video.findAll({
            where: { ...whereClause, id: { [Op.notIn]: videos.map(v => v.id) } }, // Evita duplicatas
            include: [{
                model: User,
                attributes: ["id", "username", "fullName", "profilePicture"]
            }],
            order: [["createdAt", "DESC"]],
            offset: offset > 0 ? offset - videos.length : 0, // Ajusta o offset para buscar globalmente
            limit: globalVideosToFetch
        });
        videos = [...videos, ...globalVideos];
    }

    return videos;
}

async function getVideoDetails(videoId, currentUserId = null) {
    const video = await Video.findByPk(videoId, {
        include: [
            {
                model: User,
                attributes: [
                    "id",
                    "username",
                    "fullName",
                    "profilePicture"
                ]
            }
        ],

        attributes: {
            include: [
                [
                    sequelize.literal(
                        "(SELECT COUNT(*) FROM `likes` WHERE `likes`.`video_id` = `Video`.`id`)"
                    ),
                    "likesCount"
                ],

                [
                    sequelize.literal(
                        "(SELECT COUNT(*) FROM `comments` WHERE `comments`.`video_id` = `Video`.`id`)"
                    ),
                    "commentsCount"
                ]
            ]
        }
    });

    if (!video) {
        throw new Error("Vídeo não encontrado.");
    }

    let isLiked = false;

    if (currentUserId) {
        const existingLike = await Like.findOne({
            where: {
                userId: currentUserId,
                videoId
            }
        });

        isLiked = !!existingLike;
    }

    return {
        video,
        isLiked
    };
}

module.exports = {
    uploadVideo,
    streamVideo,
    getAllVideos,
    getVideoDetails,
    getFeedVideos 
};