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
            // addclass active on this
            if ($(e.target).hasClass(".list-group-item")) {
                $(e.target).addClass('active');
            } else {
                $(e.target).closest('.list-group-item').addClass('active');
            }
            switch ($(this).data("manager")) {
                case 'home':
                    {
                        showLoadingTable();
                        setTimeout(function() {
                            $("#table-role").html(loadTableHome());
                            hideLoadingTable();
                        }, 1000);
                        break;
                    }
                case 'banner':
                    {
                        showLoadingTable();
                        setTimeout(function() {
                            renderTableBanner();
                            btnAddNew(formBanner);
                            btnDeleted(formBannerDeleted);
                            btnEditer(formBannerEditer);
                            hideLoadingTable();
                        }, 1000);
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
        $("#table-role").html(loadTableHome());
        hideLoadingTable();
        // loadTableProduct();
        // btnAddNew(formProduct);
    }
)();