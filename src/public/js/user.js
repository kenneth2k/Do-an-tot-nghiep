$(document).ready(function (c) {

    var obj = {
        name: "Nguyễn Văn Trọng",
        remember: true,
        token:"&^ksjga@#$daglifa$"
    };
    // set token
    //window.localStorage.setItem("user_token", encodeURIComponent(JSON.stringify(obj)));
    // get token
    var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
    if(user_token && user_token.name != null){
        console.log(user_token)
    }
});