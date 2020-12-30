const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {

  constructor(body) {
    this.body = body
    this.errors = []
    this.user = null
  }

  /** pecorre as chaves e verifica se e string **/
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = ''
      }
    }

    /** campos a serem salvos **/
    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }

  /** metodo que valida os campos **/
  valid() {
    /** validacao de email **/
    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail invalido')

    /** validacao senha **/
    if (this.body.password.length < 4 || this.body.password.length > 8) {
      this.errors.push('Senha precisa ter no minimo 4 e no maximo 8 caracteres')
    }
  }

  /** verifica se usuario ja existe **/
  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email })
    if ( user ) this.errors.push('E-mail ja cadastrado!')
  }

  /** registra usuario **/
  async register() {
    this.valid()
    if (this.errors.length > 0) return

    await this.userExists()
    if (this.errors.length > 0) return

    try {
      /**cria hash para senha **/
      const salt = bcryptjs.genSaltSync()
      this.body.password = bcryptjs.hashSync(this.body.password, salt)

      /** salva no banco **/
      const salve = this.user = await LoginModel.create(this.body)
    } catch (error) {
      console.log(error + 'arquivo model');
    }
  }
}

module.exports = Login;
