$(function() {
    let layer = layui.layer;
    initArtCateList();


    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                let htmlSrr = template('tpl-table', res);
                $('tbody').html(htmlSrr);
            }
        })
    }

    // 为添加类绑定点击事件
    let indexAdd = null;
    let form = layui.form;
    $('#btnAddCate').on('click', () => {
        // 弹出添加文章信息分类的层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的形式为form-add添加submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList();
                layer.msg('新增分类成功！')
                    // 根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理形式为btn-edit 绑定事件
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出修改文章信息分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        let id = $(this).attr('data-id');

        // 发请求获取对应分类的数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: (res) => {
                form.val('form-edit', res.data);
            }
        })
    })

    // 通过代理形式为修改分类表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    })

})