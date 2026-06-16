import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'markdown-to-jsx';
import './MethodologyGuide.css';

// Importing raw markdown content. Vite handles this natively if we use a plugin, 
// but since we don't have vite-plugin-md configured by default, we'll fetch or use string literals.
// For simplicity without ejecting/plugins, we will simulate fetching the local raw files.

const chapters = [
  { id: '1-understanding', title: '1. 认知篇' },
  { id: '2-vocabulary', title: '2. 单词篇' },
  { id: '3-listening', title: '3. 听力篇' },
  { id: '4-reading', title: '4. 阅读篇' },
  { id: '5-speaking', title: '5. 口语篇' },
  { id: '6-writing', title: '6. 写作篇' },
  { id: '7-ai-tools', title: '7. 利用 AI 学习 (2026 版)' }
];

const NullImage = () => null;

function MethodologyGuide() {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const [markdownContent, setMarkdownContent] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    import(`../data/guide/${activeChapter}.md?raw`)
      .then(res => {
        setMarkdownContent(res.default);
      })
      .catch(err => {
        console.error(err);
        setMarkdownContent('# Error loading chapter\nPlease check if the file exists.');
      });
      
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeChapter]);

  // Define components outside of render but we need activeChapter/setActiveChapter for the link
  // Use useMemo to avoid recreating options on every render
  const markdownOptions = React.useMemo(() => ({
    overrides: {
      h1: { component: 'h1', props: { className: 'md-h1' } },
      h2: { component: 'h2', props: { className: 'md-h2' } },
      ul: { component: 'ul', props: { className: 'md-ul' } },
      li: { component: 'li', props: { className: 'md-li' } },
      blockquote: { component: 'blockquote', props: { className: 'md-blockquote' } },
      img: { component: NullImage },
      a: {
        component: ({ children, href, ...props }) => {
          const handleClick = (e) => {
            if (href && href.includes('.md')) {
              e.preventDefault();
              const match = href.match(/(\d+-[^/.]+)\.md$/);
              if (match) {
                const num = match[1].split('-')[0];
                const targetChapter = chapters.find(c => c.id.startsWith(num + '-'));
                if (targetChapter) {
                  setActiveChapter(targetChapter.id);
                }
              }
            }
          };
          return (
            <a href={href} onClick={handleClick} className="md-link" {...props}>
              {children}
            </a>
          );
        }
      },
    },
  }), []);

  return (
    <div className="guide-container animate-fade-in">
      <div className="guide-sidebar glass-panel">
        <h3 className="guide-title">English Level-up Tips</h3>
        <ul className="guide-nav">
          {chapters.map(chap => (
            <li key={chap.id}>
              <button
                className={`guide-nav-item ${activeChapter === chap.id ? 'active' : ''}`}
                onClick={() => setActiveChapter(chap.id)}
              >
                {chap.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="guide-content glass-panel" ref={contentRef}>
        <Markdown options={markdownOptions}>
          {markdownContent}
        </Markdown>
      </div>
    </div>
  );
}

export default MethodologyGuide;
