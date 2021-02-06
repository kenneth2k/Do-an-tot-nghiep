function setSaveProd(data){
    var expires = new Date(), wrapped;

        expires.setTime(expires.getTime() + this._duration * 24 * 60 * 60 * 1000);

        wrapped = {
            value: data,
            expires: expires.toGMTString()
        };

        window.localStorage.setItem('PPminicarts', encodeURIComponent(JSON.stringify(wrapped)));
}

function setListProd(prod, index){
    var x = prod.amount * prod.quantity;
    x = x.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    var itemCart = `
    <tr>
        <td class="invert">${index + 1}</td>
        <td class="invert-image">
            <a href="/">
                <img src="/public/images/${prod.img}" alt=" " class="img-responsive">
            </a>
        </td>
        <td class="invert">
            <div class="quantity">
                <div class="quantity-select">
                    <input id="idPro" type="hidden" value="${prod.add}">
                    <div class="entry value-minus">&nbsp;</div>
                    <div class="entry value">
                        <span>${prod.quantity}</span>
                    </div>
                    <div class="entry value-plus active">&nbsp;</div>
                </div>
            </div>
        </td>
        <td class="invert">${prod.item_name}</td>
        <td class="invert" id="money-prod">${x}</td>
        <td class="invert">
            <div class="rem">
                <div class="close1" id="close"> </div>
            </div>
        </td>
    </tr>
    `;
    return itemCart;
}

$(document).ready(function (c) {

    var listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts'))) ;
    var CartItem = listProd.value.items;

    var table = $('#cart-list-prod');

    for(let i = 0 ; i < CartItem.length ; i++){
        table.append(setListProd(CartItem[i], i));
    }
    
});
$(document).ready(function (c){
    $('#last-cart-prod').click(function (){
        //window.location.assign("/cart")
    })
    $("#add-product-item").click(function(){
        console.log($('#PPminicarts').find('button[data-minicarts-alt="undefined"]')[0])
    });
    $(document).ready(function () {
        $('#form-cart-list-product').submit(function(e){
            e.preventDefault();
            window.location.assign("/cart")
        });
    });
    reloadCart();
    function reloadCart(){
        if(window.location.pathname == "/cart"){
            $('#last-cart-prod')[0].style.display = "none";
        }
        
    };
    //tăng
    $('.value-plus').on('click', function () {
        let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts'))) ;
        let cartItem = listProd.value.items;
        let id = $(this).parent().find('#idPro').val();
        let total;
        var divUpd = $(this).parent().find('.value'),
            newVal = parseInt(divUpd.text(), 10) + 1, 
            divPrice = $(this).parents('tr').find('#money-prod');
        cartItem.forEach(function(cart){
            if(cart.add == id){
                cart.quantity = newVal;
                total = cart.amount * cart.quantity;
                divPrice.text(total.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}));
                return;
            }
        });
        listProd.value.items = cartItem;
        setSaveProd(listProd.value);
        divUpd.text(newVal);
    });
    //giảm
    $('.value-minus').on('click', function () {
        let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts'))) ;
        let cartItem = listProd.value.items;
        let id = $(this).parent().find('#idPro').val();
        let total;
        var divUpd = $(this).parent().find('.value'),
            newVal = parseInt(divUpd.text(), 10) - 1,
            divPrice = $(this).parents('tr').find('#money-prod');
        if (newVal >= 1) {
            cartItem.forEach(function(cart){
                if(cart.add == id){
                    cart.quantity = newVal;
                    total = cart.amount * cart.quantity;
                    divPrice.text(total.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}));
                    return;
                }
            });
            listProd.value.items = cartItem;
            setSaveProd(listProd.value);
            divUpd.text(newVal)
        };
    });
    //xóa cart prod
    $(document).ready(function (c) {
        $('.close1').on('click', function (c) {
            let dte = $(this).parents('tr');
            let id = dte.find('#idPro').val(); 
            $(dte[0]).fadeOut('slow', function (c) {
                dte[0].remove();
            });
            let listProd = JSON.parse(decodeURIComponent(window.localStorage.getItem('PPminicarts'))) ;
            let cartItem = listProd.value.items;
            cartItem.forEach(function(cart, index){
                if(cart.add == id){
                    cartItem.splice(index, 1);
                    return;
                }
            });
                listProd.value.items = cartItem;
                setSaveProd(listProd.value);
        });
        
    });
});
