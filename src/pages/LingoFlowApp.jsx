import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Dashboard from '../lingoflow/components/Dashboard'
import Flashcards from '../lingoflow/components/Flashcards'
import ReadingViewer from '../lingoflow/components/ReadingViewer'
import MethodologyGuide from '../lingoflow/components/MethodologyGuide'
import DeckManager from '../lingoflow/components/DeckManager'
import BookOverview from '../lingoflow/components/BookOverview'
import { calculateNextReview } from '../lingoflow/utils/srs'
import '../lingoflow/lingoflow.css'
import '../lingoflow/App.css'

import { ArrowLeft } from 'lucide-react';

function LingoFlowApp() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Settings State
  const [currentBook, setCurrentBook] = useState(() => {
    return localStorage.getItem('lingo_book') || 'ielts';
  });
  
  const [dailyGoal, setDailyGoal] = useState(() => {
    return Number(localStorage.getItem('lingo_goal')) || 50;
  });

  // Custom Decks State
  // Structure: { [deckId]: { id: string, name: string, cards: [{ front: string, back: string }] } }
  const [customDecks, setCustomDecks] = useState(() => {
    const saved = localStorage.getItem('lingo_custom_decks');
    return saved ? JSON.parse(saved) : {};
  });

  // SRS State for the current book
  // Structure: { [wordIndex]: { wordIndex, status, repetition, interval, easeFactor, nextReviewDate } }
  const [srsProfile, setSrsProfile] = useState(() => {
    const saved = localStorage.getItem(`lingo_srs_${currentBook}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Daily Session State (to track new cards studied today)
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem(`lingo_session_${currentBook}`);
    return saved ? JSON.parse(saved) : { newCardsToday: 0, reviewsToday: 0, lastDate: new Date().toDateString() };
  });

  // Handle book changes: load the respective SRS profile and session
  useEffect(() => {
    localStorage.setItem('lingo_book', currentBook);
    localStorage.setItem('lingo_goal', dailyGoal);
    
    const savedSrs = localStorage.getItem(`lingo_srs_${currentBook}`);
    setSrsProfile(savedSrs ? JSON.parse(savedSrs) : {});

    const savedSession = localStorage.getItem(`lingo_session_${currentBook}`);
    const today = new Date().toDateString();
    
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      if (parsed.lastDate !== today) {
        parsed.newCardsToday = 0;
        parsed.reviewsToday = 0;
        parsed.lastDate = today;
        localStorage.setItem(`lingo_session_${currentBook}`, JSON.stringify(parsed));
      }
      setSession(parsed);
    } else {
      const newSession = { newCardsToday: 0, reviewsToday: 0, lastDate: today };
      localStorage.setItem(`lingo_session_${currentBook}`, JSON.stringify(newSession));
      setSession(newSession);
    }
  }, [currentBook, dailyGoal]);

  // Persist Custom Decks
  useEffect(() => {
    localStorage.setItem('lingo_custom_decks', JSON.stringify(customDecks));
  }, [customDecks]);

  const handleRateCard = (rating, cardState, isNewCard) => {
    const updatedCard = calculateNextReview(rating, cardState);
    
    setSrsProfile(prev => {
      const newProfile = {
        ...prev,
        [updatedCard.wordIndex]: updatedCard
      };
      localStorage.setItem(`lingo_srs_${currentBook}`, JSON.stringify(newProfile));
      return newProfile;
    });

    setSession(prev => {
      const newSession = {
        ...prev,
        newCardsToday: isNewCard ? prev.newCardsToday + 1 : prev.newCardsToday,
        reviewsToday: !isNewCard ? prev.reviewsToday + 1 : prev.reviewsToday
      };
      localStorage.setItem(`lingo_session_${currentBook}`, JSON.stringify(newSession));
      
      // Update global history
      try {
        const todayDate = new Date().toDateString();
        const historyStr = localStorage.getItem('lingo_history');
        let history = historyStr ? JSON.parse(historyStr) : {};
        if (!history[todayDate]) {
          history[todayDate] = { new: 0, review: 0 };
        }
        if (isNewCard) history[todayDate].new += 1;
        else history[todayDate].review += 1;
        localStorage.setItem('lingo_history', JSON.stringify(history));
      } catch (e) {
        console.error("Error saving history", e);
      }

      return newSession;
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          onViewChange={setCurrentView}
          currentBook={currentBook}
          setCurrentBook={setCurrentBook}
          dailyGoal={dailyGoal}
          setDailyGoal={setDailyGoal}
          srsProfile={srsProfile}
          session={session}
          customDecks={customDecks}
        />;
      case 'flashcards':
        return <Flashcards 
          currentBook={currentBook}
          dailyGoal={dailyGoal}
          srsProfile={srsProfile}
          session={session}
          customDecks={customDecks}
          onRateCard={handleRateCard}
          onBack={() => setCurrentView('dashboard')}
        />;
      case 'reading':
        return <ReadingViewer 
          onBack={() => setCurrentView('dashboard')}
          onAddWord={(w) => console.log('Add word:', w)}
        />;
      case 'methodology':
        return <MethodologyGuide onBack={() => setCurrentView('dashboard')} />;
      case 'deck_manager':
        return <DeckManager 
          customDecks={customDecks}
          setCustomDecks={setCustomDecks}
          onBack={() => setCurrentView('dashboard')}
        />;
      case 'book_overview':
        return <BookOverview
          currentBook={currentBook}
          customDecks={customDecks}
          srsProfile={srsProfile}
          dailyGoal={dailyGoal}
          session={session}
          onBack={() => setCurrentView('dashboard')}
        />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="lf-app-container">
      <nav className="lf-sidebar">
        <div 
          onClick={() => navigate('/resource/4')} 
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer', 
            marginBottom: '10px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          <ArrowLeft size={16} /> 返回专区
        </div>
        <h2 style={{cursor: 'default', marginTop: 0}}>LingoFlow</h2>
        <a 
          href="#" 
          className={`nav-item ${currentView === 'guide' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentView('guide'); }}
        >
          方法指南
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}
        >
          控制面板
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentView === 'flashcards' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentView('flashcards'); }}
        >
          单词闪卡
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentView === 'deck_manager' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentView('deck_manager'); }}
        >
          牌组管理
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentView === 'reading' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentView('reading'); }}
        >
          阅读练习
        </a>
      </nav>
      <main className="lf-main-content">
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default LingoFlowApp

