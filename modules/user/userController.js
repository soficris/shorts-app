const userService = require("./userService");
const Video = require("../video/videoModel"); // Ainda necessário para include no renderPublicProfile

exports.register = async (req, res) => {
    const { username, email, password, confirmPassword, fullName } = req.body;

    try {
        if (password !== confirmPassword) {
            req.flash("error", "As senhas não coincidem.");
            return res.redirect("/register");
        }

        await userService.registerUser(
            username,
            email,
            password,
            fullName
        );

        req.flash("success", "Conta criada com sucesso! Faça seu login.");
        res.redirect("/login");

    } catch (error) {
        console.error(error);

        req.flash(
            "error",
            error.message || "Erro ao criar conta. Verifique os dados e tente novamente."
        );

        res.redirect("/register");
    }
};

exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;

        const user = await userService.loginUser(login, password);
        const userData = await userService.getUserProfile(user.id);

        req.session.user = userData;

        res.redirect("/feed");

    } catch (error) {
        console.error(error);

        req.flash(
            "error",
            error.message || "Ocorreu um erro ao tentar entrar."
        );

        res.redirect("/login");
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};

exports.getProfile = async (userId) => {
    try {
        return await userService.getUserProfile(userId);

    } catch (error) {
        console.error(error);
        throw new Error("Erro ao buscar perfil do usuário.");
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, bio } = req.body;

        const userId = req.session.user.id;

        const newProfilePictureFilename = req.file
            ? req.file.filename
            : null;

        const updatedUser = await userService.updateUserProfile(
            userId,
            fullName,
            bio,
            newProfilePictureFilename
        );

        req.session.user = updatedUser;

        req.flash("success", "Perfil atualizado com sucesso!");

        res.redirect("/profile/edit");

    } catch (error) {
        console.error(error);

        req.flash(
            "error",
            error.message || "Erro ao atualizar perfil."
        );

        res.redirect("/profile/edit");
    }
};

exports.renderPublicProfile = async (req, res) => {
    try {
        const username = req.params.username;

        const user = await userService.getPublicProfile(username);

        const isOwner =
            req.session.user &&
            req.session.user.id === user.id;

        res.render("profile", {
            title: `@${user.username} | Shortz-App`,
            profileUser: user,
            isOwner
        });

    } catch (error) {
        console.error("Erro ao carregar perfil público:", error);

        req.flash(
            "error",
            error.message || "Erro ao carregar o perfil. Tente novamente."
        );

        res.redirect("/feed");
    }
};