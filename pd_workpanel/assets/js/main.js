// 主要的JavaScript交互逻辑

// 全局状态管理
const AppState = {
    currentProject: 'conv1',
    activeAgents: [],
    sidebarStates: {
        left: true,
        right: true
    },
    messages: [],
    currentUser: '产品经理'
};

// DOM元素引用
const elements = {
    chatMessages: null,
    messageInput: null,
    sendBtn: null,
    modal: null,
    modalTitle: null,
    modalContent: null
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    initializeData();
    console.log('产品经理AI工作台初始化完成');
});

// 初始化DOM元素引用
function initializeElements() {
    elements.chatMessages = document.getElementById('chatMessages');
    elements.messageInput = document.getElementById('messageInput');
    elements.sendBtn = document.querySelector('.send-btn');
    elements.modal = document.getElementById('agentModal');
    elements.modalTitle = document.getElementById('modalTitle');
    elements.modalContent = document.getElementById('modalContent');
}

// 设置事件监听器
function setupEventListeners() {
    // 输入框事件
    if (elements.messageInput) {
        elements.messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        elements.messageInput.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
    }

    // 发送按钮事件
    if (elements.sendBtn) {
        elements.sendBtn.addEventListener('click', sendMessage);
    }

    // 模态框关闭事件
    if (elements.modal) {
        elements.modal.addEventListener('click', function(e) {
            if (e.target === elements.modal) {
                closeModal();
            }
        });
    }

    // 智能体点击事件
    document.querySelectorAll('.agent-item').forEach(item => {
        item.addEventListener('click', function() {
            selectAgent(this.dataset.agent);
        });
    });

    // 历史对话点击事件
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', function() {
            const convId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            loadConversation(convId);
        });
    });

    // 任务项点击事件
    document.querySelectorAll('.task-item').forEach(item => {
        item.addEventListener('click', function() {
            console.log('点击任务项:', this.querySelector('.task-title').textContent);
        });
    });

    // 文档项点击事件
    document.querySelectorAll('.document-item').forEach(item => {
        item.addEventListener('click', function() {
            const docType = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            openDocument(docType);
        });
    });
}

// 初始化数据
function initializeData() {
    // 模拟智能体状态更新
    updateAgentStatus();
    
    // 开始模拟智能体工作
    simulateAgentWork();
}

// 发送消息
function sendMessage() {
    const input = elements.messageInput;
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addMessage({
        type: 'user',
        content: message,
        timestamp: new Date()
    });
    
    // 清空输入框
    input.value = '';
    autoResizeTextarea(input);
    
    // 模拟智能体响应
    setTimeout(() => {
        simulateAgentResponse(message);
    }, 1000);
    
    console.log('发送消息:', message);
}

// 添加消息到聊天区域
function addMessage(messageData) {
    const messageElement = createMessageElement(messageData);
    elements.chatMessages.appendChild(messageElement);
    
    // 滚动到底部
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    // 更新消息计数
    AppState.messages.push(messageData);
}

// 创建消息元素
function createMessageElement(messageData) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${messageData.type}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = messageData.type === 'user' ? '👤' : getAgentAvatar(messageData.agent);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    headerDiv.innerHTML = `
        <span class="agent-name">${messageData.type === 'user' ? AppState.currentUser : getAgentName(messageData.agent)}</span>
        <span class="message-time">${formatTime(messageData.timestamp)}</span>
    `;
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.innerHTML = messageData.content;
    
    contentDiv.appendChild(headerDiv);
    contentDiv.appendChild(textDiv);
    
    if (messageData.type === 'agent' && messageData.actions) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        messageData.actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'btn-action';
            btn.textContent = action.label;
            btn.onclick = () => action.handler();
            actionsDiv.appendChild(btn);
        });
        contentDiv.appendChild(actionsDiv);
    }
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

