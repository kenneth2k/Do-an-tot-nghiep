function setSaveProd(data) {
    var expires = new Date(),
        wrapped;

    expires.setTime(expires.getTime() + this._duration * 24 * 60 * 60 * 1000);

    wrapped = {
        value: data,
        expires: expires.toGMTString()
    };

    window.localStorage.setItem('PPminicarts', encodeURIComponent(JSON.stringify(wrapped)));
}

function setListProd(prod, index) {
    var x = prod.amount * prod.quantity;
    x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    var itemCart = `
    <tr>
        <td class="invert">${index + 1}</td>
        <td class="invert-image" style="max-width: 200px;">
            <a href="${prod.href}">
                <img src="/public/images/products/${prod.img}" alt=" " class="img-responsive">
            </a>
        </td>
        <td class="invert">
            <div class="quantity">
                <div class="quantity-select">
                    <input id="idPro" type="hidden" value="${prod.item_name}">
                    <div class="entry value-minus ${(prod.quantity === 1) ? 'disabled' : ''}">&nbsp;</div>
                    <div class="entry value">
                        <span>${prod.quantity}</span>
                    </div>
                    <div class="entry value-plus ${(prod.quantity === 5) ? 'disabled' : ''}">&nbsp;</div>
                </div>
            </div>
        </td>
        <td class="invert">${prod.item_name}</td>
        <td class="invert" id="money-prod">${x}</td>
        <td class="invert">
            <div class="rem" style="left: 10px;">
                <div class="close1" id="close"> </div>
            </div>
        </td>
    </tr>
    `;
    return itemCart;
}

function sumTotal() {
    let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
    let cartItem = listProd.value.items;
    let sum = 0;
    cartItem.forEach(function(cart, index) {
        sum += cart.amount * cart.quantity;
    });
    return sum;
}

