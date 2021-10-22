$(document).ready(function(event) {
            function btnViewMore(total, page) {
                return `
                    <button type="button" data-page="${page}" class="btn btn-primary">Xem thêm ${total} điện thoại <svg
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-arrow-down" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                                </svg>
                            </button>
        `;
            };

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
    (function() {
        var page = $(this).find("button").data('page');
        var rangePrice = $("#range-between").find("a");
        var searchInput = $("#search-mutiple").find("input[name='search']");
        var manufacturer = $("#select-manufacturer").find("input[type=checkbox]");
        manufacturer.each(function(index){
            let path = window.location.pathname.replace('/', '');
            if($(this).val() == path){
                $(this).prop('checked', true);
            }
        });
        let clickedViewMore = (event)=>{
            let btn = $(event.target).closest('.view-more').find("button");
            handleSearchMutipleProduct(btn.data('page'), true);
        }
        $("#content-products").find(".view-more button").click(clickedViewMore);
        function handleSearchMutipleProduct(page = 1, append = false){
            let arrMF = [],
                price = {};
            let manufacturerChecked = $("#select-manufacturer").find("input[type=checkbox]:checked").toArray();
            let rangePriceActiveMin = $("#range-between").find("a[class='active']").data('min');
            let rangePriceActiveMax = $("#range-between").find("a[class='active']").data('max');
            price.min = rangePriceActiveMin;
            price.max = rangePriceActiveMax;
            manufacturerChecked.map(function(input) {
                arrMF.push(input.value);
            });
            let query = (window.location.pathname == "/all") ? window.location.search : "";
            let valSearch = searchInput.val();
            let params = (new URLSearchParams(query));
            let countParam = params.get("q") ? params.get("q").length : 0;
            if(countParam > 0 && arrMF.length == 0 && price.min == undefined && price.max == undefined){
                valSearch = params.get("q");
                history.pushState({},"",query);
            }else if(countParam > 0 && arrMF.length == 0 && price.min != undefined && price.max != undefined){
                valSearch = params.get("q");
                history.pushState({},"",query);
            }
            else{
                history.pushState({},"","all");
            }
            $.ajax({
                type: "GET",
                url: `/api/mutipleSearch?mf=${JSON.stringify(arrMF)}&price=${JSON.stringify(price)}&name=${valSearch}&page=${page}`,
                success: function(data) {
                    if(data.products.length > 0) {
                        $("#content-products").find(".product-sec1").show();
                        $("#content-products").find(".product-sec2").hide();
                        if(append){
                            $("#viewed-products").append(loadProducts(data.products));
                        }else{
                            $("#viewed-products").html(loadProducts(data.products));
                        }
                        if(data.totalProduct - data.productViewed > 0){
                            $("#content-products").find(".view-more button").data('page', data.page);
                            $("#content-products").find(".view-more button span").text(data.totalProduct - data.productViewed);
                            $("#content-products").find(".view-more").show();
                        }
                        else{
                            $("#content-products").find(".view-more").hide();
                        }
                    }
                    else {
                        $("#content-products").find(".product-sec1").hide();
                        $("#content-products").find(".product-sec2").show();
                    }
                }
            });
        }
        manufacturer.click(function() {
            handleSearchMutipleProduct();
        });
        searchInput.keyup(function() {
            handleSearchMutipleProduct();
        });
        rangePrice.click(function(e) {
            e.preventDefault();
            //nav bar clicked
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $("#range-between li a").removeClass('active');
                $(this).addClass('active');
            }
            handleSearchMutipleProduct();
        });
    })();
});