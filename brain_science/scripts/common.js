// 通用JavaScript函数库

// 检查登录状态
function checkLoginStatus() {
    const userInfo = sessionStorage.getItem('userInfo');
    const currentPage = window.location.pathname;
    
    // 如果在登录页面，不需要检查
    if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
        return true;
    }
    
    if (!userInfo) {
        alert('请先登录');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// 获取用户角色名称
function getRoleName(role) {
    const roleNames = {
        'user': '领域组用户',
        'secretary': '秘书组审核员',
        'reviewer': '数据使用审核小组',
        'expert': '平台专家',
        'operator': '运维人员',
        'admin': '中心管理员'
    };
    return roleNames[role] || '未知角色';
}

// 根据角色显示菜单
function showRoleBasedMenu(role) {
    // 隐藏所有角色相关的菜单
    document.querySelectorAll('.user-menu, .reviewer-menu, .operator-menu, .admin-menu').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll('.user-action, .reviewer-action, .operator-action, .admin-action').forEach(el => {
        el.style.display = 'none';
    });
    
    // 根据角色显示对应菜单
    switch(role) {
        case 'user':
            document.querySelectorAll('.user-menu, .user-action').forEach(el => {
                el.style.display = 'block';
            });
            break;
        case 'secretary':
        case 'reviewer':
        case 'expert':
            document.querySelectorAll('.reviewer-menu, .reviewer-action').forEach(el => {
                el.style.display = 'block';
            });
            break;
        case 'operator':
            document.querySelectorAll('.operator-menu, .operator-action').forEach(el => {
                el.style.display = 'block';
            });
            break;
        case 'admin':
            document.querySelectorAll('.admin-menu, .admin-action').forEach(el => {
                el.style.display = 'block';
            });
            // 管理员可以看到所有菜单
            document.querySelectorAll('.reviewer-menu, .operator-menu').forEach(el => {
                el.style.display = 'block';
            });
            break;
    }
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        sessionStorage.removeItem('userInfo');
        localStorage.removeItem('userInfo');
        window.location.href = 'index.html';
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">×</button>
        </div>
    `;
    
    // 添加样式
    addNotificationStyles();
    
    document.body.appendChild(notification);
    
    // 3秒后自动消失
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

// 添加通知样式
function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        }
        .notification.success { background: #dcfce7; border-left: 4px solid #16a34a; }
        .notification.error { background: #fee2e2; border-left: 4px solid #dc2626; }
        .notification.warning { background: #fef3c7; border-left: 4px solid #d97706; }
        .notification.info { background: #dbeafe; border-left: 4px solid #2563eb; }
        .notification-content {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            gap: 8px;
        }
        .notification-icon { font-size: 16px; }
        .notification-message { flex: 1; color: #374151; font-weight: 500; }
        .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #6b7280;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 关闭通知
function closeNotification(button) {
    const notification = button.closest('.notification');
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 生成随机ID
function generateId(prefix = 'id') {
    return prefix + '-' + Math.random().toString(36).substr(2, 9);
}

// 发送HTTP请求（模拟）
function sendRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        console.log(`模拟 ${method} 请求:`, url, data);
        
        // 模拟网络延迟
        setTimeout(() => {
            // 模拟成功响应
            resolve({
                success: true,
                data: data,
                message: '操作成功'
            });
        }, Math.random() * 1000 + 500);
    });
}

// 本地存储工具
const Storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('存储失败:', e);
        }
    },
    
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('读取存储失败:', e);
            return defaultValue;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('删除存储失败:', e);
        }
    },
    
    clear: function() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('清空存储失败:', e);
        }
    }
};

// 表单验证工具
const Validator = {
    email: function(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    },
    
    phone: function(phone) {
        const pattern = /^1[3-9]\d{9}$/;
        return pattern.test(phone);
    },
    
    required: function(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    minLength: function(value, length) {
        return value && value.toString().length >= length;
    },
    
    maxLength: function(value, length) {
        return !value || value.toString().length <= length;
    }
};

// DOM工具
const DOM = {
    createElement: function(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },
    
    show: function(element) {
        if (element) element.style.display = 'block';
    },
    
    hide: function(element) {
        if (element) element.style.display = 'none';
    },
    
    toggle: function(element) {
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },
    
    addClass: function(element, className) {
        if (element && className) element.classList.add(className);
    },
    
    removeClass: function(element, className) {
        if (element && className) element.classList.remove(className);
    },
    
    hasClass: function(element, className) {
        return element && element.classList.contains(className);
    }
};

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化用户信息显示
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
        const user = JSON.parse(userInfo);
        
        // 更新用户名显示
        const userNameElements = document.querySelectorAll('#userName');
        userNameElements.forEach(el => {
            if (el) el.textContent = user.username;
        });
        
        // 更新角色显示
        const userRoleElements = document.querySelectorAll('#userRole');
        userRoleElements.forEach(el => {
            if (el) el.textContent = getRoleName(user.role);
        });
        
        // 根据角色显示菜单（如果页面有导航）
        if (document.querySelector('.nav-menu')) {
            showRoleBasedMenu(user.role);
        }
    }
    
    // 为所有模态框添加点击背景关闭功能
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // 为所有关闭按钮添加事件
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
});

// 导出常用函数到全局
window.checkLoginStatus = checkLoginStatus;
window.getRoleName = getRoleName;
window.showRoleBasedMenu = showRoleBasedMenu;
window.logout = logout;
window.showNotification = showNotification;
window.formatDate = formatDate;
window.formatFileSize = formatFileSize;
window.Storage = Storage;
window.Validator = Validator;
window.DOM = DOM;