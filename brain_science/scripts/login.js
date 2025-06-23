// 登录页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // 验证输入
        if (!username || !password || !role) {
            alert('请填写完整的登录信息');
            return;
        }
        
        // 简单的密码验证（在实际项目中应该使用更安全的方法）
        if (password === '123456') {
            // 保存用户信息到sessionStorage
            const userInfo = {
                username: username,
                role: role,
                loginTime: new Date().toISOString()
            };
            
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            console.log('用户登录成功:', userInfo);
            alert('登录成功！');
            
            // 跳转到主页
            window.location.href = 'dashboard.html';
        } else {
            alert('密码错误！正确密码是：123456');
        }
    });
    
    // 如果已经登录，直接跳转到主页
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
        window.location.href = 'dashboard.html';
    }
});

// 检查登录状态
function checkLoginStatus() {
    const userInfo = sessionStorage.getItem('userInfo');
    const currentPage = window.location.pathname;
    
    // 如果在登录页面，不需要检查
    if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
        return true;
    }
    
    if (!userInfo) {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        sessionStorage.removeItem('userInfo');
        localStorage.removeItem('userInfo');
        window.location.href = 'index.html';
    }
}