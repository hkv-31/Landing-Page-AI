
import React, { useState } from 'react';
import { RoastReportData, Severity, IssueCategory, RoastIssue } from '../types';

interface RoastReportProps {
  report: RoastReportData;
  onReset: () => void;
}

const IssueCard: React.FC<{ issue: RoastIssue }> = ({ issue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const severityColor = issue.severity === Severity.HIGH ? 'text-red-500 bg-red-500/10' : 
                       issue.severity === Severity.MEDIUM ? 'text-orange-500 bg-orange-500/10' : 
                       'text-blue-500 bg-blue-500/10';

  return (
    <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden mb-4 transition-all hover:border-white/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${issue.severity === Severity.HIGH ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
            <i className="fas fa-exclamation-triangle text-sm"></i>
          </div>
          <h4 className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors">{issue.title}</h4>
          <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider ${severityColor}`}>
            {issue.severity}
          </span>
        </div>
        <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-gray-600`}></i>
      </button>
      
      {isOpen && (
        <div className="px-5 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
          <div className="pl-12 space-y-4">
            <p className="text-gray-400 leading-relaxed text-sm">
              {issue.description}
            </p>
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2 tracking-widest">Technical Impact</span>
                <p className="text-xs text-gray-300 leading-relaxed">{issue.impact}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-green-500 block mb-2 tracking-widest">Recommended Fix</span>
                <p className="text-xs text-gray-300 leading-relaxed">{issue.suggestion}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RoastReport: React.FC<RoastReportProps> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<IssueCategory>(IssueCategory.SEO);

  const categories = Object.values(IssueCategory);
  
  const getCategoryCount = (cat: IssueCategory) => 
    report.issues.filter(i => i.category === cat).length;

  const filteredIssues = report.issues.filter(i => i.category === activeTab);

  // Determine color based on score
  const scoreColor = report.overallScore < 40 ? 'text-red-500' : report.overallScore < 70 ? 'text-orange-500' : 'text-green-500';
  const scoreGlow = report.overallScore < 40 ? 'shadow-red-500/20' : report.overallScore < 70 ? 'shadow-orange-500/20' : 'shadow-green-500/20';

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Analyze Your Landing Page</h2>
        <p className="text-gray-400">Enter a URL or upload a screenshot to get your roast report</p>
      </div>

      <button 
        onClick={onReset}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors group"
      >
        <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        Analyze another page
      </button>

      {/* Summary Score Card - Fixed Circle Layout */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-10 mb-12 relative overflow-hidden shadow-[0_0_60px_-15px_rgba(249,115,22,0.1)]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          
          {/* Large Score Circle */}
          <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0 overflow-visible">
              <circle
                cx="88"
                cy="88"
                r="74"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="88"
                cy="88"
                r="74"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={464.95}
                strokeDashoffset={464.95 - (464.95 * report.overallScore) / 100}
                strokeLinecap="round"
                className={`${scoreColor} transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]`}
              />
            </svg>
            <div className="flex flex-col items-center justify-center z-10">
              <span className="text-5xl font-black tracking-tighter">{report.overallScore}</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <div className="mb-6 flex justify-center md:justify-start">
              <span className="bg-orange-500/10 text-orange-500 text-[11px] uppercase font-black px-4 py-2 rounded-full border border-orange-500/30 tracking-[0.1em]">
                {report.statusLabel}
              </span>
            </div>
            <p className="text-2xl text-gray-100 leading-[1.4] font-semibold mb-6">
              {report.roastSummary}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <span className="opacity-60">(Analyzed: </span>
              <a href={report.analyzedTarget} target="_blank" rel="noreferrer" className="text-orange-500/60 hover:text-orange-500 transition-colors underline decoration-orange-500/20 underline-offset-4">
                {report.analyzedTarget}
              </a>
              <span className="opacity-60">)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const count = getCategoryCount(cat);
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                isActive 
                ? 'bg-orange-500/10 border-orange-500/50 text-orange-500 shadow-[0_4px_20px_-8px_rgba(249,115,22,0.3)]' 
                : 'bg-[#111111] border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200'
              }`}
            >
              <i className={`fas ${
                cat === IssueCategory.SEO ? 'fa-search' : 
                cat === IssueCategory.UX ? 'fa-mouse-pointer' : 
                cat === IssueCategory.TRUST ? 'fa-shield-alt' : 
                cat === IssueCategory.CONTENT ? 'fa-file-alt' : 'fa-mobile-alt'
              } ${isActive ? 'text-orange-500' : 'text-gray-500'}`}></i>
              {cat}
              <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-black ${isActive ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue, idx) => (
            <IssueCard key={idx} issue={issue} />
          ))
        ) : (
          <div className="text-center py-24 bg-[#0a0a0a] rounded-2xl border-2 border-dashed border-white/5">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
               <i className="fas fa-check text-green-500"></i>
            </div>
            <p className="text-gray-500 font-medium">No major issues found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoastReport;
