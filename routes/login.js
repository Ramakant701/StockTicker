const auth = require("../authenticate");

var express = require('express');
var router = express.Router();
/* GET home page. */
router.post('/', async (req, res, next) => {
    return res.json({message: 'Welcome'});
});

module.exports = router;
