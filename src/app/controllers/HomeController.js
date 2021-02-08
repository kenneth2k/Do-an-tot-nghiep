class HomeController{
    // [GET] /
    index(req, res){
        res.render('home/index');
    }
    // [GET] /:cate/:slug
    show(req, res){
        res.render('home/detail')
    }
    // [GET] /cart
    showCart(req, res){
        res.render('home/cart');
    }
    // [GET] /search
    showSearch(req, res){
        res.render('home/search');
    }
    // [GET] /profile/:slug
    showProfile(req, res){
        res.render('home/profile');
    }
    show404(req, res){
        res.send('404 not found!');
    }
}
module.exports = new HomeController;