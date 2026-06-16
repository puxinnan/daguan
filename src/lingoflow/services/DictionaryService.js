class DictionaryService {
  constructor() {
    this.dictionary = null;
    this.isLoading = false;
    this.loadPromise = null;
  }

  // 异步加载 public 目录下的词库文件
  async init() {
    if (this.dictionary) return;
    if (this.isLoading) return this.loadPromise;

    this.isLoading = true;
    this.loadPromise = fetch('/ecdict-mini.json')
      .then(res => {
        if (!res.ok) throw new Error("词库加载失败");
        return res.json();
      })
      .then(data => {
        this.dictionary = data;
        console.log("✅ 本地词库加载完成，共载入词汇数量：", Object.keys(data).length);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.isLoading = false;
      });

    return this.loadPromise;
  }

  // 查词方法
  lookup(word) {
    if (!this.dictionary) {
      console.warn("词库尚未加载完成");
      return null;
    }
    const cleanWord = word.toLowerCase().trim();
    return this.dictionary[cleanWord] || "未找到该词的释义 (测试词库仅包含部分单词，如 hello, abandon, book)";
  }
}

export const localDict = new DictionaryService();
