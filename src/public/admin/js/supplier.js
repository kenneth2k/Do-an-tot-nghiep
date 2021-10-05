function renderTableProducer(search = '', page = undefined) {
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: `/admin/producer/search?q=${search}&page=${page}`,
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
        renderListProducer(data, search);
    });
};

function renderListProducer(data, search) {
    console.log(data)
    var xquery = `
            <div class="nav-content d-flex justify-content-between p-2">
                <div class="nav-content-1 d-flex">
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('banner')">Công khai (<span class="text-secondary">${data.sumProducer}</span>) </a></div>
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="renderTableBannerDeleted()">Thùng rác (<span class="text-secondary">${data.sumDeleted}</span>) </a></div>
                </div>
                <div class="nav-content-2">
                    <form action="#" method="get" id="formSearchProducer">
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
                        <th scope="col">Tên NCC</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Address</th>
                        <th scope="col"></th>
                    </tr>
                </thead>`;
    var xtbody = '<tbody>';
    if (data.producerList.length > 0) {
        data.producerList.map((item, index) => {
            xtbody += `
                    <tr>
                        <th class="td-center" scope="row">${parseInt(data.STT) + index}</th>
                        <td class="td-center" width="200">${item.name}</td>
                        <td class="td-center">${item.email}</td>
                        <td class="td-center">${item.phone}</td>
                        <td class="td-center" width=250>${item.address}</td>
                        <td class="td-center impact-event">
                        <button type="button" class="btn btn-primary btn-sm edit" data-id="${item._id}">Sửa</button>
                        <button type="button" class="btn btn-danger btn-sm deleted" data-id="${item._id}">Xóa</button>
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
    let pagePre = (data.producerList.length > 0) ? data.pagePre : 1;
    //Show table
    contentTable("Ảnh bìa đã xóa", xquery, xthead, xtbody, false);
    pageNavigation(pagePre, data.pageActive, data.pageNext, '');
    // btnDeletedReturn(formBannerDeletedReturn);
    // btnDeletedHigh(formBannerDeletedHigh);
    // renderTableBannerSearch();
}