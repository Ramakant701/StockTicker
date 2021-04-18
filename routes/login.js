const auth = require("../authenticate");

let express = require('express');
let router = express.Router();
/* GET home page. */
router.post('/', async (req, res, next) => {
    return res.json({message: 'Welcome'});
});

module.exports = router;
