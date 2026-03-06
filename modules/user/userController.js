const User = require('./userModel'); 
const bcrypt = require('bcryptjs'); 


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
