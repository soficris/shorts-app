const User = require('./userModel');
const Video = require('../video/videoModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const followService = require("../follow/followService");

async function registerUser(username, email, password, fullName) {
    const emailExists = await User.findOne({ where: { email } });
    const usernameExists = await User.findOne({ where: { username } });
    if (emailExists || usernameExists) {
        throw new Error('Este e-mail ou usuário já está cadastrado.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName
    });
    return newUser;
}

async function loginUser(login, password) {
    const user = await User.findOne({
        where: {
            [Op.or]: [{ email: login }, { username: login }]
        }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('E-mail/Usuário ou senha incorretos.');
    }
    return user;
}

async function getUserProfile(userId) {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture', 'followersCount',
            'followingCount', 'videosCount']
    });
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    return user;
}

async function updateUserProfile(userId, fullName, bio, newProfilePictureFilename) {
    const updateData = { fullName, bio };
    let oldProfilePicture = null;

    if (newProfilePictureFilename) {
        const oldUser = await User.findByPk(userId);
        if (oldUser && oldUser.profilePicture && oldUser.profilePicture !== 'default-profile.png') {
            oldProfilePicture = oldUser.profilePicture;
        }
        updateData.profilePicture = newProfilePictureFilename;
    }

    await User.update(updateData, { where: { id: userId } });

    if (oldProfilePicture) {
        const oldProfilePicPath = path.join(__dirname, '../../public/uploads/profiles', oldProfilePicture);
        fs.unlink(oldProfilePicPath, (err) => {
            if (err) console.error('Erro ao apagar foto de perfil antiga:', err);
            else console.log('Foto de perfil antiga apagada:', oldProfilePicPath);
        });
    }

    return this.getUserProfile(userId);
}

async function getPublicProfile(username) {
    const user = await User.findOne({
        where: { username },
        include: [{
            model: Video,
            attributes: ["id", "title", "thumbnailPath", "views"],
            order: [["createdAt", "DESC"]]
        }],
        attributes: ["id", "username", "fullName", "bio", "profilePicture", "followersCount", "followingCount", "videosCount"]
    });
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    return user;
}

async function getFollowStatusForUser(currentUserId, profileUserId) {
    if (!currentUserId || !profileUserId) {
        return { isFollowing: false };
    }
    return await followService.getFollowStatus(currentUserId, profileUserId);
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getPublicProfile, 
    getFollowStatusForUser
};