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

function renderTableProduct(search = '', page = undefined) {
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: `/admin/product/search?q=${search}&page=${page}`,
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
        renderListProduct(data, search);
    });
};

function renderListProduct(data, search) {
    var xquery = `
    <div class="nav-content d-flex justify-content-between p-2">
        <div class="nav-content-1 d-flex">
            <div class="nav-item position-relative border-right-solid-1 p-2"><a href="#">Công khai (<span class="text-secondary">${data.sumProduct}</span>) </a></div>
            <div class="nav-item position-relative border-right-solid-1 p-2"><a href="#">Thùng rác (<span class="text-secondary">${data.sumDeleted}</span>) </a></div>
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
            <tr class="scrollable-wrapper">
                <th scope="col">STT</th>
                <th scope="col">Ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Màu</th>
                <th scope="col">Giá</th>
                <th scope="col">Danh mục</th>
                <th scope="col">Ngày tạo</th>
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
                listColor += "- " + val.name;
                if (index < countColors - 1) {
                    listColor += "<br/>";
                }
            })
            let createdAt = moment(moment(item.createdAt).subtract(1, "days")).format("DD/MM/YYYY - HH:mm:ss");
            xtbody += `
                <tr>
                    <th class="td-center" scope="row">${data.STT + index}</th>
                    <td class="td-center" width="120">${listImg}</td>
                    <td class="td-center" width="170"><div clas="text-wrap">${item.name}</div></td>
                    <td class="td-center" width="120">${listColor}</td>
                    <td class="td-center">${new Intl.NumberFormat().format(item.price)}</td>
                    <td class="td-center" ><p class="text-capitalize">${item.categori}</p></td>
                    <td class="td-center">${createdAt}</td>
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
    let pagePre = (data.productsList.length > 0) ? data.pagePre : 1;
    //Show table
    contentTable("Quản lý sản phẩm", xquery, xthead, xtbody, true);
    pageNavigation(pagePre, data.pageActive, data.pageNext, 'renderProductPageOnClick');
    btnAddNew(apiFormProductCreate);
    btnDeleted(formProductDeleted);
    btnEditer(apiFormProductEditer);
}


function imagesPreviewProduct(input, placeToInsertImagePreview) {
    function FileListItems(files) {
        var b = new ClipboardEvent("").clipboardData || new DataTransfer()
        for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i])
        return b.files
    }
    if (input.files) {
        var filesAmount = (input.files.length > 4) ? 4 : input.files.length;
        if (input.files.length > 4) {
            var files = [];
            for (var i = 0; i < 4; i++) {
                files.push(input.files[i])
            }
            input.files = new FileListItems(files)
            showToast("Chỉ cho phép tối đa 4 ảnh.", "warning");
        }
        $(placeToInsertImagePreview).text("");
        for (i = 0; i < filesAmount; i++) {
            var reader = new FileReader();
            reader.onload = function(event) {
                $($.parseHTML('<img class="images-edit" />')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
            }
            reader.readAsDataURL(input.files[i]);
        }
    }

};

function apiFormProductCreate() {
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: `/admin/product/create`,
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
        formProductCreate(data);
    });

}

