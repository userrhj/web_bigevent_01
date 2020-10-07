$(function () {
    //开发服务器地址
    var baseURl = 'http://ajax.frontend.itheima.net';
    //测试环境服务器地址
    // var baseURl = 'http://ajax.frontend.itheima.net';
    //生产环境服务器地址
    // var baseURl = 'http://ajax.frontend.itheima.net';


    //在发起ajax请求前，调用这个函数统一拼接请求的根路径
    $.ajaxPrefilter(function (options) {
        options.url = baseURl + options.url
    })
})