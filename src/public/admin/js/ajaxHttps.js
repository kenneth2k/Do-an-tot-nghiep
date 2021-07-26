const api = {
    post: function (href, info, callback) {
        var token = localStorage.getItem("admin-token");
        $.ajax({
            url: href,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            headers: {
                "Authorization": token
            },
            async: false,
            data: JSON.stringify(info),
            success: function (data) {
                callback(data)
            }
        })
    },
    get: function (href, callback) {
        var token = localStorage.getItem("admin-token");
        $.ajax({
            url: href,
            type: "GET",
            headers: {
                "Authorization": token
            },
            async: false,
            success: function (data) {
                callback(data)
            }
        })
    }
}