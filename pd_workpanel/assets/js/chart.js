// 图表绘制和数据可视化功能

// 图表配置
const ChartConfig = {
    colors: {
        primary: '#6366f1',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#1e1e3f',
        text: '#ffffff',
        grid: '#374151'
    },
    fonts: {
        family: 'Inter, sans-serif',
        size: 12
    }
};

// 初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // 工作效率趋势图表
    const efficiencyChart = document.getElementById('efficiencyChart');
    if (efficiencyChart) {
        drawEfficiencyChart(efficiencyChart);
    }
    
    console.log('图表初始化完成');
}

// 绘制工作效率趋势图
function drawEfficiencyChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 设置样式
    ctx.fillStyle = ChartConfig.colors.background;
    ctx.fillRect(0, 0, width, height);
    
    // 模拟数据
    const data = [
        { day: '周一', efficiency: 75 },
        { day: '周二', efficiency: 82 },
        { day: '周三', efficiency: 78 },
        { day: '周四', efficiency: 85 },
        { day: '周五', efficiency: 90 },
        { day: '周六', efficiency: 88 },
        { day: '周日', efficiency: 92 }
    ];
    
    // 绘制参数
    const padding = 20;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const maxValue = 100;
    const stepX = chartWidth / (data.length - 1);
    
    // 绘制背景网格
    drawGrid(ctx, padding, chartWidth, chartHeight, maxValue);
    
    // 绘制数据线
    drawDataLine(ctx, data, padding, stepX, chartHeight, maxValue);
    
    // 绘制数据点
    drawDataPoints(ctx, data, padding, stepX, chartHeight, maxValue);
    
    // 绘制标签
    drawLabels(ctx, data, padding, stepX, chartHeight);
}

// 绘制网格
function drawGrid(ctx, padding, chartWidth, chartHeight, maxValue) {
    ctx.strokeStyle = ChartConfig.colors.grid;
    ctx.lineWidth = 0.5;
    
    // 水平网格线
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
        
        // Y轴标签
        ctx.fillStyle = ChartConfig.colors.text;
        ctx.font = `${ChartConfig.fonts.size}px ${ChartConfig.fonts.family}`;
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(maxValue - (maxValue/5) * i)}%`, padding - 5, y + 4);
    }
}

// 绘制数据线
function drawDataLine(ctx, data, padding, stepX, chartHeight, maxValue) {
    ctx.strokeStyle = ChartConfig.colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
        const x = padding + index * stepX;
        const y = padding + chartHeight - (point.efficiency / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // 添加渐变填充
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
    gradient.addColorStop(0, `${ChartConfig.colors.primary}20`);
    gradient.addColorStop(1, `${ChartConfig.colors.primary}05`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    
    data.forEach((point, index) => {
        const x = padding + index * stepX;
        const y = padding + chartHeight - (point.efficiency / maxValue) * chartHeight;
        ctx.lineTo(x, y);
    });
    
    ctx.lineTo(padding + (data.length - 1) * stepX, padding + chartHeight);
    ctx.closePath();
    ctx.fill();
}

// 绘制数据点
function drawDataPoints(ctx, data, padding, stepX, chartHeight, maxValue) {
    data.forEach((point, index) => {
        const x = padding + index * stepX;
        const y = padding + chartHeight - (point.efficiency / maxValue) * chartHeight;
        
        // 外圈
        ctx.fillStyle = ChartConfig.colors.primary;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // 内圈
        ctx.fillStyle = ChartConfig.colors.background;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 高亮当前点
        if (index === data.length - 1) {
            ctx.strokeStyle = ChartConfig.colors.primary;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.stroke();
        }
    });
}

// 绘制标签
function drawLabels(ctx, data, padding, stepX, chartHeight) {
    ctx.fillStyle = ChartConfig.colors.text;
    ctx.font = `${ChartConfig.fonts.size}px ${ChartConfig.fonts.family}`;
    ctx.textAlign = 'center';
    
    data.forEach((point, index) => {
        const x = padding + index * stepX;
        const y = padding + chartHeight + 15;
        ctx.fillText(point.day, x, y);
    });
}

// 创建迷你图表
function createMiniChart(container, data, type = 'line') {
    const canvas = document.createElement('canvas');
    canvas.width = 60;
    canvas.height = 30;
    canvas.style.width = '60px';
    canvas.style.height = '30px';
    
    const ctx = canvas.getContext('2d');
    
    if (type === 'line') {
        drawMiniLineChart(ctx, data, canvas.width, canvas.height);
    } else if (type === 'bar') {
        drawMiniBarChart(ctx, data, canvas.width, canvas.height);
    }
    
    container.appendChild(canvas);
    return canvas;
}

// 绘制迷你线图
function drawMiniLineChart(ctx, data, width, height) {
    const padding = 5;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const maxValue = Math.max(...data);
    const stepX = chartWidth / (data.length - 1);
    
    ctx.strokeStyle = ChartConfig.colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
}

// 绘制迷你柱状图
function drawMiniBarChart(ctx, data, width, height) {
    const padding = 5;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const maxValue = Math.max(...data);
    const barWidth = chartWidth / data.length;
    
    ctx.fillStyle = ChartConfig.colors.secondary;
    
    data.forEach((value, index) => {
        const x = padding + index * barWidth;
        const barHeight = (value / maxValue) * chartHeight;
        const y = padding + chartHeight - barHeight;
        
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    });
}

// 动态更新图表数据
function updateChartData(newData) {
    const efficiencyChart = document.getElementById('efficiencyChart');
    if (efficiencyChart) {
        drawEfficiencyChart(efficiencyChart);
    }
    
    console.log('图表数据已更新');
}

// 图表动画效果
function animateChart(canvas, duration = 1000) {
    const ctx = canvas.getContext('2d');
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeProgress = easeInOutCubic(progress);
        
        // 重绘图表
        drawEfficiencyChart(canvas);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// 缓动函数
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// 导出功能
function exportChart(canvas, filename = 'chart.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
    
    console.log('图表已导出:', filename);
}

// 响应式图表
function resizeCharts() {
    const charts = document.querySelectorAll('canvas');
    charts.forEach(canvas => {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        if (containerWidth > 0 && containerHeight > 0) {
            canvas.width = containerWidth;
            canvas.height = containerHeight;
            
            // 重新绘制
            if (canvas.id === 'efficiencyChart') {
                drawEfficiencyChart(canvas);
            }
        }
    });
}

// 监听窗口大小变化
window.addEventListener('resize', resizeCharts);

// 导出函数
window.updateChartData = updateChartData;
window.animateChart = animateChart;
window.exportChart = exportChart;
window.createMiniChart = createMiniChart;