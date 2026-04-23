const User = require('./userModel'); 
const bcrypt = require('bcryptjs'); 
const fs = require("fs"); 
const path = require("path"); 


exports.register = async (req, res) => {
    const { username, email, password, confirmPassword, fullName} = req.body; //pega os inputs do formulário de registro
    console.log("dados do formulário: ", username, email); 

    try{
        // 1 - verificar se as senhas coincidem
        if (password !== confirmPassword){
            req.flash('error', 'As senhas não coincidem'); //flash informa o usuario no front-end
            return res.direct('/register'); //não sair da pagina de cadastro
        }

        // 2- verificar se o usuario ou o email já existe no banco 
        const emailExists = await User.findOne({where: {email}}); // vai até a tabela user no bd e espera até encontrar um email igual
        const usernameExists = await User.findOne({where : {username}}); 
        if (emailExists || usernameExists){
            req.flash('error', 'Este email ou usuario já esta cadastrado'); 
            return res.redirect('/register'); // não sair da pagina de cadastro 
        }

        // 3 - já que o email e usarnam estão ok e as senhas batem, encriptar a senha 

        const salt = await bcrypt.genSalt(10); //gerar um salt para a senha (gera 10 letras aleatorias e armazena no salt)
        const hashedPassword = await bcrypt.hash(password, salt); //hashed gera a senha criptografada usando o salt e a senha original
        console.log(password, hashedPassword); 

        //4 - inserir o registro no banco de dados
        await User.create({
            username, 
            email, 
            password: hashedPassword,
            fullName
        })

        //5 - redirecionar o novo usuario para a pagina de login
        req.flash('sucess', 'Conta criada com sucesso! Faça seu login'); 
        res.redirect('/login');

    } catch (error){
        console.log(error); 
        req.flash('error', 'Erro ao criar conta. Tente novamente'); 
        res.redirect('/register'); 
    }
};

exports.login = async (req, res) => {
   try {
      const { login, password } = req.body; // login pode ser email ou username

      // 1. Buscar usuário por email OU username
      const user = await User.findOne({
         where: {
            [require('sequelize').Op.or]: [{ email: login }, { username: login }]
         }
      });

      // 2. Verificar se usuário existe e se a senha bate
      if (!user || !(await bcrypt.compare(password, user.password))) {
         req.flash('error', 'E-mail/Usuário ou senha incorretos.');
         return res.redirect('/login');
      }

      // 3. Criar a sessão do usuário
      const userData = await this.getProfile(user.id); 
      req.session.user = userData; //armazenar os dados do usuário na sessão para usar em outras partes do site

      // 4. Redirecionar para o feed
      res.redirect('/feed');

   } catch (error) {
      console.error(error);
      req.flash('error', 'Ocorreu um erro ao tentar entrar.');
      res.redirect('/login');
   }
};


exports.logout = (req, res) => {
   req.session.destroy(() => {
      res.redirect('/');
   });
};

// Busca o perfil do usuário pelo ID, retornando apenas os campos necessários para exibição 
exports.getProfile = async (userId) => {
    try {
        const user = await User.findByPk(userId, { //findByPk é um método do Sequelize para buscar um registro pelo ID primário
            attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture']
        });
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar perfil do usuário.');
    }
};

// Atualiza o perfil do usuário, incluindo a foto de perfil se fornecida
exports.updateProfile = async (req, res) => { 
    try {
        const { fullName, bio } = req.body;
        const userId = req.session.user.id;

        const updateData = { fullName, bio };

        // Se um arquivo foi enviado pelo Multer, ele estará em req.file
        if (req.file) {
            updateData.profilePicture = req.file.filename;
        }
        const oldUser = await User.findByPk(userId); 

        await User.update(updateData, { where: { id: userId } });
        //Se uma nova foto foi enviada e o usuario tinha uma foto anterior
        //apagar a foto antiga do sistema de arquivos 
        if(req.file && oldUser.profilePicture && oldUser.profilePicture !== 'default-profile.png') {
            const oldProfilePicPath = path.join(__dirname, '../../public/uploads/profile', oldUser.profilePicture); 
            fs.unlink(oldProfilePicPath, (err) => {
                if (err) console.error('Erro ao excluir foto de perfil antiga:', err);
                else console.log('Foto de perfil antiga apagada:', oldProfilePicPath); 
            }); 
        }


        const userData = await this.getProfile(userId); 
        req.session.user = userData; // Atualiza os dados do usuário na sessão

        req.flash('success', 'Perfil atualizado com sucesso!');
        res.redirect('/profile/edit');

    } catch (error) {
        console.error(error);
        req.flash('error', 'Erro ao atualizar perfil.');
        res.redirect('/profile/edit');
    }
};
