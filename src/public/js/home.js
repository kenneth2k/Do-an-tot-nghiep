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
$(document).ready(function() {
    // (
    //     function() {
    //         const pageNaigation = document.querySelector('#page_navigation');
    //         if (pageNaigation) {
    //             var htmls = `
    //             <ul class="pagination">
    //                     <li class="page-item">
    //                         <span class="page-link" aria-label="Previous">
    //                             <span aria-hidden="true">&laquo;</span>
    //                             <span class="sr-only">Previous</span>
    //                         </span>
    //                     </li>
    //                     <li class="page-item"><span class="page-link">1</span></li>
    //                     <li class="page-item active"><span class="page-link">2</span></li>
    //                     <li class="page-item"><span class="page-link">3</span></li>
    //                     <li class="page-item"><span class="page-link">...</span></li>
    //                     <li class="page-item">
    //                         <span class="page-link" aria-label="Next">
    //                             <span aria-hidden="true">&raquo;</span>
    //                             <span class="sr-only">Next</span>
    //                         </span>
    //                     </li>
    //                 </ul>
    //             `;
    //             pageNaigation.innerHTML = htmls;
    //         }
    //     }
    // )()
})