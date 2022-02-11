$(function() {
    let layer = layui.layer;
    let form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();




    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败');
                }
                //调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //一定记得调用 form.render()方法
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    let $image = $('#image');

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);


    // 为选择封面的按钮 绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    })

    // 监听coverFile的change事件,获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        let files = e.target.files;
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 文章发布状态
    let art_state = '已发布';

    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 基于form表单快速常见FormData对象
        let fd = new FormData($(this)[0]);
        fd.append('state', art_state);

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob);

                // 发起ajax数据请求
                publishAricle(fd);
            })
    })


    // 定义一个发表文章的方法
    function publishAricle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg('发布文章成功');
                location.href = '/大事件/article/art_list.html';
            }
        })
    }
})