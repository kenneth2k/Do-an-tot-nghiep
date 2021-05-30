const randomToBetween = (min, max) => {
    return Math.floor(Math.random() * (Number.parseInt(max) - Number.parseInt(min))) + Number.parseInt(min);
};

function randomCharacter(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}
module.exports = {
    randomToBetween,
    randomCharacter
}