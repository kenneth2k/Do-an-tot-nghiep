$(document).ready(function(c) {
    function checkLogin() {
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if (user_token) {
            $.ajax({
                type: "GET",
                url: '/api/checkLogin',
                headers: {
                    'Authorization': user_token.token,
                },
                success: function(data) {
                    if (data.resetLogin) {
                        window.localStorage.removeItem('user_token');
                        getToken();
                        window.location.reload();
                    }
                }
            });
        }
    }
    // checkLogin();
    $("#login-form input[name='password']").prop('maxlength', '16');
    $('#login-form').submit(function(e) {
        e.preventDefault();

        var count = 0;
        var passwordHelp = this.querySelector('#passwordHelp');
        var pass = this.querySelector('input[type="password"]').value;
        var usernameHelp = this.querySelector('#usernameHelp');
        var username = this.querySelector('input[name="email"]').value;
        var loginError = this.querySelector('.text-sm-center.text-danger');

        if (pass.length < 6 || pass.length > 16) {
            passwordHelp.textContent = "Nhập mật khẩu >= 6 và  <= 16 kí tự!";
            count++;
        } else {
            passwordHelp.textContent = "";
        };
        if (!validateEmail(username)) {
            usernameHelp.textContent = "Email không đúng định dạng";
            count++;
        } else {
            usernameHelp.textContent = "";
        };
        if (count > 0) return;

        $.ajax({
            type: "POST",
            url: '/api/login',
            data: $(this).serialize(),
            success: function(data) {
                if (data.login) {
                    if (data.type === 'user') {
                        window.localStorage.setItem("user_token", encodeURIComponent(JSON.stringify(data)));
                        ShowToastMessage(data.message, "success");
                        setTimeout(function() {
                            window.location.reload();
                        }, 1500);
                    } else {
                        window.sessionStorage.setItem("user_token", encodeURIComponent(JSON.stringify(data)));
                        ShowToastMessage(data.message, "success");
                        setTimeout(function() {
                            window.location.href = "/admin";
                        }, 1500);
                    }
                } else {
                    return loginError.textContent = data.message;
                }
            }
        });
    });
    $("#form-change-profile").submit(function(e) {
        e.preventDefault();
        let name = $(this).find('input[name="fullName"]');
        let phone = $(this).find('input[name="phone"]');
        let email = $(this).find('input[name="email"]');
        let gender = $(this).find('input[name="gender"]:checked');
        let dateOfBirth = $(this).find('input[name="dateOfBirth"]');
        let count = 0;
        if (name.val().length < 4) {
            $(name).closest('.form-gp').find('small').text('Tên ít nhất 3 kí tự');
            count++;
        }
        if (!IsPhoneNumber(phone.val())) {
            count++;
            $(phone).closest('.form-gp').find('small').text('Số điện thoại không đúng định dạng');
        }
        if (gender.val() === undefined || gender.val() == '' || gender.val() == null) {
            count++;
            $(this).find('input[name="gender"]').closest('.form-gp').find('small').text('Vui lòng chọn giới tính');
        }
        if (dateOfBirth.val() == null || dateOfBirth.val() == '') {
            count++;
            $(dateOfBirth).closest('.form-gp').find('small').text('Tên ít nhất 3 kí tự');
        }

        if (count == 0) {
            $(this).find('.form-gp').closest('.form-gp').find('small').text('');
            var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
            if (user_token) {
                $.ajax({
                    type: "PUT",
                    url: '/api/updateProfile',
                    headers: {
                        'Authorization': user_token.token,
                    },
                    data: $(this).serialize(),
                    success: function(data) {
                        if (data.updated) {
                            ShowToastMessage(data.message, "success");
                        } else {
                            ShowToastMessage(data.message, "error");
                        }
                    }
                });
            }
        }
    });
    // validate form register
    (function($) {
        $.fn.inputFilter = function(inputFilter) {
            return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                }
            });
        };
    }(jQuery));

    function IsPhoneNumber(phone) {
        const regex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/g;
        const result = regex.test(phone);
        return result ? true : false;
    };

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    $("#register-form input[name='phone']").inputFilter(function(value) { return /^\d*$/.test(value); });
    $("#register-form input[name='phone']").prop('maxlength', '10');
    $("#register-form input[name='fullname']").prop('maxlength', '35');
    $("#register-form input[name='password']").prop('maxlength', '16');
    $("#register-form input[name='confirmPassword']").prop('maxlength', '16');
    $("#register-form").submit(function(e) {
        e.preventDefault();
        $(this).find("input").removeClass('is-invalid');
        $(this).find("input").removeClass('is-valid');
        $(this).find("input").addClass('is-valid');
        var count = 0;
        var name = $(this).find("input[name='fullname']");
        var email = $(this).find("input[name='email']");
        var phone = $(this).find("input[name='phone']");
        var address = $(this).find("input[name='address']");
        var password = $(this).find("input[name='password']");
        var confirmPassword = $(this).find("input[name='confirmPassword']");
        var acctive = $(this).find("input[name='acctive']");
        if (name.val().length < 3) {
            $(name).addClass('is-invalid');
            count++;
        }
        if (!validateEmail(email.val())) {
            $(email).addClass('is-invalid');
            count++;
        }
        if (!IsPhoneNumber(phone.val())) {
            $(phone).addClass('is-invalid');
            count++;
        }
        if (address.val().length < 10) {
            $(address).addClass('is-invalid');
            count++;
        }
        if (password.val().length < 6 || password.val().length > 16) {
            $(password).addClass('is-invalid');
            count++;
        }
        if (password.val() != confirmPassword.val() || (password.val() == confirmPassword.val() && password.val().length < 8)) {
            $(confirmPassword).addClass('is-invalid');
            count++;
        }
        if (!acctive[0].checked) {
            $(acctive).addClass('is-invalid');
            count++;
        }
        if (count === 0) {
            $.ajax({
                type: "POST",
                url: '/api/register',
                data: $(this).serialize(),
                success: function(data) {
                    if (data.register) {
                        $("#register-form").find("input").removeClass('is-invalid');
                        $("#register-form").find("input").removeClass('is-valid');
                        $("#register-form")[0].reset();
                        setTimeout(function() {
                            ShowToastMessage(data.message, "success");
                        }, 1000);
                    } else {
                        if (!data.userPhone) {
                            $(phone).addClass('is-invalid');
                            $(phone).parent().find('.invalid-feedback').text(data.messagePhone);
                        }
                        if (!data.userEmail) {
                            $(email).addClass('is-invalid');
                            $(email).parent().find('.invalid-feedback').text(data.messageEmail);
                        }
                    }
                }
            });
        }
    });
    $('#add-otp').click(function(e) {
        var email = $("#forgot-form").find("input[name='email']");
        $(email).removeClass('is-invalid');
        $(email).removeClass('is-valid');
        if (!validateEmail(email.val())) {
            $(email).addClass('is-invalid');
            $(email).parent().find('.invalid-feedback').text('Email không đúng định dạng');
        } else {
            $(email).addClass('is-valid');
            $.ajax({
                type: "POST",
                url: '/api/checkEmail',
                data: { email: email.val() },
                success: function(data) {
                    $('#forgot-form').find('.text-sm-center.text-danger').text(data.message);
                }
            });
        }
    });
    //nav bar clicked
    (function() {
        const li = function(menu) {
            return `
            <li class="nav-item bd-right mr-lg-2 mb-lg-0 mb-2">
                <a class="nav-link" href="/${menu.slug}">${menu.name}
                    <span class="sr-only">(current)</span>
                </a>
            </li>
            `
        }
        $.ajax({
            type: "GET",
            url: '/api/menu',
            success: function(data) {
                let cate = data.categories;
                let xhtml = ``;
                cate.forEach(menu => {
                    xhtml += li(menu);
                });
                $("#navbarSupportedContent").html(xhtml);
            }
        });
    })();
    // form forgot
    $("#forgot-form").submit(function(e) {
        e.preventDefault();
        var email = $("#forgot-form").find("input[name='email']");
        var otp = $("#forgot-form").find("input[name='otp']");
        $(this).find("input").removeClass('is-invalid');
        $(this).find("input").removeClass('is-valid');
        let count = 0;
        if (!validateEmail(email.val())) {
            $(email).addClass('is-invalid');
            $(email).parent().find('.invalid-feedback').text('Email không đúng định dạng');
            count++;
        }
        if (otp.val().length == 0) {
            $(otp).addClass('is-invalid');
            $(otp).parent().find('.invalid-feedback').text('Vui lòng nhập otp');
            count++;
        }
        if (count == 0) {
            $.ajax({
                type: "PUT",
                url: '/api/sendNewPassword',
                data: { email: email.val(), otp: otp.val() },
                success: function(data) {
                    $('#forgot-form')[0].reset();
                    $('#forgot-form').find('.text-sm-center.text-danger').text(data.message);
                }
            });
        }
    });
    //collapse detail products

    $("#collapse-raitings").click(function() {
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if (user_token) {
            $('#noidung-danhgia').collapse("toggle");
        } else {
            ShowToastMessage("Vui lòng đăng nhập để đánh giá sản phẩm!", "warning")
        }
    })

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

    $("#form-change-password").submit(function(e) {
        e.preventDefault();
        let count = 0;
        if ($(this).find("input[name='oldPassword']").val() == "") {
            ShowToastMessage("Vui lòng nhập mật khẩu cũ!", "error");
            count++;
        } else if ($(this).find("input[name='passwordNew']").val() == "") {
            ShowToastMessage("Vui lòng nhập mật khẩu mới!", "error");
            count++;
        } else if ($(this).find("input[name='passwordConfirm']").val() == "") {
            ShowToastMessage("Vui lòng nhập lại mật khẩu mới!", "error");
            count++;
        } else if ($(this).find("input[name='passwordConfirm']").val() != $(this).find("input[name='passwordNew']").val()) {
            ShowToastMessage("Nhập lại mật khẩu không đúng!", "error");
            count++;
        }
        if (count > 0) return;
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        $.ajax({
            type: "PUT",
            url: '/api/getProfile/changePassword',
            headers: {
                'Authorization': user_token.token,
            },
            data: $(this).serialize(),
            success: function(data) {
                if (data.changePassword) {
                    ShowToastMessage(data.message, "success");
                    window.localStorage.removeItem('user_token');
                    $("#form-change-password")[0].reset();
                } else {
                    ShowToastMessage(data.message, "error");
                }
            }
        });
    });
    // search on keyup
    function searchContents(products) {
        var xhtml = ``;
        var xhtmlContent = function(product) {
            return `
            <div class="search-item">
                <a href="/${product.categori}/${product.slug}">
                    <div class="item-img">
                        <img src="/public/images/products/${product.colors[0].bigImg}" alt="">
                    </div>
                    <div class="item-content">
                        <div class="item-content__name">
                            ${product.name}
                        </div>
                        <div class="item-content__price">
                            <div class="item-content__price-main">
                                <span class="item_price">${(new Intl.NumberFormat().format((product.price - (product.price*(product.sale/100)))))} <sup>đ</sup></span>
                            </div>
                            <div class="item-content__price-sale">
                            <del>${(new Intl.NumberFormat().format(product.price))}</del><sup>đ</sup>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `
        };
        for (let i = 0; i < products.length; i++) {
            xhtml += xhtmlContent(products[i]);
        }
        return xhtml;
    }
    // search input header
    $('.focus-input input').keyup(function() {
        if ($(this).val().length > 1) {
            $.ajax({
                type: "GET",
                url: '/api/search/' + $(this).val(),
                success: function(data) {
                    $(".search-content").html(searchContents(data.products));
                    $(".search-content").css("display", "block");
                }
            });
        } else {
            $(".search-content").css("display", "none");
        }
    });
    $('.focus-input input').blur(function() {
        setTimeout(function() {
            $(".search-content").css("display", "none");
        }, 500)
    });
    // payment success
    $("#payment-order").click(function() {
        let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
        if (!listProd) return;
        let cartItem = listProd.value.items;
        let products = [];
        cartItem.forEach((value, index) => {
            let obj = {
                slug: value.add,
                colorId: value.addColor,
                quantity: value.quantity
            };
            products.push(obj);
        });
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        $.ajax({
            type: "POST",
            url: '/payment/success',
            headers: {
                "Authorization": user_token.token
            },
            data: {
                products: products
            },
            success: function(data) {
                if (data.status === 200) {
                    window.localStorage.removeItem('PPminicarts');
                    $("#payment-succes").find('button[name="id"]').text(data._id);
                    $("#payment-succes").modal('show');
                }
            }
        });
    });
    $("#payment-succes").blur(function(e) {
        setTimeout(function() {
            window.location.href = '/';
        }, 500)
    });
});
$(document).ready(function(c) {
    $(".checkout-right-basket a").click(function(e) {
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if (!user_token) {
            e.preventDefault();
            ShowToastMessage("Vui lòng đăng nhập để thanh toán giỏ hàng!", "warning")
        }
    })
    $(function() {
        // Multiple images preview in browser
        var imagesPreview = function(input, placeToInsertImagePreview) {
            if (input.files) {
                var filesAmount = (input.files.length > 3) ? 3 : input.files.length;
                if (input.files.length > 3) {
                    ShowToastMessage("Chỉ cho phép tối đa 3 ảnh.", "warning")
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
            modal.click(function(e) {
                e.preventDefault();
                $("#exampleModal").modal('hide');
                setTimeout(function() {
                    $("#forgotpassword").modal('show');
                }, 500)
            })
        }
    })();

});