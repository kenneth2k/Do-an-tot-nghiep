function renderTableBanner() {
    var xquery = `
    <div class="nav-content d-flex justify-content-between p-2">
        <div class="nav-content-1 d-flex">
            <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('banner')">Công khai (<span class="text-secondary">1</span>) </a></div>
            <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="renderTableBannerDeleted()">Thùng rác (<span class="text-secondary">0</span>) </a></div>
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
                <th scope="col">Tiêu đề</th>
                <th scope="col">Nội dung</th>
                <th scope="col">Hình ảnh</th>
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
                <td class="td-center impact-event">
                    <button type="button" class="btn btn-primary btn-sm edit" data-id="1">Sửa</button>
                    <button type="button" class="btn btn-danger btn-sm deleted" data-id="2">Xóa</button>
                </td>
            </tr>
        </tbody>
    `;
    contentTable("Quản lý ảnh bìa", xquery, xthead, xtbody);
    pageNavigation(1, 1, 1);
}

function renderTableBannerDeleted() {
    showLoadingTable();
    setTimeout(function() {
        var xquery = `
        <div class="nav-content d-flex justify-content-between p-2">
            <div class="nav-content-1 d-flex">
                <div class="nav-item position-relative border-right-solid-1 p-2"><a href="javascript:;" onclick="returnNavBar('banner')">Danh sách ảnh bìa</a></div>
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
                    <th scope="col">Tiêu đề</th>
                    <th scope="col">Nội dung</th>
                    <th scope="col">Hình ảnh</th>
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
                    <td class="td-center impact-event">
                        <button type="button" class="btn btn-primary btn-sm edit" data-id="1">Khôi phục</button>
                        <button type="button" class="btn btn-danger btn-sm deleted" data-id="2">Xóa vĩnh viễn</button>
                    </td>
                </tr>
            </tbody>
        `;
        contentTable("Ảnh bìa đã xóa", xquery, xthead, xtbody, false);
        pageNavigation(0, 1, 1);
        hideLoadingTable();
    }, 1000);
}

function renderTableBannerSearch(role) {
    let xhtml = ``;

}
// add new banner
function formBanner() {
    var xhtml = `
        <div>
            <label class="form-label">Tiêu đề</label>
            <input type="text" class="form-control" name="title">
            <div></div>
        </div>
        <div>
            <label class="form-label">Nội dung</label>
            <input type="text" class="form-control" name="content">
            <div></div>
        </div>
        <div>
            <label class="form-label">Hình ảnh</label>
            <input type="file" class="form-control" name="images">
            <div></div>
        </div>
        `;
    showModal("formBannerAddnew", "post", "Xóa ảnh bìa", xhtml, function(data) {
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
                    showToast('Cập nhật thành công', "success")
                }, 500);
            }, 500);
        }, 2000);
    });
};

function formBannerEditer() {
    var xhtml = `
        <div>
            <label class="form-label">Tiêu đề</label>
            <input type="text" class="form-control" name="title">
            <div></div>
        </div>
        <div>
            <label class="form-label">Nội dung</label>
            <input type="text" class="form-control" name="content">
            <div></div>
        </div>
        <div>
            <label class="form-label">Hình ảnh</label>
            <input type="file" class="form-control" name="images">
            <div></div>
        </div>
        `;
    showModal("formBannerAddnew", "post", "Xóa ảnh bìa", xhtml, function(data) {
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
                    showToast('Cập nhật thành công', "success")
                }, 500);
            }, 500);
        }, 2000);
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
                    showToast('Cập nhật thành công', "success")
                }, 500);
            }, 500);
        }, 2000);
    });
}