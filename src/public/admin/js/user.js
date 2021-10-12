function renderTableUser(search = '', page = undefined) {
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: `/admin/user/search?q=${search}&page=${page}`,
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
        renderListUser(data, search);
    });
};

function renderListUser(data, search) {
    var xquery = `
            <div class="nav-content d-flex justify-content-between p-2">
                <div class="nav-content-1 d-flex">
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('user')">Công khai (<span class="text-secondary">${data.sumUser}</span>) </a></div>
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="renderTableUserDeleted()">Tài khoản đã khóa (<span class="text-secondary">${data.sumDeleted}</span>) </a></div>
                </div>
                <div class="nav-content-2">
                    <form action="#" method="get" id="formSearchUser">
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
                        <th scope="col">Tên</th>
                        <th scope="col">Giới tính</th>
                        <th scope="col">Email</th>
                        <th scope="col">Điện thoại</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col"></th>
                    </tr>
                </thead>`;
    var xtbody = '<tbody>';
    if (data.userList.length > 0) {
        data.userList.map((item, index) => {
            let address = '';
            item.addresses.map((item, index) => {
                if (item.active) {
                    address += item.address;
                }
            })
            xtbody += `
                    <tr>
                        <th class="td-center" scope="row">${parseInt(data.STT) + index}</th>
                        <td class="td-center" width="200">${item.fullname}</td>
                        <td class="td-center" width="100">${item.gender}</td>
                        <td class="td-center">${item.email}</td>
                        <td class="td-center">${item.phone}</td>
                        <td class="td-center" width=200>${address}</td>
                        <td class="td-center" >${item.active? '<div style="color: blue;">Đã xác thực</div>' : '<div style="color: red;">Chưa xác thực</div>'}</td>
                        <td class="td-center impact-event">
                        <button type="button" class="btn btn-danger btn-sm deleted" data-id="${item._id}">Khóa</button>
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
    let pagePre = (data.userList.length > 0) ? data.pagePre : 1;
    //Show table
    contentTable("Quản lý người dùng", xquery, xthead, xtbody, false);
    pageNavigation(pagePre, data.pageActive, data.pageNext, 'renderUserPageOnClick');
    // btnDeleted(formUserDeleted);
    // renderTableUserSearch();
}