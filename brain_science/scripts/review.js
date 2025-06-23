// 审核页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (!checkLoginStatus()) return;
    
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    
    // 检查是否有审核权限
    const reviewRoles = ['secretary', 'reviewer', 'expert', 'admin'];
    if (!reviewRoles.includes(userInfo.role)) {
        alert('您没有审核权限');
        window.location.href = 'dashboard.html';
        return;
    }
    
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = userInfo.username;
    }
    
    // 加载待审核申请列表
    loadReviewApplications();
    
    // 绑定审核结果变化事件
    const reviewResultRadios = document.querySelectorAll('input[name="reviewResult"]');
    reviewResultRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const rejectionGroup = document.getElementById('rejectionReasonGroup');
            if (this.value === 'rejected') {
                rejectionGroup.style.display = 'block';
            } else {
                rejectionGroup.style.display = 'none';
            }
        });
    });
});

// 加载待审核申请
function loadReviewApplications() {
    const applications = getReviewApplications();
    const tableBody = document.getElementById('applicationsTable');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = applications.map(app => {
        return `
            <tr>
                <td>${app.id}</td>
                <td>${app.applicant}</td>
                <td>${app.unit}</td>
                <td>${app.researchGroup}</td>
                <td>${app.type}</td>
                <td>${formatDate(app.submitTime)}</td>
                <td><span class="status ${app.statusClass}">${app.statusText}</span></td>
                <td>${app.progress}</td>
                <td><span class="priority ${app.priority}">${getPriorityText(app.priority)}</span></td>
                <td>
                    <button class="btn-small btn-primary" onclick="reviewApplication('${app.id}')">审核</button>
                    <button class="btn-small btn-secondary" onclick="viewApplication('${app.id}')">查看</button>
                </td>
            </tr>
        `;
    }).join('');
}

// 获取待审核申请（模拟数据）
function getReviewApplications() {
    return [
        {
            id: 'APP-2024-001',
            applicant: '张三',
            unit: '北京师范大学',
            researchGroup: '认知神经科学',
            type: '数据+资源',
            submitTime: '2024-01-15T00:00:00',
            status: 'pending',
            statusText: '待初审',
            statusClass: 'pending',
            progress: '秘书组审核',
            priority: 'high'
        },
        {
            id: 'APP-2024-002',
            applicant: '李四',
            unit: '北京师范大学',
            researchGroup: '发展心理学',
            type: '数据权限',
            submitTime: '2024-01-14T00:00:00',
            status: 'reviewing',
            statusText: '复审中',
            statusClass: 'reviewing',
            progress: '审核小组 (2/3)',
            priority: 'normal'
        },
        {
            id: 'APP-2024-003',
            applicant: '王五',
            unit: '北京师范大学',
            researchGroup: '脑科学与认知',
            type: '计算资源',
            submitTime: '2024-01-13T00:00:00',
            status: 'expert_review',
            statusText: '专家审核',
            statusClass: 'expert_review',
            progress: '平台专家审核',
            priority: 'urgent'
        },
        {
            id: 'APP-2024-004',
            applicant: '赵六',
            unit: '北京师范大学',
            researchGroup: '教育心理学',
            type: '数据+资源',
            submitTime: '2024-01-12T00:00:00',
            status: 'approved',
            statusText: '已通过',
            statusClass: 'approved',
            progress: '等待配置',
            priority: 'normal'
        }
    ];
}

// 获取优先级文本
function getPriorityText(priority) {
    const priorityMap = {
        'urgent': '紧急',
        'high': '高',
        'normal': '普通'
    };
    return priorityMap[priority] || '普通';
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
}

