$(document).ready(function() {
    $("#cancel-order a").click(function(event) {
        event.preventDefault();
        console.log($(this).data("id"))
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
                    $("#order-details .id-order").text(data.order._id);
                    $("#order-details .status-order").text(`${data.order.status == 2 ? 'Đang chờ duyệt' : (data.order.status == 0) ? 'Hủy' : (data.order.status == 1) ? 'Giao hàng thành công' : 'Đang giao hàng'}`);
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

    function orderDetail(detail) {
        let xhtml = `<h2>Chi tiết đơn hàng #923385424 - Giao hàng thành công</h2>
        <div class="row pt-2">
          <div class="col-md-6">
              <div >ĐỊA CHỈ NGƯỜI NHẬN</div>
              <div class="content-info-order" style="padding: 15px;">
                  <div class="font-weight-bold text-uppercase" style="font-size: 15px">NGUYỄN VĂN TRỌNG</div>
                  <div>
                      <span style="font-size: 90%;">Địa chỉ: </span>
                      <span style="font-size: 90%;">Đại chỉ 1</span>
                  </div>
                  <div>
                      <span style="font-size: 90%;">Điện thoại: </span>
                      <span style="font-size: 90%;">0326440254</span>
                  </div>
              </div>
          </div>
          <div class="col-md-6">
            <div>HÌNH THỨC THANH TOÁN</div>
              <div class="content-info-order" style="padding: 15px;">
                  <div style="font-size: 90%;">Thanh toán tiền mặt khi nhận hàng</div>
              </div>
          </div>
        </div>
        <div class="inner">
          <table>
            <thead>
              <tr>
                <th class="text-center">Sản phẩm</th>
                <th class="text-center">Giá</th>
                <th class="text-center">Số lượng</th>
                <th class="text-center">Giảm giá</th>
                <th class="text-center">Tạm tính</th>
              </tr>
            </thead>
            <tbody>
              {{#each orders}}
                <tr>
                  <td class="text-center">
                    <a href="#">{{this._id}}</a>
                  </td>
                  <td class="text-center">{{dateToString this.createdAt}}</td>
                  <td class="text-center">{{lenght this.details}}</td>
                  <td class="text-center">{{convertToVND this.sumPrice}} VNĐ</td>
                  <td class="text-center">
                    <span>{{convertStatus this.status}}</span>
                    {{{conditionEqualStatus this.status 2}}}
                  </td>
                </tr>
              {{/each}}
            </tbody>
          </table>
        </div>
        <div class="view-list-order">
            <a href="#">&#60;&#60; Quay lại đơn hàng của tôi</a>
        </div>`;
        return xhtml;
    }
});