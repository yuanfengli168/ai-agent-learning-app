const TOPICS = [
  {
    id: 'what-are-ai-agents',
    title: 'What Are AI Agents?',
    takeaway: 'AI agents are systems that perceive, reason, and act autonomously. They sit on a spectrum from simple reflexive responders to fully autonomous planners. Understanding the taxonomy helps you pick the right architecture for each use case.',
    subtopics: ['Core definition', 'Autonomy spectrum', 'Core components', 'Agent taxonomy']
  },
  {
    id: 'architecture-patterns',
    title: 'Agent Architecture Patterns',
    takeaway: 'ReAct interleaves thought and action; Plan-and-Execute separates planning from execution; LATS and Reflexion add self-reflection loops. Anthropic\'s 5 workflow patterns (prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer) map cleanly to real production needs.',
    subtopics: ['ReAct', 'Plan-and-Execute', 'LATS', 'Reflexion', 'Anthropic\'s 5 workflow patterns']
  },
  {
    id: 'frameworks-tools',
    title: 'Key Frameworks & Tools',
    takeaway: 'LangGraph gives you fine-grained graph control; CrewAI excels at role-based multi-agent teams; AutoGen enables flexible conversation patterns. No framework dominates — pick based on your team\'s skill set and use case complexity.',
    subtopics: ['LangChain/LangGraph', 'CrewAI', 'AutoGen', 'OpenAI Agents SDK', 'Semantic Kernel', 'OpenClaw', 'Comparison matrix']
  },
  {
    id: 'memory-context',
    title: 'Memory & Context',
    takeaway: 'Short-term memory handles the current conversation; long-term memory persists across sessions. Episodic memory stores experiences, semantic memory stores facts. The Generative Agents architecture shows how retrieval + reflection creates believable agents.',
    subtopics: ['Short-term memory', 'Long-term memory', 'Episodic memory', 'Semantic memory', 'Generative Agents architecture', 'Memory implementation patterns']
  },
  {
    id: 'tool-use',
    title: 'Tool Use & Function Calling',
    takeaway: 'Tools turn language models from chatbots into actors. The function calling protocol standardizes how models invoke external capabilities. MRKL systems combine reasoning and knowledge retrieval — tool selection and error handling are where most production bugs live.',
    subtopics: ['Why tools matter', 'Function calling protocol', 'Tool selection strategies', 'Error handling', 'MRKL systems']
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Systems',
    takeaway: 'Agents can communicate sequentially, in parallel, hierarchically, or through debate. Role assignment and clear contracts between agents reduce chaos. The key challenges are coordination overhead, error propagation, and knowing when a single agent suffices.',
    subtopics: ['Communication patterns (sequential, parallel, hierarchical, debate)', 'Role assignment', 'Key challenges']
  },
  {
    id: 'real-world-apps',
    title: 'Real-World Applications',
    takeaway: 'Coding assistants, research agents, and workflow automations are genuinely working today. Claims of fully autonomous businesses and self-improving agents remain mostly hype — focus on narrow, well-scoped problems where agents demonstrably outperform simpler approaches.',
    subtopics: ['What\'s working now', 'What\'s mostly hype']
  },
  {
    id: 'building-shipping',
    title: 'Building & Shipping Agents',
    takeaway: 'Evaluation must be automated and continuous — manual testing doesn\'t scale. Observability (traces, metrics) is non-negotiable for debugging agent loops. Cost management, safe deployment patterns, and guardrails separate toys from production systems.',
    subtopics: ['Evaluation', 'Observability', 'Cost management', 'Deployment', 'Safety']
  },
  {
    id: 'business-opportunities',
    title: 'Business Opportunities',
    takeaway: 'Vertical agents (deep in one domain) beat horizontal wrappers every time. Agent-as-a-Service and skill marketplaces are emerging models. The biggest wins come from building deep domain expertise, not from thin API wrappers around frontier models.',
    subtopics: ['Vertical agents', 'Agent-as-a-Service', 'Skill marketplaces', 'Infrastructure & tooling', 'Building vs wrapping']
  },
  {
    id: 'future-directions',
    title: 'Future Directions',
    takeaway: 'Capabilities are expanding exponentially while costs drop — making previously impossible use cases viable each year. Multi-agent orchestration is maturing toward an "app store moment." The safest bet: invest in fundamentals (prompting, evaluation, tool design) that survive any model swap.',
    subtopics: ['Capability trends', 'Cost trends', 'Multi-agent maturation', 'Safety', 'App store moment', 'What to learn now']
  }
];

const STATES = ['not-started', 'learning', 'mastered'];

function getState() {
  try {
    return JSON.parse(localStorage.getItem('ai-agents-tracker') || '{}');
  } catch { return {}; }
}

function saveState(state) {
  localStorage.setItem('ai-agents-tracker', JSON.stringify(state));
}

function getStatus(topicId, subIdx) {
  const state = getState();
  return state[`${topicId}-${subIdx}`] || 'not-started';
}

function setStatus(topicId, subIdx, status) {
  const state = getState();
  state[`${topicId}-${subIdx}`] = status;
  saveState(state);
  render();
  checkTopicMastery(topicId);
}

function cycleStatus(topicId, subIdx) {
  const current = getStatus(topicId, subIdx);
  const next = STATES[(STATES.indexOf(current) + 1) % 3];
  setStatus(topicId, subIdx, next);
}

