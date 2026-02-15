import React, { useState } from 'react';
import { useClickedSnippets } from '@/context/ClickedContext';
import { SnippetT } from '@/types/Snippet';
import Marquee from '@/components/common/Marquee';

export default function Sidebar() {
  const { snippets } = useClickedSnippets();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleItem = (id: string | null) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-100 h-screen bg-[var(--background)] border-r border-gray-200 overflow-y-auto mt-25 m-15 rounded-3xl p-2">
      <div className="flex-row p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Clicked Snippets</h2>
        <p className="text-sm text-gray-500 mt-1">{snippets.length} items</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {snippets.map((snippet: SnippetT) => (
          <div key={snippet.id} className="bg-[var(--background)]">
            <button
              onClick={() => toggleItem(snippet.summary)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-s font-medium text-[var(--foreground)] text-left truncate">
                <Marquee text={snippet.id}/>
              </span>
            </button>
            
            {expandedId === snippet.id && (
              <div className="px-4 py-3 bg-[var(--background)] border-t border-[var(--border)]">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {snippet.text}
                </p>
              </div>
            )}
          </div>
        ))}
        
        {snippets.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No snippets clicked yet</p>
          </div>
        )}
      </div>
    </div>
  );
};