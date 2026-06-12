const commentService = require("./commentService");
const asyncHandler = require("../../middlewares/asyncHandler"); 

exports.addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.session.user.id;

    const newComment = await commentService.addComment(videoId, userId, content);
    res.status(201).json({ message: "Comentário adicionado com sucesso!", comment: newComment });
});

exports.getComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    const comments = await commentService.getCommentsByVideoId(videoId);
    res.status(200).json({ comments });
});