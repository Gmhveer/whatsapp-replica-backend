let express = require('express');
let { login } = require('../controller/userController');
let router = express.Router();

router.route('/login').post(login);
module.exports = router;