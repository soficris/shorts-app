const Video = require("./videoModel");
const User = require("../user/userModel");

exports.uploadVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.session.user.id;

        // Verifica se os arquivos foram enviados
        if (!req.files || !req.files.video || !req.files.thumbnail) {
            req.flash("error", "Por favor, envie o vídeo e a capa.");
            return res.redirect("/upload");
        }

        const videoFile = req.files.video[0];
        const thumbnailFile = req.files.thumbnail[0];

        // Cria o novo vídeo no banco de dados
        await Video.create({
            title,
            description,
            videoPath: videoFile.filename,
            thumbnailPath: thumbnailFile.filename,
            userId,
        });

        // Atualiza a contagem de vídeos do usuário
        await User.increment('videosCount', { where: { id: userId } });

        req.flash("success", "Vídeo enviado com sucesso!");
        res.redirect("/feed");
    } catch (error) {
        console.error("Erro ao fazer upload do vídeo:", error);
        req.flash("error", "Erro ao fazer upload do vídeo. Tente novamente.");
        res.redirect("/upload");
    }
};