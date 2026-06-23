// carrega os modelos
const User  = require('../modules/user/userModel');
const Video = require('../modules/video/videoModel');
const Like = require('../modules/like/likeModel'); 
const Comment = require('../modules/comment/commentModel');
const Follow = require('../modules/follow/followModel'); 
const Playlist = require('../modules/playlist/playlistModel');
const PlaylistVideo = require('../modules/playlist/playlistVideoModel'); 

// descreve as associações
User.hasMany(Video,   { foreignKey: 'userId' });
Video.belongsTo(User, { foreignKey: 'userId' });

// Associações para Likes
User.hasMany(Like,    { foreignKey: 'userId' });
Like.belongsTo(User,  { foreignKey: 'userId' });
Video.hasMany(Like,   { foreignKey: 'videoId' });
Like.belongsTo(Video, { foreignKey: 'videoId' });

// Associações para Comments
User.hasMany(Comment,    { foreignKey: 'userId' });
Comment.belongsTo(User,  { foreignKey: 'userId' });
Video.hasMany(Comment,   { foreignKey: 'videoId' });
Comment.belongsTo(Video, { foreignKey: 'videoId' });

// Associações para Seguidores (Self-referencing)
User.belongsToMany(User, { as: "Following", through: Follow, foreignKey: "followerId" }); // Um usuário pode seguir muitos outros usuários
User.belongsToMany(User, { as: "Followers", through: Follow, foreignKey: "followingId" }); // Um usuário pode ser seguido por muitos outros usuários

// Associações explícitas para o modelo Follow
Follow.belongsTo(User, { as: "Follower", foreignKey: "followerId" });
Follow.belongsTo(User, { as: "Following", foreignKey: "followingId" });

// Associações para Playlists 
User.hasMany(Playlist, { foreignKey: "userId" });
Playlist.belongsTo(User, { foreignKey: "userId" });

Playlist.belongsToMany(Video, { through: PlaylistVideo, foreignKey: "playlistId" });
Video.belongsToMany(Playlist, { through: PlaylistVideo, foreignKey: "videoId" });

// Associações explícitas para o modelo PlaylistVideo 
PlaylistVideo.belongsTo(Playlist, { foreignKey: "playlistId" });
PlaylistVideo.belongsTo(Video, { foreignKey: "videoId" });