import React, { useState, useRef, useEffect } from 'react';
import { Account, CopilotMessage } from '../types/crm';
import { Sparkles, X, Send, Command, Lightbulb, ArrowRight, Bot } from 'lucide-react';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onSelectAccountByName: (name: string) => void;
}

const DEFAULT_PROMPTS = [
  '筛选 ICP > 90 且处于意向激增的高价值大客户',
  '为 Snowflake 生成高管触达策略与切入点',
  '推演当前高意向客户的最佳渠道营销组合',
  '分析目标客户画像中的共性深层购买动机',
];

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  accounts,
  onSelectAccountByName,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `你好！我是 Nexus AI 副驾驶。我已深度索引了您管线中的 ${accounts.length} 家核心目标大客户数据、实时意向信号及 AI 客户画像拓扑。您可以随时向我提问、下达客户分析指令或推演多渠道营销策略。`,
      timestamp: '刚刚',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: CopilotMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: '刚刚',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/crm/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, accounts }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: CopilotMessage = {
          id: `msg_ai_${Date.now()}`,
          sender: 'assistant',
          text: data.reply || '已完成分析。',
          timestamp: '刚刚',
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg h-full bg-[#0E1017] border-l border-white/[0.08] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] bg-[#0A0C13] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Nexus AI 原生副驾驶
              </h3>
              <p className="text-[11px] text-slate-400">
                实时管线推演、客户画像解析与 ABM 策略生成
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] p-3 rounded-lg text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white/[0.03] border border-white/[0.06] text-slate-200'
                }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                    {line}
                  </p>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>AI 正在研读全量管线数据与客户画像...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div className="p-3 bg-white/[0.02] border-t border-white/[0.04] space-y-1.5">
          <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>智能快捷指令 (Prompt Suggestions):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DEFAULT_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-2 py-1 rounded transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/[0.08] bg-[#0A0C13]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="向 AI 副驾驶提问或输入指令 (如：分析 Datadog 的推进策略)..."
              className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-md px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
