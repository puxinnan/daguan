import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, Download, ExternalLink } from 'lucide-react';
import '../App.css';

function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookSearch, setBookSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  // 模拟书籍数据 - 增加了 mockLinks
  const bookCategories = [
    {
      title: '土木与机械类（力学与结构核心）',
      subtitle: '(点击图片查看答案)',
      books: [
        { name: '理论力学 (I)', author: '哈工大第八版', color: '#1f5f73', link: 'https://github.com/hygge666/university-sources' },
        { name: '材料力学 I', author: '刘鸿文第六版', color: '#88987b', link: 'https://github.com/hygge666/university-sources' },
        { name: '工程力学', author: '范钦珊', color: '#007f66', link: 'https://github.com/hygge666/university-sources' },
        { name: '机械原理', author: '孙桓第八版', color: '#445668', link: 'https://github.com/QSCTech/zju-icicles' },
        { name: '材料力学 II', author: '刘鸿文第六版', color: '#809ab5', link: 'https://github.com/hygge666/university-sources' },
        { name: '机械设计', author: '濮良贵第九版', color: '#c46d3b', link: 'https://github.com/QSCTech/zju-icicles' }
      ]
    },
    {
      title: '计算机与电子电气类（IT与硬件核心）',
      subtitle: '(点击图片查看答案)',
      books: [
        { name: '电工学 (上)', author: '秦曾煌第七版', color: '#3d4d7a', link: 'https://github.com/QSCTech/zju-icicles' },
        { name: '电工学 (下)', author: '秦曾煌第七版', color: '#3d4d7a', link: 'https://github.com/QSCTech/zju-icicles' },
        { name: '模拟电子技术基础', author: '童诗白第五版', color: '#4e6d9b', link: 'https://github.com/QSCTech/zju-icicles' },
        { name: '电路', author: '邱关源第五版', color: '#0f3c9b', link: 'https://github.com/hygge666/university-sources' },
        { name: '数据结构', author: '严蔚敏', color: '#5b3c88', link: 'https://github.com/PKUanonym/REKCARC-TSC-UHT' },
        { name: '自动控制原理', author: '胡寿松第六版', color: '#9b4629', link: 'https://github.com/QSCTech/zju-icicles' }
      ]
    },
    {
      title: '经济与管理类（商科核心）',
      subtitle: '(点击图片查看答案)',
      books: [
        { name: '西方经济学(微观)', author: '高鸿业第七版', color: '#a0522d', link: 'https://github.com/lib-pku/libpku' },
        { name: '西方经济学(宏观)', author: '高鸿业第七版', color: '#8b4513', link: 'https://github.com/lib-pku/libpku' },
        { name: '管理学', author: '周三多第五版', color: '#cd853f', link: 'https://github.com/lib-pku/libpku' },
        { name: '会计学原理', author: '吴水澎', color: '#d2691e', link: 'https://github.com/lib-pku/libpku' },
        { name: '微观经济学', author: '曼昆', color: '#b8860b', link: 'https://github.com/lib-pku/libpku' },
        { name: '统计学', author: '贾俊平', color: '#808000', link: 'https://github.com/lib-pku/libpku' }
      ]
    },
    {
      title: '化学与材料类（四大化学与结构）',
      subtitle: '(点击图片查看答案)',
      books: [
        { name: '无机化学', author: '大连理工大学', color: '#2e8b57', link: 'https://github.com/USTC-Resource/USTC-Course' },
        { name: '有机化学', author: '邢其毅第三版', color: '#3cb371', link: 'https://github.com/USTC-Resource/USTC-Course' },
        { name: '物理化学', author: '傅献彩第五版', color: '#20b2aa', link: 'https://github.com/USTC-Resource/USTC-Course' },
        { name: '分析化学', author: '武汉大学', color: '#66cdaa', link: 'https://github.com/USTC-Resource/USTC-Course' },
        { name: '材料科学基础', author: '胡赓祥', color: '#008080', link: 'https://github.com/USTC-Resource/USTC-Course' },
        { name: '高分子化学', author: '潘祖仁', color: '#006400', link: 'https://github.com/USTC-Resource/USTC-Course' }
      ]
    },
    {
      title: '公共基础类（理工科通用底座）',
      subtitle: '(点击图片查看答案)',
      books: [
        { name: '高等数学 (上)', author: '同济七版', color: '#4682b4', link: 'https://github.com/hygge666/university-sources' },
        { name: '高等数学 (下)', author: '同济七版', color: '#4169e1', link: 'https://github.com/hygge666/university-sources' },
        { name: '线性代数', author: '同济六版', color: '#5f9ea0', link: 'https://github.com/hygge666/university-sources' },
        { name: '概率论与数理统计', author: '浙大四版', color: '#6495ed', link: 'https://github.com/hygge666/university-sources' },
        { name: '大学物理 (上)', author: '马文蔚第六版', color: '#7b68ee', link: 'https://github.com/hygge666/university-sources' },
        { name: '大学物理 (下)', author: '马文蔚第六版', color: '#6a5acd', link: 'https://github.com/hygge666/university-sources' }
      ]
    }
  ];

  // 考试资源数据
  const examCategories = [
    {
      title: '大学英语四六级 (CET 4/6)',
      subtitle: '(真题与词汇)',
      books: [
        { name: '四级历年真题', author: '听力/阅读/写作', color: '#1f5f73', link: 'https://github.com/hygge666/university-sources' },
        { name: '四级核心词汇', author: '高频背诵版', color: '#1f5f73', link: 'https://github.com/hygge666/university-sources' },
        { name: '六级历年真题', author: '听力/阅读/写作', color: '#88987b', link: 'https://github.com/hygge666/university-sources' },
        { name: '六级核心词汇', author: '高频背诵版', color: '#88987b', link: 'https://github.com/hygge666/university-sources' }
      ]
    },
    {
      title: '全国硕士研究生统一招生考试 (考研)',
      subtitle: '(公共课专区)',
      books: [
        { name: '考研英语 (一) 真题', author: '2005-2024年', color: '#445668', link: 'https://github.com/PKUanonym/REKCARC-TSC-UHT' },
        { name: '考研英语 (二) 真题', author: '2010-2024年', color: '#809ab5', link: 'https://github.com/PKUanonym/REKCARC-TSC-UHT' },
        { name: '长难句解析', author: '核心语法专项', color: '#c46d3b', link: 'https://github.com/PKUanonym/REKCARC-TSC-UHT' },
        { name: '高分作文模板', author: '大小作文必背', color: '#c46d3b', link: 'https://github.com/PKUanonym/REKCARC-TSC-UHT' }
      ]
    },
    {
      title: '海外留学语言考试 (雅思/托福)',
      subtitle: '(备考资料)',
      books: [
        { name: '雅思剑桥真题', author: '4-18全册', color: '#3d4d7a', link: 'https://github.com/hygge666/university-sources' },
        { name: '雅思口语题库', author: '当季机经', color: '#4e6d9b', link: 'https://github.com/hygge666/university-sources' },
        { name: '托福 TPO', author: '1-75套真题', color: '#0f3c9b', link: 'https://github.com/hygge666/university-sources' },
        { name: '托福核心词汇', author: '词根词缀记忆法', color: '#9b4629', link: 'https://github.com/hygge666/university-sources' }
      ]
    }
  ];

  // 专升本资源数据 (竖向卡片格式)
  const collegeUpgradeCategories = [
    {
      id: '01',
      tag: '必考',
      title: '大学\n英语',
      desc: '专升本核心3500词、高频语法、长难句解析与作文模板。',
      status: 'active',
      btnText: '进入学习',
      path: '/dashboard/english'
    },
    {
      id: '02',
      tag: '理科',
      title: '高等\n数学',
      desc: '微积分、线性代数等专升本高数必背公式与基础考点。',
      status: 'active',
      btnText: '进入学习',
      path: '/dashboard/math'
    },
    {
      id: '03',
      tag: '必考',
      title: '计算机\n基础',
      desc: '计算机文化基础、选择题与填空题必背知识点大全。',
      status: 'active',
      btnText: '查看资料',
      path: '/408os/index.html'
    },
    {
      id: '04',
      tag: '文科',
      title: '大学\n语文',
      desc: '大纲必背古诗文、重点文学常识与现代文阅读技巧。',
      status: 'active',
      btnText: '查看资料',
      path: '#'
    },
    {
      id: '05',
      tag: '冲刺',
      title: '各省\n统考真题',
      desc: '全面收录各省历年专升本公共课真题卷及详细解析。',
      status: 'active',
      btnText: '开始刷题',
      path: '/dashboard'
    }
  ];

  // 公职考试资源数据 (模块知识 父类)
  const publicExamCategories = [
    {
      id: '01',
      tag: '核心',
      title: '行政职业\n能力测验',
      desc: '常识判断、言语理解、数量关系、判断推理、资料分析。',
      status: 'active',
      btnText: '进入刷题',
      path: '/dashboard'
    },
    {
      id: '02',
      tag: '核心',
      title: '申论\n(主观题)',
      desc: '归纳概括、提出对策、公文写作与大作文真题及范文。',
      status: 'active',
      btnText: '查看范文',
      path: '/dashboard'
    },
    {
      id: '03',
      tag: '进阶',
      title: '国考与\n省考真题',
      desc: '历年国家公务员及各省市联考、自主命题真题及解析。',
      status: 'active',
      btnText: '进入下载',
      path: '#'
    },
    {
      id: '04',
      tag: '面试',
      title: '结构化\n面试指南',
      desc: '历年结构化面试真题、答题套路与无领导小组讨论技巧。',
      status: 'active',
      btnText: '学习技巧',
      path: '#'
    },
    {
      id: '05',
      tag: '事业编',
      title: '公共基础\n知识(公基)',
      desc: '法律常识、马哲、毛中特、省情市情及事业单位时政热点。',
      status: 'inactive',
      btnText: '整理中',
      path: '#'
    }
  ];

  const renderBookCell = (book, idx) => {
    if (!book) return <td key={idx} className="empty-cell"></td>;
    return (
      <td key={idx} className="book-cell" onClick={() => setSelectedBook(book)}>
        <div className="book-cover" style={{ backgroundColor: book.color }}>
          <div className="book-cover-title">{book.name}</div>
        </div>
        <div className="book-info">
          <div className="book-name">[{book.name}]</div>
          <div className="book-author">{book.author}</div>
        </div>
      </td>
    );
  };

  const renderBookGrid = (category) => {
    const filteredBooks = category.books.filter(b =>
      b.name.includes(bookSearch) || b.author.includes(bookSearch)
    );

    if (filteredBooks.length === 0 && bookSearch) return null;
    const booksToRender = bookSearch ? filteredBooks : category.books;

    const rows = [];
    for (let i = 0; i < booksToRender.length; i += 3) {
      const row = booksToRender.slice(i, i + 3);
      while (row.length < 3) row.push(null);
      rows.push(row);
    }

    if (!bookSearch) {
      rows.push([null, null, null]);
      rows.push([null, null, null]);
      rows.push([null, null, null]);
    }

    return (
      <div className="book-category" key={category.title}>
        <div className="category-header">
          <span className="category-title">{category.title}</span>
          <span className="category-subtitle">{category.subtitle}</span>
        </div>
        <table className="book-table">
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((book, cIdx) => renderBookCell(book, cIdx))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const [hoveredCardId, setHoveredCardId] = useState(null);

  const renderVerticalCards = (cardsList) => {
    return (
      <div className="cards-container accordion-mode" style={{ padding: '2rem 0', display: 'flex', gap: '10px', height: '500px' }}>
        {cardsList.map((card, index) => {
          const isHovered = hoveredCardId === card.id || (hoveredCardId === null && index === 0);

          return (
            <div
              key={card.id}
              className={`card accordion-card ${card.status} ${isHovered ? 'expanded' : 'collapsed'}`}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              style={{
                flex: isHovered ? '3' : '1',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                borderRadius: '8px',
                padding: isHovered ? '2rem 1.5rem' : '2rem 1rem',
                backgroundColor: card.status === 'active' ? '#0f3c33' : '#f4ebd8',
                color: card.status === 'active' ? '#fff' : '#333',
                border: card.status === 'active' ? 'none' : '1px solid #e0d5be'
              }}
            >
              <div className="card-header" style={{ marginBottom: '1.5rem' }}>
                <span className="card-number" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{card.id}</span>
                <span className="card-tag" style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  border: '1px solid currentColor',
                  whiteSpace: 'nowrap'
                }}>{card.tag}</span>
              </div>

              <div className="card-divider" style={{ opacity: 0.3, letterSpacing: '2px', textAlign: 'center', marginBottom: '1.5rem' }}>···</div>

              <h3 className="card-title" style={{
                fontSize: isHovered ? '1.8rem' : '1.5rem',
                marginBottom: '1rem',
                writingMode: isHovered ? 'horizontal-tb' : 'vertical-rl',
                textOrientation: isHovered ? 'mixed' : 'upright',
                margin: isHovered ? '0 0 1rem 0' : '0 auto 1rem auto',
                letterSpacing: isHovered ? 'normal' : '4px',
                height: isHovered ? 'auto' : '180px',
                fontWeight: 'bold',
                fontFamily: 'var(--font-serif)'
              }}>
                {card.title}
              </h3>

              <p className="card-desc" style={{
                opacity: isHovered ? 0.8 : 0,
                fontSize: '0.9rem',
                flexGrow: 1,
                transition: 'opacity 0.3s',
                lineHeight: 1.6
              }}>
                {card.desc}
              </p>

              <button
                className="card-action"
                disabled={card.status === 'inactive'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (card.status === 'active') {
                    if (card.path.endsWith('.html') || card.path.startsWith('http')) {
                      window.location.href = card.path;
                    } else {
                      navigate(card.path);
                    }
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '4px',
                  background: 'transparent',
                  border: '1px solid currentColor',
                  color: 'inherit',
                  marginTop: 'auto',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.3s',
                  pointerEvents: isHovered ? 'auto' : 'none'
                }}
              >
                {card.btnText}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      <nav className="navbar" style={{ position: 'relative', backgroundColor: 'var(--primary-color)' }}>
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="brand-title">大观园</div>
          <div className="brand-subtitle">返回首页</div>
        </div>
      </nav>

      <div style={{ padding: '4rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>

          {(id === '1' || id === '2' || id === '4' || id === '5') ? (
            <div className="books-module">
              {id !== '5' && (
                <div className="search-banner">
                  <div className="search-title">点击此处搜索页面内容</div>
                  <div className="search-bar-container" style={{ margin: '1rem auto', width: '100%', maxWidth: '400px' }}>
                    <Search className="search-icon" size={20} />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="搜索书名或资料名称..."
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="book-grids-container">
                {id === '1' && bookCategories.map(renderBookGrid)}
                {id === '2' && examCategories.map(renderBookGrid)}
                {id === '4' && renderVerticalCards(collegeUpgradeCategories)}
                {id === '5' && renderVerticalCards(publicExamCategories)}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h2 style={{ color: 'var(--text-muted)' }}>资源整理中，敬请期待...</h2>
            </div>
          )}

          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              返回首页
            </button>
          </div>
        </div>
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBook(null)}>
              <X size={24} />
            </button>

            <div className="modal-header">
              <div className="modal-book-cover" style={{ backgroundColor: selectedBook.color }}>
                {selectedBook.name}
              </div>
              <div className="modal-book-info">
                <h2>{selectedBook.name}</h2>
                <p className="modal-author">作者/版本：{selectedBook.author}</p>
                <div className="modal-tags">
                  <span className="modal-tag">高清 PDF</span>
                  <span className="modal-tag">无水印</span>
                  <span className="modal-tag">完整版解析</span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <h3>资料获取指引</h3>
              <p>为了保证资源的长久有效，我们已将《{selectedBook.name}》的课后答案归档至开源课程共享计划库中。您可以通过下方链接直接访问或下载。</p>

              <div className="modal-actions">
                <a href={selectedBook.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                  <Download size={18} /> 获取课后解析 PDF
                </a>
                <a href={selectedBook.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', backgroundColor: '#f0f0f0', color: '#333' }}>
                  <ExternalLink size={18} /> 查看源项目仓库
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceDetail;
