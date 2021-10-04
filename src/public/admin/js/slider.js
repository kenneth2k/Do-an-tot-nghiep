function renderTableBanner(data) {
    var xquery = `
    <div class="nav-content d-flex justify-content-between p-2">
        <div class="nav-content-1 d-flex">
            <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('banner')">Công khai (<span class="text-secondary">${data.countActive}</span>) </a></div>
            <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="renderTableBannerDeleted()">Thùng rác (<span class="text-secondary">${data.countDelete}</span>) </a></div>
        </div>
    </div>
    `;
    var xthead = `
        <thead>
            <tr class="scrollable-wrapper">
                <th scope="col">STT</th>
                <th scope="col">Tiêu đề</th>
                <th scope="col">Nội dung</th>
                <th scope="col">Hình ảnh</th>
                <th scope="col"></th>
            </tr>
        </thead>
    `;
    var xtbody = '<tbody>';
    data.bannerList.map((item, index) => {
        xtbody += `
            <tr>
                <th class="td-center" scope="row">${index + 1}</th>
                <td class="td-center">${item.title}</td>
                <td class="td-center">${item.content}</td>
                <td class="td-center"><img width=100 height=70 src="/public/images/background/${item.images}"/></td>
                <td class="td-center impact-event">
                    <button type="button" class="btn btn-primary btn-sm edit" data-id="${item._id}">Sửa</button>
                    <button type="button" class="btn btn-danger btn-sm deleted" data-id="${item._id}">Xóa</button>
                </td>
            </tr>
        `;
    });
    xtbody += '</tbody>';
    contentTable("Quản lý ảnh bìa", xquery, xthead, xtbody);
    pageNavigation(1, 1, 1);
    renderTableBannerSearch();
}

function renderTableBannerDeleted() {
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: '/admin/banner/delete',
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
        renderListDelete(data);
    });
}

function renderListDelete(data) {
    var xquery = `
            <div class="nav-content d-flex justify-content-between p-2">
                <div class="nav-content-1 d-flex">
                    <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('banner')">Danh sách ảnh bìa</a></div>
                </div>
                <div class="nav-content-2">
                    <form action="#" method="get" id="formSearchBannerDeleted">
                        <div class="input-group" style="width: 300px;">
                            <input type="text" class="form-control" placeholder="Tìm kiếm">
                            <button class="btn btn-primary" type="submit">Tìm kiếm</button>
                        </div>
                    </form>
                </div>
            </div>`;
    var xthead = `
                <thead>
                    <tr class="scrollable-wrapper">
                        <th scope="col">STT</th>
                        <th scope="col">Tiêu đề</th>
                        <th scope="col">Nội dung</th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col"></th>
                    </tr>
                </thead>`;
    var xtbody = '<tbody>';
    data.bannerList.map((item, index) => {
        xtbody += `
                <tr>
                    <th class="td-center" scope="row">${index + 1}</th>
                    <td class="td-center">${item.title}</td>
                    <td class="td-center">${item.content}</td>
                    <td class="td-center"><img width=100 height=70 src="/public/images/background/${item.images}"/></td>
                    <td class="td-center impact-event">
                        <button type="button" class="btn btn-primary btn-sm return" data-id="${item._id}">Khôi phục</button>
                        <button type="button" class="btn btn-danger btn-sm high" data-id="${item._id}">Xóa vĩnh viễn</button>
                    </td>
                </tr>
            `;
    });
    xtbody += '</tbody>';
    contentTable("Ảnh bìa đã xóa", xquery, xthead, xtbody, false);
    pageNavigation(data.pagePre, data.pageActive, data.pageNext);
    btnDeletedReturn(formBannerDeletedReturn);
    btnDeletedHigh(formBannerDeletedHigh);
    renderTableBannerSearch();
}