// 审核申请
function reviewApplication(appId) {
    console.log('审核申请:', appId);
    
    // 模拟申请详情数据
    const mockData = {
        id: appId,
        applicant: '张三',
        unit: '北京师范大学',
        researchGroup: '认知神经科学实验室',
        contact: 'zhangsan@example.com / 138****1234',
        submitTime: '2024-01-15 10:30',
        type: '数据+资源',
        sites: '北京站、上海站',
        dataTypes: 'MRI数据、行为测试数据',
        usagePurpose: '用于学龄儿童脑智发育相关的科学研究，分析不同年龄段儿童的认知能力发展规律，探索大脑结构与认知功能的关系。',
        cpuCores: '16核',
        memory: '64GB',
        storage: '5TB',
        duration: '6个月',
        resourceJustification: '需要处理大量的MRI数据，进行复杂的神经网络分析和机器学习模型训练，对计算资源有较高要求。'
    };
    
    // 填充审核模态框数据
    document.getElementById('reviewAppId').textContent = mockData.id;
    document.getElementById('applicantName').textContent = mockData.applicant;
    document.getElementById('applicantUnit').textContent = mockData.unit;
    document.getElementById('researchGroup').textContent = mockData.researchGroup;
    document.getElementById('contactInfo').textContent = mockData.contact;
    document.getElementById('applyTime').textContent = mockData.submitTime;
    document.getElementById('applicationType').textContent = mockData.type;
    document.getElementById('siteRange').textContent = mockData.sites;
    document.getElementById('dataTypes').textContent = mockData.dataTypes;
    document.getElementById('usagePurpose').textContent = mockData.usagePurpose;
    document.getElementById('cpuCores').textContent = mockData.cpuCores;
    document.getElementById('memory').textContent = mockData.memory;
    document.getElementById('storage').textContent = mockData.storage;
    document.getElementById('duration').textContent = mockData.duration;
    document.getElementById('resourceJustification').textContent = mockData.resourceJustification;
    
    // 清空之前的审核意见
    document.querySelectorAll('input[name="reviewResult"]').forEach(radio => {
        radio.checked = false;
    });
    document.getElementById('reviewComment').value = '';
    document.getElementById('reviewPriority').value = 'normal';
    
    // 显示审核模态框
    document.getElementById('reviewModal').style.display = 'flex';
}

// 查看申请详情
function viewApplication(appId) {
    console.log('查看申请详情:', appId);
    alert('查看申请详情功能（模拟）\n申请编号: ' + appId);
}

// 关闭审核模态框
function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
}

// 提交审核
function submitReview() {
    const reviewResult = document.querySelector('input[name="reviewResult"]:checked');
    const reviewComment = document.getElementById('reviewComment').value;
    const reviewPriority = document.getElementById('reviewPriority').value;
    
    if (!reviewResult) {
        alert('请选择审核结果');
        return;
    }
    
    if (!reviewComment.trim()) {
        alert('请填写审核意见');
        return;
    }
    
    // 如果是驳回，检查是否选择了驳回原因
    if (reviewResult.value === 'rejected') {
        const rejectionReasons = document.querySelectorAll('input[name="rejectionReason"]:checked');
        if (rejectionReasons.length === 0) {
            alert('请选择驳回原因');
            return;
        }
    }
    
    const reviewData = {
        applicationId: document.getElementById('reviewAppId').textContent,
        result: reviewResult.value,
        comment: reviewComment,
        priority: reviewPriority,
        reviewer: JSON.parse(sessionStorage.getItem('userInfo')).username,
        reviewTime: new Date().toISOString()
    };
    
    if (reviewResult.value === 'rejected') {
        reviewData.rejectionReasons = Array.from(document.querySelectorAll('input[name="rejectionReason"]:checked')).map(cb => cb.value);
    }
    
    console.log('提交审核结果:', reviewData);
    
    // 模拟提交过程
    const submitBtn = document.querySelector('#reviewModal .btn-primary');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';
    
    setTimeout(() => {
        alert('审核提交成功！');
        closeReviewModal();
        
        // 重新加载列表
        loadReviewApplications();
        
        submitBtn.disabled = false;
        submitBtn.textContent = '提交审核';
    }, 1000);
}

// 提交上级审核
function escalateReview() {
    const appId = document.getElementById('reviewAppId').textContent;
    const comment = document.getElementById('reviewComment').value;
    
    if (!comment.trim()) {
        alert('请填写提交上级的原因');
        return;
    }
    
    if (confirm('确定要将此申请提交给上级审核吗？')) {
        console.log('提交上级审核:', { appId, comment });
        alert('已提交给上级审核');
        closeReviewModal();
        loadReviewApplications();
    }
}

// 筛选申请
function filterApplications() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchInput = document.getElementById('searchInput').value;
    
    console.log('筛选条件:', { statusFilter, typeFilter, searchInput });
    
    // 实际实现中会重新加载和筛选数据
    loadReviewApplications();
}

// 刷新列表
function refreshList() {
    console.log('刷新审核列表');
    loadReviewApplications();
}

// 导出报告
function exportReport() {
    console.log('导出审核报告');
    alert('审核报告导出功能（模拟）\n\n实际环境中会下载Excel文件');
}

// 查看审核历史
function viewHistory(appId) {
    console.log('查看审核历史:', appId);
    document.getElementById('historyModal').style.display = 'flex';
}

// 关闭历史模态框
function closeHistoryModal() {
    document.getElementById('historyModal').style.display = 'none';
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