const bcrypt = require('bcrypt');
const atob = require('atob');
const UserModel = require('./models/User');
const userModel = new UserModel();

const auth = async (req, res, next) => {
    const {authorization} = req.headers;
    if (typeof authorization === 'string') {
        const tokenArr = authorization.split("Basic");
        const token = Array.isArray(tokenArr) && tokenArr.length > 1 && tokenArr[1].trim();
        if (token) {
            const userPass = atob(token).split(":");
            const userNameFromClient = userPass[0];
            const passwordFromClient = userPass[1];
            //session exists - authenticated - valid only from the same session - if browser/postman is closed - new session will be created
            if (req.session && req.session.userName === userNameFromClient && req.session.passwordFromClient === passwordFromClient) {
                next();
            } else {
                req.session.userName = "";
                req.session.permission = "";
                const {userName, password, permission} = userModel.findUser(userNameFromClient);
                if (userName) {
                    const authenticated = await bcrypt.compare(passwordFromClient, password);
                    if (authenticated) {
                        req.session.userName = userName;
                        req.session.passwordFromClient = passwordFromClient;
                        req.session.permission = permission;
                        next();
                    } else {
                        req.session.destroy();
                        res.sendStatus(401);
                    }
                } else {
                    res.sendStatus(401);
                }
            }
        } else {
            res.sendStatus(401);
        }
    }
};

module.exports = auth;
