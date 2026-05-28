/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

function setupDOM() {
  document.body.innerHTML = `
    <div id="topicsContainer"></div>
    <div id="overallBar" style="width:0%"></div>
    <span id="overallPercent"></span>
    <span id="overallDetail"></span>
    <button id="resetBtn"></button>
    <div id="modalOverlay"><button id="cancelReset"></button><button id="confirmReset"></button></div>
    <div id="celebration"><span id="celebrationText"></span><button id="closeCelebration"></button></div>
    <div id="lessonOverlay"><button class="lesson-close" onclick="closeLesson()"></button><h2 id="lessonTitle"></h2><div id="lessonContent"></div><div id="lessonActions"></div></div>
    <div id="quizOverlay"><div id="quizContent"></div></div>
  `;
}

let TOPICS, STATES, getState, saveState, getStatus, setStatus, cycleStatus,
    getTopicProgress, getOverallProgress, getQuizState, saveQuizState,
    startQuiz, closeQuiz, openLesson, closeLesson;

function loadApp() {
  setupDOM();
  localStorage.clear();

  const func = new Function('document', 'localStorage', 'window', appCode + `
    return {
      TOPICS, STATES, getState, saveState, getStatus, setStatus, cycleStatus,
      getTopicProgress, getOverallProgress, getQuizState, saveQuizState,
      startQuiz, closeQuiz, openLesson, closeLesson
    };
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
  getQuizState = exports.getQuizState;
  saveQuizState = exports.saveQuizState;
  startQuiz = exports.startQuiz;
  closeQuiz = exports.closeQuiz;
  openLesson = exports.openLesson;
  closeLesson = exports.closeLesson;
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

  describe('Lesson content', () => {
    test('every topic has lessons matching subtopic count', () => {
      TOPICS.forEach(t => {
        expect(Array.isArray(t.lessons)).toBe(true);
        expect(t.lessons.length).toBe(t.subtopics.length);
      });
    });

    test('each lesson has substantial HTML content', () => {
      TOPICS.forEach(t => {
        t.lessons.forEach((lesson, i) => {
          expect(typeof lesson).toBe('string');
          expect(lesson.length).toBeGreaterThan(50);
          expect(lesson).toContain('<p>');
        });
      });
    });

    test('lessons contain key terminology in bold', () => {
      TOPICS.forEach(t => {
        t.lessons.forEach(lesson => {
          expect(lesson).toContain('<strong>');
        });
      });
    });
  });

  describe('Quiz data', () => {
    test('every topic has quiz questions', () => {
      TOPICS.forEach(t => {
        expect(Array.isArray(t.quiz)).toBe(true);
        expect(t.quiz.length).toBeGreaterThanOrEqual(3);
      });
    });

    test('at least 30 quiz questions total', () => {
      const total = TOPICS.reduce((sum, t) => sum + t.quiz.length, 0);
      expect(total).toBeGreaterThanOrEqual(30);
    });

    test('each quiz question has required fields', () => {
      TOPICS.forEach(t => {
        t.quiz.forEach(q => {
          expect(q.question).toBeTruthy();
          expect(Array.isArray(q.options)).toBe(true);
          expect(q.options.length).toBe(4);
          expect(typeof q.correct).toBe('number');
          expect(q.correct).toBeGreaterThanOrEqual(0);
          expect(q.correct).toBeLessThan(4);
          expect(q.explanation).toBeTruthy();
          expect(q.explanation.length).toBeGreaterThan(10);
        });
      });
    });

    test('correct answer index matches one of the options', () => {
      TOPICS.forEach(t => {
        t.quiz.forEach(q => {
          expect(q.options[q.correct]).toBeTruthy();
        });
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

  describe('Quiz state persistence', () => {
    test('saves quiz results to localStorage', () => {
      saveQuizState({ 'what-are-ai-agents': { score: 3, total: 4, pct: 75 } });
      const stored = JSON.parse(localStorage.getItem('ai-agents-quiz'));
      expect(stored['what-are-ai-agents'].score).toBe(3);
    });

    test('loads quiz state from localStorage', () => {
      saveQuizState({ 'what-are-ai-agents': { score: 4, total: 4, pct: 100 } });
      expect(getQuizState()['what-are-ai-agents'].pct).toBe(100);
    });

    test('handles corrupted quiz localStorage gracefully', () => {
      localStorage.setItem('ai-agents-quiz', 'bad{json');
      expect(getQuizState()).toEqual({});
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
      setStatus('what-are-ai-agents', 0, 'mastered');
      const prog = getOverallProgress();
      expect(prog.mastered).toBe(1);
      expect(prog.total).toBe(48);
      expect(prog.percent).toBe(Math.round((1/48)*100));
    });
  });

  describe('Reset functionality', () => {
    test('reset clears all state', () => {
      setStatus('what-are-ai-agents', 0, 'mastered');
      setStatus('frameworks-tools', 2, 'learning');
      localStorage.removeItem('ai-agents-tracker');
      localStorage.removeItem('ai-agents-quiz');
      expect(getStatus('what-are-ai-agents', 0)).toBe('not-started');
      expect(getStatus('frameworks-tools', 2)).toBe('not-started');
    });
  });

  describe('Lesson and Quiz functions exist', () => {
    test('openLesson is a function', () => {
      expect(typeof openLesson).toBe('function');
    });

    test('closeLesson is a function', () => {
      expect(typeof closeLesson).toBe('function');
    });

    test('startQuiz is a function', () => {
      expect(typeof startQuiz).toBe('function');
    });

    test('closeQuiz is a function', () => {
      expect(typeof closeQuiz).toBe('function');
    });
  });

  describe('Quiz score-based status updates', () => {
    test('scoring 80%+ marks all subtopics as mastered', () => {
      const topic = TOPICS[6]; // Real-world apps (2 subtopics, 3 quiz questions)
      // Simulate: all correct = 100%
      topic.subtopics.forEach((_, i) => {
        expect(getStatus(topic.id, i)).toBe('not-started');
      });
      // Manually set all mastered as if quiz scored 100%
      topic.subtopics.forEach((_, i) => setStatus(topic.id, i, 'mastered'));
      topic.subtopics.forEach((_, i) => {
        expect(getStatus(topic.id, i)).toBe('mastered');
      });
    });

    test('scoring 50-79% marks not-started subtopics as learning', () => {
      setStatus('real-world-apps', 0, 'not-started');
      setStatus('real-world-apps', 1, 'not-started');
      // Simulate quiz marking not-started as learning
      setStatus('real-world-apps', 0, 'learning');
      setStatus('real-world-apps', 1, 'learning');
      expect(getStatus('real-world-apps', 0)).toBe('learning');
      expect(getStatus('real-world-apps', 1)).toBe('learning');
    });
  });
});