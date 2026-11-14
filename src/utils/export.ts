import { DiagnosticReport, ChatMetrics } from '../types';

/**
 * Generates a clean, comprehensive Markdown dossier of the diagnostic analysis.
 */
export function generateMarkdownReport(report: DiagnosticReport, metrics: ChatMetrics): string {
  const [p1, p2] = metrics.participants;
  const s1 = metrics.stats[p1];
  const s2 = metrics.stats[p2];

  let md = `# CASE DOSSIER: ${p1} vs ${p2}
**Case File:** ${report.caseMetadata.caseNumber}  
**Date Range:** ${report.caseMetadata.dateRange} (${metrics.dateRange.totalDays} days)  
**Total Messages Processed:** ${metrics.totalMessages}  
**Depth Level:** ${report.caseMetadata.depthLevel}  
**Generated:** ${report.caseMetadata.generatedAt}

---

## 1. Executive Diagnostic Verdict
> ### "${report.overallVerdict.headline}"
> **Archetype:** ${report.overallVerdict.archetypeTitle}  
> **Brutality Score:** ${report.overallVerdict.brutalityScore}/100  
> **Core Dynamic:** ${report.overallVerdict.coreDynamic}

${report.overallVerdict.summary}

---

## 2. Relational Health Scorecard (5-Pillar Psychometrics)
| Pillar | Score | Clinical Evaluation | Description |
| :--- | :--- | :--- | :--- |
| **Conversational Equity** | ${metrics.scorecard.equity}% | ${metrics.scorecard.equity > 75 ? 'Harmonic' : metrics.scorecard.equity > 50 ? 'Mild Asymmetry' : 'Severe Imbalance'} | Balance of initiation and volume |
| **Responsiveness** | ${metrics.scorecard.responsiveness}% | ${metrics.scorecard.responsiveness > 75 ? 'Synchronized' : metrics.scorecard.responsiveness > 50 ? 'Buffered' : 'Protracted Delay'} | Speed of replies and minimal intentional latency buffering |
| **Curiosity & Inquiry** | ${metrics.scorecard.curiosity}% | ${metrics.scorecard.curiosity > 70 ? 'Deep Inquiry' : metrics.scorecard.curiosity > 45 ? 'Moderate' : 'Low Reciprocity'} | Frequency of reciprocal follow-up inquiries |
| **Vulnerability Depth** | ${metrics.scorecard.vulnerability}% | ${metrics.scorecard.vulnerability > 70 ? 'High Intimacy' : metrics.scorecard.vulnerability > 45 ? 'Guarded' : 'Transactional'} | Night-owl exchanges and narrative emotional depth |
| **Pacing Consistency** | ${metrics.scorecard.consistency}% | ${metrics.scorecard.consistency > 75 ? 'Stable' : metrics.scorecard.consistency > 50 ? 'Fluctuating' : 'High Friction'} | Cadence stability without abrupt velocity drops |

---

## 3. Power Dynamics & Conversational Leverage
* **Dominant Party:** ${report.powerDynamic.dominantParticipant} (${report.powerDynamic.leveragePercentage}% leverage)
* **Initiation Breakdown:**
  * **${p1}:** Initiated ${s1.conversationsInitiated} conversations (${s1.initiationPercentage}%)
  * **${p2}:** Initiated ${s2.conversationsInitiated} conversations (${s2.initiationPercentage}%)
* **Median Response Latency:**
  * **${p1}:** ${s1.medianResponseTimeMinutes} minutes
  * **${p2}:** ${s2.medianResponseTimeMinutes} minutes
* **Word & Character Volume:**
  * **${p1}:** ${s1.wordCount} words, ${s1.doubleTextCount} double-texts
  * **${p2}:** ${s2.wordCount} words, ${s2.doubleTextCount} double-texts

**Forensic Breakdown:**  
${report.powerDynamic.explanation}

**Observed Tactics:**  
${report.powerDynamic.tacticsObserved.map((t) => `- ${t}`).join('\n')}

---

## 4. Attachment Theory Diagnostics
* **Systemic Interlock:** ${report.attachmentDynamics.dynamicType}

### ${p1} (Profile)
* **Attachment Style:** ${report.attachmentDynamics.personA.style}
* **Analysis:** ${report.attachmentDynamics.personA.summary}
* **Observable Triggers:** ${report.attachmentDynamics.personA.observableTriggers.join(', ')}

### ${p2} (Profile)
* **Attachment Style:** ${report.attachmentDynamics.personB.style}
* **Analysis:** ${report.attachmentDynamics.personB.summary}
* **Observable Triggers:** ${report.attachmentDynamics.personB.observableTriggers.join(', ')}

**Systemic Feedback Loop:**  
${report.attachmentDynamics.systemicLoop}

---

## 5. Gottman Relational Diagnostics
* **Turn Towards Rate (${p1}):** ${report.gottmanAnalysis.turnTowardsRateA}%
* **Turn Towards Rate (${p2}):** ${report.gottmanAnalysis.turnTowardsRateB}%
* **Receptivity Summary:** ${report.gottmanAnalysis.bidSummary}

### Friction Markers Detected:
${
  report.gottmanAnalysis.frictionMarkers.length === 0
    ? '_No severe friction markers detected._'
    : report.gottmanAnalysis.frictionMarkers
        .map(
          (m) =>
            `- **[${m.type}]** by ${m.instigator}: "${m.quote}" — ${m.analysis}`
        )
        .join('\n')
}

---

## 6. Chronological Relationship Epochs
${
  report.relationshipEpochs && report.relationshipEpochs.length > 0
    ? report.relationshipEpochs
        .map(
          (epoch) => `### Chapter ${epoch.chapterNumber}: ${epoch.title} (${epoch.timeframe})
* **Vibe Score:** ${epoch.vibeScore}/100 | **Cadence:** ${epoch.cadence}
* **Summary:** ${epoch.summary}
* **Key Milestone:** "${epoch.keyMomentQuote}"
`
        )
        .join('\n')
    : '_No distinct epochs detected._'
}

---

## 7. Actionable Guidance & Prognosis
* **Direct Counsel for ${p1}:**  
  ${report.actionableAdvice.forPersonA}

* **Direct Counsel for ${p2}:**  
  ${report.actionableAdvice.forPersonB}

* **The Bottom Line:**  
  > "${report.actionableAdvice.theBottomLine}"

---
_Generated 100% privately via Chat Forensics (Conversational Diagnostics Engine)._
`;

  return md;
}

/**
 * Triggers a client-side file download for arbitrary text or JSON data.
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
