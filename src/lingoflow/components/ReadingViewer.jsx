import React, { useState, useEffect } from 'react';
import './ReadingViewer.css';
import { builtInBooks } from '../data/books';

const defaultText = `
Technology has become an ubiquitous part of our daily lives. Its ephemeral nature means that we are constantly adapting to new tools and platforms. However, the human spirit remains resilient, finding ways to leverage these ethereal digital spaces for genuine connection and growth.
`;

const mockDictionary = {
  'technology': '技术 (jì shù)',
  'ubiquitous': '无所不在的 (wú suǒ bù zài de)',
  'ephemeral': '短暂的 (duǎn zàn de)',
  'resilient': '有弹性的，适应力强的 (yǒu tán xìng de)',
  'ethereal': '飘渺的，超凡的 (piāo miǎo de)',
  'leverage': '利用 (lì yòng)',
  'genuine': '真实的，真诚的 (zhēn chéng de)'
};

function ReadingViewer({ customDecks, setCustomDecks }) {
  const [articleText, setArticleText] = useState(() => {
    return localStorage.getItem('lingo_article') || defaultText.trim();
  });
  const [selectedBookId, setSelectedBookId] = useState('custom');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [customTranslation, setCustomTranslation] = useState('');

  useEffect(() => {
    localStorage.setItem('lingo_article', articleText);
  }, [articleText]);

  const findSentence = (word, fullText) => {
    const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [fullText];
    const sentence = sentences.find(s => s.toLowerCase().includes(word.toLowerCase()));
    return sentence ? sentence.trim() : '';
  };

  const handleWordClick = async (word) => {
    const cleanWord = word.replace(/[^a-zA-Z-]/g, '');
    if (!cleanWord) return;

    const lower = cleanWord.toLowerCase();
    
    // Set initial loading state
    setSelectedWord({ 
      word: cleanWord, 
      translation: '加载翻译中...',
      sentence: findSentence(cleanWord, articleText)
    });
    setCustomTranslation('加载翻译中...');

    let translation = mockDictionary[lower];

    if (!translation) {
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(lower)}`);
        const data = await res.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
           translation = data[0][0][0];
        } else {
           translation = '';
        }
      } catch (err) {
        console.error("Translation API error:", err);
        translation = '';
      }
    }
    
    setSelectedWord({ 
      word: cleanWord, 
      translation: translation,
      sentence: findSentence(cleanWord, articleText)
    });
    setCustomTranslation(translation);
  };

  const handleAddToDeck = () => {
    if (!selectedWord) return;
    const translationToSave = customTranslation.trim();
    
    if (!translationToSave) {
      alert("请输入中文释义！");
      return;
    }

    const READING_DECK_ID = 'reading_deck';
    
    setCustomDecks(prev => {
      const existingDeck = prev[READING_DECK_ID] || {
        id: READING_DECK_ID,
        name: '📚 阅读生词本',
        cards: []
      };

      // Check if word already exists
      if (existingDeck.cards.some(c => c.front.toLowerCase() === selectedWord.word.toLowerCase())) {
        alert("该单词已在生词本中！");
        return prev;
      }

      const newCard = {
        front: selectedWord.word,
        back: translationToSave,
        example: selectedWord.sentence
      };

      return {
        ...prev,
        [READING_DECK_ID]: {
          ...existingDeck,
          cards: [...existingDeck.cards, newCard]
        }
      };
    });

    alert(`已将 "${selectedWord.word}" 加入到 [📚 阅读生词本]！`);
  };

  const renderText = () => {
    return articleText.split(/\s+/).map((word, index) => {
      if (!word) return null;
      // remove punctuation for rendering check but keep it in display
      const cleanWord = word.replace(/[^a-zA-Z-]/g, '');
      const isWord = cleanWord.length > 0;
      
      return isWord ? (
        <span 
          key={index} 
          className="clickable-word"
          onClick={() => handleWordClick(word)}
        >
          {word}{' '}
        </span>
      ) : (
        <span key={index}>{word} </span>
      );
    });
  };

  const handleBookSelect = (e) => {
    const val = e.target.value;
    setSelectedBookId(val);
    if (val !== 'custom') {
      const book = builtInBooks.find(b => b.id === val);
      if (book) {
        setArticleText(book.content);
        setIsEditing(false);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setArticleText(evt.target.result);
      setSelectedBookId('custom');
      setIsEditing(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="reading-container animate-fade-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <h2>沉浸式阅读与查词</h2>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select 
            value={selectedBookId} 
            onChange={handleBookSelect} 
            style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            <option value="custom">自定义文章</option>
            <optgroup label="内置名著推荐">
              {builtInBooks.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </optgroup>
          </select>
          
          <label className="lf-btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            📁 导入TXT小说
            <input type="file" accept=".txt" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <button className="lf-btn-secondary" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '完成编辑' : '📝 手动粘贴文章'}
          </button>
        </div>
      </div>
      
      {!isEditing && <p className="subtitle">点击任何单词查看翻译并加入生词本。</p>}

      <div className="reader-layout">
        <div className="text-panel glass-panel">
          {isEditing ? (
            <textarea
              className="article-editor"
              value={articleText}
              onChange={(e) => {
                setArticleText(e.target.value);
                setSelectedBookId('custom');
              }}
              placeholder="在这里粘贴你的英语文章..."
            />
          ) : (
            <p className="article-content">{renderText()}</p>
          )}
        </div>

        <div className="translation-panel glass-panel">
          {selectedWord ? (
            <div className="translation-result animate-fade-in">
              <h3 className="selected-en">{selectedWord.word}</h3>
              
              <div style={{ margin: '15px 0' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>中文释义：</label>
                <input 
                  type="text" 
                  className="translation-input"
                  value={customTranslation}
                  onChange={(e) => setCustomTranslation(e.target.value)}
                  placeholder="如果没有翻译，请手动输入..."
                />
              </div>

              {selectedWord.sentence && (
                <div className="context-sentence">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>上下文原句：</span>
                  <p style={{ fontStyle: 'italic', background: 'var(--panel-bg-solid)', padding: '10px', borderRadius: '6px' }}>"{selectedWord.sentence}"</p>
                </div>
              )}

              <button className="lf-btn-primary add-to-vocab" onClick={handleAddToDeck} style={{ marginTop: '20px', width: '100%' }}>
                加入生词本
              </button>
            </div>
          ) : (
            <div className="translation-empty">
              <span className="empty-icon">👈</span>
              <p>在左侧点击单词查看翻译</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReadingViewer;
