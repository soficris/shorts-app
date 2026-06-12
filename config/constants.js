module.exports = {
    APP_NAME: 'Shorts-App',
    MAX_VIDEO_DURATION_SECONDS: 60,
    DEFAULT_PROFILE_PICTURE: 'default-profile.png',
    UPLOAD_PATHS: {
        VIDEOS: 'public/uploads/videos',
        COVERS: 'public/uploads/covers',
        PROFILES: 'public/uploads/profiles'
    },
    VALIDATION: {
    USERNAME_MIN: 3,
    USERNAME_MAX: 20,
    PASSWORD_MIN: 6,
    TITLE_MAX: 100,
    DESCRIPTION_MAX: 500,
    COMMENT_MAX: 280
    }  
};