const multer = require("multer");
const path = require("path");

// Configuração de armazenamento para vídeos e thumbnails
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") {
      cb(null, "public/uploads/videos/");
    } else if (file.fieldname === "thumbnail") {
      cb(null, "public/uploads/covers/");
    } else {
      cb(new Error("Campo de arquivo desconhecido"), false);
    }
  },
  filename: (req, file, cb) => {
    // Gera um nome único para o arquivo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Concatena o nome do campo, o sufixo único e a extensão original
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Filtro para aceitar apenas vídeos e imagens
const videoFileFilter = (req, file, cb) => {
  if (file.fieldname === "video" && file.mimetype.startsWith("video/")) {
    cb(null, true); // Aceita arquivos de vídeo
  } else if (file.fieldname === "thumbnail" && file.mimetype.startsWith("image/")) {
    cb(null, true); // Aceita arquivos de imagem para a capa
  } else {
    cb(new Error("Tipo de arquivo inválido. Apenas vídeos e imagens são permitidos."), false);
  }
};

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // Limite de 100MB para vídeos 
  },
});

module.exports = uploadVideo;