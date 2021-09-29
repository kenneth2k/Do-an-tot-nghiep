//event-nav_bar_left 
(
    function() {
        var hide = document.querySelector('.modal-backdrop.fade.show');
        if (hide) {
            hide.onclick = function() {
                $('#myModal').modal('hide');
            }
        }
    }
)();
(
    function() {
        $(".list-group-item.nav-left.border-0").click(function(e) {
            // remove all class active
            $(".list-group-item.nav-left.border-0").removeClass("active");
            //auth
            let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
            // addclass active on this
            if ($(e.target).hasClass(".list-group-item")) {
                $(e.target).addClass('active');
            } else {
                $(e.target).closest('.list-group-item').addClass('active');
            }
            switch ($(this).data("manager")) {
                case 'home':
                    {
                        $.ajax({
                            url: '/admin/home',
                            type: "GET",
                            headers: {
                                "Authorization": token.token
                            },
                            beforeSend: function() {
                                showLoadingTable();
                            },
                            success: function() {
                                hideLoadingTable();
                            }
                        }).done(function(data) {
                            $("#table-role").html(loadTableHome(data));
                        });
                        break;
                    }
                case 'banner':
                    {
                        $.ajax({
                            url: '/admin/banner',
                            type: "GET",
                            headers: {
                                "Authorization": token.token
                            },
                            beforeSend: function() {
                                showLoadingTable();
                            },
                            success: function() {
                                hideLoadingTable();

                            }
                        }).done(function(data) {
                            renderTableBanner(data);
                            btnAddNew(formBanner);
                            btnDeleted(formBannerDeleted);
                            btnEditer(formBannerEditer);
                        });
                        break;
                    }
                case 'cart':
                    {
                        break;
                    }
                case 'product':
                    {
                        showLoadingTable();
                        setTimeout(function() {
                            loadTableProduct();
                            btnAddNew(formProduct);
                            btnDeleted(formProductDeleted);
                            btnEditer(formProductEditer);
                            hideLoadingTable();
                        }, 1000);
                        break;
                    }
                case 'raiting':
                    {
                        break;
                    }
                case 'warehouse':
                    {
                        break;
                    }
                case 'supplier':
                    {
                        break;
                    }
                case 'statistical':
                    {
                        break;
                    }

            }
        })
    }
)();
(
    function() {
        $(".list-group-item.nav-left.border-0").each(function(e) {
            if ($(this).data("manager") == 'home') {
                $(this).click();
            }
        })
    }
)();