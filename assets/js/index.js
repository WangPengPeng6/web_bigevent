$(function() {
    //调用getUserInfo()获取用户基本信息
    getUserInfo();
    let layer = layui.layer;
    $('#btnLogout').on('click', function() {
        // 提示是否确认退出
        layer.confirm('确定退出登录吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //清空本地存储的token
            localStorage.removeItem('token');
            // 重新跳转到登录页
            location.href = '/大事件/login.html';

            // 关闭confirm询问框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            //调用renderAvatar() 渲染用户的头像
            renderAvatar(res.data);
        }

        // 不论成功还是失败都会调用complete函数
        // complete: function(res) {
        //     // complete可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空token
        //         localStorage.removeItem('token');
        //         // 跳转到登录页
        //         location.href = '/大事件/login.html';
        //     }
        // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp' + name);
    //按需渲染头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        // 将第一个字转为大写
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}