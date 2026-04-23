const multer = require('multer');
const path = require('path'); 

//Configuração de onde e como salvar os arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb = callback, função que recebe o caminho onde o arquivo deve ser salvo
        cb(null, 'public/uploads/profiles/'); //Pasta onde os arquivos serão salvos
    }, 
    filename: (req, file, cb) => {
        //Nome único: id usuario + timestamp + extensão do original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); //Gera um sufixo único para evitar conflitos de nomes
        
        cb (null,`profile-${req.session.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`); 
    }

}); 

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

// Configuração do Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 4 * 1024 * 1024 } // Limite de 4MB (conforme RN-003)
});

module.exports = upload; // Exporta o middleware para ser usado nas rotas que precisam de upload de imagem de perfil