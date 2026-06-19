// carrega os modelos
const User  = require('../modules/user/userModel');
const Video = require('../modules/video/videoModel');
const Like = require('../modules/like/likeModel'); 
const Comment = require('../modules/comment/commentModel');
const Follow = require('../modules/follow/followModel'); 

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

// Associações explícitas para o modelo Follow (útil para includes diretos)
Follow.belongsTo(User, { as: "Follower", foreignKey: "followerId" });
Follow.belongsTo(User, { as: "Following", foreignKey: "followingId" });