function renderTableWarehouse(search = '', page = undefined, categori = 'all') {
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: `/admin/product/search?q=${search}&page=${page}&categori=${categori}`,
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
        renderListWarehouse(data, search, categori);
    });
};

function renderListWarehouse(data, search, categori) {
    let category = '<option value="all">Tất cả</option>';
    data.categories.forEach((value, index) => {
        category += `<option value="${value.slug}">${value.name}</option>`;
    })
    var xquery = `
    <div class="nav-content d-flex justify-content-between p-2">
        <div class="nav-content-1 d-flex">
            <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('warehouse')">Danh sách phiếu nhập</a></div>
        </div>
        <div class="nav-content-2">
            <form action="#" method="get" id="formSearchWarehouse" style="width: 500px;display: flex; justify-content: space-between;">
                <div class="input-group border border-primary" style="width: 170px;">
                    <select name="categori" class="selectpicker form-control" data-size="5" data-selected-text-format="count > 3" data-live-search="true">
                        ${category}
                    </select>
                </div>
                <div class="input-group" style="width: 300px;">
                    <input name="search" type="text" class="form-control" placeholder="Tìm kiếm" value="${search}">
                    <button class="btn btn-primary" type="submit">Tìm kiếm</button>
                </div>
            </form>
        </div>
    </div>
    `;
    var xthead = `
        <thead>
            <tr class="scrollable-wrapper">
                <th scope="col">STT</th>
                <th scope="col">Ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Màu / Số lượng</th>
                <th scope="col"></th>
            </tr>
        </thead>
    `;
    var xtbody = '<tbody>';
    if (data.productsList.length > 0) {
        data.productsList.map((item, index) => {
            let listImg = '';
            item.colors.map((val, index) => {
                listImg += `<img class="border border-dark p-1" src="/public/images/products/${val.bigImg}" width="100" height="70"/>`;
            })
            let listColor = '';
            let countColors = item.colors.length;
            item.colors.map((val, index) => {
                listColor += "- " + val.name + ` (<span style="color: red;"> ${val.quantity} </span>)`;
                if (index < countColors - 1) {
                    listColor += "<br/>";
                }
            })
            xtbody += `
                <tr>
                    <th class="td-center" scope="row">${data.STT + index}</th>
                    <td class="td-center" >${listImg}</td>
                    <td class="td-center"><div clas="text-wrap">${item.name}</div></td>
                    <td class="td-center">${listColor}</td>
                    <td class="td-center impact-event">
                        <button type="button" class="btn btn-primary btn-sm edit" data-id="${item._id}">Nhập thêm</button>
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
    let pagePre = (data.productsList.length > 0) ? data.pagePre : 1;
    //Show table
    contentTable("Quản lý nhập kho - Nhập thêm số lượng sản phẩm", xquery, xthead, xtbody, false);
    $('.selectpicker').selectpicker('val', [categori]);
    pageNavigation(pagePre, data.pageActive, data.pageNext, 'renderWarehousePageOnClick');
    renderTableWarehouseSearch();
    btnEditer(formWarehouseEditer);
};
//Chọn trang hiển thị
function renderWarehousePageOnClick(page) {
    let content = $('#formSearchWarehouse').find('input[type="text"').val();
    let categori = $('#formSearchWarehouse').find('select[name="categori"]').val();
    renderTableWarehouse(content, page, categori);
};
// Tìm kiếm sản phẩm
function renderTableWarehouseSearch() {
    const search = $('#table-role #formSearchWarehouse');
    if (search) {
        search.submit(function(e) {
            e.preventDefault();
            let input = search.find('input[name="search"]').val();
            let cate = search.find('select[name="categori"]').val();
            renderTableWarehouse(input, undefined, cate);
        });
    }
};

//Cập nhật mới sản phẩm

function formWarehouseEditer({ token, id }) {
    $.ajax({
        url: `/admin/product/${id}/edit`,
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
        let quantitys = '';
        data.product.colors.forEach((color, index) => {
            quantitys += `
                <div>
                    <label class="form-label">${color.name} - (<span style="color: red;"> ${color.quantity} </span>)</label>
                    <input type="text" class="form-control" name="${color._id}" value="0" maxlength="100">
                    <div></div>
                </div>
            `;
        })
        var xhtml = `
        
        ${quantitys}`;
        showModal("formWarehouseEdit", "post", "Thêm số lượng sản phẩm - " + data.product.name, xhtml, function(data) {
            var error = {};
            // xử lý các giá trị biểu mẫu
            let keyData = Object.keys(data);
            keyData.forEach((key) => {
                if (data[key] < 0) {
                    error[`${key}`] = 'Số lượng lớn hơn hoặc bằng 0.';
                } else if (!isNumeric(data[key])) {
                    error[`${key}`] = 'Vui lòng nhập kiểu số nguyên.';
                }
            });
            // xử lý sự kiện khi có lỗi
            if (Object.keys(error).length > 0) {
                throw JSON.stringify(error);
            }
            data.id = id;
            // call ajax to do something...
            $.ajax({
                url: `/admin/warehouse/create`,
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
                if (data.status === true) {
                    $('#myModal').modal('hide');
                    setTimeout(function() {
                        showToast(data.message, "success");
                        renderTableWarehouse();
                    }, 500);
                } else {
                    showToast(data.message, "error");
                }
            });
        });
    });
}