const videoService = require("./videoService");

const fs = require("fs");
const path = require("path");

exports.uploadVideo = async (req, res) => {
    try {
        const { title, description } = req.body;

        const userId = req.session.user.id;

        const videoFile = req.files.video
            ? req.files.video[0]
            : null;

        const thumbnailFile = req.files.thumbnail
            ? req.files.thumbnail[0]
            : null;

        await videoService.uploadVideo(
            title,
            description,
            videoFile,
            thumbnailFile,
            userId
        );

        req.flash("success", "Vídeo enviado com sucesso!");

        res.redirect("/feed");

    } catch (error) {
        console.error("Erro ao fazer upload do vídeo:", error);

        req.flash(
            "error",
            error.message || "Erro ao fazer upload do vídeo. Tente novamente."
        );

        res.redirect("/upload");
    }
};

exports.streamVideo = async (req, res) => {
    const videoId = req.params.id;

    try {
        const video = await videoService.streamVideo(videoId);

        const videoPath = path.join(
            __dirname,
            "../../public/uploads/videos",
            video.videoPath
        );

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;

        const range = req.headers.range;

        if (range) {
            const parts = range
                .replace(/bytes=/, "")
                .split("-");

            const start = parseInt(parts[0], 10);

            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;

            const chunksize = (end - start) + 1;

            const file = fs.createReadStream(videoPath, {
                start,
                end
            });

            const head = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4",
            };

            res.writeHead(206, head);

            file.pipe(res);

        } else {
            const head = {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
            };

            res.writeHead(200, head);

            fs.createReadStream(videoPath).pipe(res);
        }

    } catch (error) {
        console.error("Erro ao fazer streaming do vídeo:", error);

        res
            .status(500)
            .send(error.message || "Erro interno do servidor.");
    }
};

exports.getAllVideos = async () => {
    return await videoService.getAllVideos();
};

exports.renderVideoPage = async (req, res) => {
    const videoId = req.params.id;

    const currentUserId = req.session.user
        ? req.session.user.id
        : null;

    try {
        const { video, isLiked } =
            await videoService.getVideoDetails(
                videoId,
                currentUserId
            );

        res.render("video", {
            title: video.title,
            video,
            isLiked
        });

    } catch (error) {
        console.error("Erro ao carregar a página do vídeo:", error);

        req.flash(
            "error",
            error.message || "Erro ao carregar o vídeo. Tente novamente."
        );

        res.redirect("/feed");
    }
};