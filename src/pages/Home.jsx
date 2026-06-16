import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mouse, Search } from 'lucide-react';
import '../App.css';

function Home() {
  const resourcesRef = useRef(null);
  const navigate = useNavigate();

  const scrollToResources = () => {
    resourcesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const cards = [
    {
      id: '01',
      tag: '待开发',
      title: '课后习题答案/解析',
      desc: '各大高校核心基础课、专业课教材课后习题详细解答。',
      status: 'inactive',
      btnText: '敬请期待',
      path: '/resource/1'
    },
    {
      id: '02',
      tag: '待开发',
      title: '求职与实习专区',
      desc: '各行业精美简历模板、大厂面经、笔试真题库、竞品分析报告整理。',
      status: 'inactive',
      btnText: '敬请期待',
      path: '/resource/3'
    },
    {
      id: '03',
      tag: '待开发',
      title: '专升本专区',
      desc: '统招专升本（专插本）历年真题，涵盖大学英语、高数、计算机基础及核心专业课。',
      status: 'inactive',
      btnText: '敬请期待',
      path: '/resource/4'
    },
    {
      id: '04',
      tag: '待开发',
      title: '公职与事业机构招录',
      desc: '行测、申论真题库，各省市录用考试面试指南与时政热点解析。',
      status: 'inactive',
      btnText: '敬请期待',
      path: '/resource/5'
    },
    {
      id: '05',
      tag: '专属',
      title: 'TypeWords 词文记',
      desc: '单词跟打、文章跟打，沉浸式的电脑背单词与打字练习平台。',
      status: 'active',
      btnText: '进入练习',
      path: '/daguan/words/words'
    }
  ];

  const features = [
    { id: '01', title: '系统整理', desc: '结构化归纳，化繁为简' },
    { id: '02', title: '精选优质', desc: '严选内容，高效学习' },
    { id: '03', title: '持续更新', desc: '紧跟考情，持续迭代' },
    { id: '04', title: '共同成长', desc: '研途相伴，不负理想' }
  ];

  const handleCardClick = (card) => {
    if (card.status === 'active') {
      if (card.path.startsWith('http') || card.path.startsWith('/daguan/')) {
        window.location.href = card.path;
      } else {
        navigate(card.path);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="brand-title">大观园</div>
          <div className="brand-subtitle">研学资源知识库</div>
        </div>
        
        <div className="nav-links">
          <div className="nav-link active">首页</div>
          <div className="nav-link" onClick={scrollToResources}>资源中心</div>
          <div className="nav-link">关注我们</div>
        </div>

        <div className="nav-indicators">
          <span className="nav-indicator-text">01</span>
          <div className="indicator-line"></div>
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title">大观园</h1>
          <p className="hero-subtitle">系统知识 · 优质资源 · 研途相伴</p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={scrollToResources}>进入</button>
            <button className="btn btn-secondary" onClick={scrollToResources}>查看资源</button>
          </div>
        </div>

        <div className="scroll-indicator" onClick={scrollToResources}>
          <Mouse size={24} strokeWidth={1} />
          <span>向下探索更多资源</span>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section" ref={resourcesRef}>
        <div className="section-header animate-fade-in delay-1">
          <div className="section-label">RESOURCE HUB</div>
          <h2 className="section-title">研学资源中心</h2>
        </div>

        <div className="cards-container horizontal-mode animate-fade-in delay-2">
          {cards.map((card) => (
            <div key={card.id} className={`card horizontal-card ${card.status}`}>
              <div className="card-left">
                <span className="card-number">{card.id}</span>
                <span className="card-tag">{card.tag}</span>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.desc}</p>
              </div>

              <div className="card-right">
                <button 
                  className="card-action" 
                  disabled={card.status === 'inactive'}
                  onClick={() => handleCardClick(card)}
                >
                  {card.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Features Footer */}
        <div className="features animate-fade-in delay-3">
          {features.map((item) => (
            <div key={item.id} className="feature-item">
              <div className="feature-icon">{item.id}</div>
              <div className="feature-text">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