//Add new product
function formProductCreate(data) {
    let producer = '',
        categori = '';
    data.producer.forEach((item, index) => {
        producer += `<option value="${item._id}" >${item.name}</option>`;
    });
    data.categori.forEach((item, index) => {
        categori += `<option value="${item._id}" >${item.name}</option>`;
    });
    var xhtml = `
        <form id="productCreate">
            <div class="row color-mutiple">
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Tên sản phẩm</label>
                    <input type="text" class="form-control" name="name" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Giá</label>
                    <input type="text" class="form-control" name="price" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Màng hình</label>
                    <input type="text" class="form-control" name="sreen" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Hệ điều hành</label>
                    <input type="text" name="HDH" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Camera sau</label>
                    <input type="text" name="CameraAfter" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Camera trước</label>
                    <input type="text" name="CameraBefore" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Chip</label>
                    <input type="text" name="CPU" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">RAM</label>
                    <input type="text" name="RAM" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Bộ nhớ trong</label>
                    <input type="text" name="MemoryIn" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">SIM</label>
                    <input type="text" name="SIM" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Pin, Sạc</label>
                    <input type="text" name="Battery" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Giảm giá(%)</label>
                    <input type="text" name="sale" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" id="selected">
                    <label class="form-label">Nhà cung cấp</label>
                    <select name="reducers" class="selectpicker form-control" data-size="5" data-selected-text-format="count > 3" data-live-search="true" multiple title="Chọn nhà cung cấp...">
                        ${producer}
                    </select>
                    <div id="select-messege"></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" id="selected">
                    <label class="form-label">Danh mục</label>
                    <select name="categori" class="selectpicker form-control" data-size="5" data-selected-text-format="count > 3" data-live-search="true" title="Chọn nhà cung cấp...">
                        ${categori}
                    </select>
                    <div id="select-messege"></div>
                </div>
            </div>
            
            <div class="row color-mutiple">
                <h6>Màu sản phẩm</h6>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <label class="form-label">Màu 1</label>
                    <input type="text" name="nameColor1" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <label class="form-label">Màu 2</label>
                    <input type="text" name="nameColor2" class="form-control" value="">
                    <div></div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <label class="form-label">Hình ảnh 1</label>
                    <input class="form-control" name="images1" id="content-images" type="file" multiple="true" accept="image/png, image/jpeg">
                    <div></div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <label class="form-label">Hình ảnh 2</label>
                    <input class="form-control" name="images2" id="content-images" type="file" multiple="true" accept="image/png, image/jpeg">
                    <div></div>
                </div>
            </div>
            <div class="row color-mutiple">
                <textarea name="textContent" id="textContent" rows="10" cols="80">
                </textarea>
            </div>
            <div class="color-mutiple" style="display: flex; justify-content: flex-end;">
                <button type="submit" class="btn btn-primary" width="50">Lưu</button>
            </div>
        </form>
    `;
    contentTable("Thêm sản phẩm", xhtml, '', '', false);
    $('.selectpicker').selectpicker();
    CKEDITOR.replace('textContent', {
        extraPlugins: 'filebrowser',
        filebrowserBrowseUrl: '/list',
        filebrowserUploadMethod: 'form',
        filebrowserUploadUrl: '/admin/product/images'
    });
    CKEDITOR.config.width = '100%';
    CKEDITOR.config.height = 400;

    let idForm = 'productCreate';
    //Hình ảnh 1
    $(`#${idForm} input[name="images1"]`).on('change', function() {
        imagesPreviewProduct(this, `#${idForm} input[name="images1"]~div`);
    });
    //Hình ảnh 2
    $(`#${idForm} input[name="images2"]`).on('change', function() {
        imagesPreviewProduct(this, `#${idForm} input[name="images2"]~div`);
    });

    formSubmitProduct(idForm, (data) => {
        var ckediter = CKEDITOR.instances.textContent.getData();
        var error = {};
        // xử lý các giá trị biểu mẫu
        if (data.name.length < 1) {
            error.name = "Tên sản phẩm không được rỗng!";
        } else if (data.name.length > 255) {
            error.name = "Tên sản phẩm không quá 255 kí tự!";
        }
        if (data.price.length < 1) {
            error.price = "Giá sản phẩm không được rỗng!";
        } else if (!isNumeric(data.price)) {
            error.price = "Giá sản phẩm phải là số dương!";
        } else if (data.price.length > 255) {
            error.price = "Giá sản phẩm không quá 255 kí tự!";
        }
        if (data.sale.length < 1) {
            error.sale = "Giảm giá sản phẩm không được rỗng!";
        } else if (!isNumeric(data.sale)) {
            error.sale = "Giảm giá sản phẩm phải là số dương!";
        } else if (data.sale.length > 3) {
            error.sale = "Giảm giá sản phẩm không quá 3 kí tự!";
        }
        if (data.sreen.length < 1) {
            error.sreen = "Màng hình không được rỗng!";
        } else if (data.sreen.length > 255) {
            error.sreen = "Màng hình không quá 255 kí tự!";
        }
        if (data.HDH.length < 1) {
            error.HDH = "Hệ điều hành không được rỗng!";
        } else if (data.HDH.length > 255) {
            error.HDH = "Hệ điều hành không quá 255 kí tự!";
        }
        if (data.CameraAfter.length < 1) {
            error.CameraAfter = "Camera sau không được rỗng!";
        } else if (data.CameraAfter.length > 255) {
            error.CameraAfter = "Camera sau không quá 255 kí tự!";
        }
        if (data.CameraBefore.length < 1) {
            error.CameraBefore = "Camera trước không được rỗng!";
        } else if (data.CameraBefore.length > 255) {
            error.CameraBefore = "Camera trước không quá 255 kí tự!";
        }
        if (data.CPU.length < 1) {
            error.CPU = "Chip không được rỗng!";
        } else if (data.CPU.length > 255) {
            error.CPU = "Chip không quá 255 kí tự!";
        }
        if (data.RAM.length < 1) {
            error.RAM = "RAM không được rỗng!";
        } else if (data.RAM.length > 255) {
            error.RAM = "RAM không quá 255 kí tự!";
        }
        if (data.MemoryIn.length < 1) {
            error.MemoryIn = "Bộ nhớ trong không được rỗng!";
        } else if (data.MemoryIn.length > 255) {
            error.MemoryIn = "Bộ nhớ trong không quá 255 kí tự!";
        }
        if (data.SIM.length < 1) {
            error.SIM = "SIM không được rỗng!";
        } else if (data.SIM.length > 255) {
            error.SIM = "SIM không quá 255 kí tự!";
        }
        if (data.Battery.length < 1) {
            error.Battery = "Pin, Sạc không được rỗng!";
        } else if (data.Battery.length > 255) {
            error.Battery = "Pin, Sạc không quá 255 kí tự!";
        }
        if (data.reducers.length < 1) {
            error.reducers = "Nhà cung cấp không được rỗng!";
        }
        if (data.categori.length < 1) {
            error.categori = "Danh mục không được rỗng!";
        }
        if (data.nameColor1.length < 1) {
            error.nameColor1 = "Màu 1 không được rỗng!";
        } else if (data.nameColor1.length > 255) {
            error.nameColor1 = "Màu 1 không quá 255 kí tự!";
        }
        if (data.nameColor2.length > 255) {
            error.nameColor2 = "Màu 2 không quá 255 kí tự!";
        }
        if (data.images1.length < 1) {
            error.images1 = "Hình ảnh 1 không được rỗng!";
        }
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        let formData = new FormData($(`#${idForm}`)[0]);
        formData.append('textContent', ckediter);
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: '/admin/product/create',
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
                if (data.status) {
                    showToast(data.message, "success");
                    setTimeout(function() {
                        returnNavBar('product');
                    }, 1000);
                } else {
                    showToast(data.message, "error");
                }
            }, 1000);
        });
    })
};

