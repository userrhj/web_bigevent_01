$(function () {
    // 1.1 定义查询参数
    var q = {
        pagenum: 1, //	页码值
        pagesize: 2,//	每页显示多少条数据
        cate_id: "", //文章分类的 Id
        state: "", //文章的状态，可选值有：已发布、草稿
    }
    // 1.3 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
    }
    // 1.4 定义时间补零函数
    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }
    var layer = layui.layer;
    // 1.2 渲染列表
    initTable();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                // console.log(res.total)
                // 3.1 渲染分页列表
                renderPage(res.total);
            }
        })
    }
    var form = layui.form;
    initCate();
    //  2.1 渲染筛选的下拉列表
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

                // form.render();  layui里面的渲染下拉菜单的方法  只用模板引擎可以拿到数据渲染 但是 layui里面的方法把渲染出来的页面隐藏了  需要用到layui里的 form.render()这个方法手动再次渲染页面 这样 拿到的数据就可以渲染到页面了 

                form.render();
            }
        })
    }
    //2.2为筛选按钮绑定提交事件
    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })
    // 3.1 渲染分页函数
    var laypage = layui.laypage;
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id 不加# 
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 设置默认被选中的分页
            // 分页发生切换时，触发jump回调函数
            //jump函数被调用会有两种方式：
            //1 点击分页会被调用
            //2 调用renderPage（）函数 也会被调用  会导致死循环
            jump: function (obj, first) {
                // obj.curr 是当前的页码值
                q.pagenum = obj.curr;
                //obj.limit  是当前所选择的每一页显示的条数（每页显示多少条数据）
                q.pagesize = obj.limit;
                //first 是一个布尔值   是第二种方式触发jump回调 返回值是true  不是第二种方式触发jump回调 返回值是undefined    false 
                //判断 只有不是第二种方式触发jump函数才调用 initTable()函数 重新渲染列表
                if (!first) {
                    initTable();
                }
            },
            //layout  自定义排版。可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //limits  每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框  默认值：[10, 20, 30, 40, 50]  修改里面的参数可以实现自己想要的条数
            limits: [2, 3, 5, 10]
        })
    }


    // 4 删除文章  代理的形式绑定
    $("tbody").on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    //判断  如果点击删除时 页面中只有一个删除按钮并且页码值大于1  让页码值自减1
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                        initTable();
                    }

                }
            })
            layer.close(index);
        });
    })

})