const homeRouter = require('./home');
const adminRouter = require('./admin');
const apiRouter = require('./api');

function route(app) {
    app.use('/admin', adminRouter);
    app.use('/api', apiRouter);
    app.use('/', homeRouter);
}
module.exports = route;