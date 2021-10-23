function renderTableCategory(search = '', page = undefined) {
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: `/admin/category/search?q=${search}&page=${page}`,
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
        renderListCategory(data, search);
    });
};

function renderListCategory(data, search) {
    var xquery = `
            <div class="nav-content d-flex justify-content-between p-2">
                <div class="nav-content-1 d-flex">
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('category')">Công khai (<span class="text-secondary">${data.sumCategory}</span>) </a></div>
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="renderTableCategoryDeleted()">Thùng rác (<span class="text-secondary">${data.sumDeleted}</span>) </a></div>
                </div>
                <div class="nav-content-2">
                    <form action="#" method="get" id="formSearchCategory">
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
                        <th scope="col">Slug</th>
                        <th scope="col"></th>
                    </tr>
                </thead>`;
    var xtbody = '<tbody>';
    if (data.categoryList.length > 0) {
        data.categoryList.map((item, index) => {
            xtbody += `
                    <tr>
                        <th class="td-center" scope="row">${parseInt(data.STT) + index}</th>
                        <td class="td-center">${item.name}</td>
                        <td class="td-center">${(item.slug=='')?'&#47;':item.slug}</td>
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
    let pagePre = (data.categoryList.length > 0) ? data.pagePre : 1;
    //Show table
    contentTable("Quản lý danh mục", xquery, xthead, xtbody, true);
    pageNavigation(pagePre, data.pageActive, data.pageNext, 'renderCategoryPageOnClick');
    btnDeleted(formCategoryDeleted);
    btnEditer(formCategoryEditer);
    btnAddNew(formCategoryCreate);
    renderTableCategorySearch();
}

function formCategoryDeleted(id) {
    var xhtml = `
        <div>
            <label class="form-label fw-bold fst-italic text-danger">Nhấn nút lưu để hoàn thành việc xóa danh mục!!!</label>
            <input type="text" class="form-control" name="categoryd" value="${id}" hidden="true">
            <div></div>
        </div>
        `;
    showModal("formCategoryDeleted", "post", "Xóa danh mục", xhtml, function(data) {
        var error = {};
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: `/admin/category/${data.categoryd}/delete`,
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
                showToast(data.message, "success");
                setTimeout(function() {
                    returnNavBar('category');
                }, 1000);
            }, 1000);
        });
    });
}

function renderTableCategorySearch() {
    const search = $('#table-role #formSearchCategory');
    if (search) {
        search.submit(function(e) {
            e.preventDefault();
            let input = search.find('input').val();
            renderTableCategory(input);
        });
    }
}
// Deleted

function renderTableCategoryDeleted(search = '', page = undefined) {
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: `/admin/category/delete/search?q=${search}&page=${page}`,
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
        renderListCategoryDeleted(data, search);
    });
};

function renderListCategoryDeleted(data, search) {

    var xquery = `
            <div class="nav-content d-flex justify-content-between p-2">
                <div class="nav-content-1 d-flex">
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('category')">Danh sách danh mục</a></div>
                </div>
                <div class="nav-content-2">
                    <form action="#" method="get" id="formSearchCategoryDeleted">
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
                        <th scope="col">Slug</th>
                        <th scope="col"></th>
                    </tr>
                </thead>`;
    var xtbody = '<tbody>';
    if (data.categoryList.length > 0) {
        data.categoryList.map((item, index) => {
            xtbody += `
                    <tr>
                        <th class="td-center" scope="row">${parseInt(data.STT) + index}</th>
                        <td class="td-center">${item.name}</td>
                        <td class="td-center">${(item.slug=='')?'&#47;':item.slug}</td>
                        <td class="td-center impact-event">
                        <button type="button" class="btn btn-primary btn-sm return" data-id="${item._id}">Khôi phục</button>
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
    let pagePre = (data.categoryList.length > 0) ? data.pagePre : 1;
    //Show table
    contentTable("Người dùng đã khóa", xquery, xthead, xtbody, false);
    pageNavigation(pagePre, data.pageActive, data.pageNext, 'renderCategoryPageOnClick');
    btnDeleted(formCategoryDeleted);
    btnDeletedReturn(formCategoryDeletedReturn);
    renderTablePCategoryDeletedSearch();
}

function formCategoryDeletedReturn(id) {
    var xhtml = `
        <div>
            <label class="form-label fw-bold fst-italic text-danger">Bạn muốn khôi phục danh mục!</label>
            <input type="text" class="form-control" name="userId" value="${id}" hidden="true">
            <div></div>
        </div>
        `;
    showModal("formCategoryDeletedReturn", "post", "Khôi phục danh mục", xhtml, function(data) {
        var error = {};
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: `/admin/category/${data.userId}/restore`,
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
                showToast(data.message, "success");
                setTimeout(function() {
                    returnNavBar('category');
                }, 1000);
            }, 1000);
        });
    });
}

function renderTablePCategoryDeletedSearch() {
    const search = $('#table-role #formSearchCategoryDeleted');
    if (search) {
        search.submit(function(e) {
            e.preventDefault();
            let input = search.find('input').val();
            renderTableCategoryDeleted(input);
        });
    }
}

function formCategoryEditer({ token, id }) {
    $.ajax({
        url: `/admin/category/${id}/edit`,
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
            <label class="form-label">Tên danh mục</label>
            <input type="text" class="form-control" name="name" value="${data.name}" maxlength="255">
            <div></div>
        </div>
        `;
        showModal("formCategoryEdit", "post", "Sửa danh mục", xhtml, function(data) {
            var error = {};
            // xử lý các giá trị biểu mẫu

            // xử lý sự kiện khi có lỗi
            if (Object.keys(error).length > 0) {
                throw JSON.stringify(error);
            }
            // call ajax to do something...
            $.ajax({
                url: `/admin/category/${id}/update`,
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
                    returnNavBar('category');
                }, 500);
            });
        });
    });
}

function formCategoryCreate() {
    var xhtml = `
        <div hidden="true">
            <label class="form-label">ID</label>
            <input type="text" class="form-control" name="id" />
            <div></div>
        </div>
        <div>
            <label class="form-label">Tên danh mục</label>
            <input type="text" class="form-control" name="name" maxlength="255">
            <div></div>
        </div>`;
    showModal("formCategoryAddnew", "post", "Thêm danh mục", xhtml, function(data) {
        var error = {};
        // xử lý các giá trị biểu mẫu
        if (data.name.length < 1) {
            error.name = "Tên danh mục không được rỗng!";
        } else if (data.name.length > 255) {
            error.name = "Tên danh mục không quá 255 kí tự!";
        }
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: '/admin/category/create',
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
                    returnNavBar('category');
                }, 1000);
            }, 1000);
        });
    });
};