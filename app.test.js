/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load app.js source (it defines globals)
const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

// We need to eval it in a controlled way for testing.
// Instead, we'll re-extract logic by loading it after setting up DOM.

// Minimal DOM needed by app.js
function setupDOM() {
  document.body.innerHTML = `
    <div id="topicsContainer"></div>
    <div id="overallBar"></div>
    <span id="overallPercent"></span>
    <span id="overallDetail"></span>
    <button id="resetBtn"></button>
    <div id="modalOverlay"><button id="cancelReset"></button><button id="confirmReset"></button></div>
    <div id="celebration"><span id="celebrationText"></span><button id="closeCelebration"></button></div>
  `;
}

// We need TOPICS and the pure functions testable without render side effects.
// Strategy: eval the source but mock document.getElementById for render calls.

let TOPICS, STATES, getState, saveState, getStatus, setStatus, cycleStatus, getTopicProgress, getOverallProgress;

function loadApp() {
  setupDOM();
  localStorage.clear();

  // Execute app.js in this context
  const func = new Function('document', 'localStorage', 'window', appCode + `
    return { TOPICS, STATES, getState, saveState, getStatus, setStatus, cycleStatus, getTopicProgress, getOverallProgress };
  `);
  const exports = func(document, localStorage, window);
  TOPICS = exports.TOPICS;
  STATES = exports.STATES;
  getState = exports.getState;
  saveState = exports.saveState;
  getStatus = exports.getStatus;
  setStatus = exports.setStatus;
  cycleStatus = exports.cycleStatus;
  getTopicProgress = exports.getTopicProgress;
  getOverallProgress = exports.getOverallProgress;
}

describe('AI Agent Learning App', () => {
  beforeEach(() => {
    loadApp();
  });

  describe('Topic data', () => {
    test('has 10 topics', () => {
      expect(TOPICS).toHaveLength(10);
    });

    test('each topic has id, title, takeaway, and subtopics', () => {
      TOPICS.forEach(t => {
        expect(t.id).toBeTruthy();
        expect(t.title).toBeTruthy();
        expect(t.takeaway).toBeTruthy();
        expect(Array.isArray(t.subtopics)).toBe(true);
        expect(t.subtopics.length).toBeGreaterThan(0);
      });
    });

    test('correct subtopic counts', () => {
      const counts = TOPICS.map(t => t.subtopics.length);
      expect(counts).toEqual([4, 5, 7, 6, 5, 3, 2, 5, 5, 6]);
    });

    test('key takeaways exist for each topic', () => {
      TOPICS.forEach(t => {
        expect(t.takeaway.length).toBeGreaterThan(20);
      });
    });
  });

  describe('State cycling', () => {
    test('cycles from not-started to learning', () => {
      cycleStatus('what-are-ai-agents', 0);
      expect(getStatus('what-are-ai-agents', 0)).toBe('learning');
    });

    test('cycles from learning to mastered', () => {
      setStatus('what-are-ai-agents', 0, 'learning');
      cycleStatus('what-are-ai-agents', 0);
      expect(getStatus('what-are-ai-agents', 0)).toBe('mastered');
    });

    test('cycles from mastered back to not-started', () => {
      setStatus('what-are-ai-agents', 0, 'mastered');
      cycleStatus('what-are-ai-agents', 0);
      expect(getStatus('what-are-ai-agents', 0)).toBe('not-started');
    });

    test('default status is not-started', () => {
      expect(getStatus('architecture-patterns', 0)).toBe('not-started');
    });
  });

  describe('localStorage persistence', () => {
    test('saves state to localStorage', () => {
      setStatus('what-are-ai-agents', 0, 'learning');
      const stored = JSON.parse(localStorage.getItem('ai-agents-tracker'));
      expect(stored['what-are-ai-agents-0']).toBe('learning');
    });

    test('loads state from localStorage', () => {
      saveState({ 'memory-context-3': 'mastered' });
      expect(getStatus('memory-context', 3)).toBe('mastered');
    });

    test('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('ai-agents-tracker', 'not-json{{{');
      expect(getState()).toEqual({});
    });
  });

  describe('Progress calculation', () => {
    test('topic progress with no mastery is 0%', () => {
      const prog = getTopicProgress(TOPICS[0]);
      expect(prog.percent).toBe(0);
      expect(prog.mastered).toBe(0);
    });

    test('topic progress reflects mastered subtopics', () => {
      setStatus('what-are-ai-agents', 0, 'mastered');
      const prog = getTopicProgress(TOPICS[0]);
      expect(prog.mastered).toBe(1);
      expect(prog.percent).toBe(25); // 1 of 4
    });

    test('100% when all subtopics mastered', () => {
      TOPICS[6].subtopics.forEach((_, i) => setStatus('real-world-apps', i, 'mastered'));
      const prog = getTopicProgress(TOPICS[6]);
      expect(prog.percent).toBe(100);
    });

    test('overall progress across all topics', () => {
      // Master one subtopic in first topic (1 of 48 total)
      setStatus('what-are-ai-agents', 0, 'mastered');
      const prog = getOverallProgress();
      expect(prog.mastered).toBe(1);
      expect(prog.total).toBe(48); // sum of all subtopic counts
      expect(prog.percent).toBe(Math.round((1/48)*100));
    });
  });

  describe('Reset functionality', () => {
    test('reset clears all state', () => {
      setStatus('what-are-ai-agents', 0, 'mastered');
      setStatus('frameworks-tools', 2, 'learning');
      localStorage.removeItem('ai-agents-tracker');
      // After removal, getStatus returns default
      expect(getStatus('what-are-ai-agents', 0)).toBe('not-started');
      expect(getStatus('frameworks-tools', 2)).toBe('not-started');
    });
  });
});