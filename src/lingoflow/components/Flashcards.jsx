import React, { useState, useEffect, useCallback } from 'react';
import './Flashcards.css';
import { RATING, createInitialCardState, previewInterval } from '../utils/srs';
import { fetchPublicVocab, fetchTranslation } from '../utils/api';
import { loadDeckData } from '../utils/api';
import { ArrowLeft } from 'lucide-react';

function Flashcards({ currentBook, setCurrentBook, dailyGoal, srsProfile, session, customDecks, onRateCard, onBack }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentWordState, setCurrentWordState] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  
  const [bookData, setBookData] = useState([]);
  const [deckName, setDeckName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 加载牌组数据
  useEffect(() => {
    let isMounted = true;
    const loadDeck = async () => {
      setIsLoading(true);
      const data = await loadDeckData(currentBook, customDecks);
      if (isMounted) {
        setBookData(data.cards);
        setDeckName(data.name);
        setIsLoading(false);
      }
    };
    loadDeck();
    return () => { isMounted = false; };
  }, [currentBook, customDecks]);

  // Find the next lf-card to study
  useEffect(() => {
    if (isLoading) return;
    
    if (!bookData || bookData.length === 0) {
       setIsComplete(true);
       return;
    }

    const now = Date.now();
    
    // 1. Find due reviews
    const srsValues = Object.values(srsProfile || {});
    const dueReviews = srsValues.filter(card => card.nextReviewDate <= now && card.status !== 'new');
    
    if (dueReviews.length > 0) {
      // Sort by most overdue first
      dueReviews.sort((a, b) => a.nextReviewDate - b.nextReviewDate);
      setCurrentWordState({
        cardState: dueReviews[0],
        wordData: bookData[dueReviews[0].wordIndex],
        isNew: false
      });
      return;
    }

    // 2. If no reviews due, find a new lf-card if goal not reached
    if (session.newCardsToday < dailyGoal) {
      // Find the first word index that doesn't have an SRS profile
      const newIndex = bookData.findIndex((_, index) => !srsProfile[index]);
      
      if (newIndex !== -1) {
        setCurrentWordState({
          cardState: createInitialCardState(newIndex),
          wordData: bookData[newIndex],
          isNew: true
        });
        return;
      }
    }

    // 3. If no reviews due and new lf-card goal reached (or no more new cards)
    setIsComplete(true);

  }, [isLoading, srsProfile, session.newCardsToday, dailyGoal, bookData]);

  // Generic getters for front/back to support built-in and custom decks
  const getFront = useCallback((card) => card?.english || card?.front || card?.word || 'Front', []);
  const getBack = useCallback((card) => {
    if (card?.fetching) return '⏳ 正在请求公共翻译API...';
    return card?.chinese || card?.back || card?.definition || '';
  }, []);
  const getExample = useCallback((card) => card?.examples || card?.example || card?.sentence || '', []);

  // 动态接入翻译 API
  useEffect(() => {
    if (isFlipped && currentWordState) {
      const wData = currentWordState.wordData;
      const frontText = getFront(wData);
      const backText = wData?.chinese || wData?.back || wData?.definition || '';
      
      if (!backText && !wData.fetching) {
        wData.fetching = true;
        setCurrentWordState({ ...currentWordState }); // trigger re-render
        
        fetchTranslation(frontText).then(translation => {
           wData.chinese = translation;
           wData.fetching = false;
           setCurrentWordState({ ...currentWordState });
        });
      }
    }
  }, [isFlipped, currentWordState, getFront]);

  const playTTS = useCallback((text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Play TTS when a new word is shown and not flipped
  useEffect(() => {
    if (currentWordState && currentWordState.wordData && !isFlipped) {
      playTTS(getFront(currentWordState.wordData));
    }
  }, [currentWordState, isFlipped, getFront, playTTS]);

  const handleRate = useCallback((rating) => {
    if (!currentWordState) return;
    
    setIsFlipped(false);
    // Short delay for visual flip effect before updating lf-card
    setTimeout(() => {
      onRateCard(rating, currentWordState.cardState, currentWordState.isNew);
    }, 150);
  }, [currentWordState, onRateCard]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isComplete || !currentWordState) return;

      // Spacebar to flip
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isFlipped) setIsFlipped(true);
      }

      // Numbers 1-4 for ratings when flipped
      if (isFlipped) {
        if (e.key === '1') handleRate(RATING.AGAIN);
        if (e.key === '2') handleRate(RATING.HARD);
        if (e.key === '3') handleRate(RATING.GOOD);
        if (e.key === '4') handleRate(RATING.EASY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isComplete, currentWordState, handleRate]);

  if (isLoading) {
    return (
      <div className="flashcards-container animate-fade-in" style={{ justifyContent: 'center', height: '100%' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>🌐 正在连接公开词库 API...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>请稍候，正在为您加载牌组数据</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flashcards-container animate-fade-in" style={{ justifyContent: 'center', height: '100%' }}>
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'flex-start', position: 'absolute', top: '20px', left: '20px' }}>
          <button onClick={onBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={18} /> 退回主页
          </button>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</h1>
          <h2>复习完成！</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '20px 0' }}>
            你已完成《{deckName}》今天的复习，并学习了 {session.newCardsToday} 个新单词。非常棒！
          </p>
          <div style={{ margin: '30px 0', textAlign: 'left', background: 'var(--bg-color)', padding: '20px', borderRadius: '12px' }}>
            <p style={{ marginBottom: '10px', fontSize: '0.95rem', color: 'var(--text-primary)' }}>如果今天状态不错，你可以选择继续学习另一本书：</p>
            <select 
              value={currentBook} 
              onChange={(e) => setCurrentBook(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none' }}
            >
              <optgroup label="内置牌组">
                <option value="college_upgrade">专升本核心词汇</option>
                <option value="cet4">大学英语四级 (CET4)</option>
                <option value="cet6">大学英语六级 (CET6)</option>
                <option value="kaoyan">考研英语大纲词汇</option>
                <option value="ielts">雅思核心词汇 (IELTS)</option>
                <option value="toefl">托福核心词汇 (TOEFL)</option>
              </optgroup>
              {customDecks && Object.keys(customDecks).length > 0 && (
                <optgroup label="自定义牌组">
                  {Object.values(customDecks).map(deck => (
                    <option key={deck.id} value={deck.id}>{deck.name}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          <button className="lf-btn-primary" onClick={onBack} style={{ width: '100%' }}>返回控制面板</button>
        </div>
      </div>
    );
  }

  if (!currentWordState || !currentWordState.wordData) {
    return <div className="flashcards-container">未能加载数据。</div>;
  }

  const { wordData, cardState } = currentWordState;

  // Calculate stats for the header
  const now = Date.now();
  const srsValues = Object.values(srsProfile || {});
  const dueReviewsCount = srsValues.filter(card => card.nextReviewDate <= now && card.status !== 'new').length;

  return (
    <div className="flashcards-container animate-fade-in">
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'flex-start' }}>
        <button onClick={onBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={18} /> 退回主页
        </button>
      </div>
      <h2>单词复习 ({deckName})</h2>
      <div className="stats-header subtitle">
        <span style={{ color: 'var(--primary-color)' }}>新词：{Math.max(0, dailyGoal - session.newCardsToday)}</span> | 
        <span style={{ color: '#ff7b72', marginLeft: '10px' }}>待复习：{dueReviewsCount}</span>
      </div>

      <div className="card-scene" onClick={() => !isFlipped && setIsFlipped(true)}>
        <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="card-face card-front glass-panel">
            <button 
              className="tts-button" 
              onClick={(e) => { e.stopPropagation(); playTTS(getFront(wordData)); }}
              title="播放发音"
            >
              🔊
            </button>
            <h1 className="word-en">{getFront(wordData)}</h1>
            <p className="instruction">点击或按空格键显示答案</p>
          </div>
          <div className="card-face card-back glass-panel">
            <h2 className="word-zh" style={{ whiteSpace: 'pre-wrap' }}>{getBack(wordData)}</h2>
            {(() => {
              const examples = getExample(wordData);
              const exampleList = Array.isArray(examples) ? examples : (examples ? [examples] : []);
              if (exampleList.length > 0) {
                return (
                  <div className="example-box" style={{ textAlign: 'left' }}>
                    <strong>例句：</strong>
                    <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: '8px 0 0 0' }}>
                      {exampleList.map((ex, i) => (
                        <li key={i} style={{ marginBottom: '8px', borderBottom: i < exampleList.length - 1 ? '1px dashed var(--border-color)' : 'none', paddingBottom: i < exampleList.length - 1 ? '8px' : '0' }}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>

      <div className="controls" style={{ visibility: isFlipped ? 'visible' : 'hidden', opacity: isFlipped ? 1 : 0, transition: 'opacity 0.3s' }}>
        <div className="rating-buttons">
          <button className="btn-rating btn-again" onClick={() => handleRate(RATING.AGAIN)} title="快捷键: 1">
            <div className="interval-preview">{previewInterval(RATING.AGAIN, cardState)}</div>
            <div>重来 (1)</div>
          </button>
          <button className="btn-rating btn-hard" onClick={() => handleRate(RATING.HARD)} title="快捷键: 2">
            <div className="interval-preview">{previewInterval(RATING.HARD, cardState)}</div>
            <div>困难 (2)</div>
          </button>
          <button className="btn-rating btn-good" onClick={() => handleRate(RATING.GOOD)} title="快捷键: 3">
            <div className="interval-preview">{previewInterval(RATING.GOOD, cardState)}</div>
            <div>良好 (3)</div>
          </button>
          <button className="btn-rating btn-easy" onClick={() => handleRate(RATING.EASY)} title="快捷键: 4">
            <div className="interval-preview">{previewInterval(RATING.EASY, cardState)}</div>
            <div>简单 (4)</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Flashcards;
