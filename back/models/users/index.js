const db = require("../../db")
const crypto = require("crypto")
const S  = require('sequelize');

class User extends S.Model {}

User.init({
    email: {
    type: S.STRING,
    validate: {
        isEmail: true,
        notEmpty: true
      }
  },
  password: {
    type: S.STRING,
    validate: {
        notEmpty: true
      }

  },
  firstName: {
    type: S.STRING,
    validate: {
        notEmpty: true
      }
    },
    lastName: {
    type: S.STRING,
    validate: {
        notEmpty: true
      }
    },
    status: {
        type: S.INTEGER,
        defaultValue: 1
    },   
    salt: {
    type: S.STRING, 
    }
}, {
  
  sequelize: db,
  modelName: 'User' 
});


User.addHook('beforeCreate', (user) => {
    user.salt = crypto.randomBytes(20).toString('hex');
    user.password = user.hashPassword(user.password);
  })
  
User.prototype.hashPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }
  
User.prototype.validPassword = function (password) {
    return this.password === this.hashPassword(password);
  }

module.exports = User