// 模拟智能体响应
function simulateAgentResponse(userMessage) {
    const responses = [
        {
            agent: 'requirement',
            content: `我来分析您的需求"${userMessage}"。基于产品设计经验，我建议从以下几个维度来考虑：<br><br><strong>用户价值：</strong>这个需求能为用户带来什么价值？<br><strong>技术可行性：</strong>实现难度如何？<br><strong>商业价值：</strong>对业务目标的贡献？`,
            actions: [
                { label: '查看详细分析', handler: () => viewDetails('requirement') },
                { label: '生成用户故事', handler: () => callTool('requirement', 'user-story') }
            ]
        },
        {
            agent: 'competitor',
            content: `我来补充竞品分析的视角。通过对市场上类似产品的调研，发现以下关键洞察：<br><br><div class="task-breakdown"><div class="breakdown-item"><div class="breakdown-header"><span class="breakdown-title">🎯 核心竞争优势</span></div><ul class="breakdown-tasks"><li>功能差异化分析</li><li>用户体验对比</li><li>市场定位研究</li></ul></div></div>`,
            actions: [
                { label: '查看完整报告', handler: () => viewDetails('competitor') },
                { label: '生成竞品矩阵', handler: () => callTool('competitor', 'matrix') }
            ]
        }
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    addMessage({
        type: 'agent',
        agent: randomResponse.agent,
        content: randomResponse.content,
        actions: randomResponse.actions,
        timestamp: new Date()
    });
}

// 获取智能体头像
function getAgentAvatar(agentType) {
    const avatars = {
        requirement: '📋',
        competitor: '🔍',
        breakdown: '🧩',
        testing: '🧪',
        prd: '📄',
        prototype: '🎨'
    };
    return avatars[agentType] || '🤖';
}

// 获取智能体名称
function getAgentName(agentType) {
    const names = {
        requirement: '需求分析智能体',
        competitor: '竞品分析智能体',
        breakdown: '需求拆分智能体',
        testing: '需求测试智能体',
        prd: 'PRD撰写智能体',
        prototype: '原型生成智能体'
    };
    return names[agentType] || '智能体';
}

// 格式化时间
function formatTime(date) {
    return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// 自动调整文本框高度
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// 切换侧边栏
function toggleSidebar(side) {
    const sidebar = document.querySelector(`.${side}-sidebar`);
    AppState.sidebarStates[side] = !AppState.sidebarStates[side];
    
    if (AppState.sidebarStates[side]) {
        sidebar.style.transform = 'translateX(0)';
    } else {
        if (side === 'left') {
            sidebar.style.transform = 'translateX(-100%)';
        } else {
            sidebar.style.transform = 'translateX(100%)';
        }
    }
    
    console.log(`${side}侧边栏${AppState.sidebarStates[side] ? '展开' : '收起'}`);
}

// 选择智能体
function selectAgent(agentType) {
    // 移除之前的选中状态
    document.querySelectorAll('.agent-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加新的选中状态
    const selectedAgent = document.querySelector(`[data-agent="${agentType}"]`);
    if (selectedAgent) {
        selectedAgent.classList.add('active');
    }
    
    console.log('选择智能体:', agentType);
}

// 加载对话
function loadConversation(conversationId) {
    // 移除之前的选中状态
    document.querySelectorAll('.history-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加新的选中状态
    const selectedConv = document.querySelector(`[onclick*="${conversationId}"]`);
    if (selectedConv) {
        selectedConv.classList.add('active');
    }
    
    AppState.currentProject = conversationId;
    
    // 模拟加载对话内容
    console.log('加载对话:', conversationId);
}

// 查看详情
function viewDetails(agentType) {
    const details = {
        requirement: {
            title: '需求分析详情',
            content: `
                <h4>需求分析报告</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">15</div>
                        <div class="stat-label">识别需求数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">94%</div>
                        <div class="stat-label">准确率</div>
                    </div>
                </div>
                <h5>核心需求列表</h5>
                <ul>
                    <li>个性化推荐算法优化</li>
                    <li>用户行为数据收集</li>
                    <li>实时推荐引擎</li>
                    <li>A/B测试平台</li>
                </ul>
            `
        },
        competitor: {
            title: '竞品分析报告',
            content: `
                <h4>竞品对比分析</h4>
                <table class="comparison-table">
                    <tr>
                        <th>产品</th>
                        <th>核心功能</th>
                        <th>优势</th>
                        <th>劣势</th>
                    </tr>
                    <tr>
                        <td>产品A</td>
                        <td>智能推荐</td>
                        <td>算法精准</td>
                        <td>界面复杂</td>
                    </tr>
                    <tr>
                        <td>产品B</td>
                        <td>个性化定制</td>
                        <td>用户体验好</td>
                        <td>功能较少</td>
                    </tr>
                </table>
            `
        }
    };
    
    const detail = details[agentType];
    if (detail) {
        openModal(detail.title, detail.content);
    }
}

// 调用工具
function callTool(agentType, toolType) {
    console.log(`${agentType}智能体调用${toolType}工具`);
    
    // 模拟工具调用
    addMessage({
        type: 'agent',
        agent: agentType,
        content: `正在调用${toolType}工具进行分析...`,
        timestamp: new Date()
    });
    
    setTimeout(() => {
        addMessage({
            type: 'agent',
            agent: agentType,
            content: `${toolType}工具分析完成！已生成相关报告和数据。`,
            timestamp: new Date()
        });
    }, 2000);
}

// 打开文档
function openDocument(docType) {
    const docs = {
        prd: '产品需求文档',
        prototype: '交互原型',
        analysis: '竞品分析报告',
        test: '测试用例'
    };
    
    console.log('打开文档:', docs[docType] || docType);
    alert(`即将打开 ${docs[docType] || docType}`);
}

// 打开工具
function openTool(toolName) {
    const tools = {
        feishu: '飞书文档',
        mastergo: 'MasterGo',
        xmind: 'XMind',
        notion: 'Notion'
    };
    
    console.log('打开工具:', tools[toolName] || toolName);
    alert(`即将打开 ${tools[toolName] || toolName}`);
}

// 创建新项目
function createNewProject() {
    console.log('创建新项目');
    const projectName = prompt('请输入项目名称:');
    if (projectName) {
        alert(`项目 "${projectName}" 创建成功！`);
    }
}

// 保存项目
function saveProject() {
    console.log('保存项目');
    alert('项目已保存！');
}

// 导出项目
function exportProject() {
    console.log('导出项目');
    alert('项目导出功能开发中...');
}

// 模态框操作
function openModal(title, content) {
    if (elements.modal && elements.modalTitle && elements.modalContent) {
        elements.modalTitle.textContent = title;
        elements.modalContent.innerHTML = content;
        elements.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (elements.modal) {
        elements.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 更新智能体状态
function updateAgentStatus() {
    const agents = document.querySelectorAll('.agent-item');
    agents.forEach(agent => {
        const statusIndicator = agent.querySelector('.status-indicator');
        const statusText = agent.querySelector('.agent-status-text');
        
        // 随机更新状态（模拟）
        if (Math.random() > 0.7) {
            const statuses = ['运行中', '已完成', '待启动'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            statusText.textContent = randomStatus;
            
            statusIndicator.className = 'status-indicator';
            if (randomStatus === '运行中') {
                statusIndicator.classList.add('running');
            } else if (randomStatus === '已完成') {
                statusIndicator.classList.add('completed');
            } else {
                statusIndicator.classList.add('idle');
            }
        }
    });
}

// 模拟智能体工作
function simulateAgentWork() {
    setInterval(() => {
        updateAgentStatus();
    }, 30000); // 每30秒更新一次状态
}

// 工具栏功能
function insertTemplate() {
    const templates = [
        '请分析以下需求的可行性...',
        '帮我对比这两个产品功能...',
        '生成这个功能的PRD...',
        '创建用户测试方案...'
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    elements.messageInput.value = template;
    autoResizeTextarea(elements.messageInput);
    
    console.log('插入模板:', template);
}

function uploadFile() {
    console.log('上传文件');
    alert('文件上传功能开发中...');
}

function voiceInput() {
    console.log('语音输入');
    alert('语音输入功能开发中...');
}

function callAgent() {
    console.log('召唤智能体');
    const agents = ['需求分析', '竞品分析', '需求拆分', '需求测试', 'PRD撰写', '原型生成'];
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    
    elements.messageInput.value = `@${randomAgent} `;
    elements.messageInput.focus();
    
    console.log('召唤智能体:', randomAgent);
}

function generateJira() {
    console.log('生成Jira任务');
    alert('正在生成Jira任务...');
}

// 工具九宫格功能
function toggleToolsGrid() {
    const modal = document.getElementById('toolsGridModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    
    if (modal.style.display === 'block') {
        // 添加进入动画效果
        const content = modal.querySelector('.tools-grid-content');
        content.style.transform = 'translate(-50%, -50%) scale(0.9)';
        content.style.opacity = '0';
        content.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            content.style.transform = 'translate(-50%, -50%) scale(1)';
            content.style.opacity = '1';
        }, 10);
        
        // 禁用背景滚动
        document.body.style.overflow = 'hidden';
    } else {
        // 恢复背景滚动
        document.body.style.overflow = 'auto';
    }
    
    console.log('工具九宫格', modal.style.display === 'block' ? '打开' : '关闭');
}

function closeToolsGrid() {
    const modal = document.getElementById('toolsGridModal');
    const content = modal.querySelector('.tools-grid-content');
    
    // 添加退出动画效果
    content.style.transform = 'translate(-50%, -50%) scale(0.9)';
    content.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        content.style.transform = 'translate(-50%, -50%) scale(1)';
        content.style.opacity = '1';
        // 恢复背景滚动
        document.body.style.overflow = 'auto';
    }, 200);
    
    console.log('工具九宫格关闭');
}

// 扩展工具打开功能
function openTool(toolName) {
    const tools = {
        feishu: {
            name: '飞书文档',
            url: 'https://feishu.cn',
            description: '在线文档协作工具'
        },
        mastergo: {
            name: 'MasterGo',
            url: 'https://mastergo.com',
            description: '产品设计协作平台'
        },
        xmind: {
            name: 'XMind',
            url: 'https://xmind.cn',
            description: '思维导图工具'
        },
        notion: {
            name: 'Notion',
            url: 'https://notion.so',
            description: '全能工作空间'
        },
        axure: {
            name: 'Axure',
            url: 'https://axure.com',
            description: '原型设计工具'
        },
        figma: {
            name: 'Figma',
            url: 'https://figma.com',
            description: 'UI/UX设计工具'
        },
        jira: {
            name: 'Jira',
            url: 'https://atlassian.com/software/jira',
            description: '项目管理工具'
        },
        confluence: {
            name: 'Confluence',
            url: 'https://atlassian.com/software/confluence',
            description: '团队协作空间'
        },
        slack: {
            name: 'Slack',
            url: 'https://slack.com',
            description: '团队沟通工具'
        }
    };
    
    const tool = tools[toolName];
    if (tool) {
        console.log('打开工具:', tool.name);
        
        // 关闭工具九宫格
        closeToolsGrid();
        
        // 显示工具信息并询问是否打开
        const openTool = confirm(`即将打开 ${tool.name}\n${tool.description}\n\n是否继续？`);
        if (openTool) {
            // 在新窗口中打开工具（实际使用时可以替换为真实URL）
            console.log(`正在打开 ${tool.name}: ${tool.url}`);
            // window.open(tool.url, '_blank');
            alert(`${tool.name} 已在新窗口中打开！`);
        }
    } else {
        console.log('未知工具:', toolName);
        alert('工具暂未配置，请联系管理员');
    }
}

// 键盘事件监听（ESC关闭工具九宫格）
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('toolsGridModal');
        if (modal && modal.style.display === 'block') {
            closeToolsGrid();
        }
    }
});

// 提示词模板功能
function showPromptTemplates() {
    const modal = document.getElementById('promptTemplatesModal');
    modal.style.display = 'block';
    
    // 添加进入动画
    setTimeout(() => {
        modal.querySelector('.modal-container').style.animation = 'slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 10);
    
    // 禁用背景滚动
    document.body.style.overflow = 'hidden';
}

function closePromptTemplates() {
    const modal = document.getElementById('promptTemplatesModal');
    modal.querySelector('.modal-container').style.animation = 'slideOut 0.3s ease';
    
    setTimeout(() => {
        modal.style.display = 'none';
        // 恢复背景滚动
        document.body.style.overflow = 'auto';
    }, 300);
}

function insertPrompt(promptText) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = promptText;
    messageInput.focus();
    closePromptTemplates();
    showNotification('提示词已插入', 'success');
}

// 关联上下文功能
let currentContextType = null;
let selectedItems = new Set();

function showContextMenu() {
    const modal = document.getElementById('contextModal');
    modal.style.display = 'block';
    
    // 重置状态
    currentContextType = null;
    selectedItems.clear();
    
    // 添加进入动画
    setTimeout(() => {
        modal.querySelector('.modal-container').style.animation = 'slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 10);
    
    // 禁用背景滚动
    document.body.style.overflow = 'hidden';
}

function closeContextMenu() {
    // 关闭所有相关弹窗
    const modals = ['contextModal', 'panshiModal', 'feishuModal', 'mastergoModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && modal.style.display === 'block') {
            modal.querySelector('.modal-container').style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
    
    // 重置状态
    currentContextType = null;
    selectedItems.clear();
    updateSelectedCount();
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

function showContextType(type) {
    currentContextType = type;
    selectedItems.clear();
    
    // 隐藏主菜单
    document.getElementById('contextModal').style.display = 'none';
    
    // 显示对应的详情弹窗
    const modalId = type + 'Modal';
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    
    // 添加进入动画
    setTimeout(() => {
        modal.querySelector('.modal-container').style.animation = 'slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 10);
    
    updateSelectedCount();
}

function backToContextMenu() {
    // 隐藏当前详情弹窗
    const currentModal = document.getElementById(currentContextType + 'Modal');
    currentModal.style.display = 'none';
    
    // 显示主菜单
    const contextModal = document.getElementById('contextModal');
    contextModal.style.display = 'block';
    
    // 重置状态
    currentContextType = null;
    selectedItems.clear();
}

// 选择项目功能
function selectRequirement(reqId) {
    const checkbox = document.getElementById(reqId);
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        selectedItems.add(reqId);
    } else {
        selectedItems.delete(reqId);
    }
    
    updateSelectedCount();
    
    // 阻止事件冒泡
    if (event) event.stopPropagation();
}

function selectDocument(docId) {
    const checkbox = document.getElementById(docId);
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        selectedItems.add(docId);
    } else {
        selectedItems.delete(docId);
    }
    
    updateSelectedCount();
    
    // 阻止事件冒泡
    if (event) event.stopPropagation();
}

function selectDesign(designId) {
    const checkbox = document.getElementById(designId);
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        selectedItems.add(designId);
    } else {
        selectedItems.delete(designId);
    }
    
    updateSelectedCount();
    
    // 阻止事件冒泡
    if (event) event.stopPropagation();
}

function updateSelectedCount() {
    const countElements = {
        'panshi': 'selectedCount',
        'feishu': 'selectedDocCount',
        'mastergo': 'selectedDesignCount'
    };
    
    if (currentContextType && countElements[currentContextType]) {
        const countElement = document.getElementById(countElements[currentContextType]);
        if (countElement) {
            countElement.textContent = selectedItems.size;
        }
        
        // 更新确认按钮状态
        const confirmBtn = document.querySelector(`#${currentContextType}Modal .btn-primary`);
        if (confirmBtn) {
            confirmBtn.disabled = selectedItems.size === 0;
        }
    }
}

// 确认选择功能
function confirmRequirementSelection() {
    if (selectedItems.size === 0) {
        showNotification('请选择至少一个需求', 'warning');
        return;
    }
    
    const selectedList = Array.from(selectedItems).join(', ');
    showNotification(`已关联 ${selectedItems.size} 个磐石需求：${selectedList}`, 'success');
    
    // 在输入框中添加关联信息
    const messageInput = document.getElementById('messageInput');
    const contextInfo = `\n\n[已关联磐石需求：${selectedList}]`;
    messageInput.value += contextInfo;
    
    closeContextMenu();
}

function confirmDocumentSelection() {
    if (selectedItems.size === 0) {
        showNotification('请选择至少一个文档', 'warning');
        return;
    }
    
    const selectedList = Array.from(selectedItems).join(', ');
    showNotification(`已关联 ${selectedItems.size} 个飞书文档：${selectedList}`, 'success');
    
    // 在输入框中添加关联信息
    const messageInput = document.getElementById('messageInput');
    const contextInfo = `\n\n[已关联飞书文档：${selectedList}]`;
    messageInput.value += contextInfo;
    
    closeContextMenu();
}

function confirmDesignSelection() {
    if (selectedItems.size === 0) {
        showNotification('请选择至少一个设计稿', 'warning');
        return;
    }
    
    const selectedList = Array.from(selectedItems).join(', ');
    showNotification(`已关联 ${selectedItems.size} 个MasterGo设计稿：${selectedList}`, 'success');
    
    // 在输入框中添加关联信息
    const messageInput = document.getElementById('messageInput');
    const contextInfo = `\n\n[已关联MasterGo设计稿：${selectedList}]`;
    messageInput.value += contextInfo;
    
    closeContextMenu();
}

// 更新ESC键监听
document.removeEventListener('keydown', arguments.callee);
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // 关闭提示词弹窗
        if (document.getElementById('promptTemplatesModal').style.display === 'block') {
            closePromptTemplates();
        }
        
        // 关闭关联上下文弹窗
        if (document.getElementById('contextModal').style.display === 'block' ||
            document.getElementById('panshiModal').style.display === 'block' ||
            document.getElementById('feishuModal').style.display === 'block' ||
            document.getElementById('mastergoModal').style.display === 'block') {
            closeContextMenu();
        }
        
        // 关闭工具九宫格
        if (document.getElementById('toolsGridModal').style.display === 'block') {
            closeToolsGrid();
        }
    }
});

// 点击遮罩层关闭弹窗
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        if (e.target.id === 'promptTemplatesModal') {
            closePromptTemplates();
        } else if (e.target.id === 'contextModal' || 
                   e.target.id === 'panshiModal' || 
                   e.target.id === 'feishuModal' || 
                   e.target.id === 'mastergoModal') {
            closeContextMenu();
        }
    }
});

// 导出全局函数供HTML调用
window.toggleSidebar = toggleSidebar;
window.loadConversation = loadConversation;
window.viewDetails = viewDetails;
window.callTool = callTool;
window.openDocument = openDocument;
window.openTool = openTool;
window.createNewProject = createNewProject;
window.saveProject = saveProject;
window.exportProject = exportProject;
window.closeModal = closeModal;
window.insertTemplate = insertTemplate;
window.uploadFile = uploadFile;
window.voiceInput = voiceInput;
window.callAgent = callAgent;
window.sendMessage = sendMessage;
window.generateJira = generateJira;
window.toggleToolsGrid = toggleToolsGrid;
window.closeToolsGrid = closeToolsGrid;
window.showPromptTemplates = showPromptTemplates;
window.closePromptTemplates = closePromptTemplates;
window.insertPrompt = insertPrompt;
window.showContextMenu = showContextMenu;
window.closeContextMenu = closeContextMenu;
window.showContextType = showContextType;
window.backToContextMenu = backToContextMenu;
window.selectRequirement = selectRequirement;
window.selectDocument = selectDocument;
window.selectDesign = selectDesign;
window.confirmRequirementSelection = confirmRequirementSelection;
window.confirmDocumentSelection = confirmDocumentSelection;
window.confirmDesignSelection = confirmDesignSelection;