// 我的申请页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (!checkLoginStatus()) return;
    
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = userInfo.username;
    }
    
    // 加载申请列表
    loadApplications();
});

// 加载申请列表
function loadApplications() {
    const applications = getMyApplications();
    const tableBody = document.getElementById('applicationsTable');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = applications.map(app => {
        return `
            <tr>
                <td>${app.id}</td>
                <td>${app.type || '数据+资源'}</td>
                <td>${formatDate(app.submitTime)}</td>
                <td><span class="status ${app.statusClass}">${app.statusText}</span></td>
                <td>${app.currentStage}</td>
                <td>${formatDate(app.lastUpdate)}</td>
                <td>
                    <button class="btn-small btn-secondary" onclick="viewApplication('${app.id}')">查看</button>
                    ${getActionButtons(app)}
                </td>
            </tr>
        `;
    }).join('');
}

// 获取我的申请
function getMyApplications() {
    // 从localStorage获取申请，实际项目中会从后端API获取
    const storedApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
    
    // 模拟一些示例数据
    const sampleApplications = [
        {
            id: 'APP-2024-001',
            type: '数据+资源',
            submitTime: '2024-01-15T10:30:00',
            status: 'approved',
            statusText: '已通过',
            statusClass: 'approved',
            currentStage: '运维配置中',
            lastUpdate: '2024-01-16T09:00:00'
        },
        {
            id: 'APP-2024-002',
            type: '数据权限',
            submitTime: '2024-01-12T14:20:00',
            status: 'reviewing',
            statusText: '审核中',
            statusClass: 'reviewing',
            currentStage: '审核小组 (2/3)',
            lastUpdate: '2024-01-14T16:30:00'
        },
        {
            id: 'APP-2024-003',
            type: '计算资源',
            submitTime: '2024-01-10T09:15:00',
            status: 'rejected',
            statusText: '已驳回',
            statusClass: 'rejected',
            currentStage: '秘书组初审',
            lastUpdate: '2024-01-11T11:00:00'
        }
    ];
    
    // 合并存储的申请和示例数据
    const allApplications = [...storedApplications, ...sampleApplications];
    
    // 按提交时间倒序排列
    return allApplications.sort((a, b) => new Date(b.submitTime) - new Date(a.submitTime));
}

// 根据申请状态获取操作按钮
function getActionButtons(app) {
    switch(app.status) {
        case 'approved':
            return '<button class="btn-small btn-primary" onclick="downloadAgreement(\'' + app.id + '\')">协议</button>';
        case 'reviewing':
            return '<button class="btn-small btn-warning" onclick="trackProgress(\'' + app.id + '\')">跟踪</button>';
        case 'rejected':
            return '<button class="btn-small btn-primary" onclick="editApplication(\'' + app.id + '\')">修改</button>';
        case 'draft':
            return '<button class="btn-small btn-primary" onclick="editDraft(\'' + app.id + '\')">编辑</button>' + 
                   '<button class="btn-small btn-danger" onclick="deleteDraft(\'' + app.id + '\')">删除</button>';
        default:
            return '';
    }
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

// 查看申请详情
function viewApplication(appId) {
    console.log('查看申请:', appId);
    
    // 模拟申请详情数据
    const mockData = {
        id: appId,
        type: '数据+资源',
        submitTime: '2024-01-15 10:30',
        status: '审核中',
        purpose: '用于学龄儿童脑智发育相关的科学研究，分析不同年龄段儿童的认知能力发展规律。',
        dataRange: '北京站、上海站 | MRI数据、行为测试数据',
        resource: 'CPU: 16核 | 内存: 64GB | 存储: 5TB'
    };
    
    // 填充模态框数据
    document.getElementById('detailAppId').textContent = mockData.id;
    document.getElementById('detailId').textContent = mockData.id;
    document.getElementById('detailType').textContent = mockData.type;
    document.getElementById('detailTime').textContent = mockData.submitTime;
    document.getElementById('detailStatus').innerHTML = `<span class="status reviewing">${mockData.status}</span>`;
    document.getElementById('detailPurpose').textContent = mockData.purpose;
    document.getElementById('detailDataRange').textContent = mockData.dataRange;
    document.getElementById('detailResource').textContent = mockData.resource;
    
    // 显示模态框
    document.getElementById('detailModal').style.display = 'flex';
}

// 关闭详情模态框
function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 跟踪申请进度
function trackProgress(appId) {
    console.log('跟踪进度:', appId);
    
    // 显示进度模态框
    document.getElementById('progressModal').style.display = 'flex';
}

// 关闭进度模态框
function closeProgressModal() {
    document.getElementById('progressModal').style.display = 'none';
}

// 下载协议
function downloadAgreement(appId) {
    console.log('下载协议:', appId);
    alert('数据使用协议下载功能（模拟）\n\n实际环境中会下载PDF文件');
}

// 编辑申请
function editApplication(appId) {
    console.log('编辑申请:', appId);
    if (confirm('确定要重新编辑这个申请吗？\n\n编辑后需要重新提交审核。')) {
        // 跳转到申请页面并预填数据
        window.location.href = `apply.html?edit=${appId}`;
    }
}

// 编辑草稿
function editDraft(draftId) {
    console.log('编辑草稿:', draftId);
    window.location.href = `apply.html?draft=${draftId}`;
}

// 删除草稿
function deleteDraft(draftId) {
    console.log('删除草稿:', draftId);
    if (confirm('确定要删除这个草稿吗？')) {
        let drafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
        drafts = drafts.filter(draft => draft.id !== draftId);
        localStorage.setItem('applicationDrafts', JSON.stringify(drafts));
        
        loadApplications(); // 重新加载列表
        alert('草稿删除成功');
    }
}

// 筛选申请
function filterApplications() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    console.log('筛选条件:', { statusFilter, dateFilter });
    
    // 实际实现中会重新加载和筛选数据
    loadApplications();
}

// 刷新列表
function refreshList() {
    console.log('刷新申请列表');
    loadApplications();
}

// 导出列表
function exportList() {
    console.log('导出申请列表');
    alert('申请列表导出功能（模拟）\n\n实际环境中会下载Excel文件');
}

// 分页功能
function prevPage() {
    console.log('上一页');
}

function nextPage() {
    console.log('下一页');
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