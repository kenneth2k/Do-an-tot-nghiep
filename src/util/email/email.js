require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const emailKey = `${process.env.SENDGRID_API_KEY}`;
sgMail.setApiKey(emailKey);

function sendCodeMail(email, code) {
    const msg = {
        to: email,
        from: {
            name: 'EPHONE STORE',
            email: `${process.env.SENDGRID_EMAIL}`
        },
        subject: 'Code of the Ephone Store',
        text: 'Send code ephone store',
        html: `Mã của bạn là: <strong>${code}</strong> vui lòng không chia sẽ mã này cho bất cứ ai.`,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent code to: ' + email);
        })
        .catch((error) => {
            console.error(error)
        })
}

function sendActiveMail(email, activeToken) {
    const msg = {
        to: email,
        from: {
            name: 'EPHONE STORE',
            email: `${process.env.SENDGRID_EMAIL}`
        },
        subject: 'Send Link Acount Active form Ephone Store',
        text: 'Send Link Acount Active form Ephone Store',
        html: `
        <tbody>
            <tr>
                <td style="padding:0;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif;font-size:20px;vertical-align:top;" valign="top">
                    <p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;"><small>Đường dẫn kích hoạt tài khoản ephone store.</small></p>
                </td>
            </tr>
            <tr>
                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:20px;vertical-align:top;padding:30px" valign="top">
                <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
                    <tbody>
                        <tr>
                            <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
                            <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%">
                                <tbody>
                                    <tr>
                                        <td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top">
                                        <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important">
                                            <tbody>
                                                <tr>
                                                    <td align="center" bgcolor="#348eda" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top"><a style="box-sizing:border-box;border-color:#348eda;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#348eda;border:solid 1px #348eda;border-radius:2px;font-size:14px;padding:12px 45px" href="${process.env.ADDRESS_WEB}active/${activeToken}">Nhấn vào đây!</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </td>
            </tr>
        </tbody>
        `,
    };
    //ES6
    return sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent active account to: ' + email);
        })
        .catch((error) => {
            console.error(error)
        });
}

function sendWelcomeMail(email, name) {
    const msg = {
        to: email,
        from: {
            name: 'EPHONE STORE',
            email: `${process.env.SENDGRID_EMAIL}`
        },
        subject: 'Welcome to Ephone Store',
        text: 'Send welcome to the Ephone Store',
        html: `Chào mừng <strong>${name}</strong> đến với shop <a href="${process.env.ADDRESS_WEB}">ephone store</a> mua hàng trực tuyến của chúng tôi.`,
    };
    //ES6
    return sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent welcome to: ' + email);
        })
        .catch((error) => {
            console.error(error)
        });
}

function sendCancelOrderMail(email, id) {
    const msg = {
        to: email,
        from: {
            name: 'EPHONE STORE',
            email: `${process.env.SENDGRID_EMAIL}`
        },
        subject: 'Cancel order to Ephone Store',
        text: 'Send Cancel order to the Ephone Store',
        html: `Bạn đã hủy đơn hàng: ${id} cảm ơn bạn đã mua sắm tại Ephone Store.`,
    };
    //ES6
    return sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent cancel order to: ' + email);
        })
        .catch((error) => {
            console.error(error)
        });
}

function sendNewPasswordMail(email, password) {
    const msg = {
        to: email,
        from: {
            name: 'EPHONE STORE',
            email: `${process.env.SENDGRID_EMAIL}`
        },
        subject: 'New password of the Ephone Store',
        text: 'Send new password of the Ephone Store',
        html: `Mật khẩu mới của bạn là: <strong>${password}</strong> vui lòng không chia sẽ mật khẩu cho bất cứ ai.`,
    };
    //ES6
    return sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent new password to: ' + email);
        })
        .catch((error) => {
            console.error(error)
        });
}

