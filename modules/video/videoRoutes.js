var express = require("express");
var router = express.Router();
const videoController = require("./videoController");
const {uploadValidator} = require("./videoValidator"); 
const {isAuthenticated} = require("../../middlewares/auth");
const videoMulter = require("../../middlewares/videoMulter"); // Importa o Multer para vídeos

const asyncHandler = require("../../middlewares/asyncHandler");

router.get("/upload", isAuthenticated, videoController.renderUploadPage);

router.post("/upload", isAuthenticated, videoMulter.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
]), uploadValidator, asyncHandler(videoController.uploadVideo));

router.get("/video/:id/stream", isAuthenticated, asyncHandler(videoController.streamVideo));
router.get("/video/:id", isAuthenticated, asyncHandler(videoController.renderVideoPage));

module.exports = router; 