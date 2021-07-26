function loadTableHome() {
    let xhtml = `<div class="row">
    <h3>Thông tin đơn hàng</h3>
    <div class="col-md-3">
        <div class="bg-success text-white shadow rounded">
            <div class="fs-5 p-2" style="background-color: #14653f !important;">Đơn hàng thành công</div>
            <div class="p-2"><span>Số lượng: </span> 5</div>
            <div class="p-2">Đơn giao dịch thành công</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="bg-warning text-white shadow rounded">
            <div class="fs-5 p-2" style="background-color: #E0AA07 !important;">Đơn hàng đang xử lý</div>
            <div class="p-2"><span>Số lượng: </span> 5</div>
            <div class="p-2">Đơn hàng đang được xử lý</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="bg-danger text-white shadow rounded">
            <div class="fs-5 p-2" style="background-color: #bd2b39 !important;">Đơn hàng đang giao</div>
            <div class="p-2"><span>Số lượng: </span> 5</div>
            <div class="p-2">Đơn hàng dang vận chuyển</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="bg-secondary text-white shadow rounded">
            <div class="fs-5 p-2" style="background-color: #53595f !important;">Đơn hàng đã hủy</div>
            <div class="p-2"><span>Số lượng: </span> 5</div>
            <div class="p-2">Đơn hàng giao dịch thất bại</div>
        </div>
    </div>
</div>
<div class="row mt-4">
    <h3>Thông tin chung</h3>
    <div class="col-md-3">
        <div class="card text-dark bg-light">
            <div class="card-header">Đơn hàng</div>
            <div class="p-2"><span>Số lượng: </span> 5</div>
            <div class="p-2">Tổng số lượng đơn hàng</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card text-dark bg-light">
            <div class="card-header">Sản phẩm</div>
            <div class="p-2"><span>Số lượng: </span> 5</div>
            <div class="p-2">Tổng số sản phấm đang có</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card text-dark bg-light">
            <div class="card-header">Thành viên</div>
            <div class="p-2"><span>Số lượng: </span> 5</div>
            <div class="p-2">Tổng số lượng thành viên</div>
        </div>
    </div>
</div>
        `;
    return xhtml;
}