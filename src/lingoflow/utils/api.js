import { collegeUpgradeWords } from '../data/vocabulary';

export const fetchPublicVocab = async (count = 50, offset = 0) => {
  try {
    // 接入公开的 Github 词汇表 (google 10000 english)
    const response = await fetch('https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears-medium.txt');
    if (!response.ok) throw new Error('Failed to fetch public vocabulary');
    const text = await response.text();
    const words = text.split('\n').filter(w => w.trim().length > 0);
    
    // 取出指定数量的单词
    const selectedWords = words.slice(offset, offset + count);
    
    return selectedWords.map((word, index) => ({
      id: `public_${offset}_${index}`,
      english: word.charAt(0).toUpperCase() + word.slice(1),
      chinese: '', // 留空，等待翻转时动态翻译
      example: ''
    }));
  } catch (error) {
    console.error('Error fetching public vocab:', error);
    return [];
  }
};

export const fetchTranslation = async (text) => {
  const fetchWithTimeout = (url, timeoutMs) => {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs))
    ]);
  };

  try {
    // 优先尝试 Google Translate API (Googleapis 在国内大部分地区直连可用，且原生支持跨域)
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
    const googleRes = await fetchWithTimeout(googleUrl, 4000);
    const googleData = await googleRes.json();
    return googleData[0][0][0];
  } catch (err) {
    try {
      // 备用方案：通过 Dictionary API 获取英英释义
      const fallbackUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`;
      const fallbackRes = await fetchWithTimeout(fallbackUrl, 3000);
      const fallbackData = await fallbackRes.json();
      const def = fallbackData[0]?.meanings[0]?.definitions[0]?.definition;
      return def ? `[英] ${def}` : '翻译拉取失败，请检查网络';
    } catch (fallbackErr) {
      console.error('All translation APIs failed:', fallbackErr);
      return '翻译请求超时或失败，请检查网络连接';
    }
  }
};


export const loadDeckData = async (currentBook, customDecks) => {
  const builtInDecks = {
    cet4: { url: `${import.meta.env.BASE_URL}decks/cet4.json`, name: '大学英语四级 (CET4)' },
    cet6: { url: `${import.meta.env.BASE_URL}decks/cet6.json`, name: '大学英语六级 (CET6)' },
    kaoyan: { url: `${import.meta.env.BASE_URL}decks/kaoyan.json`, name: '考研英语大纲词汇' },
    ielts: { url: `${import.meta.env.BASE_URL}decks/ielts.json`, name: '雅思核心词汇 (IELTS)' },
    toefl: { url: `${import.meta.env.BASE_URL}decks/toefl.json`, name: '托福核心词汇 (TOEFL)' },
    college_upgrade: { url: `${import.meta.env.BASE_URL}decks/college_upgrade.json`, name: '专升本核心词汇' },
  };

  if (builtInDecks[currentBook]) {
    try {
      const res = await fetch(builtInDecks[currentBook].url);
      const words = await res.json();
      const cards = words.map((item, index) => {
        // Handle both string arrays and object arrays
        const englishWord = typeof item === 'string' ? item : item.english;
        const chineseTranslation = typeof item === 'string' ? '' : item.chinese;
        
        return {
          id: `${currentBook}_${index}`,
          english: englishWord,
          chinese: chineseTranslation,
          example: ''
        };
      });
      return { cards, name: builtInDecks[currentBook].name };
    } catch (e) {
      console.error(`Failed to load deck ${currentBook}`, e);
      return { cards: [], name: '牌组加载失败' };
    }
  } else if (customDecks && customDecks[currentBook]) {
    return { cards: customDecks[currentBook].cards, name: customDecks[currentBook].name };
  }
  return { cards: [], name: '未知牌组' };
};
