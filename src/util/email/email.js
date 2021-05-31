const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

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
    sendNewPasswordMail
}