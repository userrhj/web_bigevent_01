$(function () {
    // 1.1 点击去注册事件 显示注册 隐藏登录
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 1.2 点击去登录事件 显示登录 隐藏注册
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })






    //从layui中导出form对象
    var form = layui.form;
    //从layui中导出layer对象
    var layer = layui.layer;
    // 2 自定义校验规则
    form.verify({
        //这里的对象属性将成为规则名称
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            //这里的value 是表单中的输入的值  谁用这个验证 value值就是谁的输入的值
            var pwd = $('.reg-box input[name=password]').val();
            if (value !== pwd) {
                return "两次密码输入不一致！";
            }
        }
    })


    // 3 监听注册事件
    $("#form_reg").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //模拟点击去登录事件
                $('#link_login').click();
                //重置表单
                $('#form_reg')[0].reset();
            }
        })
    })




    // 4 监听登录事件
    $("#form_login").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //记录返回来的token值
                localStorage.setItem('token', res.token);
                //跳转页面
                location.href = "/index.html";
            }
        })
    })
})