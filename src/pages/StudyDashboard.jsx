import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, Home, BookOpen, Star, Settings, Bell, LayoutDashboard } from 'lucide-react';
import '../App.css';

// Mock Data for Public Exams (公务员/专升本公共课)
const publicMenuData = [
  {
    title: '行政职业能力测验',
    children: [
      { id: 'xc-1', title: '常识判断 (政治/法律等)' },
      {
        id: 'xc-2',
        title: '言语理解与表达',
        subChildren: [
          { id: 'xc-2-1', title: '逻辑填空 (选词)' },
          { id: 'xc-2-2', title: '片段阅读 (中心/细节)' },
          { id: 'xc-2-3', title: '语句表达 (排序/病句)' }
        ]
      },
      {
        id: 'xc-3',
        title: '判断推理',
        subChildren: [
          { id: 'xc-3-1', title: '图形推理' },
          { id: 'xc-3-2', title: '定义判断' },
          { id: 'xc-3-3', title: '类比推理' },
          { id: 'xc-3-4', title: '逻辑判断' }
        ]
      },
      { id: 'xc-4', title: '资料分析 (速算与公式)' },
      { id: 'xc-5', title: '数量关系 (数学运算)' }
    ]
  },
  {
    title: '申论模块',
    children: [
      { id: 'sl-1', title: '归纳概括' },
      { id: 'sl-2', title: '综合分析' },
      { id: 'sl-3', title: '提出对策' },
      { id: 'sl-4', title: '公文写作' },
      { id: 'sl-5', title: '文章写作 (大作文)' }
    ]
  },
  {
    title: '专业科目与面试',
    children: [
      { id: 'ms-1', title: '公安/执法专业科目' },
      {
        id: 'ms-2',
        title: '结构化面试',
        subChildren: [
          { id: 'ms-2-1', title: '综合分析' },
          { id: 'ms-2-2', title: '人际关系处理' },
          { id: 'ms-2-3', title: '应急应变' },
          { id: 'ms-2-4', title: '组织管理' }
        ]
      }
    ]
  }
];

// Mock Data for Math (考研数学/专升本数学)
const mathMenuData = [
  {
    title: '章节分类',
    children: [
      {
        id: 'math-1',
        title: '高等数学',
        subChildren: [
          { id: 'math-1-1', title: '第一章 (函数、极限和连续)' },
          { id: 'math-1-2', title: '第二章 (一元函数微分学)' },
          { id: 'math-1-3', title: '第三章(一元函数积分学)' },
          { id: 'math-1-4', title: '第四章 (无穷级数)' },
          { id: 'math-1-5', title: '第五章 (常微分方程)' },
          { id: 'math-1-6', title: '第六章(向量代数与空间解析几何)' },
          { id: 'math-1-7', title: '证明题 (零点, 中值定理, 泰勒)' }
        ]
      },
      { id: 'math-2', title: '线性代数', subChildren: [{ id: 'math-2-1', title: '线性代数-核心题库' }] },
      { id: 'math-3', title: '概率统计', subChildren: [{ id: 'math-3-1', title: '概率统计-核心题库' }] },
      { id: 'math-4', title: '880', subChildren: [{ id: 'math-4-1', title: '基础/强化题库' }] },
      { id: 'math-5', title: '历年真题', subChildren: [{ id: 'math-5-1', title: '真题卷汇编' }] },
      { id: 'math-6', title: '模拟卷', subChildren: [{ id: 'math-6-1', title: '名师模拟预测卷' }] }
    ]
  }
];

// Mock Data for English (大学英语)
const englishMenuData = [
  {
    title: '章节分类',
    children: [
      { id: 'eng-1', title: '核心词汇', subChildren: [{ id: 'eng-1-1', title: '大纲3500词' }, { id: 'eng-1-2', title: '高频短语' }] },
      { id: 'eng-2', title: '语法大全', subChildren: [{ id: 'eng-2-1', title: '基础语法' }, { id: 'eng-2-2', title: '长难句解析' }] },
      { id: 'eng-3', title: '阅读理解', subChildren: [{ id: 'eng-3-1', title: '精读训练' }, { id: 'eng-3-2', title: '泛读材料' }] },
      { id: 'eng-4', title: '翻译写作', subChildren: [{ id: 'eng-4-1', title: '翻译技巧' }, { id: 'eng-4-2', title: '高分作文模板' }] },
      { id: 'eng-5', title: '历年真题', subChildren: [{ id: 'eng-5-1', title: '历年真题解析' }] },
      { id: 'eng-6', title: '模拟卷', subChildren: [{ id: 'eng-6-1', title: '全真模拟试卷' }] }
    ]
  }
];