function sendOrderSuccessMail(order, user, products) {
    let temp = ``;
    let idx = user.addresses.findIndex(user => {
        return user.active === true;
    });
    products.forEach((product, index) => {
        temp += `
            <tr>
                <td style="text-align: center; padding: 5px; border: 1px solid gray;">${index + 1}</td>
                <td style="text-align: center; padding: 5px; border: 1px solid gray;">${product.productName} - ${product.colorName}</td>
                <td style="text-align: center; padding: 5px; border: 1px solid gray;">${new Intl.NumberFormat().format(product.price / (1 - (product.sale / 100)))}</td>
                <td style="text-align: center; padding: 5px; border: 1px solid gray;">${product.quantity}</td>
                <td style="text-align: center; padding: 5px; border: 1px solid gray;">${product.sale}</td>
                <td style="text-align: center; padding: 5px; border: 1px solid gray;">${new Intl.NumberFormat().format(product.price * product.quantity)}</td>
            </tr>
        `;
    })
    let xhtml = `
        <div style="padding: 10px 40px 40px;border-radius: 8px; margin: auto; width: 800px;box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);">
            <h1 style="text-align: center;">Ephone store</h1>
            <div style="border-bottom: 2px solid #f0f0f0;">
                <h3 style="margin:10px;">Xin chào ${user.fullname} ,</h3>
                <p style="margin:10px;text-align: justify;">
                    Ephone store đã nhận được yêu cầu đặt hàng của bạn và đang xử lý nhé. Bạn sẽ nhận được thông báo tiếp theo khi đơn hàng đã sẵn sàng được giao
                </p>
                <p style="margin:10px;text-align: justify;">*<strong>Lưu ý nhỏ cho bạn</strong>: Bạn chỉ nên nhận hàng khi trạng thái đơn hàng là <strong>“Đang giao hàng”</strong> và nhớ kiểm tra Mã đơn hàng, Thông tin người gửi và Mã vận đơn để nhận đúng kiện hàng nhé.</p>
                </div>
            <div style="border-bottom: 2px solid #f0f0f0;">
                <h3 style="position: relative;">
                    <span>
                        <img style="position: absolute; top: -3px;" width="25" height="25" src="https://simpleicon.com/wp-content/uploads/map-marker-2.png" alt="">
                    </span>
                    <span style="padding-left: 30px;">Đơn hàng được giao đến</span>
                </h3>
                <div style="padding-bottom: 10px;">
                    <div style="padding: 5px 0; display: flex;">
                        <div style="width: 150px;font-size: 16px;font-weight: bold;">Tên:</div>
                        <div style="text-align: justify;">${user.addresses[idx].name}</div>
                    </div>
                    <div style="padding: 5px 0; display: flex;">
                        <div style="width: 150px;font-size: 16px;font-weight: bold;">Địa chỉ nhà:</div>
                        <div style="text-align: justify;">${user.addresses[idx].address}</div>
                    </div>
                    <div style="padding: 5px 0; display: flex;">
                        <div style="width: 150px;font-size: 16px;font-weight: bold;">Điện thoại:</div>
                        <div style="text-align: justify;">${user.phone}</div>
                    </div>
                    <div style="padding: 5px 0; display: flex;">
                        <div style="width: 150px;font-size: 16px;font-weight: bold;">Email:</div>
                        <div style="text-align: justify;"><a href="mailto:${user.email}" target="_blank">${user.email}</a></div>
                    </div>
                </div>
            </div>
            <div style="border-bottom: 2px solid #f0f0f0;">
                <h3 style="margin: 10px 0px 0px 0px;">Mã đơn hàng#${order._id}</h3>
                <table>
                    <thead>
                        <tr>
                            <th style="height: 40px; width: 50px;">STT</th>
                            <th style="height: 40px; width: 300px;">Tên</th>
                            <th style="height: 40px; width: 140px;">Giá(vnđ)</th>
                            <th style="height: 40px; width: 100px;">Số lượng</th>
                            <th style="height: 40px; width: 60px;">Giảm(%)</th>
                            <th style="height: 40px; width: 150px;">Tạm tính</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${temp}
                    </tbody>
                </table>
                <div style="display: flex;line-height: 40px;padding-right: 10px;color: orange;">
                    <div>Thành tiền:</div>
                    <div style="padding: 0 5px;">${new Intl.NumberFormat().format(order.sumPrice)}</div>
                    <div>VNĐ</div>
                </div>
            </div>
            <div>
                <p style="margin:10px;text-align: justify;">
                    Nếu có vấn đề gì, hãy gọi ngay đến tổng đài trợ giúp của chúng tôi.
                </p>
                <p style="margin:10px;text-align: justify;">
                    Hotline: 066.888.8888
                </p>
            </div>
        </div>
    `;
    const msg = {
        to: user.email,
        from: {
            name: 'EPHONE STORE',
            email: `${process.env.SENDGRID_EMAIL}`
        },
        subject: 'Cám ơn bạn đã đặt hàng tại ephone store!',
        text: 'Cám ơn bạn đã đặt hàng tại ephone store!',
        html: xhtml
    };
    //ES6
    return sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent order to: ' + user.email);
        })
        .catch((error) => {
            console.error(error)
        });
}
module.exports = {
    sendCodeMail,
    sendWelcomeMail,
    sendNewPasswordMail,
    sendActiveMail,
    sendOrderSuccessMail,
    sendCancelOrderMail
}