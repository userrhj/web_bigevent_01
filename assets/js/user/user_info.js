$(function () {
    // 1.1 自定义验证
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称的长度在1-6位之间!";
            }
        }
    })
    initUserInfo();
    // 2.1 获取   初始化用户信息
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //获取信息成功  快速给表单赋值  渲染页面
                form.val("formUserInfo", res.data)
            }
        })
    };

    // 3.1 重置表单
    $("#btnReset").on('click', function (e) {
        //阻止表单默认重置行为
        e.preventDefault();
        initUserInfo();
    })

    // 4.1 提交表单
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //调用父页面中的更新用户信息和头像的函数getUserInfo()   
                window.parent.getUserInfo();
            }
        })
    })
})