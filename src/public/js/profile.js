$(document).ready(function() {

            onloadEventAdress();

            function onloadEventAdress() {
                if (window.location.href.indexOf('profile') === -1) return;
                //form-create-address
                $("#form-create-address input[name='phone']").inputFilter(function(value) { return /^\d*$/.test(value); });
                $("#form-create-address input[name='phone']").prop('maxlength', '10');
                $("#form-create-address input[name='fullname']").prop('maxlength', '35');

                function IsPhoneNumber(phone) {
                    const regex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/g;
                    const result = regex.test(phone);
                    return result ? true : false;
                };
                $("#form-create-address").submit(function(e) {
                            e.preventDefault();
                            let name = $(this).find('input[name="fullname"]');
                            let phone = $(this).find('input[name="phone"]');
                            let address = $(this).find('textarea[name="address"]');
                            $(this).find('small').text('');
                            let count = 0;
                            if (name.val().length < 4) {
                                $(name).closest('.form-gp').find('small').text('Tên ít nhất 3 kí tự');
                                count++;
                            }
                            if (!IsPhoneNumber(phone.val())) {
                                count++;
                                $(phone).closest('.form-gp').find('small').text('Số điện thoại không đúng định dạng');
                            }
                            if (address.val().length < 10) {
                                $(address).closest('.form-gp').find('small').text('Địa chỉ ít nhất 10 kí tự');
                                count++;
                            }
                            if (count > 0) { return; };
                            var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
                            $.ajax({
                                        type: "POST",
                                        url: '/api/createAddress',
                                        headers: {
                                            'Authorization': user_token.token,
                                        },
                                        data: $(this).serialize(),
                                        success: function(data) {
                                                if (data.created) {
                                                    ShowToastMessage(data.message, "success");
                                                    let xhtml = ``;
                                                    data.addresses.forEach(function(value) {
                                                                xhtml += `
                                                    <div class="item">
                                                      <div class="info">
                                                        <div class="name">${value.name}
                                                          ${value.active ?`
                                                            <span>
                                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                  <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z">
                                                                  </path>
                                                                </svg>
                                                                <span>Địa chỉ mặc định</span>
                                                            </span>
                                                          `:''}
                                                        </div>
                                                        <div class="address">
                                                          <span>Địa chỉ: </span>
                                                          ${value.address}
                                                        </div>
                                                        <div class="phone">
                                                          <span>Điện thoại: </span>
                                                          ${value.phone}
                                                        </div>
                                                      </div>
                                                      <div id="action-address">
                                                        ${value.active ?'':`
                                                          <a class="default" href="#" data-id="${value._id}">Mặc định</a>
                                                          <a class="detele" href="#" data-id="${value._id}">Xóa</a>
                                                        `}
                                                      </div>
                                                    </div>
                                                    `;
                                                  });
                                              $("#addresses .inner").html(xhtml);
                                              onloadEventAdress();
                                              $("#form-create-address")[0].reset();
                                          } else {
                                              ShowToastMessage(data.message, "error");
                                          };
                }
            });
        });
        $("#action-address .detele").click(function(e) {
                    e.preventDefault();
                    var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
                    if (!user_token) return;
                    let id = $(this).data("id");
                    $.ajax({
                                type: "PUT",
                                url: '/api/updateAddress/' + id,
                                headers: {
                                    "Authorization": user_token.token
                                },
                                data: {
                                    event: 'detele'
                                },
                                success: function(data) {
                                        if (data.updated) {
                                            ShowToastMessage(data.message, "success");
                                            let xhtml = ``;
                                            data.addresses.forEach(function(value) {
                                                        xhtml += `
                                  <div class="item">
                                    <div class="info">
                                      <div class="name">${value.name}
                                        ${value.active ?`
                                          <span>
                                              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z">
                                                </path>
                                              </svg>
                                              <span>Địa chỉ mặc định</span>
                                          </span>
                                        `:''}
                                      </div>
                                      <div class="address">
                                        <span>Địa chỉ: </span>
                                        ${value.address}
                                      </div>
                                      <div class="phone">
                                        <span>Điện thoại: </span>
                                        ${value.phone}
                                      </div>
                                    </div>
                                    <div id="action-address">
                                      ${value.active ?'':`
                                        <a class="default" href="#" data-id="${value._id}">Mặc định</a>
                                        <a class="detele" href="#" data-id="${value._id}">Xóa</a>
                                      `}
                                    </div>
                                  </div>
                                  `;
                                });
                            $("#addresses .inner").html(xhtml);
                            onloadEventAdress();
                        } else {
                            ShowToastMessage(data.message, "error");
                        };
                        }
                    });
        });
        $("#action-address .default").click(function(e) {
                    e.preventDefault();
                    var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
                    if (!user_token) return;
                    let id = $(this).data("id");
                    $.ajax({
                                type: "PUT",
                                url: '/api/updateAddress/' + id,
                                headers: {
                                    "Authorization": user_token.token
                                },
                                data: {
                                  event: 'default'
                                },
                                success: function(data) {
                                        if (data.updated) {
                                            ShowToastMessage(data.message, "success");
                                            let xhtml = ``;
                                            data.addresses.forEach(function(value) {
                                                        xhtml += `
                                  <div class="item">
                                    <div class="info">
                                      <div class="name">${value.name}
                                        ${value.active ?`
                                          <span>
                                              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z">
                                                </path>
                                              </svg>
                                              <span>Địa chỉ mặc định</span>
                                          </span>
                                        `:''}
                                      </div>
                                      <div class="address">
                                        <span>Địa chỉ: </span>
                                        ${value.address}
                                      </div>
                                      <div class="phone">
                                        <span>Điện thoại: </span>
                                        ${value.phone}
                                      </div>
                                    </div>
                                    <div id="action-address">
                                      ${value.active ?'':`
                                        <a class="default" href="#" data-id="${value._id}">Mặc định</a>
                                        <a class="detele" href="#" data-id="${value._id}">Xóa</a>
                                      `}
                                    </div>
                                  </div>
                                  `;
                                });
                            $("#addresses .inner").html(xhtml);
                            onloadEventAdress();
                        } else {
                            ShowToastMessage(data.message, "error");
                        };
                        }
                        });
        });
    };
    $("#cancel-order a").click(function(event) {
        event.preventDefault();
        $("#form-cancel-order").find("input[name='id']").val($(this).data("id"));
        $("#modal-cancel").modal('show');
    });
    $("#form-cancel-order").submit(function(event) {
        event.preventDefault();
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if (!user_token) return;
        let id = $(this).find("input[name='id']").val();
        $.ajax({
            type: "PUT",
            url: '/cancel/order/' + id,
            headers: {
                "Authorization": user_token.token
            },
            success: function(data) {
                $("#cancel-order a").each(function() {
                    if ($(this).data("id") == id) {
                        $(this).closest('.text-center').html(`<span class="text-danger">${data.message}</span>`);
                    }
                    setTimeout(function() {
                        $("#modal-cancel").modal('hide');
                        setTimeout(function() {
                            ShowToastMessage("Cập nhật đơn hàng thành công!", "success");
                        }, 500);
                    }, 500);
                });
            }
        })
    });
    $("#order-detail a").click(function(event) {
        event.preventDefault();
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if (!user_token) return;
        $(".tab-content .tab-pane").removeClass('active');
        $("#order-details").addClass('active');
        $.ajax({
            type: "GET",
            url: '/order/detail/' + $(this).data("id"),
            headers: {
                "Authorization": user_token.token
            },
            success: function(data) {
                if (data.status == 200) {
                    $("#order-details .id-order").text(data.order.slug);
                    $("#order-details .status-order").text(`${data.order.status == 2 ? 'Đang chờ duyệt' : (data.order.status == 0) ? 'Đã hủy' : (data.order.status == 1) ? 'Giao hàng thành công' : 'Đang giao hàng'}`);
                    $("#order-details .user-name").text(data.order.userName);
                    $("#order-details .user-address").text(data.order.userAddress);
                    $("#order-details .user-phone").text(data.order.userPhone);
                    $("#order-details .total-price").text(`${new Intl.NumberFormat().format(data.order.sumPrice)} VNĐ`);
                    let xhtml = ``;
                    data.order.details.forEach((value) => {
                        xhtml += `
                        <tr>
                          <td class="text-center">
                            <a href="#">${value.productName}</a>
                          </td>
                          <td class="text-center">${new Intl.NumberFormat().format(value.price/(1 - (value.sale/100)))}</td>
                          <td class="text-center">${value.quantity}</td>
                          <td class="text-center">${value.sale}</td>
                          <td class="text-center">${new Intl.NumberFormat().format(value.price * value.quantity)}</td>
                        </tr>
                      `;
                    });
                    $("#order-details table tbody").html(xhtml);
                }
            }
        });
    });
    const dafaultPathname = window.location.pathname;
    $("#form-noidung-danhgia").submit(function(event) {
      event.preventDefault();
      let error = '';
      let title = $(this).find('input[name="star"]:checked').val()?$(this).find('input[name="star"]:checked').val():0;
      let content = $(this).find('textarea').val();
      if(title == 0){
        error+= 'Bạn chưa đánh giá điểm sao, vui lòng đánh giá.';
      }
      else if(content.length < 1){
        error +='Vui lòng nhập nội dung đánh giá về sản phẩm.';
      }
      $(this).find('.danhgia-submit .text-danger').text(error);
      if(error.length > 0) return;
      var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
      let  proSlug = dafaultPathname.substring(dafaultPathname.lastIndexOf('/') + 1, dafaultPathname.length);
      
      $(this).find('input[name="proSlug"]').val(proSlug);
      $(this).find('input[name="userSlug"]').val(user_token._slug);
      
      let formData = new FormData($(this)[0]);
      $.ajax({
        type: 'POST',
        url: '/api/raiting',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        headers: {
          "Authorization": user_token.token
        },  
        success: function(data) {
          if(data.raiting){
            $("#form-noidung-danhgia")[0].reset();
            $("#form-noidung-danhgia").find('.gallery').text('');
            $("#form-noidung-danhgia .star label .fa.fa-star").css("color","#dee2e6");
            ShowToastMessage(data.message, "success");
            let star = ``, images = ``;
            for(let i = 0; i < 5; i++){
              if(i<data.star){
                star += `<span class="fa fa-star checked">`;
              }
              else{
                star += `<span class="fa fa-star">`;
              }
            }
            for(let i = 0; i < data.images.length; i++){
              images += `<img src="/public/images/comments/${data.images[i]}" width="100" height="100" alt="">`;
            }
            let xhtml = `<div class="comment">
                <div class="comment-item">
                    <div class="item-top">
                        <p class="comment-item__name">${data.name}</p>
                    </div>
                    <div class="item-rate">
                        ${star}
                    </div>
                    <div class="comment-content">
                    ${data.content}
                    </div>
                    <div class="comment-content">
                        ${images}
                    </div>
                    <hr style="border:1px solid #f1f1f1">
                </div>
            </div>`;
            $('#raiting-content').prepend(xhtml);
          }
          else{
            ShowToastMessage(data.message, "error")
          }
        }
      })
  })
});