function getTopicProgress(topic) {
  const total = topic.subtopics.length;
  let mastered = 0, learning = 0;
  topic.subtopics.forEach((_, i) => {
    const s = getStatus(topic.id, i);
    if (s === 'mastered') mastered++;
    else if (s === 'learning') learning++;
  });
  return { total, mastered, learning, percent: Math.round((mastered / total) * 100) };
}

function getOverallProgress() {
  let total = 0, mastered = 0;
  TOPICS.forEach(t => {
    total += t.subtopics.length;
    t.subtopics.forEach((_, i) => {
      if (getStatus(t.id, i) === 'mastered') mastered++;
    });
  });
  return { total, mastered, percent: Math.round((mastered / total) * 100) };
}

function checkTopicMastery(topicId) {
  const topic = TOPICS.find(t => t.id === topicId);
  const prog = getTopicProgress(topic);
  if (prog.mastered === prog.total) {
    showCelebration(topic.title);
  }
}

function showCelebration(topicTitle) {
  const el = document.getElementById('celebration');
  document.getElementById('celebrationText').textContent = `You've mastered "${topicTitle}"! 🎉`;
  el.classList.add('active');
  spawnConfetti();
}

function spawnConfetti() {
  const colors = ['#58a6ff', '#bc8cff', '#3fb950', '#d29922', '#f85149', '#79c0ff'];
  for (let i = 0; i < 30; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = Math.random() * 0.8 + 's';
    c.style.animationDuration = (2 + Math.random()) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3500);
  }
}

function render() {
  const container = document.getElementById('topicsContainer');
  const overall = getOverallProgress();
  
  document.getElementById('overallBar').style.width = overall.percent + '%';
  document.getElementById('overallPercent').textContent = overall.percent + '%';
  document.getElementById('overallDetail').textContent = `${overall.mastered} / ${overall.total} subtopics mastered`;

  const expandedState = {};
  container.querySelectorAll('.topic-card').forEach(card => {
    expandedState[card.dataset.id] = card.classList.contains('expanded');
  });

  container.innerHTML = TOPICS.map((topic, tIdx) => {
    const prog = getTopicProgress(topic);
    const isMastered = prog.mastered === prog.total;
    const wasExpanded = expandedState[topic.id] !== false; // default expanded
    
    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (prog.percent / 100) * circumference;
    const circleColor = isMastered ? 'var(--mastered)' : prog.learning ? 'var(--learning)' : 'var(--not-started)';

    return `
      <div class="topic-card${isMastered ? ' mastered-topic' : ''}${wasExpanded ? ' expanded' : ''}" data-id="${topic.id}">
        <div class="topic-header" onclick="toggleTopic('${topic.id}')">
          <div class="topic-info">
            <div class="topic-number">Topic ${tIdx + 1}</div>
            <div class="topic-title">${topic.title}</div>
            <div class="topic-takeaway">${topic.takeaway}</div>
          </div>
          <div class="topic-right">
            <div class="topic-progress-mini">
              <svg viewBox="0 0 44 44" width="100%" height="100%">
                <circle cx="22" cy="22" r="18" fill="none" stroke="var(--not-started-bg)" stroke-width="3"/>
                <circle cx="22" cy="22" r="18" fill="none" stroke="${circleColor}" stroke-width="3"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                  stroke-linecap="round" style="transition: stroke-dashoffset 0.6s, stroke 0.3s"/>
              </svg>
              <span class="progress-text">${prog.percent}%</span>
            </div>
            <span class="chevron">▼</span>
          </div>
        </div>
        <div class="subtopics">
          <div class="subtopics-inner">
            ${topic.subtopics.map((sub, sIdx) => {
              const status = getStatus(topic.id, sIdx);
              const badgeClass = status === 'mastered' ? 'badge-ms' : status === 'learning' ? 'badge-ln' : 'badge-ns';
              const badgeText = status === 'mastered' ? '✓ Mastered' : status === 'learning' ? '⟳ Learning' : '○ Not Started';
              const nameClass = status === 'mastered' ? ' mastered-text' : status === 'learning' ? ' learning-text' : '';
              const rowClass = status === 'mastered' ? ' mastered-row' : '';
              return `
                <div class="subtopic-row${rowClass}">
                  <div class="status-btns">
                    <button class="status-btn ns${status === 'not-started' ? ' active' : ''}" onclick="event.stopPropagation(); setStatus('${topic.id}', ${sIdx}, 'not-started')" title="Not Started"></button>
                    <button class="status-btn ln${status === 'learning' ? ' active' : ''}" onclick="event.stopPropagation(); setStatus('${topic.id}', ${sIdx}, 'learning')" title="Learning"></button>
                    <button class="status-btn ms${status === 'mastered' ? ' active' : ''}" onclick="event.stopPropagation(); setStatus('${topic.id}', ${sIdx}, 'mastered')" title="Mastered"></button>
                  </div>
                  <span class="subtopic-name${nameClass}">${sub}</span>
                  <span class="subtopic-badge ${badgeClass}">${badgeText}</span>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
  }).join('');
}

function toggleTopic(topicId) {
  const card = document.querySelector(`.topic-card[data-id="${topicId}"]`);
  if (card) card.classList.toggle('expanded');
}

// Reset modal
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.add('active');
});

document.getElementById('cancelReset').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('active');
});

document.getElementById('confirmReset').addEventListener('click', () => {
  localStorage.removeItem('ai-agents-tracker');
  document.getElementById('modalOverlay').classList.remove('active');
  render();
});

document.getElementById('closeCelebration').addEventListener('click', () => {
  document.getElementById('celebration').classList.remove('active');
});

// Initial render
render();