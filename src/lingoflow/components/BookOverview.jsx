import React, { useState, useEffect } from 'react';
import { loadDeckData, fetchTranslation } from '../utils/api';
import { ArrowLeft } from 'lucide-react';

function BookOverview({ currentBook, customDecks, srsProfile, dailyGoal, session, onBack }) {
  const [bookData, setBookData] = useState([]);
  const [deckName, setDeckName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedTranslations, setFetchedTranslations] = useState({});

  const handleFetchTranslation = async (index, word) => {
    setFetchedTranslations(prev => ({ ...prev, [index]: { loading: true, text: '' } }));
    const translation = await fetchTranslation(word);
    setFetchedTranslations(prev => ({ ...prev, [index]: { loading: false, text: translation } }));
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const data = await loadDeckData(currentBook, customDecks);
      if (isMounted) {
        setBookData(data.cards);
        setDeckName(data.name);
        setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [currentBook, customDecks]);

  const plannedCount = Object.keys(srsProfile).length;
  const totalCount = bookData.length;
  const remainingCount = Math.max(0, totalCount - plannedCount);

  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <button onClick={onBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <ArrowLeft size={18} /> 返回主页
      </button>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>{deckName} - 学习概览</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="stat-card glass-panel" style={{ flex: 1, minWidth: '120px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>词书总词汇量</h3>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{totalCount}</div>
          </div>
          <div className="stat-card glass-panel" style={{ flex: 1, minWidth: '120px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>已规划 / 已学</h3>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{plannedCount}</div>
          </div>
          <div className="stat-card glass-panel" style={{ flex: 1, minWidth: '120px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>剩余未学单词</h3>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e67e22' }}>{remainingCount}</div>
          </div>
          <div className="stat-card glass-panel" style={{ flex: 1, minWidth: '120px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>今日新词规划</h3>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{dailyGoal}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>已学: {session.newCardsToday}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>词汇明细 ({totalCount})</h3>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>正在加载词书数据...</div>
        ) : (
          <div style={{ maxHeight: '500px', overflowY: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--panel-bg-solid)', zIndex: 1 }}>
                <tr>
                  <th style={{ padding: '12px 15px', borderBottom: '1px solid var(--border-color)' }}>序号</th>
                  <th style={{ padding: '12px 15px', borderBottom: '1px solid var(--border-color)' }}>单词</th>
                  <th style={{ padding: '12px 15px', borderBottom: '1px solid var(--border-color)' }}>释义 (多重意思)</th>
                  <th style={{ padding: '12px 15px', borderBottom: '1px solid var(--border-color)' }}>学习状态</th>
                </tr>
              </thead>
              <tbody>
                {bookData.map((card, index) => {
                  const srsCard = srsProfile[index];
                  let statusLabel = '未学习';
                  let statusColor = 'var(--text-secondary)';
                  
                  if (srsCard) {
                    if (srsCard.status === 'learning') {
                      statusLabel = '学习中';
                      statusColor = '#e67e22';
                    } else if (srsCard.status === 'review') {
                      statusLabel = '复习中';
                      statusColor = 'var(--primary-color)';
                    } else if (srsCard.status === 'graduated') {
                      statusLabel = '已掌握';
                      statusColor = 'var(--success-color)';
                    }
                  }

                  // 处理多重释义的换行展示
                  const fetchedData = fetchedTranslations[index];
                  const hasTranslation = card.chinese || (fetchedData && fetchedData.text);
                  const displayChinese = card.chinese || (fetchedData ? fetchedData.text : '');
                  // Replace carriage returns and split by newlines, or split by semicolon as fallback
                  const meanings = displayChinese ? displayChinese.replace(/\r/g, '').split('\n').filter(m => m.trim() !== '') : [];

                  return (
                    <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 15px', color: 'var(--text-secondary)' }}>{index + 1}</td>
                      <td style={{ padding: '10px 15px', fontWeight: 'bold' }}>{card.english || card.front}</td>
                      <td style={{ padding: '10px 15px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {hasTranslation ? (
                          meanings.map((m, i) => <div key={i}>{m}</div>)
                        ) : fetchedData?.loading ? (
                          <span style={{ color: 'var(--primary-color)' }}>正在获取...</span>
                        ) : (
                          <button 
                            onClick={() => handleFetchTranslation(index, card.english || card.front)}
                            style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }}
                          >
                            🔍 查看释义
                          </button>
                        )}
                      </td>
                      <td style={{ padding: '10px 15px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem', 
                          background: `${statusColor}20`, 
                          color: statusColor,
                          fontWeight: 'bold'
                        }}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookOverview;
