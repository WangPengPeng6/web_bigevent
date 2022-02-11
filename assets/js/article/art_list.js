$(function() {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象，将来请求时
    //需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, //页码值： 默认请求第一页的数据
        pagesize: 2, //每页显示几条数据：默认每页显示2条
        cate_id: '', //文章分类的Id
        state: '', //文章的发布状态
    };
    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                // 使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的函数
                rendePage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件重新渲染
        initTable();
    })

    // 定义渲染分页的方法
    function rendePage(total) {
        // 调用laypage。render方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时，触发jump回调
            // 触发jump的方法有两种
            // 1.点击页码值时会发生
            // 2.只要调用laypage.render()方法就会发生
            jump: function(obj, first) {
                //可以通过first的值，来判断通过那种方式触发的jump回调
                //如果first的值为true，证明是方式2触发的
                //否则就是方式1触发的
                // 把最新的页码值赋值到q这个参数对象
                q.pagenum = obj.curr;
                //把最新的条目数赋值到q这个参数对象上
                q.pagesize = obj.limit;
                if (!first) {
                    // 根据最新的q获取对应的数据，并渲染表格
                    initTable();
                }
            }
        });
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        let len = $('.btn-delete').length;
        // 获取到文章的 id
        let id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                        // 如果没有剩余的数据了,则让页码值 -1 之后,
                        // 再重新调用 initTable 方法
                        // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })

    // 通过代理的形式，为编辑按钮绑定点击事件处理函数
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        let id = $(this).attr('data-id');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章',
            content: $('#dialog-edit').html()
        });


        $.ajax({
            method: 'get',
            hrl: '/my/article/list' + id,
            success: function(res) {
                console.log(res);
            }
        })
    })
})