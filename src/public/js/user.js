$(document).ready(function(c) {
    function checkLogin() {
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if (user_token) {
            return;
            $.ajax({
                type: "POST",
                url: '/api/checkLogin',
                headers: {
                    'Authorization': user_token.token,
                },
                success: function(data) {
                    if (!data.message) {
                        window.localStorage.removeItem('user_token');
                        getToken();
                    }
                }
            });
        }
    }
    checkLogin();
    $('#login-form').submit(function(e) {
        e.preventDefault();

        var flag = false;
        var passwordHelp = this.querySelector('#passwordHelp');
        var pass = this.querySelector('input[type="password"]').value;
        var loginError = this.querySelector('.text-sm-center.text-danger');

        if (pass.length < 6 || pass.length > 16) {
            passwordHelp.textContent = "Nhập mật khẩu >= 6 và  <= 16 kí tự!";
            flag = false;
        } else {
            passwordHelp.textContent = "";
            flag = true;
        };
        if (!flag) return;

        $.ajax({
            type: "POST",
            url: '/api/login',
            data: $(this).serialize(),
            success: function(data) {
                if (!data.message) {
                    loginError.textContent = "Thông tin đăng nhập không đúng!";
                    return;
                }
                window.localStorage.setItem("user_token", encodeURIComponent(JSON.stringify(data)));
                //console.log(data)
                window.location.href = "/";
            }
        });
    });
    // get token
    getToken();

    function getToken() {
        var divName = $('#name-user-login');
        var divLogout = $('#name-user-logout');
        if (divName && divLogout) {

            var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
            if (user_token && user_token.name != null) {
                divName[0].innerHTML = `<a href="/profile/${user_token._slug}" class="text-white">${user_token.name}</a>`;
                divLogout[0].innerHTML = `<a href="/" class="text-white" ><i class="fas fa-sign-out-alt mr-2"></i>Đăng xuất</a>`;
            } else {
                divName[0].innerHTML = `
                <a href="#" data-toggle="modal" data-target="#exampleModal" class="text-white">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    Đăng nhập 
                </a>
                `;
                divLogout[0].innerHTML = `
    
                <a href="#" data-toggle="modal" data-target="#exampleModal2" class="text-white">
                <i class="fas fa-sign-out-alt mr-2"></i>Đăng kí </a>
                
                `;
            }
            divLogout.on('click', function() {
                window.localStorage.removeItem('user_token')
            })
        }
    }
});
$(document).ready(function() {
    reloadProfile();

    function reloadProfile() {
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if (!user_token && window.location.pathname.indexOf("profile") != (-1)) {
            window.location.href = "/";
        }
        if (user_token && window.location.pathname.indexOf("profile") != (-1)) {
            profileUser(user_token);
        }
    };

    function profileUser(user_token) {
        const inputFullName = document.getElementById("fulName");
        const inputPhone = document.getElementById("phoneNumber");
        const inputDate = document.getElementById("date");
        const inputCheckedMale = document.getElementById("male");
        const inputCheckedFemale = document.getElementById("female");
        return;
        $.ajax({
            type: "POST",
            url: '/api/getProfile',
            headers: {
                "Authorization": user_token.token
            },
            success: function(data) {
                inputFullName.value = data.fullname;
                inputPhone.value = data.phone;
                inputDate.value = data.dateOfBirth;
                if (data.gender == 'Nam') {
                    inputCheckedMale.checked = true;
                } else {
                    inputCheckedFemale.checked = true;
                }
            }
        });
    }
    const tabs = document.querySelectorAll(".tab-item");
    const panes = document.querySelectorAll(".tab-pane");

    const tabActive = document.querySelector(".tab-item.active");
    tabs.forEach((tab, index) => {
        const pane = panes[index];

        tab.onclick = function() {
            document.querySelector(".tab-item.active").classList.remove("active");
            document.querySelector(".tab-pane.active").classList.remove("active");

            this.classList.add("active");
            pane.classList.add("active");
        };
    });

    const formChangePass = $("#form-change-password");
    formChangePass.submit(function(e) {
        e.preventDefault();
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        $.ajax({
            type: "PUT",
            url: '/api/getProfile/changePassword',
            headers: {
                'Authorization': user_token.token,
            },
            data: $(this).serialize(),
            success: function(data) {
                if (data.message) {
                    alert('Cập nhật mật khẩu thành công, vui lòng đăng nhập lại!');
                    window.localStorage.removeItem('user_token');
                    window.location.href = "/";
                } else {
                    alert('Cập nhật mật khẩu thất bại!');
                }
            }
        });
    });
    //form-create-address
    const formCreateAddress = $("#form-create-address");
    formCreateAddress.submit(function(e) {
        e.preventDefault();
    })
});
$(document).ready(function(c) {
    getUser()

    function getUser() {
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if (!user_token && window.location.pathname.indexOf("payment") != (-1)) {
            window.location.href = "/";
        }
        if (!user_token) return;
        return;
        $.ajax({
            type: "POST",
            url: '/api/getProfile',
            headers: {
                "Authorization": user_token.token
            },
            success: function(data) {
                // console.log(data);
            }
        });
    };
    $(function() {
        // Multiple images preview in browser
        var imagesPreview = function(input, placeToInsertImagePreview) {
            if (input.files) {
                var filesAmount = (input.files.length > 3) ? 3 : input.files.length;
                if (input.files.length > 3) {
                    myFunction("Chỉ cho phép tối đa 3 ảnh.", "warning")
                }
                $(placeToInsertImagePreview).text("");
                for (i = 0; i < filesAmount; i++) {
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                    }

                    reader.readAsDataURL(input.files[i]);
                }
            }

        };

        $('#content-images').on('change', function() {
            imagesPreview(this, '.textarea-bottom .gallery');
        });
    });
    $(function() {
        var raiting = $('#noidung-danhgia');
        if (raiting) {
            var star = $(raiting).find('.star');
            star.click(function() {
                var star_list = $(star).find('span');
                var onStar = $(this).find("input").val();
                for (var i = 0; i < star_list.length; i++) {
                    if (i < onStar) {
                        $(star_list[i]).css("color", "orange");
                    } else {
                        $(star_list[i]).css("color", "#dee2e6");
                    }
                }
            });
        }
        var viewMore = $(".btn-view-more");
        if (viewMore) {
            var btn = $(viewMore).find("button");
            btn.click(function() {
                var css = $(".view-content").css("display");
                if (css !== "block") {
                    $(".view-content").css("display", "block");
                } else {
                    $(".view-content").css("display", "-webkit-box");
                }
            })
        }
    });
    (function() {
        var modal = $('#quen-mat-khau');
        if (modal) {
            modal.click(function() {
                var parent = $("#exampleModal").find('button[class="close"]');
                parent.click();
            })
        }
    })()
});