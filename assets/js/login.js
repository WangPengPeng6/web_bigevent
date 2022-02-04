$(function() {
    // 点击登录页面的a链接跳转到注册页面
    $('#link_reg').on('click', function() {
        $('.login-box').slideUp();
        $('.reg-box').slideDown();
    })

    //点击注册页面的a链接跳转到登录页面
    $('#link_login').on('click', function() {
        $('.reg-box').slideUp();
        $('.login-box').slideDown();
    })

    // 从Layui中获取form对象
    let form = layui.form;
    // 从Layui中获取form对象
    let layer = layui.layer;
    // 通过form.verify() 函数之定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        'pwd': [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        'repwd': function(value) {
            // 通过形参拿到确认密码框的内容
            // 还要拿到密码框的内容
            // 进行一次等于的判断
            // 如果失败这return一个提示消息
            const pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post('http://www.liulongbin.top:3007/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg('res.message');
            }
            layer.msg('注册成功，请登录');

            // 模拟人的手动点击
            $('#link_login').click();
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url: 'http://www.liulongbin.top:3007/api/login',
            method: 'post',
            // 快速获取表单的数据
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('登陆失败');
                }
                layer.msg('登陆成功');
                // 将登录成功得到的token字符串保存到localStorage中
                localStorage.setItem('token', res.token)

                // 跳转到后台主页
                location.href = '/大事件/index.html';
            }
        })
    })
})