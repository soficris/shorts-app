const likeService = require("./likeService");

exports.toggleLike = async (req, res) => {
    const { videoId } = req.params;

    const userId = req.session.user.id;

    try {
        const result = await likeService.toggleLike(
            userId,
            videoId
        );

        res
            .status(result.liked ? 201 : 200)
            .json(result);

    } catch (error) {
        console.error("Erro ao alternar like:", error);

        res.status(500).json({
            message:
                error.message ||
                "Erro interno do servidor ao processar like."
        });
    }
};

exports.checkLikeStatus = async (req, res) => {
    const { videoId } = req.params;

    const userId = req.session.user.id;

    try {
        const liked = await likeService.checkLikeStatus(
            userId,
            videoId
        );

        res.status(200).json({ liked });

    } catch (error) {
        console.error(
            "Erro ao verificar status do like:",
            error
        );

        res.status(500).json({
            message:
                error.message ||
                "Erro interno do servidor ao verificar status do like."
        });
    }
};