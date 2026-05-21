const commentService = require("./commentService");

exports.addComment = async (req, res) => {
    const { videoId } = req.params;

    const { content } = req.body;

    const userId = req.session.user.id;

    try {
        const newComment =
            await commentService.addComment(
                videoId,
                userId,
                content
            );

        res.status(201).json({
            message: "Comentário adicionado com sucesso!",
            comment: newComment
        });

    } catch (error) {
        console.error(
            "Erro ao adicionar comentário:",
            error
        );

        res
            .status(
                error.message ===
                "O comentário não pode ser vazio."
                    ? 400
                    : 500
            )
            .json({
                message:
                    error.message ||
                    "Erro interno do servidor ao adicionar comentário."
            });
    }
};

exports.getComments = async (req, res) => {
    const { videoId } = req.params;

    try {
        const comments =
            await commentService.getCommentsByVideoId(
                videoId
            );

        res.status(200).json({ comments });

    } catch (error) {
        console.error(
            "Erro ao buscar comentários:",
            error
        );

        res.status(500).json({
            message:
                error.message ||
                "Erro interno do servidor ao buscar comentários."
        });
    }
};