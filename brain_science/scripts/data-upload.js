// 数据上传页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (!checkLoginStatus()) return;
    
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = userInfo.username;
    }
    
    // 初始化标签页
    switchTab('upload');
    
    // 初始化文件上传
    initFileUpload();
    
    // 初始化下载表单
    initDownloadForm();
});

// 切换标签页
function switchTab(tabName) {
    // 隐藏所有标签页内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有按钮的active状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // 添加选中按钮的active状态
    event.target.classList.add('active');
    
    console.log('切换到标签页:', tabName);
}

// 初始化文件上传
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileQueue = document.getElementById('fileQueue');
    const startUploadBtn = document.getElementById('startUpload');
    
    let selectedFiles = [];
    
    // 阻止默认拖拽行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // 拖拽时高亮
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    // 处理拖放的文件
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        uploadArea.classList.add('dragover');
    }
    
    function unhighlight(e) {
        uploadArea.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    // 处理选择的文件
    function handleFiles(files) {
        ([...files]).forEach(uploadFile);
    }
    
    function uploadFile(file) {
        if (!validateFile(file)) return;
        
        selectedFiles.push(file);
        displayFileInQueue(file);
        
        // 启用上传按钮
        if (selectedFiles.length > 0) {
            startUploadBtn.disabled = false;
        }
    }
    
    // 验证文件
    function validateFile(file) {
        const allowedTypes = ['.csv', '.xlsx', '.mat', '.nii', '.py', '.r', '.zip', '.tar.gz'];
        const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
        
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.some(type => extension.endsWith(type.replace('.', '')))) {
            alert(`文件类型不支持: ${file.name}\n支持的格式: ${allowedTypes.join(', ')}`);
            return false;
        }
        
        if (file.size > maxSize) {
            alert(`文件过大: ${file.name}\n最大支持: 2GB`);
            return false;
        }
        
        return true;
    }
    
    // 在队列中显示文件
    function displayFileInQueue(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <div class="file-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%;"></div>
                </div>
                <div class="progress-text">等待上传</div>
            </div>
            <button class="remove-file" onclick="removeFile(this, '${file.name}')" type="button">×</button>
        `;
        
        fileQueue.appendChild(fileItem);
    }
    
    // 文件选择
    window.selectFiles = function() {
        fileInput.click();
    };
    
    window.fileSelected = function(event) {
        const files = event.target.files;
        handleFiles(files);
    };
    
    // 移除文件
    window.removeFile = function(button, fileName) {
        selectedFiles = selectedFiles.filter(file => file.name !== fileName);
        button.parentElement.remove();
        
        if (selectedFiles.length === 0) {
            startUploadBtn.disabled = true;
        }
    };
    
    // 清空队列
    window.clearQueue = function() {
        selectedFiles = [];
        fileQueue.innerHTML = '';
        startUploadBtn.disabled = true;
    };
    
    // 开始上传
    window.startUpload = function() {
        if (selectedFiles.length === 0) return;
        
        const fileType = document.getElementById('fileType').value;
        const dataCategory = document.getElementById('dataCategory').value;
        const description = document.getElementById('uploadDescription').value;
        
        console.log('开始上传文件:', {
            files: selectedFiles.map(f => f.name),
            fileType,
            dataCategory,
            description
        });
        
        // 模拟上传过程
        selectedFiles.forEach((file, index) => {
            simulateFileUpload(file, index);
        });
    };
    
    // 模拟文件上传
    function simulateFileUpload(file, index) {
        const fileItems = fileQueue.children;
        const fileItem = fileItems[index];
        const progressFill = fileItem.querySelector('.progress-fill');
        const progressText = fileItem.querySelector('.progress-text');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressText.textContent = Math.round(progress) + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                progressText.textContent = '上传完成';
                fileItem.classList.add('completed');
            }
        }, 200);
    }
}

// 初始化下载表单
function initDownloadForm() {
    const downloadForm = document.getElementById('downloadForm');
    
    if (downloadForm) {
        downloadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const downloadType = document.getElementById('downloadType').value;
            const downloadFormat = document.getElementById('downloadFormat').value;
            const selectedFiles = document.querySelectorAll('input[name="downloadFile"]:checked');
            const downloadReason = document.getElementById('downloadReason').value;
            
            if (!downloadType || !downloadFormat) {
                alert('请选择下载类型和文件格式');
                return;
            }
            
            if (selectedFiles.length === 0) {
                alert('请选择要下载的文件');
                return;
            }
            
            if (!downloadReason.trim()) {
                alert('请填写下载原因');
                return;
            }
            
            const downloadData = {
                type: downloadType,
                format: downloadFormat,
                files: Array.from(selectedFiles).map(cb => cb.value),
                reason: downloadReason,
                requestTime: new Date().toISOString()
            };
            
            console.log('提交下载申请:', downloadData);
            alert('下载申请提交成功！\n\n申请将由管理员审核，通过后您将收到通知。');
            
            // 重置表单
            downloadForm.reset();
            selectedFiles.forEach(cb => cb.checked = false);
        });
    }
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 拖拽处理
function dropHandler(ev) {
    console.log('文件拖拽放置');
    ev.preventDefault();
    
    if (ev.dataTransfer.items) {
        [...ev.dataTransfer.items].forEach((item, i) => {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                console.log(`拖拽文件[${i}]: ${file.name}`);
            }
        });
    } else {
        [...ev.dataTransfer.files].forEach((file, i) => {
            console.log(`拖拽文件[${i}]: ${file.name}`);
        });
    }
}

function dragOverHandler(ev) {
    console.log('文件拖拽经过');
    ev.preventDefault();
}

// 下载文件
function downloadFile(filename) {
    console.log('下载文件:', filename);
    
    // 模拟下载过程
    const link = document.createElement('a');
    link.href = '#';
    link.download = filename;
    
    // 创建一个包含文件内容的Blob（这里是模拟内容）
    const content = `这是文件 ${filename} 的模拟内容\n下载时间: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(blob);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('文件下载开始: ' + filename);
}