function resetCart() {
    var listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
    var cartItem = listProd.value.items,
        bodyCart = $('#clear-cart-all'),
        emtyCart = $('#clear-cart-emty');
    if (cartItem.length < 1) {
        bodyCart[0].style.display = 'none';
        emtyCart[0].style.display = 'block';
    }
}
$(document).ready(function(c) {

    var listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
    var CartItem;
    if (!listProd) return;
    console.log("listProd", listProd);
    CartItem = listProd.value.items;
    var table = $('#cart-list-prod');

    for (let i = 0; i < CartItem.length; i++) {
        table.append(setListProd(CartItem[i], i));
    }
    var divSumTotal = $('#sumTotal');
    divSumTotal.text(sumTotal().toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));

});
$(document).ready(function(c) {
    reloadCart();

    function reloadCart() {
        let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
        if (!listProd) return;
        let cartItem = listProd.value.items;
        if (window.location.pathname == "/cart" && cartItem.length < 1) {
            $('#clear-cart-all')[0].style.display = 'none';
            $('#clear-cart-emty')[0].style.display = "block";
        }
        if (window.location.pathname == "/cart") {
            $('#last-cart-prod')[0].style.display = "none";
        }
    };

    function setInputFilter(textbox, inputFilter) {
        if (textbox) {
            ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
                textbox.addEventListener(event, function() {
                    if (inputFilter(this.value)) {
                        this.oldValue = this.value;
                        this.oldSelectionStart = this.selectionStart;
                        this.oldSelectionEnd = this.selectionEnd;
                    } else if (this.hasOwnProperty("oldValue")) {
                        this.value = this.oldValue;
                        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                    } else {
                        this.value = "";
                    }
                });
            });
        }
    }
    setInputFilter(document.getElementById("input[class='minicarts-quantity']"), function(value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 5);
    });
    //tăng
    $('.value-plus').on('click', function() {
        let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
        let cartItem = listProd.value.items;
        let id = $(this).parent().find('#idPro').val();
        let total;
        var divUpd = $(this).parent().find('.value'),
            newVal = parseInt(divUpd.text(), 10) + 1,
            divPrice = $(this).parents('tr').find('#money-prod'),
            divSumTotal = $('#sumTotal');
        if (newVal <= 5) {
            $(this).parent(".quantity-select").find(".value-minus").removeClass('disabled');
            cartItem.forEach(function(cart) {
                if (cart.item_name == id) {
                    cart.quantity = newVal;
                    total = cart.amount * cart.quantity;
                    divPrice.text(total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
                    return;
                }
            });
            listProd.value.items = cartItem;
            setSaveProd(listProd.value);
            divUpd.text(newVal);
            divSumTotal.text(sumTotal().toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
        }
        if (newVal === 5) {
            $(this)[0].classList.add('disabled');
        }
    });
    //giảm
    $('.value-minus').on('click', function() {
        $(this)[0].style.disibles;
        let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
        let cartItem = listProd.value.items;
        let id = $(this).parent().find('#idPro').val();
        let total;
        var divUpd = $(this).parent().find('.value'),
            newVal = parseInt(divUpd.text(), 10) - 1,
            divPrice = $(this).parents('tr').find('#money-prod'),
            divSumTotal = $('#sumTotal');
        if (newVal >= 1) {
            $(this).parent(".quantity-select").find(".value-plus").removeClass('disabled');
            cartItem.forEach(function(cart) {
                if (cart.item_name == id) {
                    cart.quantity = newVal;
                    total = cart.amount * cart.quantity;
                    divPrice.text(total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
                    return;
                }
            });
            listProd.value.items = cartItem;
            setSaveProd(listProd.value);
            divUpd.text(newVal);
            divSumTotal.text(sumTotal().toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
        };
        if (newVal === 1) {
            $(this)[0].classList.add('disabled');
        }
    });
    //xóa cart prod
    $(document).ready(function(c) {
        $('.close1').on('click', function(c) {
            let dte = $(this).parents('tr');
            let id = dte.find('#idPro').val();
            $(dte[0]).fadeOut('slow', function(c) {
                dte[0].remove();
            });
            let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
            let cartItem = listProd.value.items;
            cartItem.forEach(function(cart, index) {
                if (cart.item_name == id) {
                    cartItem.splice(index, 1);
                    return;
                }
            });
            listProd.value.items = cartItem;
            setSaveProd(listProd.value);
            resetCart();
        });

    });
});
$(document).ready(function(c) {
    var listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts')));
    var CartItem;
    if (!listProd) return;
    CartItem = listProd.value.items;
    var prodUl = $('#prod_list-item');

    for (let i = 0; i < CartItem.length; i++) {
        prodUl.append(setListProd2(CartItem[i]));
    }
    var divSumTotal = $('.price__info-content-money-content');
    divSumTotal.text(sumTotal().toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));

    function setListProd2(prod) {
        var x = prod.amount;
        x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        var itemCart = `
            <li class="list-group-item">
                <div class="prod_content-img">
                    <img src="/public/images/products/${prod.img}" alt="">
                </div>
                <div class="prod_content-title">
                    ${prod.item_name}
                    <div class="prod_content-sub">
                        <div class="prod_content-sub-quantity">
                            <span>SL: x<strong>${prod.quantity}</strong></span>
                        </div>
                        <div class="prod_content-sub-price">
                            <span>${x}</span>
                        </div>
                    </div>
                </div>
            </li>
        `;
        return itemCart;
    }
});
$(document).ready(function() {;
    (function() {
        var imgColor = $(".pro_img img");
        if (imgColor) {
            imgColor.click(function(e) {
                let input = $(this).parent().parent().find("input");
                let color = $(this).parent().parent().find("span");
                let addColor = $("form fieldset input[name='addColor']");
                let textColor = $("form fieldset input[name='text_color']");
                let itemName = $("form fieldset input[name='item_name']");

                // let add = $("form fieldset input[name='add']");
                // let vt = add.val().indexOf("-");
                // let id = add.val().substr(0, vt);
                // add.val(`${id}-${input.val()}`);


                itemName.val(`${itemName.val().substr(0, itemName.val().indexOf("-"))}- ${color.text()}`);
                addColor.val(input.val());
                textColor.val(color.text());
            });
        }
    })()
})