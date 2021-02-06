class HomeController{
    // [GET] /
    index(req, res){
        res.render('home/index');
    }
    // [GET] /:cate/:slug
    show(req, res){
        res.render('home/detail')
    }

    showCart(req, res){
        res.render('home/cart');
    }
    show404(req, res){
        res.send('404 not found!');
    }
}
module.exports = new HomeController;