$(function () {
    getUserInfo();


    // 退出功能
    //获取layui中的layer对象
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something

            //删除本地存储
            localStorage.removeItem("token");
            //跳转页面
            location.href = '/login.html';
            //layui自己提供的关闭弹出层功能
            layer.close(index);
        });
    })
})



//请求用户信息   因为别的文件也要用  所以写在入口函数外面让他变为全局函数

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        //配置请求头信息
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            //渲染用户信息
            renderAvatar(res.data);
        },
        //无论请求成功或失败 都会执行complete函数
        //防止不正当登录
        // complete: function (res) {
        //     console.log(res);
        //     // 判断返回信息 是否认证失败  失败就删除本地存储并且页面跳转
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         //删除本地存储
        //         localStorage.removeItem('token');
        //         //页面跳转
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 渲染用户信息页面
function renderAvatar(user) {
    //获取用户名称  有昵称用昵称  没有就用登录名
    var name = user.nickname || user.username;
    //渲染文本信息
    $("#welcome").html("欢迎&nbsp,&nbsp" + name);
    //判断返回的信息是否有头像
    if (user.user_pic !== null) {
        //有头像  就把头像显示 出来  文本隐藏
        $(".layui-nav-img").attr('src', user.user_pic).show();
        $(".user-avatar").hide();
    } else {
        //没有头像就把图片隐藏  把用户名第一个字符转换为大写显示出来
        var first = name[0].toUpperCase();
        $(".layui-nav-img").hide();
        $(".user-avatar").html(first).show();
    }
}
