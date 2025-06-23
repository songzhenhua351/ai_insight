// 申请页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (!checkLoginStatus()) return;
    
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = userInfo.username;
    }
    
    const applicationForm = document.getElementById('applicationForm');
    const gpuRequiredRadios = document.querySelectorAll('input[name="gpuRequired"]');
    const gpuSpecs = document.getElementById('gpuSpecs');
    
    // GPU需求显示/隐藏
    gpuRequiredRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                gpuSpecs.style.display = 'block';
            } else {
                gpuSpecs.style.display = 'none';
            }
        });
    });
    
    // 表单提交
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = collectFormData();
            submitApplication(formData);
        }
    });
});

// 表单验证
function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.style.borderColor = '#d1d5db';
    });
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            isValid = false;
        }
    });
    
    const siteCheckboxes = document.querySelectorAll('input[name="sites"]:checked');
    if (siteCheckboxes.length === 0) {
        alert('请至少选择一个站点');
        isValid = false;
    }
    
    const dataTypeCheckboxes = document.querySelectorAll('input[name="dataTypes"]:checked');
    if (dataTypeCheckboxes.length === 0) {
        alert('请至少选择一种数据类型');
        isValid = false;
    }
    
    if (!isValid) {
        alert('请填写所有必填项并检查格式是否正确');
    }
    
    return isValid;
}

// 收集表单数据
function collectFormData() {
    const formData = {
        realName: document.getElementById('realName').value,
        unit: document.getElementById('unit').value,
        researchGroup: document.getElementById('researchGroup').value,
        position: document.getElementById('position').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        sites: Array.from(document.querySelectorAll('input[name="sites"]:checked')).map(cb => cb.value),
        dataTypes: Array.from(document.querySelectorAll('input[name="dataTypes"]:checked')).map(cb => cb.value),
        usagePurpose: document.getElementById('usagePurpose').value,
        cpuCores: document.getElementById('cpuCores').value,
        memory: document.getElementById('memory').value,
        storage: document.getElementById('storage').value,
        duration: document.getElementById('duration').value,
        resourceJustification: document.getElementById('resourceJustification').value,
        submitTime: new Date().toISOString(),
        submitter: JSON.parse(sessionStorage.getItem('userInfo')).username
    };
    
    return formData;
}

// 提交申请
function submitApplication(formData) {
    console.log('提交申请数据:', formData);
    
    const applicationId = generateApplicationId();
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';
    
    setTimeout(() => {
        saveApplicationToStorage(applicationId, formData);
        alert(`申请提交成功！\n申请编号：${applicationId}`);
        window.location.href = 'my-applications.html';
    }, 1500);
}

// 生成申请编号
function generateApplicationId() {
    const now = new Date();
    const year = now.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `APP-${year}-${random}`;
}

// 保存申请到本地存储
function saveApplicationToStorage(applicationId, formData) {
    const applications = JSON.parse(localStorage.getItem('userApplications') || '[]');
    const application = {
        id: applicationId,
        ...formData,
        status: 'pending',
        statusText: '待审核'
    };
    applications.push(application);
    localStorage.setItem('userApplications', JSON.stringify(applications));
}

// 保存草稿
function saveDraft() {
    alert('草稿保存成功！');
    console.log('保存草稿');
}

// 显示帮助
function showHelp() {
    document.getElementById('helpModal').style.display = 'flex';
}

// 关闭帮助
function closeHelp() {
    document.getElementById('helpModal').style.display = 'none';
}