function formSubmitProduct(idForm, callback) {
    var submitForm = document.getElementById(idForm);
    // check size
    // var size = Object.keys(data).length;
    submitForm.onsubmit = function(e) {
        e.preventDefault();
        try {
            var listInput = submitForm.querySelectorAll("input");
            var listSelected = submitForm.querySelectorAll("select");
            var data = {};
            listInput.forEach((input, index) => {
                if (input.type === "radio" && input.checked == false) {
                    return;
                }
                if (input.type === "checkbox" && input.checked == false) {
                    return;
                }
                if (input.type === "search") {
                    return;
                }
                data[`${input.name}`] = input.value;
            });
            listInput.forEach((input, index) => {
                if (input.type === "search") {
                    return;
                }
                input.classList = "form-control";
                input.classList = "form-control is-valid";
                input.parentElement.querySelector('div').classList = "valid-feedback";
                input.parentElement.querySelector('div').textContent = "";
            });
            listSelected.forEach((select) => {
                select.classList = "selectpicker form-control";
                select.classList = "selectpicker form-control is-valid";
                select.closest('#selected').querySelector('.bootstrap-select').classList = "dropdown bootstrap-select show-tick form-control is-valid";
            })
            listSelected.forEach((item) => {
                data[`${item.name}`] = $(item).val();
            });
            callback(data);
        } catch (error) {
            var objError = JSON.parse(error);
            if (Object.keys(JSON.parse(error)).length > 0) {
                var objArr = Object.keys(JSON.parse(error));
                objArr.forEach(val => {
                    listInput.forEach((input, index) => {
                        if (input.name == val) {
                            input.classList = "form-control";
                            input.classList = "form-control is-invalid";
                            input.parentElement.querySelector('div').classList = "invalid-feedback";
                            input.parentElement.querySelector('div').textContent = objError[`${val}`];
                        }
                    })
                    listSelected.forEach((select) => {
                        if (select.name == val) {
                            select.classList = "selectpicker form-control";
                            select.classList = "selectpicker form-control is-invalid";
                            select.closest('#selected').querySelector('#select-messege').classList = "invalid-feedback";
                            select.closest('#selected').querySelector('.bootstrap-select').classList = "dropdown bootstrap-select show-tick form-control is-invalid";
                            select.closest('#selected').querySelector('#select-messege').textContent = objError[`${val}`];
                        }
                    })
                })
            }
        }
    };
};

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
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: `/admin/product/${data.productId}/delete`,
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
                    returnNavBar('product');
                }, 1000);
            }, 1000);
        });

    });
}


//Add new product
function apiFormProductEditer({ token, id }) {
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
        formProductEditer(data);
    });
}

