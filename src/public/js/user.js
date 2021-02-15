$(document).ready(function (c) {
    var divName = $('#name-user-login');
    var divLogout = $('#name-user-logout');
    var obj = {
        name: "Nguyễn Văn Trọng",
        remember: true,
        token:"&^ksjga@#$daglifa$"
    };
    // set token
    window.localStorage.setItem("user_token", encodeURIComponent(JSON.stringify(obj)));
    // get token
    var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
    if(user_token && user_token.name != null){
        divName[0].innerHTML = `<a href="/profile/${'123'}" class="text-white">${user_token.name}</a>`;
        divLogout[0].innerHTML = `<a href="/" class="text-white" ><i class="fas fa-sign-out-alt mr-2"></i>Đăng xuất</a>`;
    }
    else{
        divName[0].innerHTML = `
        <a href="#" data-toggle="modal" data-target="#exampleModal" class="text-white">
            <i class="fas fa-sign-in-alt mr-2"></i>
            Đăng nhập 
        </a>
        `;
        divLogout[0].innerHTML = `

        <a href="#" data-toggle="modal" data-target="#exampleModal2" class="text-white">
        <i class="fas fa-sign-out-alt mr-2"></i>Đăng kí </a>
        
        `;
    }
    divLogout.on('click', function(){
        window.localStorage.removeItem('user_token')
    })
});
$(document).ready(function (c) {
    reloadProfile();
    function reloadProfile(){
        var user_token = JSON.parse(decodeURIComponent(window.localStorage.getItem('user_token')));
        if(!user_token && window.location.pathname.indexOf("profile") != (-1)){
            window.location.href = "/";
        }
        
    };
    const tabs = document.querySelectorAll(".tab-item");
    const panes = document.querySelectorAll(".tab-pane");
    
    const tabActive = document.querySelector(".tab-item.active");
    tabs.forEach((tab, index) => {
      const pane = panes[index];
    
      tab.onclick = function () {
        document.querySelector(".tab-item.active").classList.remove("active");
        document.querySelector(".tab-pane.active").classList.remove("active");
    
        this.classList.add("active");
        pane.classList.add("active");
      };
    });
});



