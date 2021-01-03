const Contato = require('../models/ContatoModel')

exports.index = function (req, res) {
    res.render('contato', {
        contato: {}
    })
}

exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('success', 'Contato registrado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}

exports.editIndex = async (req, res) => {
    if (!req.params.id) return res.render('404')

    const contato = await Contato.buscaPorId(req.params.id)
    if (!contato) return res.render('404')

    res.render('contato', { contato })
}

exports.edit = async function(req, res) {
    if (!req.params.id) return res.render('404')

    try {
        const contato = new Contato(req.body)
        await contato.edit(req.params.id)

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('success', 'Contato atualizado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch (error) {
        console.log(error);
        return res.render('404')
    }
}