function renderTableBannerSearch() {
    const search = $('#table-role #formSearchBanner');
    const searchDeleted = $('#table-role #formSearchBannerDeleted');
    if (search) {
        search.submit(function(e) {
            e.preventDefault();
            const input = search.find('input');
            const table = $('#table-role tbody');
            table.html(` <tr>
            <th class="td-center" scope="row">1</th>
            <td class="td-center">item 1</td>
            <td class="td-center">item 2</td>
            <td class="td-center">item 3</td>
            <td class="td-center impact-event">
                <button type="button" class="btn btn-primary btn-sm edit" data-id="1">Sửa</button>
                <button type="button" class="btn btn-danger btn-sm deleted" data-id="2">Xóa</button>
            </td>
        </tr>`);
            btnDeleted(formBannerDeleted);
            btnEditer(formBannerEditer);
        });
    }
    if (searchDeleted) {
        searchDeleted.submit(function(e) {
            e.preventDefault();
            const input = searchDeleted.find('input');
            const table = $('#table-role tbody');
            table.html(` <tr>
            <th class="td-center" scope="row">1</th>
            <td class="td-center">item 1</td>
            <td class="td-center">item 2</td>
            <td class="td-center">item 3</td>
            <td class="td-center impact-event">
                <button type="button" class="btn btn-primary btn-sm return" data-id="1">Khôi phục</button>
                <button type="button" class="btn btn-danger btn-sm high" data-id="2">Xóa vĩnh viễn</button>
            </td>
        </tr>`);
            btnDeletedReturn(formBannerDeletedReturn);
            btnDeletedHigh(formBannerDeletedHigh);
        });
    }
}
// add new banner
function formBanner() {
    var xhtml = `
        <div>
            <label class="form-label">Tiêu đề</label>
            <input type="text" class="form-control" name="title" maxlength="30">
            <div></div>
        </div>
        <div>
            <label class="form-label">Nội dung</label>
            <input type="text" class="form-control" name="content" maxlength="30">
            <div></div>
        </div>
        <div>
            <label class="form-label">Hình ảnh</label>
            <input type="file" class="form-control" name="images">
            <div></div>
        </div>
        `;
    showModal("formBannerAddnew", "post", "Thêm ảnh bìa", xhtml, function(data) {
        var error = {};
        // xử lý các giá trị biểu mẫu
        if (data.title.length < 1) {
            error.title = "Tiêu đề không được rỗng!";
        } else if (data.title.length > 30) {
            error.title = "Tiêu đề không quá 30 kí tự!";
        }
        if (data.content.length < 1) {
            error.content = "Nội dung không được rỗng!";
        } else if (data.content.length > 30) {
            error.content = "Nội dung không quá 30 kí tự!";
        }
        if (data.images.length < 1) {
            error.images = "Vui lòng chọn ảnh!";
        }
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        let formData = new FormData($('#formBannerAddnew')[0]);
        $.ajax({
            url: '/admin/banner/create',
            type: "POST",
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
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
                    returnNavBar('banner');
                }, 1000);
            }, 1000);
        });
    });
};

function formBannerEditer({ token, id }) {
    $.ajax({
        url: `/admin/banner/${id}/edit`,
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
            <label class="form-label">Tiêu đề</label>
            <input type="text" class="form-control" name="title" value="${data.title}" maxlength="30">
            <div></div>
        </div>
        <div>
            <label class="form-label">Nội dung</label>
            <input type="text" class="form-control" name="content" value="${data.content}" maxlength="30">
            <div></div>
        </div>
        <div>
            <label class="form-label">Hình ảnh</label>
            <input type="file" class="form-control" name="images">
            <div><img class="images-edit" src="/public/images/background/${data.images}"/></div>
        </div>
        `;
        showModal("formBannerEdit", "post", "Xóa ảnh bìa", xhtml, function(data) {
            var error = {};
            // xử lý các giá trị biểu mẫu
            if (data.title.length < 1) {
                error.title = "Tiêu đề không được rỗng!";
            } else if (data.title.length > 30) {
                error.title = "Tiêu đề không quá 30 kí tự!";
            }
            if (data.content.length < 1) {
                error.content = "Nội dung không được rỗng!";
            } else if (data.content.length > 30) {
                error.content = "Nội dung không quá 30 kí tự!";
            }
            // xử lý sự kiện khi có lỗi
            if (Object.keys(error).length > 0) {
                throw JSON.stringify(error);
            }
            // call ajax to do something...
            let formData = new FormData($('#formBannerEdit')[0]);
            $.ajax({
                url: `/admin/banner/${id}/update`,
                type: "PUT",
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                enctype: 'multipart/form-data',
                processData: false,
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
                $('#myModal').modal('hide');
                setTimeout(function() {
                    showToast(data.message, "success");
                    returnNavBar('banner');
                }, 500);
            });
        });
    });
}

function formBannerDeleted(id) {
    var xhtml = `
        <div>
            <label class="form-label fw-bold fst-italic text-danger">Nhấn nút lưu để hoàn thành việc xóa ảnh bìa!!!</label>
            <input type="text" class="form-control" name="bannerId" value="${id}" hidden="true">
            <div></div>
        </div>
        `;
    showModal("formBannerDeleted", "post", "Xóa ảnh bìa", xhtml, function(data) {
        var error = {};
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: `/admin/banner/${data.bannerId}/delete`,
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
                    returnNavBar('banner');
                }, 1000);
            }, 1000);
        });
    });
}

function formBannerDeletedReturn(id) {
    var xhtml = `
        <div>
            <label class="form-label fw-bold fst-italic text-danger">Bạn muốn khôi phục ảnh bìa!</label>
            <input type="text" class="form-control" name="bannerId" value="${id}" hidden="true">
            <div></div>
        </div>
        `;
    showModal("formBannerDeletedReturn", "post", "Khôi phục ảnh bìa", xhtml, function(data) {
        var error = {};
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: `/admin/banner/${data.bannerId}/restore`,
            type: "PUT",
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
                    returnNavBar('banner');
                }, 1000);
            }, 1000);
        });
    });
}

function formBannerDeletedHigh(id) {
    var xhtml = `
        <div>
            <label class="form-label fw-bold fst-italic text-danger">Bạn muốn XÓA VĨNH VIỄN ảnh bìa!</label>
            <input type="text" class="form-control" name="bannerId" value="${id}" hidden="true">
            <div></div>
        </div>
        `;
    showModal("formBannerDeletedHigh", "post", "Xóa vĩnh viễn ảnh bìa", xhtml, function(data) {
        var error = {};
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: `/admin/banner/${data.bannerId}/destroy`,
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
                    renderTableBannerDeleted();
                }, 1000);
            }, 1000);
        });
    });
}