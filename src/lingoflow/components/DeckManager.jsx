import React, { useState } from 'react';
import './DeckManager.css';

function DeckManager({ customDecks, setCustomDecks, onBack }) {
  const [deckName, setDeckName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!deckName.trim()) {
      alert("请先输入牌组名称！");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const cards = [];

      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Skip header if it looks like one
          if (i === 0 && line.toLowerCase().includes('front')) continue;

          // Determine separator: if it has a tab, use tab, otherwise use comma
          const separator = line.includes('\t') ? '\t' : ',';
          const parts = line.split(separator);
          
          if (parts.length >= 2) {
            cards.push({
              front: parts[0].trim(),
              back: parts[1].trim(),
              example: parts.slice(2).join(separator).trim() || ''
            });
          }
        }
      } else if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            cards.push(...parsed);
          }
        } catch (err) {
          alert("JSON 格式错误");
          return;
        }
      } else {
        alert("不支持的文件格式，请上传 TXT, CSV 或 JSON");
        return;
      }

      if (cards.length === 0) {
        alert("未找到任何卡片内容！请检查文件格式。");
        return;
      }

      const deckId = 'custom_' + Date.now();
      setCustomDecks(prev => ({
        ...prev,
        [deckId]: {
          id: deckId,
          name: deckName.trim(),
          cards: cards
        }
      }));

      setDeckName('');
      alert(`成功导入 ${cards.length} 张卡片到 "${deckName}"！`);
    };

    reader.readAsText(file);
    // Reset file input
    e.target.value = null;
  };

  const deleteDeck = (deckId) => {
    if (confirm("确定要删除这个牌组吗？此操作无法撤销。")) {
      const newDecks = { ...customDecks };
      delete newDecks[deckId];
      setCustomDecks(newDecks);
    }
  };

  return (
    <div className="deck-manager animate-fade-in">
      <div className="deck-manager-header">
        <h2>牌组管理</h2>
        <button className="lf-btn-secondary" onClick={onBack}>返回控制面板</button>
      </div>

      <div className="deck-list">
        {Object.values(customDecks || {}).length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            你还没有自定义牌组，快去导入一个吧！
          </div>
        ) : (
          Object.values(customDecks).map(deck => (
            <div key={deck.id} className="deck-item">
              <div className="deck-info">
                <h3>{deck.name}</h3>
                <p>包含 {deck.cards.length} 张卡片</p>
              </div>
              <button className="btn-danger" onClick={() => deleteDeck(deck.id)}>删除</button>
            </div>
          ))
        )}
      </div>

      <div className="import-section glass-panel">
        <h3>导入新牌组</h3>
        <p style={{ color: 'var(--text-secondary)' }}>从 TXT、CSV 或 JSON 文件批量导入单词卡片。</p>
        
        <div style={{ marginTop: '20px' }}>
          <input 
            type="text" 
            placeholder="输入新牌组名称（例如：我的日常单词）" 
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            style={{ width: '100%', maxWidth: '300px', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--panel-bg)', color: 'var(--text-primary)' }}
          />
        </div>

        <label className="file-upload-label">
          选择 TXT、CSV 或 JSON 文件
          <input type="file" accept=".txt,.csv,.json" onChange={handleFileUpload} />
        </label>

        <div className="import-help">
          <strong>导入格式说明：</strong>
          <p>请准备一个文本文件（.txt 或 .csv）。每一行代表一张卡片，用<strong>逗号</strong>或<strong>制表符(Tab)</strong>分隔正面和背面（可选第三列为例句）：</p>
          <pre>
Apple,苹果,An apple a day keeps the doctor away.
Cat	猫	The cat is sleeping.
Serendipity	机缘巧合
          </pre>
        </div>
      </div>
    </div>
  );
}

export default DeckManager;
