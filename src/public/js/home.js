$(document).ready(function() {
    const carouselInner = document.querySelector('.carousel-inner');
    const menu = document.querySelector('#nav-header-bottoms');
    if (carouselInner) {
        carouselInner.innerHTML = `
        <div class="carousel-item item1 active">
            <div class="container">
                <div class="w3l-space-banner">
                    <div class="carousel-caption p-lg-5 p-sm-4 p-3">
                        <p>Nhận
                            <span>10%</span> Hoàn tiền</p>
                        <h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">Giảm
                            <span>Giá</span>
                            Lớn
                        </h3>
                        <a class="button2" href="product.html">Mua ngay </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="carousel-item item2">
            <div class="container">
                <div class="w3l-space-banner">
                    <div class="carousel-caption p-lg-5 p-sm-4 p-3">
                        <p>Tai nghe
                            <span>Không dây</span> Tiên tiến</p>
                        <h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">
                            <span>Tai Nghe</span>
                            Tốt nhất
                        </h3>
                        <a class="button2" href="product.html">Mua ngay </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="carousel-item item3">
            <div class="container">
                <div class="w3l-space-banner">
                    <div class="carousel-caption p-lg-5 p-sm-4 p-3">
                        <p>Nhận
                            <span>10%</span> Hoàn tiền</p>
                        <h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">Giảm
                            <span>Giá</span>
                            Lớn
                        </h3>
                        <a class="button2" href="product.html">Mua ngay </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="carousel-item item4">
            <div class="container">
                <div class="w3l-space-banner">
                    <div class="carousel-caption p-lg-5 p-sm-4 p-3">
                        <p>Mua ngay Giảm
                            <span>40%</span></p>
                        <h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">
                            <span>Giảm giá</span>
                            Ngay hôm nay
                        </h3>
                        <a class="button2" href="product.html">Mua ngay </a>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    if (menu) {
        var href = window.location.pathname == '/' ? '/' : (window.location.pathname).replace('/', '');
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
})