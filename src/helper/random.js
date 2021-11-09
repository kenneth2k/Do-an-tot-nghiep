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
};

function randomIdInDate() {
    var date = new Date(Date.now());
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate().toString();
    // 01, 02, 03, ... 10, 11, 12
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1).toString();
    // 1970, 1971, ... 2015, 2016, ...
    var yyyy = date.getFullYear().toString().substring(2);
    var character = randomCharacter(6).toString().toLocaleUpperCase();
    return (yyyy + MM + dd + character);
}
module.exports = {
    randomToBetween,
    randomCharacter,
    randomIdInDate
}