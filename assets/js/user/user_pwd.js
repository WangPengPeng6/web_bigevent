$(function() {
    let form = layui.form;

    // verify创建校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd: function(value) {
            if (value === $('[name=newPwd]').val()) {
                return '两次输入的密码不一致';
            }
        }
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDfault();
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(), //快速获取表单
            success: function(res) {
                if (res.status !== 0) {
                    return layui.msg('更新密码失败');
                }
                layui.msg('更让新密码成功');
                //重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})