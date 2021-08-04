// Ẩn loading page
function removeLoadingPage() {
    setTimeout(() => {
        var loadingPage = document.querySelector("#loading-page");
        loadingPage.style.display = "none"
    }, 500)
}
// Hiện loading page
function addLoadingPage() {
    setTimeout(() => {
        var loadingPage = document.querySelector("#loading-page");
        loadingPage.style.display = "block"
    }, 500)
}

// Hiện Toast
// showToast(message.addSuccess, "success")
function showToast(message, color) {
    var x = document.getElementById("snackbar");
    x.textContent = message;
    x.className = `${color} show`;
    setTimeout(function() {
        x.className = x.className.replace("show", "");
    }, 3000);
}
// Ẩn loading table
function hideLoadingTable() {
    setTimeout(function() {
        var loading = document.getElementById("table-loading");
        var table = document.getElementById("table-role");
        loading.style.display = "none";
        table.style.display = "block";
    }, 500)
}
// Hiện loading table
function showLoadingTable() {
    setTimeout(function() {
        var loading = document.getElementById("table-loading");
        var table = document.getElementById("table-role");
        loading.style.display = "block";
        table.style.display = "none";
    }, 500)
}
// Content table
function contentTable(title, xquery, thead, tbody, addNew = true) {
    var table = document.querySelector("#table-role");
    var xhtml = `
        <div class="body-content__title">
            <h5>${title}</h5>
            ${addNew == true ? `<div class="add-new">
            <button type="button" class="btn btn-info btn-sm active">Thêm mới</button>
            </div>`:''}
        </div>
            ${xquery}
        <table class="table table-hover">
            ${thead}
            ${tbody}
        </table>
    `;
    table.innerHTML = xhtml;
}
// Ẩn/Hiện Modal
function showModal(idForm, method, title, body, callback) {
    var xhtml = `
        <div class="modal-dialog">
            <form id=${idForm} action="#" method=${method}>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" >${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${body}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-primary">Lưu</button>
                    </div>
                </div>
            </form>
        </div>
    `;
    var xmodal = document.getElementById("myModal");
    xmodal.innerHTML = xhtml;
    var openModal = new bootstrap.Modal(xmodal, {
        keyboard: false
    });
    openModal.show();
    var submitForm = document.getElementById(idForm);
    // check size
    // var size = Object.keys(data).length;
    submitForm.onsubmit = function(e) {
        e.preventDefault();
        try {
            var listInput = submitForm.querySelectorAll("input");
            var data = {};
            listInput.forEach((input, index) => {
                if (input.type === "radio" && input.checked == false) {
                    return;
                }
                if (input.type === "checkbox" && input.checked == false) {
                    return;
                }
                data[`${input.name}`] = input.value;
            });
            listInput.forEach((input, index) => {
                input.classList = "form-control";
                input.classList = "form-control is-valid";
                input.parentElement.querySelector('div').classList = "valid-feedback";
                input.parentElement.querySelector('div').textContent = "";
            })
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
                })
            }
        }
    }
}

function pageNavigation(pPrev, pActive, pNext) {
    $('#page-navigation').remove();
    let xhtml = `<div class="d-flex justify-content-end" data-id="page-navigation">
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            ${pPrev < 1 ?'': `
            <li class="page-item">
                <a class="page-link" href="#" data-id="${pPrev}" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only"></span>
                </a>
            </li>`}
            <li class="page-item active"><a class="page-link" href="#">${pActive}</a></li>
            ${pNext > pActive? `
            <li class="page-item">
                <a class="page-link" href="#" data-id="${pNext}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only"></span>
                </a>
            </li>
            `:''}
        </ul>
    </nav>
</div>`;
    $("#table-role").append((pPrev==pActive==pNext)?'':xhtml);
}
function returnNavBar(navName){
    $(".list-group-item.nav-left.border-0").each(function(){
        if($(this).data('manager') == navName){
            $(this).click();
        }
    });
}
// Button add new
function btnAddNew(callback) {
    var addNew = document.querySelector(".add-new button");
    if (addNew) {
        addNew.onclick = function() {
            callback();
        }
    }
}
// Button deleted
function btnDeleted(callback) {
    $(".impact-event .deleted").click(function(e) {
        e.preventDefault();
        callback($(this).data('id'));
    });
}
// Button editer
function btnEditer(callback) {
    $(".impact-event .edit").click(function(e) {
        e.preventDefault();
        callback($(this).data('id'));
    });
}
// Button deleted return
function btnDeletedReturn(callback) {
    $(".impact-event .return").click(function(e) {
        e.preventDefault();
        callback($(this).data('id'));
    });
}
// Button deleted high
function btnDeletedHigh(callback) {
    $(".impact-event .high").click(function(e) {
        e.preventDefault();
        callback($(this).data('id'));
    });
}