//this to be replaced with db connection - FindOne
class UserModel {

    findUser(userNameFromClient) {
        //does schema - findOne call to the db
        const USERS = JSON.parse(process.env.USERS);
        const user = USERS.find((user) => user.userName === userNameFromClient);
        return user || {};
    }
}


module.exports = UserModel;
