import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ onViewChange, currentBook, setCurrentBook, dailyGoal, setDailyGoal, srsProfile, session, customDecks }) {
  const [history, setHistory] = useState({});

  useEffect(() => {
    const historyStr = localStorage.getItem('lingo_history');
    if (historyStr) {
      try {
        setHistory(JSON.parse(historyStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleBookChange = (e) => {
    setCurrentBook(e.target.value);
  };

  const handleGoalChange = (e) => {
    setDailyGoal(Number(e.target.value));
  };

  // Calculate SRS stats
  const now = Date.now();
  const srsValues = Object.values(srsProfile || {});
  const dueReviews = srsValues.filter(card => card.nextReviewDate <= now && card.status !== 'new').length;
  
  const learningCount = srsValues.filter(card => card.status === 'learning').length;
  const reviewCount = srsValues.filter(card => card.status === 'review' || card.status === 'graduated').length;

  // Render current deck name
  const renderDeckName = () => {
    if (currentBook === 'ielts') return '雅思核心词汇';
    if (currentBook === 'toefl') return '托福核心词汇';
    if (currentBook === 'college_upgrade') return '专升本核心词汇';
    if (customDecks && customDecks[currentBook]) return customDecks[currentBook].name;
    return '未知牌组';
  };

  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const shortDate = `${d.getMonth() + 1}/${d.getDate()}`;
    const data = history[dateStr] || { new: 0, review: 0 };
    const total = data.new + data.review;
    return { date: shortDate, total, ...data };
  });
  
  const maxDaily = Math.max(...last7Days.map(d => d.total), 10); // minimum scale 10

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>欢迎回来！</h1>
          <p>今天准备好提升英语了吗？</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{session.newCardsToday + session.reviewsToday}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>今日学习总数</div>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <h3>今日新词目标</h3>
          <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
            {session.newCardsToday} / {dailyGoal}
          </div>
          <div className="progress-bar-bg" style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (session.newCardsToday / dailyGoal) * 100)}%`, height: '100%', background: 'var(--primary-color)', transition: 'width 0.5s' }} />
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <h3>待复习</h3>
          <div className="stat-value" style={{ color: dueReviews > 0 ? '#ff7b72' : 'var(--success-color)' }}>
            {dueReviews}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            今日已复习 {session.reviewsToday} 个
          </div>
        </div>

        <div className="stat-card glass-panel">
          <h3>掌握情况 (当前牌组)</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '0.9rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '1.2rem' }}>{learningCount}</div>
              <div style={{ color: 'var(--text-secondary)' }}>学习中</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--success-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>{reviewCount}</div>
              <div style={{ color: 'var(--text-secondary)' }}>已掌握</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-row" style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        {/* Settings Panel */}
        <div className="settings-panel glass-panel" style={{ flex: '1', minWidth: '250px', padding: '25px' }}>
          <h3 style={{ marginBottom: '15px' }}>学习设置</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>选择牌组：</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={currentBook} onChange={handleBookChange} style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                  <optgroup label="内置牌组">
                    <option value="ielts">雅思核心词汇</option>
                    <option value="toefl">托福核心词汇</option>
                    <option value="college_upgrade">专升本核心词汇</option>
                  </optgroup>
                  {customDecks && Object.keys(customDecks).length > 0 && (
                    <optgroup label="自定义牌组">
                      {Object.values(customDecks).map(deck => (
                        <option key={deck.id} value={deck.id}>{deck.name}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <button onClick={() => onViewChange('book_overview')} className="btn-primary" style={{ padding: '0 15px', whiteSpace: 'nowrap' }}>查看明细</button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>每日新词规划（可自由输入）：</label>
              <input 
                type="number" 
                min="1" 
                max="1000" 
                value={dailyGoal} 
                onChange={handleGoalChange} 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} 
              />
            </div>
          </div>
        </div>

        {/* 7-Day History Chart */}
        <div className="chart-panel glass-panel" style={{ flex: '2', minWidth: '350px', padding: '25px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '15px' }}>过去 7 天学习热力图</h3>
          
          {last7Days.reduce((sum, d) => sum + d.total, 0) === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
              <p>暂无学习记录，去【单词闪卡】背几个单词吧！</p>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', gap: '10px' }}>
              {last7Days.map((day, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '120px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'flex-end',
                    background: 'var(--border-color)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: `${(day.total / maxDaily) * 100}%`, 
                      background: day.total > 0 ? 'var(--primary-color)' : 'transparent',
                      width: '100%',
                      transition: 'height 0.5s',
                      opacity: 0.8
                    }} title={`${day.date}: 新词${day.new}, 复习${day.review}`}></div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{day.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>快速开始</h2>
      <div className="modules-grid">
        <div className="module-card glass-panel" onClick={() => onViewChange('deck_manager')}>
          <div className="module-icon">📂</div>
          <h3>牌组管理</h3>
          <p>导入或管理你的自定义卡片库。</p>
        </div>

        <div className="module-card glass-panel" onClick={() => onViewChange('flashcards')} style={{ border: '1px solid var(--primary-color)' }}>
          <div className="module-icon">📇</div>
          <h3>单词闪卡</h3>
          <p>开始复习 {renderDeckName()} 的单词。</p>
        </div>
        
        <div className="module-card glass-panel" onClick={() => onViewChange('reading')}>
          <div className="module-icon">📖</div>
          <h3>沉浸阅读</h3>
          <p>阅读文章，查词并一键制卡到生词本。</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
