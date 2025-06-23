// 仪表板页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (!checkLoginStatus()) return;
    
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    
    // 更新用户信息显示
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = userInfo.username;
    }
    if (document.getElementById('userRole')) {
        document.getElementById('userRole').textContent = getRoleName(userInfo.role);
    }
    
    // 根据角色显示相应的菜单和功能
    showRoleBasedMenu(userInfo.role);
    
    // 更新卡片数据
    updateDashboardData(userInfo.role);
    
    // 初始化活动列表
    updateActivityList(userInfo.role);
});

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

// 更新仪表板数据
function updateDashboardData(role) {
    const data = getDashboardData(role);
    
    if (document.getElementById('pendingApps')) {
        document.getElementById('pendingApps').textContent = data.pending;
    }
    if (document.getElementById('myApps')) {
        document.getElementById('myApps').textContent = data.myApps;
    }
    if (document.getElementById('dataFiles')) {
        document.getElementById('dataFiles').textContent = data.dataFiles;
    }
    if (document.getElementById('resourceUsage')) {
        document.getElementById('resourceUsage').textContent = data.resourceUsage;
    }
}

// 根据角色获取不同的数据
function getDashboardData(role) {
    const baseData = {
        user: {
            pending: 0,
            myApps: 3,
            dataFiles: 15,
            resourceUsage: '2.5GB'
        },
        secretary: {
            pending: 8,
            myApps: 0,
            dataFiles: 0,
            resourceUsage: 'N/A'
        },
        reviewer: {
            pending: 5,
            myApps: 0,
            dataFiles: 0,
            resourceUsage: 'N/A'
        },
        expert: {
            pending: 3,
            myApps: 0,
            dataFiles: 0,
            resourceUsage: '85%'
        },
        operator: {
            pending: 8,
            myApps: 0,
            dataFiles: 0,
            resourceUsage: '85%'
        },
        admin: {
            pending: 18,
            myApps: 0,
            dataFiles: 247,
            resourceUsage: '76%'
        }
    };
    
    return baseData[role] || baseData.user;
}

// 更新活动列表
function updateActivityList(role) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const activities = getActivitiesByRole(role);
    
    activityList.innerHTML = activities.map(activity => {
        return `
            <li>
                <span class="time">${activity.time}</span>
                <span class="activity">${activity.text}</span>
            </li>
        `;
    }).join('');
}

// 根据角色获取活动
function getActivitiesByRole(role) {
    const allActivities = {
        user: [
            { time: '2024-01-15 14:30', text: '您的申请 APP-2024-001 已通过审核' },
            { time: '2024-01-14 16:20', text: '数据文件 analysis_001.csv 上传成功' },
            { time: '2024-01-13 10:15', text: '新申请 APP-2024-002 已提交' },
            { time: '2024-01-12 09:45', text: '计算资源配置完成' }
        ],
        secretary: [
            { time: '2024-01-15 15:30', text: '完成申请 APP-2024-005 初审' },
            { time: '2024-01-15 14:20', text: '申请 APP-2024-004 需要补充材料' },
            { time: '2024-01-15 11:10', text: '申请 APP-2024-003 初审通过' },
            { time: '2024-01-14 16:45', text: '新增待审核申请 3 份' }
        ],
        reviewer: [
            { time: '2024-01-15 16:00', text: '申请 APP-2024-002 复审完成' },
            { time: '2024-01-15 14:30', text: '参与申请 APP-2024-001 复审讨论' },
            { time: '2024-01-14 10:20', text: '申请 APP-2024-008 复审通过' },
            { time: '2024-01-13 15:15', text: '收到新的复审任务' }
        ],
        expert: [
            { time: '2024-01-15 17:00', text: '完成资源评估 APP-2024-003' },
            { time: '2024-01-15 14:45', text: '建议调整申请 APP-2024-006 资源配置' },
            { time: '2024-01-14 11:30', text: '批准高性能计算资源申请' },
            { time: '2024-01-13 16:20', text: '参与平台资源优化讨论' }
        ],
        operator: [
            { time: '2024-01-15 18:00', text: '完成用户 zhangsan 的资源配置' },
            { time: '2024-01-15 16:30', text: '云桌面环境部署完成' },
            { time: '2024-01-15 14:15', text: '解决存储空间不足问题' },
            { time: '2024-01-14 09:00', text: '系统例行维护完成' }
        ],
        admin: [
            { time: '2024-01-15 17:30', text: '系统运行状态检查完成' },
            { time: '2024-01-15 15:45', text: '处理用户权限异常问题' },
            { time: '2024-01-15 13:20', text: '导出月度统计报告' },
            { time: '2024-01-14 16:30', text: '批量处理滞留申请' }
        ]
    };
    
    return allActivities[role] || allActivities.user;
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        sessionStorage.removeItem('userInfo');
        localStorage.removeItem('userInfo');
        window.location.href = 'index.html';
    }
}

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