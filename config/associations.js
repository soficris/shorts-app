// carrega os modelos
const User  = require('../modules/user/userModel');
const Video = require('../modules/video/videoModel');

// descreve as associações
User.hasMany(Video,   { foreignKey: 'userId' });
Video.belongsTo(User, { foreignKey: 'userId' });