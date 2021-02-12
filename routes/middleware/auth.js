module.exports = module.exports = {
    redirectOnAuthFail: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect('/login')
    },
    redirectOnAuthSuccess: function(req, res, next) {
      if (req.isAuthenticated()) {
        return res.redirect('/')
      }
      next()
    },
}
