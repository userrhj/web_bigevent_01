$(function () {
    var form = layui.form;
    var layer = layui.layer;
    initCate();
    //  1.1 渲染筛选的下拉列表
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }
    // 2.1 初始化富文本编辑器
    initEditor()
    // 3.1 图片裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.1 为选择封面的按钮绑定点击事件
    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click();
    })
    // 4.2 绑定用户选择文件  change 获取用户选择的文件  
    $("#coverFile").on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        if (files.length == 0) {
            return layer.msg("请选择文件");
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })
    // 5.1 发布文章  设置状态 绑定点击事件
    var state = "已发布";
    // $("#btnSave1").on('click', function () {
    //     state = "已发布";
    // })
    $("#btnSave2").on('click', function () {
        state = "草稿";
    })
    //  5.2 绑定表单提交事件
    $("#form-pub").on('submit', function (e) {
        e.preventDefault();
        // 基于 form 表单，快速创建一个 FormData 对象
        //new FormData(this) 括号中放的是DOM对象
        var fd = new FormData(this);
        // 将文章的发布状态，存到 fd 中
        fd.append("state", state);
        // 将裁剪后的图片，输出为文件 放到formdata对象中
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                //发起ajax请求
                publishArticle(fd);
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 发布文章成功后，跳转到文章列表页面

                // location.href = "/article/art_list.html"
                window.parent.document.querySelector("#art_list").click();

                // location.href = "/article/art_list.html"
            }
        })
    }
})