function StudyDashboard() {
  const navigate = useNavigate();
  const { subject } = useParams();

  const isMath = subject === 'math';
  const isEnglish = subject === 'english';
  const currentMenuData = isMath ? mathMenuData : (isEnglish ? englishMenuData : publicMenuData);

  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    // Automatically expand the first menu group and its first child
    if (isMath) {
      setExpandedMenus({
        '章节分类': true,
        'math-1': true
      });
    } else if (isEnglish) {
      setExpandedMenus({
        '章节分类': true,
        'eng-1': true
      });
    } else {
      setExpandedMenus({ '行政职业能力测验': true });
    }
  }, [isMath]);

  const toggleMenu = (title) => {
    setExpandedMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>大观园</div>
        </div>

        <div className="sidebar-nav-group">
          <div className="nav-item" onClick={() => navigate('/')}>
            <Home size={18} /> <span>首页</span>
          </div>
          <div className="nav-item active">
            <LayoutDashboard size={18} /> <span>学习面板</span>
          </div>
          <div className="nav-item">
            <BookOpen size={18} /> <span>错题本</span>
          </div>
          <div className="nav-item">
            <Star size={18} /> <span>收藏本</span>
          </div>
        </div>

        <div className="sidebar-menu-list">
          {currentMenuData.map((menu, idx) => (
            <div key={idx} className="menu-group">
              <div
                className={`menu-title ${expandedMenus[menu.title] ? 'expanded' : ''}`}
                onClick={() => toggleMenu(menu.title)}
              >
                <span>{menu.title}</span>
                {expandedMenus[menu.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>

              {expandedMenus[menu.title] && (
                <div className="menu-children">
                  {menu.children.map((child, cIdx) => (
                    <div key={child.id} className="menu-child-container">
                      <div
                        className={`menu-child-item ${expandedMenus[child.id] ? 'expanded' : ''}`}
                        onClick={() => child.subChildren ? toggleMenu(child.id) : null}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <div>
                          <span className="child-idx">({cIdx + 1})</span> {child.title}
                        </div>
                        {child.subChildren && (
                          expandedMenus[child.id] ? <ChevronDown size={14} color="#a0aec0" /> : <ChevronRight size={14} color="#a0aec0" />
                        )}
                      </div>

                      {/* Third level nested menu */}
                      {child.subChildren && expandedMenus[child.id] && (
                        <div className="menu-subchildren">
                          {child.subChildren.map((sub) => (
                            <div key={sub.id} className="menu-subchild-item">
                              <span className="subchild-dot">•</span> {sub.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button className="btn-back" onClick={() => navigate(-1)}>← 返回</button>
          </div>
          <div className="header-right">
            <Settings className="icon-btn" size={20} />
            <Bell className="icon-btn" size={20} />
            <div className="user-profile">
              <span>微信用户</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          {/* Top Panel - Progress */}
          <div className="progress-panel animate-fade-in">
            <div className="progress-left">
              <div className="panel-tag">学习起点</div>
              <h2>还没有学习记录</h2>
              <p>从第一个章节开始，系统会自动记录你的学习进度。</p>
              <button className="btn btn-primary start-study-btn">开始学习</button>
            </div>

            <div className="progress-right">
              <div className="rate-header">
                <span>掌握率</span>
                <span className="rate-value">0%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '0%' }}></div>
              </div>
              <div className="rate-footer">
                <span>已掌握 0 题</span>
                <span>待掌握 4619 题</span>
              </div>
            </div>
          </div>

          {/* Bottom Panels */}
          <div className="bottom-panels animate-fade-in delay-1">
            {/* Left - Recent Records */}
            <div className="recent-records-panel">
              <div className="panel-header-flex">
                <div className="panel-tag">学习足迹</div>
                <button className="btn-text">★ 查看全部</button>
              </div>
              <h3>最近学习记录</h3>

              <div className="empty-state-box">
                <h4>最近还没有学习记录</h4>
                <p>开始刷第一章吧，这里会实时呈现你的学习轨迹。</p>
              </div>
            </div>

            {/* Right - Calendar */}
            <div className="calendar-panel">
              <div className="panel-header-flex">
                <div className="panel-tag">学习日历</div>
                <span className="streak-tag">连签 0 天</span>
              </div>
              <div className="calendar-month-selector">
                <h3>2026年6月</h3>
                <div className="month-nav">
                  <button>‹</button>
                  <button>›</button>
                </div>
              </div>

              <div className="calendar-grid">
                <div className="day-name">一</div>
                <div className="day-name">二</div>
                <div className="day-name">三</div>
                <div className="day-name">四</div>
                <div className="day-name">五</div>
                <div className="day-name">六</div>
                <div className="day-name">日</div>

                {/* 1st to 7th */}
                <div className="day">1</div><div className="day">2</div><div className="day">3</div><div className="day">4</div><div className="day">5</div><div className="day">6</div><div className="day">7</div>
                <div className="day">8</div><div className="day">9</div><div className="day">10</div><div className="day">11</div><div className="day">12</div><div className="day">13</div><div className="day">14</div>
                <div className="day">15</div><div className="day today active">16</div><div className="day">17</div><div className="day">18</div><div className="day">19</div><div className="day">20</div><div className="day">21</div>
                <div className="day">22</div><div className="day">23</div><div className="day">24</div><div className="day">25</div><div className="day">26</div><div className="day">27</div><div className="day">28</div>
                <div className="day">29</div><div className="day">30</div>
                <div className="day empty">1</div><div className="day empty">2</div><div className="day empty">3</div><div className="day empty">4</div><div className="day empty">5</div>
              </div>

              <div className="today-stats">
                <span className="stats-label">今日刷题数</span>
                <span className="stats-number">0<span className="stats-unit">题</span></span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudyDashboard;
