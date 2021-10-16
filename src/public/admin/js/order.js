function renderTableOder(search = '', page = undefined) {
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: `/admin/order/search?q=${search}&page=${page}`,
        type: "GET",
        headers: {
            "Authorization": token.token
        },
        beforeSend: function() {
            addLoadingPage();
        },
        success: function() {
            removeLoadingPage();

        }
    }).done(function(data) {
        renderListOder(data, search);
    });
};

function renderListOder(data, search) {
    var xquery = `
            <div class="nav-content d-flex justify-content-between p-2">
                <div class="nav-content-1 d-flex">
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="renderTableOrderDeleted()">Đang xử lý (<span class="text-secondary">${data.countOrderWarning}</span>) </a></div>
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="renderTableOrderDeleted()">Đang giao (<span class="text-secondary">${data.countOrderSuccess}</span>) </a></div>
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="renderTableOrderDeleted()">Hoàn thành (<span class="text-secondary">${data.countOrderFinished}</span>) </a></div>
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="renderTableOrderDeleted()">Đã Hủy (<span class="text-secondary">${data.countOrderFailed}</span>) </a></div>
                </div>
                <div class="nav-content-2">
                    <form action="#" method="get" id="formSearchOder">
                        <div class="input-group" style="width: 300px;">
                            <input type="text" class="form-control" placeholder="Tìm kiếm" value="${search}">
                            <button class="btn btn-primary" type="submit">Tìm kiếm</button>
                        </div>
                    </form>
                </div>
            </div>`;
    var xthead = `
                <thead>
                    <tr class="scrollable-wrapper">
                        <th scope="col">STT</th>
                        <th scope="col">ID</th>
                        <th scope="col">Khách hàng</th>
                        <th scope="col">Tổng tiền</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Thời gian</th>
                        <th scope="col">Chi tiết</th>
                    </tr>
                </thead>`;
    var xtbody = '<tbody>';
    if (data.orderNewList.length > 0) {
        data.orderNewList.map((item, index) => {
            let status = (item.status == 1) ? 'Hoàn thành' : '';
            switch (item.status) {
                case 0:
                    { status = '<div class="badge rounded-pill bg-secondary" style="top: 0px; left: 0px;">Đã hủy</div>'; break; }
                case 1:
                    { status = '<div class="badge rounded-pill bg-success" style="top: 0px; left: 0px;">Thành công</div>'; break; }
                case 2:
                    { status = '<div class="badge rounded-pill bg-warning" style="top: 0px; left: 0px;">Đang xử lý</div>'; break; }
                case 3:
                    { status = '<div class="badge rounded-pill bg-danger" style="top: 0px; left: 0px;">Đang giao hàng</div>'; break; }
                default:
                    { status = '<div class="">Lỗi status</div>'; break; }
            }
            let createdAt = moment(moment(item.createdAt).subtract(1, "days")).format("DD/MM/YYYY - HH:mm:ss");
            xtbody += `
                    <tr>
                        <th class="td-center" scope="row">${parseInt(data.STT) + index}</th>
                        <td class="td-center" >${item._id}</td>
                        <td class="td-center">${item.userName}</td>
                        <td class="td-center">${(new Intl.NumberFormat().format((item.sumPrice)))} VNĐ</td>
                        <td class="td-center" >${status}</td>
                        <td class="td-center" >${createdAt}</td>
                        <td class="td-center impact-event" >
                            <button type="button" class="btn btn-primary btn-sm edit" data-id="${item._id}">Chi tiết</button>
                        </td>
                    </tr>
                `;
        });
    } else {
        xtbody += `
                    <tr>
                        <td colspan="5">Không tìm thấy tài liệu</td>
                    </tr>
                `;
    }
    xtbody += '</tbody>';
    //Check page hide or show
    let pagePre = (data.orderNewList.length > 0) ? data.pagePre : 1;
    //Show table
    contentTable("Quản lý đơn hàng", xquery, xthead, xtbody, false);
    pageNavigation(pagePre, data.pageActive, data.pageNext, 'renderOrderPageOnClick');
    btnEditer(formOderEditer);
}


