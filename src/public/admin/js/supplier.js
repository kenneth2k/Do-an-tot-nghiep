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
    var xquery = `
            <div class="nav-content d-flex justify-content-between p-2">
                <div class="nav-content-1 d-flex">
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('supplier')">Công khai (<span class="text-secondary">${data.sumProducer}</span>) </a></div>
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
    contentTable("Quản lý nhà cung cấp", xquery, xthead, xtbody, true);
    pageNavigation(pagePre, data.pageActive, data.pageNext, '');
    btnEditer(formProducerEditer);
    btnDeleted(formProducerDeleted);
    btnAddNew(formProducerCreate);
}

function formProducerCreate() {
    var xhtml = `
        <div hidden="true">
            <label class="form-label">ID</label>
            <input type="text" class="form-control" name="id" />
            <div></div>
        </div>
        <div>
            <label class="form-label">Tên nhà cung cấp</label>
            <input type="text" class="form-control" name="name" maxlength="255">
            <div></div>
        </div>
        <div>
            <label class="form-label">Email</label>
            <input type="text" class="form-control" name="email"  maxlength="255">
            <div></div>
        </div>
        <div>
            <label class="form-label">Số điện thoại</label>
            <input type="text" class="form-control" name="phone"  maxlength="255">
            <div></div>
        </div>
        <div>
            <label class="form-label">Địa chỉ</label>
            <input type="text" class="form-control" name="address" maxlength="255">
            <div></div>
        </div>`;
    showModal("formProducerAddnew", "post", "Thêm nhà cung cấp", xhtml, function(data) {
        var error = {};
        // xử lý các giá trị biểu mẫu
        if (data.name.length < 1) {
            error.name = "Tên nhà cung cấp không được rỗng!";
        } else if (data.name.length > 255) {
            error.name = "Tên nhà cung cấp không quá 255 kí tự!";
        }
        if (data.email.length < 1) {
            error.email = "Email không được rỗng!";
        } else if (data.email.length > 255) {
            error.email = "Email không quá 255 kí tự!";
        } else if (!checkEmail(data.email)) {
            error.email = "Email không đúng định dạng!";
        }
        if (data.phone.length < 1) {
            error.phone = "Số điện thoại không được rỗng!";
        } else if (data.phone.length > 255) {
            error.phone = "Số điện thoại không quá 255 kí tự!";
        } else if (!checkPhone(data.phone)) {
            error.phone = "Số điện thoại không đúng định dạng!";
        }
        if (data.address.length < 1) {
            error.address = "Địa chỉ không được rỗng!";
        } else if (data.address.length > 255) {
            error.address = "Địa chỉ không quá 255 kí tự!";
        }
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: '/admin/producer/create',
            type: "POST",
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
            setTimeout(function() {
                $('#myModal').modal('hide');
                showToast(data.message, "success");
                setTimeout(function() {
                    returnNavBar('supplier');
                }, 1000);
            }, 1000);
        });
    });
};

function formProducerEditer({ token, id }) {
    $.ajax({
        url: `/admin/producer/${id}/edit`,
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
        var xhtml = `
        <div hidden="true">
            <label class="form-label">ID</label>
            <input type="text" class="form-control" name="id" value="${data._id}" >
            <div></div>
        </div>
        <div>
            <label class="form-label">Tên nhà cung cấp</label>
            <input type="text" class="form-control" name="name" value="${data.name}" maxlength="255">
            <div></div>
        </div>
        <div>
            <label class="form-label">Email</label>
            <input type="text" class="form-control" name="email" value="${data.email}" maxlength="255">
            <div></div>
        </div>
        <div>
            <label class="form-label">Số điện thoại</label>
            <input type="text" class="form-control" name="phone" value="${data.phone}" maxlength="255">
            <div></div>
        </div>
        <div>
            <label class="form-label">Địa chỉ</label>
            <input type="text" class="form-control" name="address" value="${data.address}" maxlength="255">
            <div></div>
        </div>
        `;
        showModal("formProducerEdit", "post", "Sửa nhà cung cấp", xhtml, function(data) {
            var error = {};
            // xử lý các giá trị biểu mẫu
            if (data.name.length < 1) {
                error.name = "Tên nhà cung cấp không được rỗng!";
            } else if (data.name.length > 255) {
                error.name = "Tên nhà cung cấp không quá 255 kí tự!";
            }
            if (data.email.length < 1) {
                error.email = "Email không được rỗng!";
            } else if (data.email.length > 255) {
                error.email = "Email không quá 255 kí tự!";
            } else if (!checkEmail(data.email)) {
                error.email = "Email không đúng định dạng!";
            }
            if (data.phone.length < 1) {
                error.phone = "Số điện thoại không được rỗng!";
            } else if (data.phone.length > 255) {
                error.phone = "Số điện thoại không quá 255 kí tự!";
            } else if (!checkPhone(data.phone)) {
                error.phone = "Số điện thoại không đúng định dạng!";
            }
            if (data.address.length < 1) {
                error.address = "Địa chỉ không được rỗng!";
            } else if (data.address.length > 255) {
                error.address = "Địa chỉ không quá 255 kí tự!";
            }
            // xử lý sự kiện khi có lỗi
            if (Object.keys(error).length > 0) {
                throw JSON.stringify(error);
            }
            // call ajax to do something...
            $.ajax({
                url: `/admin/producer/${id}/update`,
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
                    returnNavBar('supplier');
                }, 500);
            });
        });
    });
}

function formProducerDeleted(id) {
    var xhtml = `
        <div>
            <label class="form-label fw-bold fst-italic text-danger">Nhấn nút lưu để hoàn thành việc xóa nhà cung cấp!!!</label>
            <input type="text" class="form-control" name="producerId" value="${id}" hidden="true">
            <div></div>
        </div>
        `;
    showModal("formProducerDeleted", "post", "Xóa nhà cung cấp", xhtml, function(data) {
        var error = {};
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: `/admin/producer/${data.producerId}/delete`,
            type: "DELETE",
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
            setTimeout(function() {
                $('#myModal').modal('hide');
                showToast('Cập nhật thành công', "success");
                setTimeout(function() {
                    returnNavBar('supplier');
                }, 1000);
            }, 1000);
        });
    });
}