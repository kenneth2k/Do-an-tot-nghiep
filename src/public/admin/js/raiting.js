function renderTableRaiting(dateBefore = undefined, dateAfter = undefined, page = undefined) {
    if (!dateBefore && !dateBefore) {
        dateBefore = dateAfter = new Date().toISOString().slice(0, 10);
    }
    // call ajax to do something...
    let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
    $.ajax({
        url: `/admin/raiting/search?dateBefore=${dateBefore}&dateAfter=${dateAfter}&page=${page}`,
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
        renderListRaiting(data, dateBefore, dateAfter);
    });
};

function renderListRaiting(data, dateBefore, dateAfter) {
    var xquery = `
    <div class="nav-content d-flex justify-content-between p-2">
        <div class="nav-content-1 d-flex">
        <div class="nav-item position-relative p-2">
                <div>Từ ngày:</div>
            </div>
            <div class="nav-item position-relative p-2">
                <div class="before">
                    <input type="date" value="${dateBefore}"/>
                </div>
            </div>
            <div class="nav-item position-relative p-2">
                <div>Đến ngày:</div>
            </div>
            <div class="nav-item position-relative p-2">
                <div class="after">
                    <input type="date" value="${dateAfter}"/>
                </div>
            </div>
        </div>
    </div>
    `;
    var xthead = `
                <thead>
                    <tr class="scrollable-wrapper">
                        <th scope="col">STT</th>
                        <th scope="col">Tên sản phẩm</th>
                        <th scope="col">Người đánh giá</th>
                        <th scope="col">Nội dung</th>
                        <th scope="col" style="text-align:center;">Số sao</th>
                        <th scope="col">Ảnh</th>
                        <th scope="col"></th>
                    </tr>
                </thead>`;
    var xtbody = '<tbody>';
    if (data.raitingList.length > 0) {
        data.raitingList.map((item, index) => {
            let listimg = '';
            item.images.map((img, index) => {
                listimg += `<img src="/public/images/comments/${img}" width="100" height="70"/>`;
            })
            xtbody += `
                    <tr>
                        <th class="td-center" scope="row">${parseInt(data.STT) + index}</th>
                        <td class="td-center" width=200>${item.product[0].name}</td>
                        <td class="td-center" width=200>${item.user[0].fullname}</td>
                        <td class="td-center" style="width:200px;word-wrap: break-word;text-align:justify;">${item.content}</td>
                        <td class="td-center" width=200 style="text-align:center;">${item.star}</td>
                        <td class="td-center" width=450>
                            ${listimg}
                        </td>
                        <td class="td-center impact-event">
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
    let pagePre = (data.raitingList.length > 0) ? data.pagePre : 1;
    //Show table
    contentTable("Quản lý đánh giá", xquery, xthead, xtbody, false);
    pageNavigation(pagePre, data.pageActive, data.pageNext, 'renderRaitingPageOnClick');
    btnDeleted(formRaitingDeleted);
    renderRaitingOnChangeDate();
}

function formRaitingDeleted(id) {
    var xhtml = `
        <div>
            <label class="form-label fw-bold fst-italic text-danger">Nhấn nút lưu để hoàn thành việc xóa đánh giá!!!</label>
            <input type="text" class="form-control" name="raitingId" value="${id}" hidden="true">
            <div></div>
        </div>
        `;
    showModal("formRaitingDeleted", "post", "Xóa đánh giá", xhtml, function(data) {
        var error = {};
        // xử lý sự kiện khi có lỗi
        if (Object.keys(error).length > 0) {
            throw JSON.stringify(error);
        }
        // call ajax to do something...
        let token = JSON.parse(decodeURIComponent(window.sessionStorage.getItem('user_token')));
        $.ajax({
            url: `/admin/raiting/${data.raitingId}/delete`,
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
                    returnNavBar('raiting');
                }, 1000);
            }, 1000);
        });
    });
}

function renderRaitingPageOnClick(page) {
    let before = $('.before input[type="date"]').val();
    let after = $('.after input[type="date"]').val();
    renderTableRaiting(before, after, page);
}

function renderRaitingOnChangeDate() {
    let before = $('.before input[type="date"]');
    let after = $('.after input[type="date"]');
    before.change(function() {
        renderTableRaiting(before.val(), after.val());
    });
    after.change(function() {
        renderTableRaiting(before.val(), after.val());
    });
}