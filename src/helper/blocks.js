module.exports = {
    imageOne: (images) => {
        for (let i = 0; i < images.length; i++) {
            return images[i].image;
        }
    },
    convertToVND: (price) => {
        return (new Intl.NumberFormat().format(price) + ' VNĐ');
    },
    genderChecked: (gender) => {
        if (gender == 'Nam') {
            return `
                <label class="gender-checked">
                    <input type="radio" name="gender" value="Nam" id="male" checked>
                    <span class="label">Nam</span>
                </label>
                <label class="gender-checked">
                    <input type="radio" name="gender" value="Nữ" id="female">
                    <span class="label">Nữ</span>
                </label>`;
        }
        return `
                <label class="gender-checked">
                    <input type="radio" name="gender" value="Nam" id="male">
                    <span class="label">Nam</span>
                </label>
                <label class="gender-checked">
                    <input type="radio" name="gender" value="Nữ" id="female" checked>
                    <span class="label">Nữ</span>
                </label>`;
    },
    dateToString: (date) => {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    },
    productTop: (products) => {
        let xhtmlHeaderActive = `
            <div class="carousel-item active">
                <div class="row m-1">
        `;
        let xhtmlHeader = `
            <div class="carousel-item">
                <div class="row m-1">
        `;
        let xhtmlContent = (product) => {
            return `
            <div class="col-lg-3 col-md-6 col-sm-6 media-slide-0 pl-1 pr-1 product-men mt-5">
                <div class="men-pro-item simpleCart_shelfItem">
                    <div class="men-thumb-item text-center">
                        <img src="/public/images/products/${product.colors[0].bigImg}" alt="*.jpg"
                            width="100%">
                        <div class="men-cart-pro">
                            <div class="inner-men-cart-pro">
                                <a href="/${product.slug}"
                                    class="link-product-add-cart">Xem
                                    thông
                                    tin</a>
                            </div>
                        </div>
                    </div>
                    <div class="item-info-product text-center border-top mt-4">
                        <h4 class="pt-1">
                            <a href="/${product.slug}">${product.name}</a>
                        </h4>
                        <div class="info-product-price my-2">
                            <span class="item_price">${(new Intl.NumberFormat().format((product.price - (product.price*(product.sale/100)))))} <sup>đ</sup></span>
                            <del>${(new Intl.NumberFormat().format(product.price))}</del><sup>đ</sup>
                        </div>
                    </div>
                </div>
            </div>
            `;
        };
        let xhtmlFooter = `</div></div>`;
        let xhtml = ``;
        for (let i = 0; i < (products.length / 4); i++) {
            if (i == 0) {
                xhtml += xhtmlHeaderActive;
            } else {
                xhtml += xhtmlHeader;
            }
            for (let j = (i * 4); j < ((i * 3) + 4 + i); j++) {
                xhtml += xhtmlContent(products[j]);
            }
            xhtml += xhtmlFooter;
        }
        return xhtml;
    },
}