// 管理面板JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (!checkLoginStatus()) return;
    
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    
    // 检查是否是管理员
    if (userInfo.role !== 'admin') {
        alert('您没有管理员权限');
        window.location.href = 'dashboard.html';
        return;
    }
    
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = userInfo.username;
    }
    
    // 默认显示总览标签页
    switchAdminTab('overview');
    
    // 加载数据
    loadAdminData();
});

// 切换管理员标签页
function switchAdminTab(tabName) {
    // 隐藏所有标签页内容
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有按钮的active状态
    document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // 添加选中按钮的active状态
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    console.log('切换到管理标签页:', tabName);
    
    // 根据标签页加载相应数据
    switch(tabName) {
        case 'overview':
            loadOverviewData();
            break;
        case 'applications':
            loadAllApplications();
            break;
        case 'users':
            loadUserManagement();
            break;
        case 'audit':
            loadAuditLogs();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// 加载管理员数据
function loadAdminData() {
    loadOverviewData();
}

// 加载总览数据
function loadOverviewData() {
    console.log('加载总览数据');
    
    // 模拟加载过程监控数据
    updateProcessMonitor();
    updatePerformanceMetrics();
    updateAlerts();
}

// 更新流程监控
function updateProcessMonitor() {
    // 这里可以添加实时更新流程监控的逻辑
    console.log('更新流程监控数据');
}

// 更新性能指标
function updatePerformanceMetrics() {
    // 这里可以添加性能指标更新逻辑
    console.log('更新性能指标');
}

// 更新告警信息
function updateAlerts() {
    console.log('更新告警信息');
}

// 处理告警
function handleAlert(alertType) {
    console.log('处理告警:', alertType);
    
    const alertActions = {
        storage: '存储空间告警处理',
        delay: '滞留申请处理',
        users: '用户异常处理'
    };
    
    const action = alertActions[alertType] || '未知告警';
    alert(`处理告警: ${action}\n\n这里会显示具体的处理界面（模拟）`);
}

// 加载全部申请
function loadAllApplications() {
    const applications = getAllApplicationsData();
    const tableBody = document.getElementById('adminApplicationsTable');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = applications.map(app => {
        return `
            <tr>
                <td><input type="checkbox" name="adminAppItem" value="${app.id}"></td>
                <td>
                    <a href="#" onclick="viewApplicationDetail('${app.id}')">${app.id}</a>
                </td>
                <td>${app.applicant}<br><small>${app.researchGroup}</small></td>
                <td>${app.type}</td>
                <td>${formatDate(app.submitTime)}</td>
                <td><span class="status ${app.statusClass}">${app.statusText}</span></td>
                <td>${app.currentStage}</td>
                <td>${app.processingTime}</td>
                <td><span class="priority ${app.priority}">${getPriorityText(app.priority)}</span></td>
                <td>
                    <button class="btn-small btn-primary" onclick="adminIntervene('${app.id}')">干预</button>
                    <button class="btn-small btn-secondary" onclick="viewTimeline('${app.id}')">时间线</button>
                </td>
            </tr>
        `;
    }).join('');
}

// 获取全部申请数据（模拟）
function getAllApplicationsData() {
    return [
        {
            id: 'APP-2024-001',
            applicant: '张三',
            researchGroup: '认知神经科学',
            type: '数据+资源',
            submitTime: '2024-01-10T09:30:00',
            status: 'reviewing',
            statusText: '审核中',
            statusClass: 'reviewing',
            currentStage: '专家审核',
            processingTime: '5天',
            priority: 'urgent'
        },
        {
            id: 'APP-2024-002',
            applicant: '李四',
            researchGroup: '发展心理学',
            type: '数据权限',
            submitTime: '2024-01-12T14:15:00',
            status: 'configuring',
            statusText: '配置中',
            statusClass: 'configuring',
            currentStage: '运维配置',
            processingTime: '3天',
            priority: 'high'
        },
        {
            id: 'APP-2024-003',
            applicant: '王五',
            researchGroup: '脑科学与认知',
            type: '计算资源',
            submitTime: '2024-01-13T11:20:00',
            status: 'completed',
            statusText: '已完成',
            statusClass: 'completed',
            currentStage: '流程结束',
            processingTime: '2天',
            priority: 'normal'
        }
    ];
}

// 管理员干预
function adminIntervene(appId) {
    console.log('管理员干预:', appId);
    
    document.getElementById('interventionAppId').textContent = appId;
    document.getElementById('interventionModal').style.display = 'flex';
}

// 关闭干预模态框
function closeInterventionModal() {
    document.getElementById('interventionModal').style.display = 'none';
    document.getElementById('interventionType').value = '';
    document.getElementById('interventionReason').value = '';
}

// 确认干预
function confirmIntervention() {
    const appId = document.getElementById('interventionAppId').textContent;
    const interventionType = document.getElementById('interventionType').value;
    const reason = document.getElementById('interventionReason').value;
    
    if (!interventionType || !reason.trim()) {
        alert('请选择干预类型并填写原因');
        return;
    }
    
    const interventionData = {
        applicationId: appId,
        type: interventionType,
        reason: reason,
        admin: JSON.parse(sessionStorage.getItem('userInfo')).username,
        time: new Date().toISOString()
    };
    
    console.log('执行管理员干预:', interventionData);
    
    if (confirm('确定要执行此干预操作吗？\n\n此操作将被记录在审计日志中。')) {
        alert('管理员干预执行成功！');
        closeInterventionModal();
        loadAllApplications(); // 重新加载列表
    }
}

// 查看申请详情
function viewApplicationDetail(appId) {
    console.log('查看申请详情:', appId);
    alert('申请详情查看功能（模拟）\n申请编号: ' + appId);
}

// 查看时间线
function viewTimeline(appId) {
    console.log('查看时间线:', appId);
    alert('申请时间线查看功能（模拟）\n申请编号: ' + appId);
}

// 检查配置状态
function checkConfigStatus(appId) {
    console.log('检查配置状态:', appId);
    alert('配置状态检查功能（模拟）\n申请编号: ' + appId);
}

// 查看完成情况
function viewCompletion(appId) {
    console.log('查看完成情况:', appId);
    alert('完成情况查看功能（模拟）\n申请编号: ' + appId);
}

// 生成报告
function generateReport(appId) {
    console.log('生成报告:', appId);
    alert('报告生成功能（模拟）\n申请编号: ' + appId);
}

// 加载用户管理
function loadUserManagement() {
    console.log('加载用户管理数据');
}

// 添加用户
function addUser() {
    console.log('添加用户');
    alert('添加用户功能（模拟）');
}

// 导出用户
function exportUsers() {
    console.log('导出用户');
    alert('导出用户功能（模拟）');
}

// 同步用户
function syncUsers() {
    console.log('同步用户');
    alert('同步用户功能（模拟）');
}

// 查看用户详情
function viewUserDetail(username) {
    console.log('查看用户详情:', username);
    alert('用户详情查看功能（模拟）\n用户: ' + username);
}

// 编辑用户
function editUser(username) {
    console.log('编辑用户:', username);
    alert('编辑用户功能（模拟）\n用户: ' + username);
}

// 暂停用户
function suspendUser(username) {
    if (confirm('确定要暂停用户 ' + username + ' 吗？')) {
        console.log('暂停用户:', username);
        alert('用户暂停成功: ' + username);
    }
}

// 查看审核记录
function viewReviewHistory(username) {
    console.log('查看审核记录:', username);
    alert('审核记录查看功能（模拟）\n用户: ' + username);
}

// 加载审计日志
function loadAuditLogs() {
    console.log('加载审计日志');
}

// 导出审计日志
function exportAuditLog() {
    console.log('导出审计日志');
    alert('审计日志导出功能（模拟）');
}

// 清理旧日志
function clearOldLogs() {
    if (confirm('确定要清理超过90天的旧日志吗？')) {
        console.log('清理旧日志');
        alert('旧日志清理完成');
    }
}

// 查看日志详情
function viewLogDetail(logId) {
    console.log('查看日志详情:', logId);
    alert('日志详情查看功能（模拟）\n日志ID: ' + logId);
}

// 加载报告
function loadReports() {
    console.log('加载报告数据');
}

// 生成完整报告
function generateFullReport() {
    console.log('生成完整报告');
    alert('完整报告生成中...\n\n这可能需要几分钟时间（模拟）');
}

// 定时报告
function scheduleReport() {
    console.log('设置定时报告');
    alert('定时报告设置功能（模拟）');
}

// 生成各类报告
function generateApplicationReport() {
    console.log('生成申请统计报告');
    alert('申请统计报告生成中...（模拟）');
}

function generateUserReport() {
    console.log('生成用户行为报告');
    alert('用户行为报告生成中...（模拟）');
}

function generateResourceReport() {
    console.log('生成资源使用报告');
    alert('资源使用报告生成中...（模拟）');
}

function generatePerformanceReport() {
    console.log('生成系统性能报告');
    alert('系统性能报告生成中...（模拟）');
}

// 预览报告
function previewReport(reportType) {
    console.log('预览报告:', reportType);
    alert('报告预览功能（模拟）\n报告类型: ' + reportType);
}

// 下载报告
function downloadReport(reportId) {
    console.log('下载报告:', reportId);
    alert('报告下载功能（模拟）\n报告ID: ' + reportId);
}

// 查看报告
function viewReport(reportId) {
    console.log('查看报告:', reportId);
    alert('报告查看功能（模拟）\n报告ID: ' + reportId);
}

// 通用功能
function exportApplications() {
    console.log('导出申请数据');
    alert('申请数据导出功能（模拟）');
}

function refreshApplications() {
    console.log('刷新申请列表');
    loadAllApplications();
}

function batchOperation() {
    const selected = document.querySelectorAll('input[name="adminAppItem"]:checked');
    if (selected.length === 0) {
        alert('请先选择要操作的申请');
        return;
    }
    
    const appIds = Array.from(selected).map(cb => cb.value);
    console.log('批量操作申请:', appIds);
    alert(`批量操作功能（模拟）\n\n选中 ${appIds.length} 个申请:\n${appIds.join('\n')}`);
}

function filterAdminApplications() {
    console.log('筛选申请');
    loadAllApplications();
}

function toggleSelectAllAdmin() {
    const selectAll = document.getElementById('selectAllAdmin');
    const checkboxes = document.querySelectorAll('input[name="adminAppItem"]');
    
    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });
}

// 分页功能
function adminPrevPage() {
    console.log('管理员列表上一页');
}

function adminNextPage() {
    console.log('管理员列表下一页');
}

// 工具函数
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
}

function getPriorityText(priority) {
    const priorityMap = {
        'urgent': '紧急',
        'high': '高',
        'normal': '普通'
    };
    return priorityMap[priority] || '普通';
}

// 检查登录状态
function checkLoginStatus() {
    const userInfo = sessionStorage.getItem('userInfo');
    if (!userInfo) {
        alert('请先登录');
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