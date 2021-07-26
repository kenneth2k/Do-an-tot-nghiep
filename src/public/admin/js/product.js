$('.cbo-m-select__dropdown-item input').click(function(e) {
    var listInput = $('.cbo-m-select__dropdown-item input[type="checkbox"]:checked');
    var listID = [];
    if (listInput.length > 0) {
        let text = '';
        listInput.each(function(index, val) {
            text += $(val).val() + ',';
            listID.push($(val).data('id'));
        });
        if ($('.cbo-m-select__primary').hasClass('is-invalid')) {
            $('.cbo-m-select__primary').removeClass('is-invalid');
            $('.cbo-m-select__primary').addClass('is-valid');
        } else {
            $('.cbo-m-select__primary').addClass('is-valid');
        }
        $('.cbo-m-select__text').text(text.substr(0, text.length - 1));
        $('.cbo-m-select input[type="text"]').val(JSON.stringify(listID));
    } else {
        $('.cbo-m-select__primary').removeClass('is-invalid');
        $('.cbo-m-select__primary').removeClass('is-valid');
        $('.cbo-m-select__primary').addClass('is-invalid');
        $('.cbo-m-select__text').text('Vui lòng chọn');
        $('.cbo-m-select input[type="text"]').val('');
    }
});

function loadTableProduct() {
    var xquery = `
    <div class="nav-content d-flex justify-content-between p-2">
        <div class="nav-content-1 d-flex">
            <div class="nav-item position-relative border-right-solid-1 p-2"><a href="#">Công khai (<span class="text-secondary">1</span>) </a></div>
            <div class="nav-item position-relative border-right-solid-1 p-2"><a href="#">Thùng rác (<span class="text-secondary">0</span>) </a></div>
        </div>
        <div class="nav-content-2">
            <form action="#" method="get">
                <div class="input-group" style="width: 300px;">
                    <input type="text" class="form-control" placeholder="Tìm kiếm" aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button class="btn btn-primary" type="submit">Tìm kiếm</button>
                </div>
            </form>
        </div>
    </div>
    `;
    var xthead = `
        <thead>
            <tr>
                <th scope="col">STT</th>
                <th scope="col">Hình</th>
                <th scope="col">Tên</th>
                <th scope="col">Giá</th>
                <th scope="col">địa chỉ</th>
                <th scope="col">địa chỉ</th>
                <th scope="col">địa chỉ</th>
                <th scope="col">địa chỉ</th>
                <th scope="col">địa chỉ</th>
                <th scope="col"></th>
            </tr>
        </thead>
    `;
    var xtbody = `
        <tbody>
            <tr>
                <th class="td-center" scope="row">1</th>
                <td class="td-center">item 1</td>
                <td class="td-center">item 2</td>
                <td class="td-center">item 3</td>
                <td class="td-center">item 4</td>
                <td class="td-center">item 4</td>
                <td class="td-center">item 4</td>
                <td class="td-center">item 4</td>
                <td class="td-center">item 4</td>
                <td class="td-center impact-event">
                    <button type="button" class="btn btn-primary btn-sm edit" data-id="1">Sửa</button>
                    <button type="button" class="btn btn-danger btn-sm deleted" data-id="2">Xóa</button>
                </td>
            </tr>
        </tbody>
    `;
    contentTable("Quản lý sản phẩm", xquery, xthead, xtbody);
}

// add new product
function formProduct() {
    var xhtml = `
    <div class="body-content__title justify-content-start">
    <a href="#" style="line-height: 40px; padding-right: 10px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
          </svg> quay lại</a>
    <h5>Thêm sản phẩm</h5>
</div>
<div class="row">
    <form class="row needs-validation" action="#" method="post">
        <div class="col-lg-4 col-md-6 col-sm-12">
            <label class="form-label">Màng hình</label>
            <input type="text" class="form-control" name="sreen" value="">
            <div></div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <label class="form-label">Hệ điều hành</label>
            <input type="text" name="HDH" class="form-control">
            <div></div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <label class="form-label">Camera sau</label>
            <input type="text" name="CameraAfter" class="form-control">
            <div></div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <label class="form-label">Camera trước</label>
            <input type="text" name="CameraBefore" class="form-control">
            <div></div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <label class="form-label">Chip</label>
            <input type="text" name="CPU" class="form-control">
            <div></div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <label class="form-label">RAM</label>
            <input type="text" name="RAM" class="form-control">
            <div></div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <label class="form-label">Bộ nhớ trong</label>
            <input type="text" name="MemoryIn" class="form-control">
            <div></div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <label class="form-label">SIM</label>
            <input type="text" name="SIM" class="form-control">
            <div></div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <label class="form-label">Pin, Sạc</label>
            <input type="text" name="Battery" class="form-control">
            <div></div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="cbo-m-select__content">
                <label class="form-label">Chọn nhà cung cấp</label>
                <div class="cbo-m-select">
                    <input type="text" name="cbo" hidden="true">
                    <div class="btn dropdown-toggle cbo-m-select__text cbo-m-select__primary">
                        Vui lòng chọn
                    </div>
                    <div class="invalid-feedback">
                        Vui lòng chọn nhà cung cấp
                    </div>
                    <div class="cbo-m-select__dropdown-menu">
                        <div class="cbo-m-select__dropdown-item">
                            <input type="checkbox" data-id="f1" value="Default checkbox f1" id="f1">
                            <label for="f1">
                                    Default checkbox f1
                                </label>
                        </div>
                        <div class="cbo-m-select__dropdown-item">
                            <input type="checkbox" data-id="f2" value="Default checkbox f2" value="2" id="f2">
                            <label for="f2">
                                    Default checkbox f2
                                </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="color-mutiple">
                <div class="color-title">
                    <label class="form-label">Màu sản phẩm</label>
                </div>
                <div class="color-content">
                    <div class="color-single">
                        <div class="color-single-title">Màu 1</div>
                        <div class="color-single-name">
                            <label for="#">Tên: </label>
                            <input type="text" value="Vàng nầu">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
        `;
    $("#table-role").html(xhtml);
};

function formProductEditer() {
    formProduct();
}

function formProductDeleted(id) {
    var xhtml = `
        <div>
            <label class="form-label fw-bold fst-italic text-danger">Nhấn nút lưu để hoàn thành việc xóa sản phẩm!!!</label>
            <input type="text" class="form-control" name="productId" value="${id}" hidden="true">
            <div></div>
        </div>
        `;
    showModal("formProductDeleted", "post", "Xóa sản phẩm", xhtml, function(data) {
        var error = {};
        // xử lý các giá trị biểu mẫu
        // if (data.name === "") {
        //     error.name = "sadsad!";
        // }
        // if (data.email === "") {
        //     error.email = "Vui lòng nhập email!";
        // }
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // gọi ajax to do something...
        console.log("wait");
        addLoadingPage();
        // ajax response
        setTimeout(function() {
            removeLoadingPage();
            setTimeout(function() {
                $('#myModal').modal('hide');
                setTimeout(function() {
                    showToast(message.deleteSuccess, "success")
                }, 500);
            }, 500);
        }, 2000);
    });
}