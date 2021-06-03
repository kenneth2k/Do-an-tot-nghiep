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
            console.log('Email sent code.')
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
            console.log('Email sent active account.');
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
            console.log('Email sent welcome.');
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
            console.log('Email sent new password.');
        })
        .catch((error) => {
            console.error(error)
        });
}
module.exports = {
    sendCodeMail,
    sendWelcomeMail,
    sendNewPasswordMail,
    sendActiveMail
}