// 重新申请下载
function reapplyDownload(filename) {
    console.log('重新申请下载:', filename);
    
    if (confirm('确定要重新申请下载此文件吗？\n\n文件: ' + filename)) {
        alert('重新申请已提交，请等待审核。');
    }
}

// 刷新文件列表
function refreshFileList() {
    console.log('刷新文件列表');
    alert('文件列表刷新功能（模拟）');
}

// 文件搜索
function filterFiles(searchTerm) {
    console.log('搜索文件:', searchTerm);
    
    const fileItems = document.querySelectorAll('#downloadFileList .file-item');
    fileItems.forEach(item => {
        const fileName = item.querySelector('.file-name').textContent;
        if (fileName.toLowerCase().includes(searchTerm.toLowerCase())) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 切换视图模式
function switchView(viewMode) {
    console.log('切换视图模式:', viewMode);
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

// 文件管理功能
function createFolder() {
    const folderName = prompt('请输入文件夹名称:');
    if (folderName) {
        console.log('创建文件夹:', folderName);
        alert('文件夹创建成功: ' + folderName);
    }
}

function refreshFileManager() {
    console.log('刷新文件管理器');
    alert('文件管理器刷新功能（模拟）');
}

function deleteSelected() {
    const selected = document.querySelectorAll('input[name="fileItem"]:checked');
    if (selected.length === 0) {
        alert('请先选择要删除的文件');
        return;
    }
    
    const fileNames = Array.from(selected).map(cb => cb.value);
    if (confirm(`确定要删除这 ${fileNames.length} 个文件吗？\n\n${fileNames.join('\n')}`)) {
        console.log('删除文件:', fileNames);
        alert('文件删除成功');
    }
}

function navigateToFolder(path) {
    console.log('导航到文件夹:', path);
}

function editFile(filename) {
    console.log('编辑文件:', filename);
    alert('文件编辑功能（模拟）\n文件: ' + filename);
}

function downloadFileManager(filename) {
    downloadFile(filename);
}

function previewFile(filename) {
    console.log('预览文件:', filename);
    
    document.getElementById('previewFileName').textContent = filename;
    document.getElementById('previewContent').innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h4>文件预览</h4>
            <p>文件名: ${filename}</p>
            <p>这里显示文件预览内容（模拟）</p>
            <div style="margin: 20px 0;">
                <button class="btn-secondary" onclick="closePreviewModal()">关闭</button>
                <button class="btn-primary" onclick="downloadFile('${filename}')">下载</button>
            </div>
        </div>
    `;
    
    document.getElementById('previewModal').style.display = 'flex';
}

function closePreviewModal() {
    document.getElementById('previewModal').style.display = 'none';
}

function toggleSelectAllFiles() {
    const selectAll = document.getElementById('selectAllFiles');
    const checkboxes = document.querySelectorAll('input[name="fileItem"]');
    
    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });
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

// 添加CSS样式
const style = document.createElement('style');
style.textContent = `
    .dragover {
        border-color: #3b82f6 !important;
        background-color: rgba(59, 130, 246, 0.1) !important;
    }
    
    .file-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        margin-bottom: 8px;
        background: #f9fafb;
    }
    
    .file-item.completed {
        background: #f0fdf4;
        border-color: #16a34a;
    }
    
    .file-info {
        flex: 1;
    }
    
    .file-name {
        font-weight: 500;
        margin-bottom: 2px;
    }
    
    .file-size {
        font-size: 12px;
        color: #6b7280;
    }
    
    .file-progress {
        flex: 2;
        margin: 0 15px;
    }
    
    .progress-bar {
        width: 100%;
        height: 6px;
        background: #e5e7eb;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 4px;
    }
    
    .progress-fill {
        height: 100%;
        background: #3b82f6;
        transition: width 0.3s;
    }
    
    .progress-text {
        font-size: 11px;
        color: #6b7280;
    }
    
    .remove-file {
        background: #ef4444;
        color: white;
        border: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .remove-file:hover {
        background: #dc2626;
    }
`;
document.head.appendChild(style);