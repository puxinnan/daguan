import React, { useState, useEffect } from 'react';
import { localDict } from '../services/DictionaryService';
import { Search, Book, ArrowLeft } from 'lucide-react';

export default function DictionaryTool({ onBack }) {
  const [isReady, setIsReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [translation, setTranslation] = useState('');

  useEffect(() => {
    localDict.init().then(() => {
      setIsReady(true);
    });
  }, []);

  const handleSearch = () => {
    if (!searchTerm) return;
    const result = localDict.lookup(searchTerm);
    setTranslation(result);
  };

  return (
    <div className="p-6 h-full bg-white text-gray-800">
      <div className="max-w-2xl mx-auto space-y-6">
        {onBack && (
          <button onClick={onBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#666' }}>
            <ArrowLeft size={18} /> 返回主页
          </button>
        )}
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Book size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">极速本地查词</h1>
            <p className="text-gray-500 text-sm">完全离线，0毫秒延迟 (当前为精简版测试词库)</p>
          </div>
        </div>
        
        {!isReady ? (
          <div className="p-4 bg-gray-50 text-gray-500 rounded-lg animate-pulse">
            正在加载本地词库资源...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="输入测试词汇 (如: hello, abandon, computer, apple)..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  autoFocus
                />
              </div>
              <button 
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                查询
              </button>
            </div>

            {translation && (
              <div className="mt-6 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-800 mb-2 uppercase tracking-wider">查询结果</h3>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 mr-4">{searchTerm.toLowerCase()}</span>
                    <p className="text-lg text-gray-700 mt-2 leading-relaxed">{translation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
