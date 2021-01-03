const Login = require('../models/LoginModel')

exports.index = (req, res) => {
   // console.log(req.session.user);
   if(req.session.user) return res.render('login-logado')
    return res.render('login')
}
/** controller de cadastro **/
exports.register = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('back');
            });
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso.');
        req.session.save(function () {
            return res.redirect('back');
        });
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

/** controller de registro **/
exports.login = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('back');
            });
            return;
        }
 
        req.flash('success', 'Bem Vindo');

        /** craindo sessao do usuario **/
        req.session.user = login.user
        req.session.save(function () {
            return res.redirect('back');
        });
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}