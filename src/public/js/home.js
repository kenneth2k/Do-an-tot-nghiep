$(document).ready(function() {
    (function() {
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if (!user_token && window.location.pathname.indexOf("payment") != (-1)) {
            return window.location.href = "/";
        } else {
            $.ajax({
                type: "GET",
                url: '/api/getProfile',
                headers: {
                    "Authorization": user_token.token
                },
                success: function(data) {
                    console.log("data", data);
                }
            });
        }
    })();
});

$(document).ready(function() {
    const carouselInner = document.querySelector('#banner-carousel-inner');
    const menu = document.querySelector('#nav-header-bottoms');
    if (carouselInner) {
        carouselInner.innerHTML = `
        <div class="carousel-item item1 active">
            <div class="container">
                <div class="w3l-space-banner">
                    <div class="carousel-caption p-lg-5 p-sm-4 p-3">
                        <p>Nhận 10% Hoàn tiền</p>
                        <h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">
                        <span>Giảm giá Ngay hôm nay</span>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="carousel-item item2">
            <div class="container">
                <div class="w3l-space-banner">
                    <div class="carousel-caption p-lg-5 p-sm-4 p-3">
                        <p>Tai nghe không dây Tiên tiến</p>
                        <h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">
                        <span>Giảm giá Ngay hôm nay</span>
                        </h3>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="carousel-item item3">
            <div class="container">
                <div class="w3l-space-banner">
                    <div class="carousel-caption p-lg-5 p-sm-4 p-3">
                        <p>Nhận 10% Hoàn tiền</p>
                        <h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">
                        <span>Giảm giá Ngay hôm nay</span>
                        </h3>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="carousel-item item4">
            <div class="container">
                <div class="w3l-space-banner">
                    <div class="carousel-caption p-lg-5 p-sm-4 p-3">
                        <p>Mua ngay Giảm 40%</p>
                        <h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">
                            <span>Giảm giá Ngay hôm nay</span>
                        </h3>
                        
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    if (menu) {
        var href = window.location.pathname == '/' ? '/' : (window.location.pathname).replace('/', '');
        return;
        $.ajax({
            type: "GET",
            url: '/api/menu',
            success: function(data) {
                var menus = data.menus;
                var eleMenus = ``;
                menus.forEach(function(val) {
                    eleMenus += `<li class="nav-item nav-border-relative ${(val.slug == href)? 'active': ''} mr-lg-2 mb-lg-0 mb-2">
                                        <a class="nav-link" href="${val.slug}">${val.name}
                                        </a>
                                        <ul class="list-group group-show">
                                            <li class="list-group-item "><a class="nav-link href="/>">left1</a></li>
                                            <li class="list-group-item "><a class="nav-link href="/">left</a></li>
                                        </ul>
                                    </li>`;
                })
                menu.innerHTML = eleMenus;
            }
        })
    }
});
$(document).ready(function(event) {
            function loadProducts(products) {
                let xhtml = ``;
                let myProduct = (product) => {
                        return `
                    <div class="col-lg-3 col-md-4 col-sm-6 media-slide-0 pl-1 pr-1 product-men mt-5">
                        <div class="men-pro-item simpleCart_shelfItem">
                            <div class="men-thumb-item text-center">
                                <img src="/public/images/products/${product.colors[0].bigImg}" alt="*.jpg"
                                    width="100%">
                                <div class="men-cart-pro">
                                    <div class="inner-men-cart-pro">
                                        <a href="/${product.categori}/${product.slug}"
                                            class="link-product-add-cart">Xem
                                            thông
                                            tin</a>
                                    </div>
                                </div>
                            </div>
                            <div class="item-info-product text-center border-top mt-4">
                                <h4 class="pt-1">
                                    <a href="/${product.categori}/${product.slug}">${product.name}</a>
                                </h4>
                                <div class="info-product-price my-2">
                                    <span class="item_price">${(new Intl.NumberFormat().format((product.price - (product.price*(product.sale/100)))))} <sup>đ</sup></span>
                                    ${(product.sale == 0)?``:`<del>${(new Intl.NumberFormat().format(product.price))}</del><sup>đ</sup>`}
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
        };
        products.map((product) => {
            xhtml += myProduct(product);
        });
        return xhtml;
    };
});