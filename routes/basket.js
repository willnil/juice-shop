const utils = require('../lib/utils')
const insecurity = require('../lib/insecurity')
const models = require('../models/index')
const challenges = require('../data/datacache').challenges

module.exports = function retrieveBasket () {
  return (req, res, next) => {
    const id = req.params.id
    models.Basket.findOne({ where: { id }, include: [{ model: models.Product, paranoid: false }] })
      .then(basket => {
        /* jshint eqeqeq:false */
        if (utils.notSolved(challenges.basketAccessChallenge)) {
          const user = insecurity.authenticatedUsers.from(req)
          if (user && id && id !== 'undefined' && id !== 'null' && user.bid != id) { // eslint-disable-line eqeqeq
            utils.solve(challenges.basketAccessChallenge)
          }
        }
        if (basket && basket.Products && basket.Products.length > 0) {
          for (let i = 0; i < basket.Products.length; i++) {
            basket.Products[i].name = req.__(basket.Products[i].name)
          }
        }
        res.json(utils.queryResultToJson(basket))
      }).catch(error => {
        next(error)
      })
  }
}
