function checkEmail(email) {
    const re = /^(?=.{1,64}@)(?:("[^"\\]*(?:\\.[^"\\]*)*"@)|((?:[0-9a-z](?:\.(?!\.)|[-!#\$%&'\*\+\/=\?\^`\{\}\|~\w])*)?[0-9a-z]@))(?=.{1,255}$)(?:(\[(?:\d{1,3}\.){3}\d{1,3}\])|((?:(?=.{1,63}\.)[0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9])|((?=.{1,63}$)[0-9a-z][-\w]*))$/g;
    const result = re.test(email.toLowerCase());
    return result ? true : false;
};

function checkPhone(phone) {
    const regex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/g;
    const result = regex.test(phone);
    return result ? true : false;
};

function isNumeric(str) {
    const regex = /^\d+$/;
    const result = regex.test(str);
    return result ? true : false;
}