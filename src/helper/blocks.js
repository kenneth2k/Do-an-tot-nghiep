module.exports = {
        convertToVND: (price) => {
            return (new Intl.NumberFormat().format(price));
        },
        convertSaleToVND: (price, sale) => {
            return (new Intl.NumberFormat().format((price - (price * (sale / 100)))));
        },
        convertSale: (price, sale) => {
            return ((price - (price * (sale / 100))));
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
                        <div class="col-xl-2dot4 col-md-3 col-sm-6 media-slide-0 pl-1 pr-1 product-men mt-5">
                            <div class="men-pro-item simpleCart_shelfItem">
                                <div class="men-thumb-item text-center">
                                    <img src="${process.env.IMAGES_PRODUCT}${product.colors[0].bigImg}" alt="*.jpg"
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
        let xhtmlFooter = `</div></div>`;
        let xhtml = ``;
        for (let i = 0; i < Math.ceil(products.length / 5); i++) {
            if (i == 0) {
                xhtml += xhtmlHeaderActive;
            } else {
                xhtml += xhtmlHeader;
            }
            for (let j = (i * 5); j < ((i * 4) + 5 + i); j++) {
                if (products[j]) {
                    xhtml += xhtmlContent(products[j]);
                }
            }
            xhtml += xhtmlFooter;
        }
        return xhtml;
    },
    productList: (products) => {
        let xhtmlContent = (product) => {
            return `
            <div class="col-xl-2dot4 col-md-3 col-sm-6 media-slide-0 pl-1 pr-1 product-men mt-5">
                <div class="men-pro-item simpleCart_shelfItem">
                    <div class="men-thumb-item text-center">
                        <img src="${process.env.IMAGES_PRODUCT}${product.colors[0].bigImg}" alt="*.jpg"
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
        let xhtml = ``;
        for (let i = 0; i < products.length; i++) {
            xhtml += xhtmlContent(products[i]);
        }
        return xhtml;
    },
    productSearch: (products) => {
        let xhtmlContent = (product) => {
            return `
            <div class="col-lg-3 col-md-4 col-sm-6 media-slide-0 pl-1 pr-1 product-men mt-5">
                <div class="men-pro-item simpleCart_shelfItem">
                    <div class="men-thumb-item text-center">
                        <img src="${process.env.IMAGES_PRODUCT}${product.colors[0].bigImg}" alt="*.jpg"
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
        let xhtml = ``;
        for (let i = 0; i < products.length; i++) {
            xhtml += xhtmlContent(products[i]);
        }
        return xhtml;
    },
    productDetailImages: (colors) => {

        let xhtml = ``;
        let xhtmlContent = (img) => {
            return `
                <li data-thumb="${process.env.IMAGES_PRODUCT}${img}">
                    <div class="thumb-image">
                        <img src="${process.env.IMAGES_PRODUCT}${img}" data-imagezoom="true"
                            class="img-fluid" alt="">
                    </div>
                </li>
            `;
        };

        for (let i = 0; i < colors.length; i++) {
            for (let j = 0; j < colors[i].secImg.length; j++) {
                xhtml += xhtmlContent(colors[i].secImg[j]);
            }
        }
        return xhtml;
    },
    imageOne: (colors) => {
        return colors[0].bigImg;
    },
    idImageOne: (colors) => {
        return colors[0]._id;
    },
    nameImageOne: (colors) => {
        return colors[0].name;
    },
    commentProduct: (raitings) => {
        let xhtml = ``;
        let starContent = (number) => {
            let xhtml = ``;
            for (let i = 0; i < 5; i++) {
                if (i < number) {
                    xhtml += `<span class="fa fa-star checked"></span>`;
                } else {
                    xhtml += `<span class="fa fa-star"></span>`;
                }
            }
            return xhtml;
        }
        let imagesContent = (images) => {
            if (images.length < 1) return ``;
            let xhtml = ``;
            for (let i = 0; i < images.length; i++) {
                xhtml += `<img src="${process.env.IMAGES_COMMENT}${images[i]}" width="100" height="100" alt="">`;
            }
            return xhtml;
        }
        let commentContent = (coment) => {
            return `
            <div class="comment">
                <div class="comment-item">
                    <div class="item-top">
                        <p class="comment-item__name">${coment.userdetails[0].fullname}</p>
                    </div>
                    <div class="item-rate">
                        ${starContent(coment.star)}
                    </div>
                    <div class="comment-content">
                        ${coment.content}
                    </div>
                    <div class="comment-content">
                        ${imagesContent(coment.images)}
                    </div>
                    <hr style="border:1px solid #f1f1f1">
                </div>
            </div>
        `;
        }
        for (let i = 0; i < raitings.length; i++) {
            xhtml += commentContent(raitings[i]);
        }
        return xhtml;
    },
    lenghtRaitings: (raitings) => {
        return raitings.length;
    },
    avgRaitings: (raitings) => {
        let sum = 0;
        for (let i = 0; i < raitings.length; i++) {
            sum += raitings[i].star;
        }
        return parseFloat((raitings.length == 0) ? 0 : (sum / raitings.length) + '').toFixed(1);
    },
    percentRaitings: (raitings, number) => {
        let sum = 0;
        for (let i = 0; i < raitings.length; i++) {
            if (raitings[i].star == number) {
                sum += 1;
            }
        }
        return (raitings.length == 0) ? 0 : parseFloat(((sum / raitings.length) * 100) + '').toFixed(0);
    },
    checkContentProduct: (content) => {
        return content ? `
            <div class="view-content">
                ${content}
            </div>
            <div class="btn-view-more">
                <button type="button" class="btn btn-primary">Xem thêm</button>
            </div>
        ` : 'Không có nội dung!';
    },
    starRaitings: (raitings) => {
        let xhtml = ``;
        let sum = 0;
        for (let i = 0; i < raitings.length; i++) {
            sum += raitings[i].star;
        };
        let avg = parseFloat((sum / raitings.length) + '').toFixed(0);
        for (let i = 0; i < 5; i++) {
            if (i < avg) {
                xhtml += `<span class="fa fa-star checked"></span>`;
            } else {
                xhtml += `<span class="fa fa-star"></span>`;
            }
        }
        return xhtml;
    },
    viewMoreBtn: (products, totalProduct) => {
        return `
        <div class="view-more" ${totalProduct - products.length < 1? 'style="display:none;"':''}>
            <button type="button" data-page="2" class="btn btn-primary">Xem thêm <span>${(totalProduct - products.length < 1)? 0 : totalProduct - products.length}</span> điện thoại <svg
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-arrow-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                </svg>
            </button>
        </div>
    `;
    },
    manufacturerView: (categories)=>{
        let xhtml = ``;
        for(let i=0; i<categories.length; i++){
            xhtml += `
                <li>
                    <input id="${categories[i]._id}" value="${categories[i].slug}" type="checkbox" class="checked">
                    <label for="${categories[i]._id}" class="cursor-pointer span">${categories[i].name}</label>
                </li>
            `;
        }
        return xhtml;
    },
}