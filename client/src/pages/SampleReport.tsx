import React from 'react';
import { Link } from 'react-router-dom';
import { ReportStatsSummary } from '../components/reports/ReportStatsSummary';
import { FindingsList } from '../components/reports/FindingsList';
import { PatternsSection } from '../components/reports/PatternsSection';
import { SuggestionsList } from '../components/reports/SuggestionsList';
import { HourlyChart } from '../components/charts/HourlyChart';
import { ConflictVerdictCard } from '../components/reports/ConflictVerdictCard';
import { AnalysisReport } from '../shared/types/report';
import { Info, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const DEMO_REPORT: AnalysisReport = {
  id: 'sample-report-demo',
  title: 'Alex & Maya: Communication Dynamics & Rhythm',
  category: 'relationship',
  conciseSummary:
    'Across 842 messages spanning 42 days, Alex and Maya demonstrate a highly reciprocal, responsive dialogue with balanced conversational initiation and consistent daily check-in rhythms. Communication peaks naturally during midday breaks and late evening unwind hours, with mutual responsiveness evident throughout active intervals.',
  apparentTone: 'Warm, collaborative, and responsive',
  confidenceLevel: 'high',
  conflictVerdict: {
    detectedIssue: 'Late-night plan rescheduling and subtle communication withdrawal around busy office deadlines.',
    triggeredBy: 'Alex',
    verdictRuling: 'Alex was primarily in the wrong for going cold without explanation, while Maya was justified in feeling deprioritized.',
    whoIsWrong: {
      name: 'Alex',
      summary: 'Turned cold with one-word responses ("k", "fine") instead of communicating busy work constraints.',
      reasons: [
        'Failed to provide a simple heads-up about demanding work deadlines',
        'Shut down dialogue with dismissive responses',
        'Left Maya guessing about his emotional state for hours'
      ],
      severity: 'moderate'
    },
    whoIsRight: {
      name: 'Maya',
      summary: 'Attempted to coordinate and stay engaged, but was met with sudden uncommunicative silence.',
      reasons: [
        'Clearly confirmed plans and kept communication open',
        'Stayed patient throughout the initial delay',
        'Sought clarity rather than immediately starting a confrontation'
      ]
    },
    accountability: [
      {
        participantName: 'Alex',
        whatTheyDidWrong: 'Assumed Maya would understand work stress without texting a quick heads-up; sent dry one-word replies ("k", "fine").',
        whatTheyDidRight: 'Took initiative for weekend arrangements and expressed genuine apology once free.',
        underlyingIntent: 'Felt overwhelmed by deadlines and struggled to juggle priorities.',
        faultPercentage: 55,
      },
      {
        participantName: 'Maya',
        whatTheyDidWrong: 'Reacted with sarcastic comments ("Bade log ho gaye") rather than asking if everything was okay.',
        whatTheyDidRight: 'Stayed patient initially and tried to keep conversation upbeat.',
        underlyingIntent: 'Wanted reassurance and felt disconnected during the silence.',
        faultPercentage: 45,
      }
    ],
    fairVerdict: 'The conflict was rooted in mismatched expectations around response timing rather than lack of affection. Alex escalated the friction by turning cold, while Maya reacted defensively with sarcasm. A brief heads-up prevents this cycle completely.',
    suggestedReplies: [
      {
        forParticipant: 'Alex',
        messageText: 'Hey Maya, sorry for sounding distant earlier. Work was genuinely chaotic, but I should have given you a quick heads-up. Let me take you out tomorrow!',
        intentGoal: 'Acknowledges impact without defensiveness and takes proactive initiative.'
      },
      {
        forParticipant: 'Maya',
        messageText: 'Hey Alex, sorry I gave you a hard time. I was just excited to catch up, but I get that work was intense. Rest up and talk tomorrow!',
        intentGoal: 'Softens tension and removes pressure.'
      }
    ]
  },
  isPaid: true,
  status: 'completed',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  analyzedMessagesCount: 842,
  totalOriginalMessagesCount: 860,
  dateRangeAnalyzed: {
    start: '2024-01-01T08:00:00.000Z',
    end: '2024-02-12T22:30:00.000Z',
  },
  verifiedStatistics: {
    totalMessages: 842,
    totalWords: 7850,
    durationDays: 42,
    messagesPerDay: 20.1,
    participationBalance: 0.88,
    isTimestampReliable: true,
    startDate: '2024-01-01T08:00:00.000Z',
    endDate: '2024-02-12T22:30:00.000Z',
    participants: [
      {
        name: 'Alex',
        messageCount: 442,
        percentage: 52.5,
        wordCount: 4120,
        avgWordsPerMessage: 9.3,
        charactersCount: 22100,
        conversationsInitiated: 28,
        avgReplyTimeMinutes: 14,
        medianReplyTimeMinutes: 6,
        longestMonologueCount: 4,
      },
      {
        name: 'Maya',
        messageCount: 400,
        percentage: 47.5,
        wordCount: 3730,
        avgWordsPerMessage: 9.3,
        charactersCount: 20400,
        conversationsInitiated: 24,
        avgReplyTimeMinutes: 16,
        medianReplyTimeMinutes: 7,
        longestMonologueCount: 3,
      },
    ],
    hourlyDistribution: [
      { hour: 0, count: 12, percentage: 1.4 },
      { hour: 1, count: 4, percentage: 0.5 },
      { hour: 2, count: 0, percentage: 0 },
      { hour: 3, count: 0, percentage: 0 },
      { hour: 4, count: 0, percentage: 0 },
      { hour: 5, count: 0, percentage: 0 },
      { hour: 6, count: 8, percentage: 1.0 },
      { hour: 7, count: 18, percentage: 2.1 },
      { hour: 8, count: 48, percentage: 5.7 },
      { hour: 9, count: 52, percentage: 6.2 },
      { hour: 10, count: 42, percentage: 5.0 },
      { hour: 11, count: 38, percentage: 4.5 },
      { hour: 12, count: 64, percentage: 7.6 },
      { hour: 13, count: 58, percentage: 6.9 },
      { hour: 14, count: 44, percentage: 5.2 },
      { hour: 15, count: 36, percentage: 4.3 },
      { hour: 16, count: 46, percentage: 5.5 },
      { hour: 17, count: 54, percentage: 6.4 },
      { hour: 18, count: 62, percentage: 7.4 },
      { hour: 19, count: 70, percentage: 8.3 },
      { hour: 20, count: 78, percentage: 9.3 },
      { hour: 21, count: 66, percentage: 7.8 },
      { hour: 22, count: 32, percentage: 3.8 },
      { hour: 23, count: 10, percentage: 1.2 },
    ],
    dailyDistribution: [
      { dayOfWeek: 0, dayName: 'Sunday', count: 135 },
      { dayOfWeek: 1, dayName: 'Monday', count: 112 },
      { dayOfWeek: 2, dayName: 'Tuesday', count: 120 },
      { dayOfWeek: 3, dayName: 'Wednesday', count: 118 },
      { dayOfWeek: 4, dayName: 'Thursday', count: 124 },
      { dayOfWeek: 5, dayName: 'Friday', count: 128 },
      { dayOfWeek: 6, dayName: 'Saturday', count: 105 },
    ],
    weeklyTrends: [],
    topKeywords: [
      { word: 'dinner', count: 42 },
      { word: 'tomorrow', count: 38 },
      { word: 'weekend', count: 31 },
      { word: 'coffee', count: 28 },
      { word: 'proposal', count: 22 },
    ],
    conversationStarters: [
      { name: 'Alex', count: 28, ratio: 54 },
      { name: 'Maya', count: 24, ratio: 46 },
    ],
    replyTimeDistributions: [
      { name: 'Alex', avgMinutes: 14, medianMinutes: 6 },
      { name: 'Maya', avgMinutes: 16, medianMinutes: 7 },
    ],
  },
  keyFindings: [
    {
      id: 'finding-1',
      title: 'Balanced Conversational Reciprocity',
      categoryTag: 'engagement',
      observation:
        'Participation volume is remarkably balanced (52.5% vs 47.5%), with both Alex and Maya actively contributing and sustaining shared topics across days.',
      confidence: 'high',
      alternativeExplanation:
        'Slight volume differences correlate with individual typing habits (shorter sequential texts vs single paragraphs) rather than emotional asymmetry.',
      supportingEvidence: [
        {
          quote: 'Hey Maya, did you review the project proposal?',
          sender: 'Alex',
          contextNote: 'Conversational initiation',
          verifiedInSource: true,
        },
        {
          quote: 'Yes! I went through all the sections this morning. It looks comprehensive and very thorough.',
          sender: 'Maya',
          contextNote: 'Prompt constructive response',
          verifiedInSource: true,
        },
      ],
    },
    {
      id: 'finding-2',
      title: 'Prompt Turnaround During Active Hours',
      categoryTag: 'communication',
      observation:
        'Median response time is 6 to 7 minutes during non-working windows, indicating comfortable, fluid pacing without delayed defensiveness.',
      confidence: 'high',
      alternativeExplanation:
        'Longer intervals during midday typically coincide with work meetings and focused tasks rather than avoidance.',
      supportingEvidence: [
        {
          quote: 'Tomorrow at 3pm works perfectly for me.',
          sender: 'Maya',
          contextNote: 'Decisive planning response',
          verifiedInSource: true,
        },
      ],
    },
    {
      id: 'finding-3',
      title: 'Supportive Clarification Habits',
      categoryTag: 'tone',
      observation:
        'When plans shift or schedules conflict, both participants proactively confirm logistics rather than letting ambiguity linger.',
      confidence: 'moderate',
      alternativeExplanation:
        'Fast logistical clarifications may occasionally read as terse if text-only shorthand is used without affectionate sign-offs.',
      supportingEvidence: [
        {
          quote: 'Perfect, I will send the invite shortly.',
          sender: 'Alex',
          contextNote: 'Closing the loop',
          verifiedInSource: true,
        },
      ],
    },
  ],
  communicationPatterns: [
    {
      id: 'pattern-1',
      name: 'Evening Plan Alignments',
      description: 'Consistent check-ins between 8:00 PM and 9:30 PM to coordinate next-day logistics.',
      type: 'positive',
      frequency: 'Daily',
      exampleQuotes: ['Tomorrow at 3pm works perfectly for me.'],
    },
    {
      id: 'pattern-2',
      name: 'Asynchronous Workday Buffering',
      description: 'Comfortable gaps during business hours without repetitive nudges or anxious follow-ups.',
      type: 'positive',
      frequency: 'Consistent',
      exampleQuotes: ['I went through all the sections this morning.'],
    },
  ],
  positiveObservations: [
    'Exceptionally high conversational reciprocity: both individuals share the initiation burden equally (54% vs 46%).',
    'Low friction in logistical decision-making, with fast mutual confirmations.',
    'Warm, colloquial tone sustained across multiple weeks.',
  ],
  potentialFrictionPoints: [
    'Occasional shorthand during hurried moments can occasionally omit vocal warmth.',
  ],
  practicalSuggestions: [
    {
      id: 'sug-1',
      title: 'Contextualize Stepping Away',
      suggestion: 'When busy with meetings, a quick "focused until 5pm" prevents either party from wondering about response pacing.',
      whyItHelps: 'Ensures peaceful focus while giving clear reassurance.',
      targetAudience: 'Both participants',
    },
    {
      id: 'sug-2',
      title: 'Celebrate Mutual Coordination',
      suggestion: 'Acknowledge how smoothly joint planning happens and reinforce positive teamwork.',
      whyItHelps: 'Builds positive sentiment and deepens appreciation for mutual reliability.',
      targetAudience: 'Both participants',
    },
  ],
  limitationsAndUncertainty: [
    'Text messages do not capture vocal inflection, eye contact, or in-person emotional warmth.',
    'Analysis is strictly grounded in this WhatsApp export and cannot account for voice calls or offline discussions.',
  ],
};

export const SampleReport: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Demonstration Banner */}
      <div className="bg-[#EDF3EB] border border-[#DCE8D6] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#304A34]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#718B65] shrink-0" />
          <span>
            <strong>Interactive Demonstration:</strong> This sample report illustrates the complete findings, charts, and verified statistics generated for full reports using synthetic data.
          </span>
        </div>
        <Link
          to="/analyze"
          className="px-4 py-2 bg-[#304A34] text-[#FFFEFA] rounded-lg font-semibold hover:bg-[#263B29] transition-colors whitespace-nowrap"
        >
          Analyze Your Own Chat
        </Link>
      </div>

      {/* Report Header */}
      <div className="space-y-4 border-b border-[#E3E1D9] pb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#991B1B] uppercase tracking-wider">
            {DEMO_REPORT.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Full Report Unlocked
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          {DEMO_REPORT.title}
        </h1>

        <div className="bg-[#FFFEFA] rounded-xl border border-[#E3E1D9] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#5A6559] uppercase tracking-wider block mb-1">
            Executive Summary
          </span>
          <p className="text-sm text-[#242923] leading-relaxed">
            {DEMO_REPORT.conciseSummary}
          </p>
        </div>
      </div>

      {/* Relationship Conflict & Accountability Reality Check */}
      {DEMO_REPORT.conflictVerdict && (
        <ConflictVerdictCard verdict={DEMO_REPORT.conflictVerdict} />
      )}

      {/* Verified Statistics Engine */}
      <ReportStatsSummary statistics={DEMO_REPORT.verifiedStatistics} />

      {/* Time-of-day Activity Chart */}
      <HourlyChart distribution={DEMO_REPORT.verifiedStatistics.hourlyDistribution} />

      {/* Evidence & Key Findings */}
      <FindingsList findings={DEMO_REPORT.keyFindings} />

      {/* Recurring Patterns & Positive Dynamics */}
      <PatternsSection
        patterns={DEMO_REPORT.communicationPatterns}
        positiveObservations={DEMO_REPORT.positiveObservations}
        potentialFrictionPoints={DEMO_REPORT.potentialFrictionPoints}
      />

      {/* Practical Constructive Suggestions */}
      <SuggestionsList suggestions={DEMO_REPORT.practicalSuggestions} />

      {/* Limitations & Ethical AI Disclaimer */}
      <div className="bg-[#FFFEFA] rounded-xl border border-[#E3E1D9] p-6 space-y-3 text-xs text-[#5A6559]">
        <div className="flex items-center gap-2 font-bold text-[#242923]">
          <ShieldCheck className="w-4 h-4 text-[#718B65]" />
          <span>Ethical AI & Limitations Disclaimer</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[#7F8A7D]">
          {DEMO_REPORT.limitationsAndUncertainty.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
          <li>ChatTruth is designed for personal insight and communication reflection. It does not constitute psychological diagnosis or legal evidence.</li>
        </ul>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8 space-y-4">
        <h3 className="text-2xl font-bold text-[#242923] editorial-title">
          Ready to uncover the truth in your conversations?
        </h3>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-sm shadow-xs transition-colors"
        >
          Analyze your chat now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
