module.exports = {
        quantityProduct: (colors) => {
            return colors[0].quantity;
        },
        rennderPhonesColor: (phones) => {
            let xhtml = '';
            for (let i = 0; i < phones.length; i++) {
                xhtml += `
                <div class="pro_img">
                    <input hidden type="radio" id="random-${phones[i]._id}" name="color" value="${phones[i]._id}" ${(i == 0) ? 'checked': ''}>
                    <input hidden type="text" name="inventoryCheck" value="${phones[i].quantity}"/>
                    <label for="random-${phones[i]._id}"><img
                            src="/public/images/products/${phones[i].bigImg}"
                            alt=""></label>
                    <span>${phones[i].name}</span>
                </div>`;
            }
            return xhtml;
        },
        conditionEqualStatus: (_id, num1, num2) => {
            return (num1 == num2) ? `
            <span id="cancel-order"><a
            href="#"
            data-id="${_id}"
            style="padding: 0 5px;color: red;border: 1px solid;margin: 0 5px;"
            >hủy</a></span>
            ` : '';
        },
        addColorTextStatus: (number) => {
            switch (number) {
                case 0:
                    return 'class="text-danger"';
                case 1:
                    return 'class="text-success"';
                case 2:
                    return 'class="text-primary"';
                case 3:
                    return 'class="text-warning"';
                default:
                    return 'Lỗi status';
            }
        },
        convertToVND: (price) => {
            return (new Intl.NumberFormat().format(price));
        },
        convertStatusText: (number) => {
            switch (number) {
                case 0:
                    return 'Đã hủy';
                case 1:
                    return 'Thành công';
                case 2:
                    return 'Đang chờ duyệt';
                case 3:
                    return 'Đang giao hàng';
                default:
                    return 'Lỗi status';
            }
        },
        convertSaleToVND: (price, sale) => {
            return (new Intl.NumberFormat().format((price - (price * (sale / 100)))));
        },
        convertSale: (price, sale) => {
            return ((price - (price * (sale / 100))));
        },
        genderChecked: (gender) => {
            if (gender == null) {
                return `
                <label class="gender-checked">
                    <input type="radio" name="gender" value="Nam" id="male">
                    <span class="label">Nam</span>
                </label>
                <label class="gender-checked">
                    <input type="radio" name="gender" value="Nữ" id="female">
                    <span class="label">Nữ</span>
                </label>`;
            }
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
            if (date == null) {
                return '';
            }
            var dd = (date.getDate() < 10 ? '0' : '') + date.getDate().toString();
            // 01, 02, 03, ... 10, 11, 12
            var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1).toString();
            // 1970, 1971, ... 2015, 2016, ...
            var yyyy = date.getFullYear();
            return `${dd}-${MM}-${yyyy}`;
        },
        timeSpanToString: (date) => {
            if (date == null) {
                return '';
            }
            checkTime = (i) => {
                return (i < 10) ? "0" + i : i;
            }
            var h = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            m = checkTime(m);
            s = checkTime(s);
            return h + ":" + m + ":" + s;
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
                                    <img  src="${process.env.IMAGES_PRODUCT}${product.colors[0].bigImg}" alt="*.jpg"
                                        width="100%" height="130">
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
                        <img height="130" src="${process.env.IMAGES_PRODUCT}${product.colors[0].bigImg}" alt="*.jpg"
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
                        <img height="130" src="${process.env.IMAGES_PRODUCT}${product.colors[0].bigImg}" alt="*.jpg"
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
    lenght: (array) => {
        return array.length;
    },
    showBanners: (banners) => {
        let xhtml = ``;
        for (let i = 0; i < banners.length; i++) {
            xhtml += `
            <div class="carousel-item item${i+1} ${i==0?'active':''}" style="background:url(/public/images/background/${banners[i].images}) no-repeat center;">
                <div class="container">
                    <div class="w3l-space-banner">
                        <div class="carousel-caption p-lg-5 p-sm-4 p-3">
                            <p>${banners[i].title}</p>
                            <h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">
                            <span>${banners[i].content}</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        return xhtml;
    },
    renderProductBestSeller: (products)=>{
        let xhtml = ``;
        for(let i=0; i<products.length; i++){
            xhtml+= `
            <div class="row" style="border-bottom: 1px solid #333; padding: 10px;">
                <div class="col-lg-3 col-sm-2 col-3 left-mar">
                    <img src="/public/images/products/${products[i].colors[0].bigImg}" alt="" class="img-fluid">
                </div>
                <div class="col-lg-9 col-sm-10 col-9 w3_mvd">
                    <a onclick="location.href='/${products[i].categori}/${products[i].slug}';" href="#">${products[i].name}</a>
                    <a onclick="location.href='/${products[i].categori}/${products[i].slug}';" href="#"
                        class="price-mar mt-2">${(new Intl.NumberFormat().format(products[i].price))} <sup>đ</sup></a>
                </div>
            </div>
            `;
        }
        return xhtml;
    }
}