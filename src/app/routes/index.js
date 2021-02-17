const homeRouter = require('./home')
const apiRouter = require('./api')

function route(app){
    app.use('/api', apiRouter);
    app.use('/', homeRouter);
}
module.exports = route;