
export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum IssueCategory {
  SEO = 'On-Page SEO',
  UX = 'UX Signals',
  TRUST = 'Trust & Credibility',
  CONTENT = 'Content & Keywords',
  MOBILE = 'Mobile Readiness'
}

export interface RoastIssue {
  category: IssueCategory;
  severity: Severity;
  title: string;
  description: string;
  impact: string;
  suggestion: string;
}

export interface RoastReportData {
  overallScore: number;
  statusLabel: string; // e.g., "Needs Work", "Poor", "Decent"
  roastSummary: string;
  analyzedTarget: string;
  issues: RoastIssue[];
}

export type InputMode = 'URL' | 'FILE';