function formProductEditer(data) {
    console.log(data);
    let producer = '',
        categori = '',
        images1 = '',
        images2 = '',
        nameColor1 = data.product.colors[0].name,
        nameColor2 = ((data.product.colors.length > 1) ? data.product.colors[1].name : ''),
        arrSelected = [];
    data.selectProducer.forEach((item, index) => {
        if (item.checked) {
            arrSelected.push(item._id)
        }
        producer += `<option value="${item._id}" >${item.name}</option>`;
    });
    data.selectCategori.forEach((item, index) => {
        if (item.checked) {
            arrSelected.push(item._id)
        }
        categori += `<option value="${item._id}" >${item.name}</option>`;
    });
    data.product.colors.forEach((color, index) => {
        if (index === 0) {
            color.secImg.forEach((item) => {
                images1 += `<img class="images-edit" src="/public/images/products/${item}"/>`;
            })
        } else {
            color.secImg.forEach((item) => {
                images2 += `<img class="images-edit" src="/public/images/products/${item}"/>`;
            })
        }
    })
    var xhtml = `
        <form id="productCreate">
            <div class="row color-mutiple">
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Tên sản phẩm</label>
                    <input type="text" class="form-control" name="name" value="${data.product.name}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Giá</label>
                    <input type="text" class="form-control" name="price" value="${data.product.price}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Màng hình</label>
                    <input type="text" class="form-control" name="sreen" value="${data.product.sreen}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Hệ điều hành</label>
                    <input type="text" name="HDH" class="form-control" value="${data.product.HDH}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Camera sau</label>
                    <input type="text" name="CameraAfter" class="form-control" value="${data.product.CameraAfter}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Camera trước</label>
                    <input type="text" name="CameraBefore" class="form-control" value="${data.product.CameraBefore}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Chip</label>
                    <input type="text" name="CPU" class="form-control" value="${data.product.CPU}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">RAM</label>
                    <input type="text" name="RAM" class="form-control" value="${data.product.RAM}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Bộ nhớ trong</label>
                    <input type="text" name="MemoryIn" class="form-control" value="${data.product.MemoryIn}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">SIM</label>
                    <input type="text" name="SIM" class="form-control" value="${data.product.SIM}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Pin, Sạc</label>
                    <input type="text" name="Battery" class="form-control" value="${data.product.Battery}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <label class="form-label">Giảm giá(%)</label>
                    <input type="text" name="sale" class="form-control" value="${data.product.sale}">
                    <div></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" id="selected">
                    <label class="form-label">Nhà cung cấp</label>
                    <select name="reducers" class="selectpicker form-control" data-size="5" data-selected-text-format="count > 3" data-live-search="true" multiple title="Chọn nhà cung cấp...">
                        ${producer}
                    </select>
                    <div id="select-messege"></div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" id="selected">
                    <label class="form-label">Danh mục</label>
                    <select name="categori" class="selectpicker form-control" data-size="5" data-selected-text-format="count > 3" data-live-search="true" title="Chọn nhà cung cấp...">
                        ${categori}
                    </select>
                    <div id="select-messege"></div>
                </div>
            </div>
            
            <div class="row color-mutiple">
                <h6>Màu sản phẩm</h6>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <label class="form-label">Màu 1</label>
                    <input type="text" name="nameColor1" class="form-control" value="${nameColor1}">
                    <div></div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <label class="form-label">Màu 2</label>
                    <input type="text" name="nameColor2" class="form-control" value="${nameColor2}">
                    <div></div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <label class="form-label">Hình ảnh 1</label>
                    <input class="form-control" name="images1" id="content-images" type="file" multiple="true" accept="image/png, image/jpeg">
                    <div>${images1}</div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <label class="form-label">Hình ảnh 2</label>
                    <input class="form-control" name="images2" id="content-images" type="file" multiple="true" accept="image/png, image/jpeg">
                    <div>${images2}</div>
                </div>
            </div>
            <div class="row color-mutiple">
                <textarea name="textContent" id="textContent" rows="10" cols="80">
                ${data.product.content}
                </textarea>
            </div>
            <div class="color-mutiple" style="display: flex; justify-content: flex-end;">
                <button type="submit" class="btn btn-primary" width="50">Lưu</button>
            </div>
        </form>
    `;
    contentTable("Thêm sản phẩm", xhtml, '', '', false);
    $('.selectpicker').selectpicker('val', arrSelected);
    CKEDITOR.replace('textContent', {
        extraPlugins: 'filebrowser',
        filebrowserBrowseUrl: '/list',
        filebrowserUploadMethod: 'form',
        filebrowserUploadUrl: '/admin/product/images'
    });
    CKEDITOR.config.width = '100%';
    CKEDITOR.config.height = 400;
    let idForm = 'productCreate';
    //Hình ảnh 1
    $(`#${idForm} input[name="images1"]`).on('change', function() {
        imagesPreviewProduct(this, `#${idForm} input[name="images1"]~div`);
    });
    //Hình ảnh 2
    $(`#${idForm} input[name="images2"]`).on('change', function() {
        imagesPreviewProduct(this, `#${idForm} input[name="images2"]~div`);
    });

    formSubmitProduct(idForm, (data) => {
        var data_content = CKEDITOR.instances.textContent.getData();
        console.log("data_content", data_content);
        return;
        var error = {};
        // xử lý các giá trị biểu mẫu
        if (data.name.length < 1) {
            error.name = "Tên sản phẩm không được rỗng!";
        } else if (data.name.length > 255) {
            error.name = "Tên sản phẩm không quá 255 kí tự!";
        }
        if (data.price.length < 1) {
            error.price = "Giá sản phẩm không được rỗng!";
        } else if (!isNumeric(data.price)) {
            error.price = "Giá sản phẩm phải là số dương!";
        } else if (data.price.length > 255) {
            error.price = "Giá sản phẩm không quá 255 kí tự!";
        }
        if (data.sale.length < 1) {
            error.sale = "Giảm giá sản phẩm không được rỗng!";
        } else if (!isNumeric(data.sale)) {
            error.sale = "Giảm giá sản phẩm phải là số dương!";
        } else if (data.sale.length > 3) {
            error.sale = "Giảm giá sản phẩm không quá 3 kí tự!";
        }
        if (data.sreen.length < 1) {
            error.sreen = "Màng hình không được rỗng!";
        } else if (data.sreen.length > 255) {
            error.sreen = "Màng hình không quá 255 kí tự!";
        }
        if (data.HDH.length < 1) {
            error.HDH = "Hệ điều hành không được rỗng!";
        } else if (data.HDH.length > 255) {
            error.HDH = "Hệ điều hành không quá 255 kí tự!";
        }
        if (data.CameraAfter.length < 1) {
            error.CameraAfter = "Camera sau không được rỗng!";
        } else if (data.CameraAfter.length > 255) {
            error.CameraAfter = "Camera sau không quá 255 kí tự!";
        }
        if (data.CameraBefore.length < 1) {
            error.CameraBefore = "Camera trước không được rỗng!";
        } else if (data.CameraBefore.length > 255) {
            error.CameraBefore = "Camera trước không quá 255 kí tự!";
        }
        if (data.CPU.length < 1) {
            error.CPU = "Chip không được rỗng!";
        } else if (data.CPU.length > 255) {
            error.CPU = "Chip không quá 255 kí tự!";
        }
        if (data.RAM.length < 1) {
            error.RAM = "RAM không được rỗng!";
        } else if (data.RAM.length > 255) {
            error.RAM = "RAM không quá 255 kí tự!";
        }
        if (data.MemoryIn.length < 1) {
            error.MemoryIn = "Bộ nhớ trong không được rỗng!";
        } else if (data.MemoryIn.length > 255) {
            error.MemoryIn = "Bộ nhớ trong không quá 255 kí tự!";
        }
        if (data.SIM.length < 1) {
            error.SIM = "SIM không được rỗng!";
        } else if (data.SIM.length > 255) {
            error.SIM = "SIM không quá 255 kí tự!";
        }
        if (data.Battery.length < 1) {
            error.Battery = "Pin, Sạc không được rỗng!";
        } else if (data.Battery.length > 255) {
            error.Battery = "Pin, Sạc không quá 255 kí tự!";
        }
        if (data.reducers.length < 1) {
            error.reducers = "Nhà cung cấp không được rỗng!";
        }
        if (data.categori.length < 1) {
            error.categori = "Danh mục không được rỗng!";
        }
        if (data.nameColor1.length < 1) {
            error.nameColor1 = "Màu 1 không được rỗng!";
        } else if (data.nameColor1.length > 255) {
            error.nameColor1 = "Màu 1 không quá 255 kí tự!";
        }
        if (data.nameColor2.length > 255) {
            error.nameColor2 = "Màu 2 không quá 255 kí tự!";
        }
        if (data.images1.length < 1) {
            error.images1 = "Hình ảnh 1 không được rỗng!";
        }
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        let formData = new FormData($(`#${idForm}`)[0]);
        formData.append('textContent', data_content);
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: '/admin/product/create',
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
            console.log(data);
            setTimeout(function() {
                $('#myModal').modal('hide');
                showToast(data.message, "success");
                setTimeout(function() {
                    returnNavBar('product');
                }, 1000);
            }, 1000);
        });
    })
};