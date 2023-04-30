const transform = require('./../transform');

module.exports = class userTranform extends transform {

    transform(item , createToken = false) {
        this.createToken = createToken;
        return {
            'name' : item.name,
            'email' : item.email,
        }
    }

}