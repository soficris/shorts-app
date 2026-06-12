const videoService = require("./videoService");

const fs = require("fs");
const path = require("path");

const asyncHandler = require("../../middlewares/asyncHandler");

exports.uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.session.user.id;

    const videoFile = req.files.video
        ? req.files.video[0]
        : null;

    const thumbnailFile = req.files.thumbnail
        ? req.files.thumbnail[0]
        : null;

    // O express-validator valida campos de texto,
    // mas não a existência de arquivos.
    if (!videoFile || !thumbnailFile) {
        throw new Error(
            'Por favor, envie o vídeo e a capa.'
        );
    }

    await videoService.uploadVideo(
        title,
        description,
        videoFile,
        thumbnailFile,
        userId
    );

    req.flash('success', 'Vídeo enviado com sucesso!');
    res.redirect('/feed');
});

exports.streamVideo = asyncHandler(async (req, res) => {
    const { id: videoId } = req.params;

    const video = await videoService.streamVideo(videoId);

    const videoPath = path.join(
        __dirname,
        '../../public/uploads/videos',
        video.videoPath
    );

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range
            .replace(/bytes=/, '')
            .split('-');

        const start = parseInt(parts[0], 10);

        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;

        const chunkSize = end - start + 1;

        const file = fs.createReadStream(videoPath, {
            start,
            end
        });

        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        };

        res.writeHead(206, headers);
        file.pipe(res);
    } else {
        const headers = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };

        res.writeHead(200, headers);

        fs.createReadStream(videoPath).pipe(res);
    }
});

/**
 * Função auxiliar.
 * Não é um handler de rota.
 */
exports.getAllVideos = async () => {
    return await videoService.getAllVideos();
};

exports.renderVideoPage = asyncHandler(async (req, res) => {
    const { id: videoId } = req.params;

    const currentUserId = req.session.user
        ? req.session.user.id
        : null;

    const { video, isLiked } =
        await videoService.getVideoDetails(
            videoId,
            currentUserId
        );

    res.render('video', {
        title: video.title,
        video,
        isLiked
    });
});

exports.renderUploadPage = (req, res) => {
    res.render('upload', {
        title: 'Upload de Vídeo | Shortz-App'
    });
};