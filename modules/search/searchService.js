const { Op } = require("sequelize");
const Video = require("../video/videoModel");
const User = require("../user/userModel");

class SearchService {
    async searchVideos(query) {
        if (!query) return [];
        const videos = await Video.findAll({
            where: {
                title: { [Op.like]: `%${query}%` }
            },
            include: [{
                model: User,
                attributes: ["id", "username", "fullName", "profilePicture"]
            }],
            order: [["createdAt", "DESC"]],
            limit: 10
        });
        return videos;

    } 
    
    async searchUsers(query) {
        if (!query) return [];
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.like]: `%${query}%` } },
                    { fullName: { [Op.like]: `%${query}%` } }
                ]
            },
            attributes: ["id", "username", "fullName", "profilePicture"],
            limit: 10
        });
        return users;
    }

    async globalSearch(query) {
        const videos = await this.searchVideos(query);
        const users = await this.searchUsers(query);
        return { videos, users };
    }
}

module.exports = new SearchService();