function formOderEditer({ token, id }) {
    $.ajax({
        url: `/admin/order/${id}/edit`,
        type: "GET",
        headers: {
            "Authorization": token.token
        },
        beforeSend: function() {
            addLoadingPage();
        },
        success: function() {
            removeLoadingPage();
        }
    }).done(function(data) {
        console.log(data);
        let details = '';
        data.details.map((item, index) => {
            details += `
                <tr>
                    <th class="td-center" scope="row">${index + 1}</th>
                    <td class="td-center">${item.productName}</td>
                    <td class="td-center">${item.colorName}</td>
                    <td class="td-center">${new Intl.NumberFormat().format(item.price / (1 - (item.sale / 100)))} VNĐ</td>
                    <td class="td-center">${item.quantity}</td>
                    <td class="td-center">${item.sale}</td>
                    <td class="td-center">${new Intl.NumberFormat().format(item.price * item.quantity)} VNĐ</td>
                </tr>`;
        });
        var xhtml = `
        <div >
            <label style="font-weight: 500;">Mã đơn hàng</label>
            <h5>&nbsp;&nbsp;&nbsp;&nbsp;${data._id}</h5>
        </div>
        <div >
            <label style="font-weight: 500;">Tên người nhận</label>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;${data.userName}</p>
        </div>
        <div >
            <label style="font-weight: 500;">Địa chỉ</label>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;${data.userAddress}</p>
        </div>
        <div >
            <label style="font-weight: 500;">Số điện thoại</label>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;${'0'+data.userPhone}</p>
        </div>
        <div >
            <label style="font-weight: 500;">Email</label>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;${data.email}</p>
        </div>
        <div >
            <label style="font-weight: 500;">Thông tin thanh toán</label>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;- Thanh toán khi nhận hàng.</p>
        </div>
        <div style="width: 400px;">
            <label style="font-weight: 500;">Thông tin đơn hàng</label>
            <div class="input-group mb-3">
            <select class="form-select bg-danger text-white">
                    <option value="1" selected>Đang xử lý</option>
                    <option value="2">Đang giao hàng</option>
            </select>
            <span class="input-group-text" style="background-color: transparent; border-color: transparent;"><button type="submit" class="btn btn-primary">Cập nhật đơn hàng</button></span>
            </div>
        </div>
        <div>
            <table class="table table-hover">
                <thead>
                    <tr class="scrollable-wrapper">
                        <th scope="col">STT</th>
                        <th scope="col">Tên sản phẩm</th>
                        <th scope="col">Màu sắc</th>
                        <th scope="col">Đơn giá</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col">Giảm (%)</th>
                        <th scope="col">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${details}
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-end">
            <label style="font-weight: 500;">Tổng  cộng:</label>
            <p class="text-primary">&nbsp;&nbsp;&nbsp;&nbsp;${(new Intl.NumberFormat().format((data.sumPrice)))} VNĐ</p>
        </div>
        `;
        showModal("formOrderEdit-xl-hbtn", "get", "Thông tin đơn hàng", xhtml, function(data) {
            var error = {};
            // xử lý các giá trị biểu mẫu

            // xử lý sự kiện khi có lỗi
            if (Object.keys(error).length > 0) {
                throw JSON.stringify(error);
            }
            // call ajax to do something...
            $.ajax({
                url: `/admin/order/${id}/update`,
                type: "PUT",
                data: data,
                headers: {
                    "Authorization": token.token
                },
                beforeSend: function() {
                    addLoadingPage();
                },
                success: function() {
                    removeLoadingPage();
                }
            }).done(function(data) {
                $('#myModal').modal('hide');
                setTimeout(function() {
                    showToast(data.message, "success");
                    returnNavBar('order');
                }, 500);
            });
        });
    });
}