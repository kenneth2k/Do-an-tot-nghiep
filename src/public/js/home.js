$(document).ready(function() {
    (function() {
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
        if (!user_token && window.location.pathname.indexOf("payment") != (-1)) {
            return window.location.href = "/";
        } else if (user_token && window.location.pathname.indexOf("payment") != (-1)) {
            if (listProd === null) {
                return window.location.href = "/";
            } else if (listProd.value.items.length < 1) {
                return window.location.href = "/";
            }
            $.ajax({
                type: "GET",
                url: '/api/getProfile',
                headers: {
                    "Authorization": user_token.token
                },
                success: function(data) {
                    $(".user__info-content-title a").attr("href", "/profile/" + data.slug);
                    $(".user__info-content-name h6").text(data.addresses.name);
                    $(".user__info-content-address p:first-child").text(data.addresses.address);
                    $(".user__info-content-address p span").text(data.addresses.phone);
                }
            });
        }
    })();
});
$(document).ready(function(event) {
            function loadProducts(products) {
                let xhtml = ``;
                let myProduct = (product) => {
                        return `
                    <div class="col-lg-3 col-md-4 col-sm-6 media-slide-0 pl-1 pr-1 product-men mt-5">
                        <div class="men-pro-item simpleCart_shelfItem">
                            <div class="men-thumb-item text-center">
                                <img height="130" src="/public/images/products/${product.colors[0].bigImg}" alt="*.jpg"
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