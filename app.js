const TOPICS = [
  {
    id: 'what-are-ai-agents',
    title: 'What Are AI Agents?',
    takeaway: 'AI agents are systems that perceive, reason, and act autonomously. They sit on a spectrum from simple reflexive responders to fully autonomous planners. Understanding the taxonomy helps you pick the right architecture for each use case.',
    subtopics: ['Core definition', 'Autonomy spectrum', 'Core components', 'Agent taxonomy'],
    lessons: [
      `<p>An AI agent is a system that uses an LLM as its "brain" to <strong>perceive, reason, act, and observe</strong> — autonomously pursuing goals with minimal human intervention. Unlike a simple LLM call that takes a prompt and returns a response, an agent operates in a loop: <em>Perceive → Reason → Act → Observe → (repeat)</em>.</p><p>The key distinction from chatbots is that a chatbot responds to a prompt and stops, while an agent decides <em>what to do next</em>, uses tools, checks results, and continues until the goal is met. This loop is what gives agents their autonomy and power.</p>`,
      `<p>Not all "agents" are equally autonomous. Anthropic draws a useful distinction: <strong>Workflows</strong> are systems where LLMs and tools are orchestrated through <em>predefined code paths</em> — the developer controls the flow. <strong>Agents</strong> are systems where LLMs <em>dynamically direct their own processes and tool usage</em>, maintaining control over how they accomplish tasks.</p><p>Don't reach for agents when a simpler pattern works. Many problems can be solved with a single well-prompted LLM call plus retrieval. Agents trade latency and cost for flexibility — only add complexity when you need it.</p>`,
      `<p>Every agent system has four essential modules (from Lilian Weng's foundational blog post): <strong>Planning</strong> — breaking complex tasks into subgoals and self-critiquing plans; <strong>Memory</strong> — short-term (in-context learning) and long-term (vector stores, databases); <strong>Tool Use</strong> — calling external APIs, code interpreters, search engines; and <strong>The Agent/Brain</strong> — the LLM itself, serving as the controller that orchestrates everything.</p><p>These four components interact in a feedback loop: the agent plans what to do, uses memory to recall relevant context, invokes tools to take actions, then observes the results and re-plans. Understanding these building blocks is essential for designing any agent system.</p>`,
      `<p>The agent taxonomy spans from simple to complex: <strong>Simple Reflex</strong> agents respond to current input only with no history (like rule-based chatbots). <strong>Model-Based Reflex</strong> agents maintain internal state (like smart thermostats). <strong>Goal-Based</strong> agents plan actions to achieve specific goals (like navigation agents). <strong>Utility-Based</strong> agents optimize across multiple outcomes (like trading bots). <strong>Learning Agents</strong> improve from experience (like recommendation systems). <strong>Hierarchical Agents</strong> decompose tasks across levels (like warehouse robotics).</p><p>The term "agent" is overloaded — when someone says "AI agent," clarify whether they mean a predefined workflow or a truly autonomous system. The difference matters for architecture, cost, and safety.</p>`
    ],
    quiz: [
      {
        question: 'What is the fundamental difference between a chatbot and an AI agent?',
        options: ['Agents use larger language models', 'Agents operate in a perceive-reason-act-observe loop and decide what to do next', 'Chatbots cannot use tools', 'Agents always require human supervision'],
        correct: 1,
        explanation: 'The core distinction is that a chatbot responds and stops, while an agent operates in an autonomous loop — perceiving, reasoning, acting, observing, and deciding what to do next until the goal is met.'
      },
      {
        question: 'According to Anthropic, what distinguishes a "Workflow" from an "Agent"?',
        options: ['Workflows use cheaper models; agents use expensive ones', 'Workflows have predefined code paths; agents dynamically direct their own processes', 'Workflows are single-turn; agents are multi-turn', 'Workflows cannot use tools; agents can'],
        correct: 1,
        explanation: 'Anthropic defines Workflows as systems where LLMs are orchestrated through predefined code paths (developer controls flow), while Agents dynamically direct their own processes and tool usage.'
      },
      {
        question: 'Which of the four core agent components is responsible for breaking complex tasks into subgoals?',
        options: ['Memory', 'Tool Use', 'Planning', 'The Agent/Brain'],
        correct: 2,
        explanation: 'Planning handles breaking complex tasks into subgoals, self-critiquing, and refining plans. Memory stores context, Tool Use invokes external capabilities, and the Brain orchestrates everything.'
      },
      {
        question: 'A smart thermostat that maintains internal state about the room temperature falls into which agent taxonomy category?',
        options: ['Simple Reflex', 'Model-Based Reflex', 'Goal-Based', 'Utility-Based'],
        correct: 1,
        explanation: 'A smart thermostat maintains an internal model of the world (room state) beyond just the current input, making it a Model-Based Reflex agent. Simple Reflex agents respond only to current input with no history.'
      }
    ]
  },
  {
    id: 'architecture-patterns',
    title: 'Agent Architecture Patterns',
    takeaway: 'ReAct interleaves thought and action; Plan-and-Execute separates planning from execution; LATS and Reflexion add self-reflection loops. Anthropic\'s 5 workflow patterns map cleanly to real production needs.',
    subtopics: ['ReAct', 'Plan-and-Execute', 'LATS', 'Reflexion', 'Anthropic\'s 5 workflow patterns'],
    lessons: [
      `<p><strong>ReAct (Reasoning + Acting)</strong> interleaves <em>Thought</em> (reasoning traces) with <em>Action</em> (tool calls) and <em>Observation</em> (environment feedback) in a loop. For example: "Thought: I need to find who invented Python → Action: Search['Python inventor'] → Observation: Python was created by Guido van Rossum → Thought: I now have the answer."</p><p>ReAct demonstrated that combining reasoning with acting produces better results than either alone. Reasoning helps target <em>what</em> to look up; acting provides the <em>actual information</em> that grounds the reasoning. Strengths: interpretable, grounded in observations, reduces hallucination. Weaknesses: can get stuck in loops; depends on tool quality.</p>`,
      `<p><strong>Plan-and-Execute</strong> decouples planning from execution. A planner LLM creates a multi-step plan upfront, then each step is executed — potentially by simpler or cheaper models. The pattern: (1) Planner creates a strategy, (2) Executor carries out each step, (3) Optionally re-plan based on results.</p><p>This is best for complex, multi-step tasks where you want to separate high-level strategy from low-level execution. It allows using a powerful model for planning and cheaper models for execution, optimizing cost and quality.</p>`,
      `<p><strong>LATS (Language Agent Tree Search)</strong> treats agent decision-making as a tree search problem. At each step, the agent explores multiple possible actions, evaluates them, and selects the best path — similar to <em>Monte Carlo Tree Search</em> in game AI. It generates multiple candidate actions, evaluates each using a value function or LLM judge, expands the most promising branches, and backtracks when paths fail.</p><p>Use LATS for tasks where exploration matters and mistakes are costly, such as code generation or strategic planning. The tree search approach lets agents recover from bad choices rather than committing to a single path.</p>`,
      `<p><strong>Reflexion</strong> enables agents to verbally reflect on their failures, store reflections in episodic memory, and use those reflections to improve on subsequent attempts — <em>without updating model weights</em>. The process: attempt task → receive evaluation → generate self-reflection ("I failed because I didn't check the database first") → store in memory → retrieve on next attempt.</p><p>Reflexion achieved 91% pass@1 on the HumanEval coding benchmark, surpassing GPT-4's 80%. The key insight is that <em>verbal reflections</em> serve as a form of "experience" that improves future attempts without fine-tuning.</p>`,
      `<p>Anthropic identified 5 production-proven workflow patterns: <strong>Prompt Chaining</strong> — decompose into sequential steps with programmatic gates between them. <strong>Routing</strong> — classify input, then route to specialized handlers. <strong>Parallelization</strong> — run multiple LLM calls simultaneously (sectioning or voting). <strong>Orchestrator-Workers</strong> — a central LLM dynamically decomposes and delegates tasks. <strong>Evaluator-Optimizer</strong> — one LLM generates, another evaluates in a loop until quality threshold is met.</p><p>Start with the simplest pattern that works. Most production systems use prompt chaining or routing, not full autonomous agents. Complexity should be earned, not assumed.</p>`
    ],
    quiz: [
      {
        question: 'In the ReAct pattern, what does "Observation" represent?',
        options: ['The agent\'s internal reasoning', 'The environment feedback after a tool call', 'The initial user prompt', 'The final answer'],
        correct: 1,
        explanation: 'Observation is the environment feedback received after taking an Action (tool call). It grounds the agent\'s reasoning in real information, reducing hallucination.'
      },
      {
        question: 'What is the primary advantage of Plan-and-Execute over ReAct?',
        options: ['It is always faster', 'It separates high-level strategy (powerful model) from execution (cheaper models)', 'It requires fewer tool calls', 'It eliminates the need for reasoning'],
        correct: 1,
        explanation: 'Plan-and-Execute decouples planning from execution, allowing a powerful/expensive model to create strategy while cheaper models handle execution — optimizing both cost and quality.'
      },
      {
        question: 'How does Reflexion improve agent performance without fine-tuning?',
        options: ['By increasing model parameters', 'By storing verbal self-reflections in memory that guide future attempts', 'By running multiple models in parallel', 'By using larger context windows'],
        correct: 1,
        explanation: 'Reflexion stores verbal self-reflections ("I failed because...") in episodic memory. On subsequent attempts, the agent retrieves relevant reflections to guide behavior — improving without any weight updates.'
      },
      {
        question: 'Which Anthropic workflow pattern uses a central LLM to dynamically break down and delegate tasks to worker LLMs?',
        options: ['Prompt Chaining', 'Routing', 'Orchestrator-Workers', 'Parallelization'],
        correct: 2,
        explanation: 'The Orchestrator-Workers pattern has a central LLM dynamically decompose tasks and delegate to worker LLMs. Unlike parallelization, subtasks aren\'t predetermined — the orchestrator decides what\'s needed.'
      },
      {
        question: 'Which pattern is best when you have distinct input categories that need different prompts or tools?',
        options: ['Prompt Chaining', 'Routing', 'Evaluator-Optimizer', 'LATS'],
        correct: 1,
        explanation: 'Routing classifies input and sends it to specialized handlers. This is ideal when distinct categories (like customer service topics) need different prompts, tools, or processing logic.'
      }
    ]
  },
  {
    id: 'frameworks-tools',
    title: 'Key Frameworks & Tools',
    takeaway: 'LangGraph gives you fine-grained graph control; CrewAI excels at role-based multi-agent teams; AutoGen enables flexible conversation patterns. No framework dominates — pick based on your team\'s skill set and use case complexity.',
    subtopics: ['LangChain/LangGraph', 'CrewAI', 'AutoGen', 'OpenAI Agents SDK', 'Semantic Kernel', 'OpenClaw', 'Comparison matrix'],
    lessons: [
      `<p><strong>LangChain</strong> is the most popular framework for building LLM applications, providing chains (sequential LLM calls), tools, memory, and retrieval abstractions. <strong>LangGraph</strong> extends it by modeling agent workflows as <em>directed graphs</em> where nodes are LLM calls or tool executions and edges define transitions — supporting cycles, conditional branching, and state persistence.</p><p>Strengths: huge ecosystem and extensive integrations. Weaknesses: complexity, abstraction layers that can obscure what's happening, steep learning curve. Best for complex multi-step workflows and production systems needing observability.</p>`,
      `<p><strong>CrewAI</strong> is a Python framework for orchestrating role-playing, autonomous AI agents. You define <strong>Agents</strong> with roles, goals, and backstories; <strong>Tasks</strong> with descriptions and expected outputs; then organize agents into <strong>Crews</strong> that execute tasks sequentially or hierarchically. <strong>Flows</strong> provide production-ready, event-driven workflow orchestration.</p><p>Strengths: simple mental model (agents as team members), built-in memory, clean separation of concerns. Best for multi-agent collaboration scenarios and teams of specialists working together.</p>`,
      `<p><strong>AutoGen</strong> (Microsoft) is a framework for building multi-agent conversational systems. Agents communicate through <em>conversations</em> (message passing), support human-in-the-loop participation, and can be configured with different LLMs, tools, and termination conditions. Its two-level architecture has Core (low-level, event-driven) and AgentChat (high-level, task-driven).</p><p>Strengths: excellent multi-agent conversations, human-proxy agents, flexible communication patterns. Best for research prototyping and collaborative problem-solving.</p>`,
      `<p><strong>OpenAI Agents SDK / Responses API</strong> is OpenAI's official tooling for building agents. The <strong>Responses API</strong> combines Chat Completions simplicity with tool-use capabilities. Built-in tools include web search, file search, and computer use (browser automation). The <strong>Agents SDK</strong> orchestrates single-agent and multi-agent workflows with tracing and handoffs.</p><p>Strengths: first-party, excellent model quality, built-in tools reduce glue code. Weaknesses: lock-in to OpenAI ecosystem. Best for OpenAI-centric stacks wanting batteries-included tooling.</p>`,
      `<p><strong>Semantic Kernel</strong> (Microsoft) is an SDK for integrating LLMs into applications with agents as a first-class concept. It uses <strong>Plugins</strong> as units of capability (functions + descriptions), <strong>Planners</strong> that decompose tasks into plugin invocations, and <strong>Memory</strong> connectors for vector stores. Language-agnostic: .NET, Python, Java.</p><p>Strengths: enterprise-grade, multi-language, strong Azure integration. Best for enterprise .NET/Java shops and Azure-centric organizations.</p>`,
      `<p><strong>OpenClaw</strong> is an agent platform that runs AI agents as personal assistants with tool-use capabilities, memory, and skill-based extensibility. Agents are long-running personal assistants with persistent memory. <strong>Skills</strong> are modular, installable capability packages (like apps on a phone). Supports multiple communication channels (WhatsApp, Discord, etc.) with built-in memory management, heartbeat scheduling, and cron tasks.</p><p>Emphasizes safety, human oversight, and practical tool integration. Best for personal AI assistants, lifestyle automation, and multi-channel agent deployment.</p>`,
      `<p>Comparing across key dimensions: <strong>LangGraph</strong> scores highest for graph-based control and production readiness but has a high learning curve. <strong>CrewAI</strong> balances multi-agent support with medium difficulty. <strong>OpenAI SDK</strong> has the lowest learning curve. <strong>Semantic Kernel</strong> offers multi-language support but steeper learning.</p><p>There's no "best" framework — it depends on your use case. For prototyping, start simple (raw API calls or OpenAI SDK). For production multi-agent systems, LangGraph or CrewAI are strong choices. For personal assistants, OpenClaw offers a unique skill-based model.</p>`
    ],
    quiz: [
      {
        question: 'What makes LangGraph different from standard LangChain?',
        options: ['LangGraph uses smaller models', 'LangGraph models workflows as directed graphs with cycles and conditional branching', 'LangGraph does not support tool use', 'LangGraph is only for single-agent systems'],
        correct: 1,
        explanation: 'LangGraph extends LangChain by modeling agent workflows as directed graphs where nodes are LLM calls/tool executions and edges define transitions — supporting cycles, conditional branching, and state persistence.'
      },
      {
        question: 'In CrewAI, what is the primary organizational unit for agents working together?',
        options: ['A Chain', 'A Graph', 'A Crew', 'A Conversation'],
        correct: 2,
        explanation: 'CrewAI organizes agents into Crews — teams that execute tasks sequentially or hierarchically. Each agent has a role, goal, and backstory, and crews coordinate to accomplish complex tasks.'
      },
      {
        question: 'Which framework emphasizes a "skill marketplace" model for agent extensibility?',
        options: ['LangGraph', 'AutoGen', 'Semantic Kernel', 'OpenClaw'],
        correct: 3,
        explanation: 'OpenClaw uses Skills — modular, installable capability packages similar to apps on a phone — as its extensibility model, creating a skill marketplace for agent capabilities.'
      },
      {
        question: 'Which framework is best suited for an enterprise .NET/Java organization already using Azure?',
        options: ['CrewAI', 'LangGraph', 'Semantic Kernel', 'OpenAI SDK'],
        correct: 2,
        explanation: 'Semantic Kernel is language-agnostic (.NET, Python, Java), enterprise-grade, and has strong integration with Azure/AI services — making it ideal for Azure-centric enterprise organizations.'
      }
    ]
  },
  {
    id: 'memory-context',
    title: 'Memory & Context',
    takeaway: 'Short-term memory handles the current conversation; long-term memory persists across sessions. Episodic memory stores experiences, semantic memory stores facts. The Generative Agents architecture shows how retrieval + reflection creates believable agents.',
    subtopics: ['Short-term memory', 'Long-term memory', 'Episodic memory', 'Semantic memory', 'Generative Agents architecture', 'Memory implementation patterns'],
    lessons: [
      `<p><strong>Short-term memory</strong> (working memory) is the current conversation context, recent actions, and observations. It's implemented through in-context learning (prompt stuffing) and sliding window buffers. The limitation: it's bounded by the context window size, and older information gets dropped as new information enters.</p><p>Think of it like your working memory while reading this paragraph — you can recall recent sentences, but details from the beginning start fading. The current ReAct trajectory (Thought → Action → Observation sequence) is a form of short-term memory.</p>`,
      `<p><strong>Long-term memory</strong> persists information across sessions — facts about users, past decisions, learned preferences. It's implemented using vector databases (Pinecone, Weaviate, ChromaDB), document stores, or structured databases. Retrieval uses <em>semantic search over embeddings</em> to find relevant memories.</p><p>For example, an agent with long-term memory remembers you prefer dark mode, your coding style, or that a past approach failed. Without it, every session starts from scratch — no personalization, no learning.</p>`,
      `<p><strong>Episodic memory</strong> records specific past experiences — entire interaction trajectories, not just facts. It stores complete action-observation sequences and retrieves them when similar situations arise. Reflexion uses episodic memory to store past failed attempts and reflections.</p><p>Think of episodic memory like your memory of a specific event: "When I tried debugging that login bug last week, the issue was a missing environment variable." It's experiential and contextual, not just factual.</p>`,
      `<p><strong>Semantic memory</strong> contains general knowledge and facts not tied to specific experiences. It's implemented through knowledge graphs, structured knowledge bases, and embedded documents. An agent "knowing" Python syntax without looking it up is semantic memory.</p><p>The key distinction from episodic memory: semantic memory is <em>what you know</em> (facts, concepts), episodic memory is <em>what you experienced</em> (events, sequences). Both are important — semantic for general knowledge, episodic for learned strategies.</p>`,
      `<p>The <strong>Generative Agents</strong> architecture (Park et al., 2023) from Stanford is one of the most influential memory designs. It has three key processes: <strong>Observation</strong> — agent perceives events; <strong>Reflection</strong> — periodically synthesizes observations into higher-level insights ("I've been working a lot — maybe I should take a break"); <strong>Retrieval</strong> — when deciding what to do next, retrieves memories using the formula: <em>Score = α·recency + β·importance + γ·relevance</em>.</p><p>This created surprisingly believable emergent behavior — agents autonomously organized a Valentine's Day party from a single seed suggestion. The most impactful innovation isn't storing information — it's <em>reflection</em>. Periodic synthesis of observations into higher-level insights dramatically improves decision quality.</p>`,
      `<p>For most applications, start simple with memory: <strong>Conversation buffer</strong> — store the last N messages. <strong>Summary memory</strong> — periodically summarize old messages, keep recent ones verbatim. <strong>Entity memory</strong> — track facts about specific entities (people, projects). <strong>Vector store memory</strong> — embed and retrieve semantically relevant past interactions.</p><p>Advanced patterns include hierarchical memory (short → medium → long-term), memory with decay (older memories score lower), and reflective memory (background processes that consolidate and re-index). Don't over-engineer — add complexity only when simpler approaches fall short.</p>`
    ],
    quiz: [
      {
        question: 'What is the primary limitation of short-term memory in agents?',
        options: ['It is too expensive to implement', 'It is bounded by the context window size and older information drops out', 'It cannot store tool call results', 'It requires a vector database'],
        correct: 1,
        explanation: 'Short-term memory is implemented via in-context learning and bounded by the context window. As new information enters, older information gets dropped — like how you forget the beginning of a long conversation.'
      },
      {
        question: 'In the Generative Agents memory retrieval formula (Score = α·recency + β·importance + γ·relevance), what does the "importance" component capture?',
        options: ['How recently the memory was created', 'How semantically similar the memory is to the query', 'How significant the memory is to the agent\'s life', 'How many times the memory has been accessed'],
        correct: 2,
        explanation: 'The importance component scores how significant a memory is to the agent (e.g., "met someone new" vs "walked down hallway"). Recency handles freshness, relevance handles semantic similarity, and importance captures significance.'
      },
      {
        question: 'What key insight from the Generative Agents paper most dramatically improves agent decision quality?',
        options: ['Using larger vector databases', 'Periodic reflection that synthesizes observations into higher-level insights', 'Storing every conversation verbatim', 'Using multiple LLMs for memory retrieval'],
        correct: 1,
        explanation: 'The paper showed that periodic reflection — synthesizing raw observations into higher-level insights — is the most impactful innovation. Reflection creates "I\'ve been working too much" from raw data, enabling better autonomous decisions.'
      },
      {
        question: 'Which type of memory stores complete action-observation sequences from past attempts?',
        options: ['Short-term memory', 'Semantic memory', 'Episodic memory', 'Summary memory'],
        correct: 2,
        explanation: 'Episodic memory records specific past experiences — entire interaction trajectories. Reflexion stores past failed attempts and reflections as episodic memory, retrieved when similar situations arise.'
      }
    ]
  },
  {
    id: 'tool-use',
    title: 'Tool Use & Function Calling',
    takeaway: 'Tools turn language models from chatbots into actors. The function calling protocol standardizes how models invoke external capabilities. MRKL systems combine reasoning and knowledge retrieval — tool selection and error handling are where most production bugs live.',
    subtopics: ['Why tools matter', 'Function calling protocol', 'Tool selection strategies', 'Error handling', 'MRKL systems'],
    lessons: [
      `<p>LLMs are powerful reasoners but limited by their training data. <strong>Tools bridge the gap</strong> between what the model <em>knows</em> and what it can <em>do</em>: Search APIs access current information; Code interpreters execute calculations; Database queries access proprietary data; APIs interact with external services (email, calendar); Browser automation navigates web pages.</p><p>Without tools, an LLM can only generate text. With tools, it becomes an actor in the world — the difference between <em>knowing about</em> weather and <em>checking</em> the weather.</p>`,
      `<p>Modern LLMs support structured <strong>function/tool calling</strong> through a four-step protocol: (1) <strong>Define tools</strong> — describe each tool's name, description, and input schema (JSON Schema); (2) <strong>Model decides</strong> — the LLM chooses whether and which tool to call, with what parameters; (3) <strong>Execute</strong> — your code runs the tool and returns the result; (4) <strong>Model continues</strong> — the LLM incorporates the result and decides next steps.</p><p>This protocol standardizes tool invocation across providers (OpenAI, Anthropic, Google). The LLM outputs structured tool calls rather than free-form text, making parsing reliable.</p>`,
      `<p><strong>Tool selection strategies</strong> include: <strong>Single tool</strong> — when only one is relevant (e.g., search). <strong>Router pattern</strong> — classify the query first, then select the appropriate tool. <strong>Parallel tool calls</strong> — call multiple independent tools simultaneously. <strong>Tool chain</strong> — output of one tool feeds into the next.</p><p>Choosing the right strategy matters: parallel calls reduce latency for independent operations, while chaining handles dependencies. Most agent frameworks handle this automatically, but understanding the patterns helps you design better tool interfaces.</p>`,
      `<p><strong>Error handling best practices</strong> are critical because tools are where most production bugs live: (1) <strong>Validate tool outputs</strong> — never trust external APIs blindly. (2) <strong>Retry with backoff</strong> — transient failures are common. (3) <strong>Graceful degradation</strong> — if a tool fails, explain and offer alternatives. (4) <strong>Timeout limits</strong> — prevent infinite loops from stuck calls. (5) <strong>Log everything</strong> — calls, inputs, outputs, and errors for debugging.</p><p>The best tool implementations anticipate failure modes and handle them gracefully, making the agent resilient rather than brittle.</p>`,
      `<p>The <strong>MRKL</strong> (Module, Reasoning, Knowledge, Language) framework from AI21 is an early formalization of tool-augmented LLMs. It combines: <strong>Expert modules</strong> — specialized tools (calculator, search, database); <strong>Reasoning</strong> — LLM decides which module to route to; <strong>Knowledge</strong> — external knowledge sources; <strong>Language</strong> — natural language interface.</p><p>Tool design is agent design. The quality and documentation of your tools determines agent quality more than prompt engineering. Write clear descriptions, define tight schemas, and handle errors gracefully.</p>`
    ],
    quiz: [
      {
        question: 'What is the fundamental reason tools are essential for AI agents?',
        options: ['They make LLM responses faster', 'They bridge the gap between what the model knows and what it can do', 'They reduce the cost of LLM calls', 'They replace the need for prompts'],
        correct: 1,
        explanation: 'LLMs are limited by their training data. Tools let agents access current information, execute code, query databases, and interact with the real world — turning a text generator into an actor.'
      },
      {
        question: 'In the function calling protocol, what happens after your code executes a tool and returns the result?',
        options: ['The conversation ends', 'The LLM incorporates the result and decides next steps', 'The tool result is stored in long-term memory only', 'A new conversation session begins'],
        correct: 1,
        explanation: 'After tool execution, the LLM receives the result, incorporates it into its reasoning, and decides next steps — which may include calling more tools or providing a final answer.'
      },
      {
        question: 'Which tool selection strategy is best when multiple independent operations need to happen?',
        options: ['Single tool', 'Router pattern', 'Parallel tool calls', 'Tool chain'],
        correct: 2,
        explanation: 'Parallel tool calls run multiple independent tools simultaneously, reducing latency. Tool chains are for dependent operations; routing classifies which single tool to use.'
      },
      {
        question: 'In MRKL systems, what does the "R" stand for and what is its role?',
        options: ['Retrieval — fetching documents from a database', 'Reasoning — the LLM deciding which module to route to', 'Rendering — displaying results to users', 'Routing — directing HTTP requests'],
        correct: 1,
        explanation: 'MRKL stands for Module, Reasoning, Knowledge, Language. The Reasoning component is the LLM deciding which expert module to route to based on the query.'
      }
    ]
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Systems',
    takeaway: 'Agents can communicate sequentially, in parallel, hierarchically, or through debate. Role assignment and clear contracts between agents reduce chaos. The key challenges are coordination overhead, error propagation, and knowing when a single agent suffices.',
    subtopics: ['Communication patterns (sequential, parallel, hierarchical, debate)', 'Role assignment', 'Key challenges'],
    lessons: [
      `<p>Multi-agent systems use four main <strong>communication patterns</strong>: <strong>Sequential</strong> (pipeline) — Agent A → B → C, each handling a stage (e.g., Researcher → Writer → Editor). <strong>Parallel</strong> (fan-out/fan-in) — multiple agents work simultaneously, results merged by a synthesizer (e.g., three reviewers evaluate code in parallel). <strong>Hierarchical</strong> — a manager agent decomposes tasks, delegates to specialists, synthesizes results (e.g., CrewAI's hierarchical process). <strong>Debate/Collaborative</strong> — agents discuss, challenge, and refine each other's outputs (e.g., AutoGen's multi-agent conversations).</p><p>Each pattern has tradeoffs: sequential is simple and debuggable, parallel reduces latency, hierarchical handles complexity, debate improves quality through scrutiny.</p>`,
      `<p><strong>Role assignment strategies</strong> include: <strong>Functional specialization</strong> — research agent, coding agent, review agent. <strong>Perspective diversity</strong> — optimist vs. critic, plaintiff vs. defendant. <strong>Skill-based</strong> — each agent has different tool access. <strong>Scale-based</strong> — manager uses GPT-4, workers use GPT-4o-mini (optimizing cost).</p><p>Clear role definitions prevent agents from duplicating work or contradicting each other. The best multi-agent systems have crisp contracts between agents — each knows its responsibilities and boundaries.</p>`,
      `<p><strong>Key challenges</strong> in multi-agent systems: <strong>Coordination overhead</strong> — more agents ≠ better results; coordination costs grow. <strong>Context loss</strong> — information gets lost between agent handoffs. <strong>Debugging complexity</strong> — hard to trace which agent made which decision. <strong>Cost multiplication</strong> — each agent call costs tokens; N agents = N× cost. <strong>Redundancy</strong> — agents may duplicate work or contradict each other.</p><p>Start with a single well-prompted agent. Add agents only when you can clearly articulate <em>why</em> one agent can't do the job. The CEO/orchestrator pattern is the most practical for most applications.</p>`
    ],
    quiz: [
      {
        question: 'Which multi-agent communication pattern is best for tasks where independent subtasks can run simultaneously?',
        options: ['Sequential (pipeline)', 'Parallel (fan-out/fan-in)', 'Hierarchical (CEO/orchestrator)', 'Debate/collaborative'],
        correct: 1,
        explanation: 'The parallel pattern runs multiple agents simultaneously on independent subtasks, then merges results — reducing latency. Sequential handles dependencies, hierarchical manages complexity, and debate improves through scrutiny.'
      },
      {
        question: 'In a "scale-based" role assignment strategy, what is the primary optimization goal?',
        options: ['Maximizing the number of agents', 'Using expensive models for all tasks', 'Cost optimization by using powerful models for complex tasks and cheaper models for simple ones', 'Ensuring all agents use the same model for consistency'],
        correct: 2,
        explanation: 'Scale-based assignment uses expensive models (GPT-4) for complex reasoning tasks and cheaper models (GPT-4o-mini) for routine work — optimizing cost without sacrificing quality where it matters.'
      },
      {
        question: 'What is the most practical multi-agent pattern for most real applications?',
        options: ['Debate with 5+ agents', 'Fully parallel fan-out', 'CEO/orchestrator pattern', 'No multi-agent pattern; use a single agent'],
        correct: 2,
        explanation: 'The CEO/orchestrator pattern is the most practical — a manager decomposes tasks and delegates to specialists. It handles complexity while maintaining coordination. However, many tasks don\'t need multi-agent at all.'
      }
    ]
  },
  {
    id: 'real-world-apps',
    title: 'Real-World Applications',
    takeaway: 'Coding assistants, research agents, and workflow automations are genuinely working today. Claims of fully autonomous businesses and self-improving agents remain mostly hype — focus on narrow, well-scoped problems where agents demonstrably outperform simpler approaches.',
    subtopics: ['What\'s working now', 'What\'s mostly hype'],
    lessons: [
      `<p><strong>What's working now (2024-2025):</strong> The most mature agent application is <strong>coding & software development</strong> — Cursor, GitHub Copilot, and Devin write, review, and debug code using a generation + execution + self-repair loop. <strong>Customer support</strong> agents (Intercom Fin, Zendesk AI) handle tickets with RAG + tool use and human escalation. <strong>Research & analysis</strong> agents (Perplexity, Elicit) perform multi-step search → extract → synthesize → cite. <strong>Sales & marketing</strong> agents generate personalized outreach. <strong>Finance</strong> agents handle market analysis with strict risk limits. <strong>Enterprise automation</strong> (UiPath, Zapier) enhances workflows with LLM reasoning.</p><p>The common pattern: the most successful applications combine LLM reasoning with <em>well-defined tool interfaces</em>. The magic isn't in autonomy — it's in having the right tools and guardrails.</p>`,
      `<p><strong>What's mostly hype:</strong> Fully autonomous agents for complex creative work — agents still struggle with long-horizon creative tasks. Claims of agents replacing entire job functions — they augment, not replace (for now). "Set it and forget it" agents — all production agents need monitoring, guardrails, and human oversight. Multi-agent systems for simple tasks — over-engineering when a well-prompted single agent suffices.</p><p>The pattern for separating real from hype: look for narrow, well-scoped problems with clear success metrics. If you can't define exactly what "success" looks like, the agent probably can't either.</p>`
    ],
    quiz: [
      {
        question: 'What is the most mature and proven agent application as of 2024-2025?',
        options: ['Fully autonomous business management', 'Coding & software development (generation + execution + self-repair)', 'Creative writing and novel generation', 'Self-improving agent systems'],
        correct: 1,
        explanation: 'Coding agents (Cursor, Copilot, Devin) are the most mature — the code generation + execution + self-repair loop works reliably because code has clear correctness criteria (tests pass or they don\'t).'
      },
      {
        question: 'What common pattern do the most successful real-world agent applications share?',
        options: ['They use the largest available models', 'They operate without any human oversight', 'They combine LLM reasoning with well-defined tool interfaces and guardrails', 'They replace entire job functions'],
        correct: 2,
        explanation: 'The magic isn\'t in autonomy — it\'s in having the right tools (well-defined interfaces) and the right guardrails. Successful agents are constrained and tool-augmented, not free-roaming.'
      },
      {
        question: 'Why are claims of "set it and forget it" agents considered mostly hype?',
        options: ['The technology isn\'t advanced enough yet', 'All production agents need monitoring, guardrails, and human oversight', 'Agents cannot run for more than a few minutes', 'API costs are too high for long-running agents'],
        correct: 1,
        explanation: 'Production agents inevitably encounter edge cases, errors, and situations requiring human judgment. All deployed agents need monitoring, guardrails, and human oversight — autonomous doesn\'t mean unmonitored.'
      }
    ]
  },
  {
    id: 'building-shipping',
    title: 'Building & Shipping Agents',
    takeaway: 'Evaluation must be automated and continuous — manual testing doesn\'t scale. Observability (traces, metrics) is non-negotiable for debugging agent loops. Cost management, safe deployment patterns, and guardrails separate toys from production systems.',
    subtopics: ['Evaluation', 'Observability', 'Cost management', 'Deployment', 'Safety'],
    lessons: [
      `<p><strong>Evaluation</strong> is the #1 challenge in agent development — you can't improve what you can't measure. Approaches: <strong>End-to-end metrics</strong> — does the agent accomplish the task? (completion rate, accuracy). <strong>Step-by-step evaluation</strong> — is each individual step correct? (trajectory evaluation). <strong>LLM-as-judge</strong> — use a stronger model to evaluate outputs. <strong>Human evaluation</strong> — gold standard but expensive. <strong>Automated test suites</strong> — predefined input-output pairs.</p><p>Best practices: build evals <em>before</em> you build the agent; test edge cases, not just happy paths; track both outcome quality and cost/latency; every bug fix should add a test case.</p>`,
      `<p><strong>Observability</strong> is non-negotiable for production agents. Log every LLM call (input, output, model, tokens, latency), every tool call (function, arguments, result, duration), agent reasoning traces (thoughts, plans), final outputs and user feedback, and all errors and retries. Tools include LangSmith, Langfuse (open-source), OpenAI Tracing, and Weights & Biases Weave.</p><p>Without observability, debugging agent behavior is like debugging a distributed system without logs — impossible. The agent loop means failures compound across steps.</p>`,
      `<p><strong>Cost management</strong> strategies: <strong>Model routing</strong> — use cheap models (GPT-4o-mini, Haiku) for easy steps; expensive models only when needed. <strong>Caching</strong> — cache identical LLM calls and tool results. <strong>Token budgeting</strong> — set max tokens per task; track spend per user/session. <strong>Prompt optimization</strong> — shorter prompts = fewer tokens = lower cost. <strong>Early termination</strong> — stop the agent loop when "good enough."</p><p>Typical costs: simple single-agent task $0.01-0.10; complex multi-agent workflow $0.10-1.00; long-running autonomous task $1-10+.</p>`,
      `<p><strong>Deployment</strong> considerations: <strong>Sandboxing</strong> — run agent code in isolated environments (Docker, Firecracker). <strong>Rate limiting</strong> — prevent runaway agents from making unlimited API calls. <strong>Human-in-the-loop</strong> — for critical decisions, require human approval. <strong>Idempotency</strong> — agent actions should be safely retryable. <strong>Graceful degradation</strong> — if the LLM is unavailable, fall back to simpler logic.</p><p>Production agents fail in ways that demos don't. Invest heavily in evals, observability, and safety before investing in features.</p>`,
      `<p><strong>Safety</strong> practices: <strong>Guardrails</strong> — input validation, output filtering, content safety checks. <strong>Permissions</strong> — agents should have minimum necessary access (least privilege). <strong>Audit trails</strong> — log every action for accountability. <strong>Cost limits</strong> — cap spending per task/session/user. <strong>Kill switches</strong> — ability to immediately stop a misbehaving agent. <strong>Prompt injection defense</strong> — validate and sanitize all external inputs before feeding to the LLM.</p><p>A reliable simple agent beats a flaky complex one. Safety isn't optional — it's what separates production systems from demos.</p>`
    ],
    quiz: [
      {
        question: 'Why is evaluation considered the #1 challenge in agent development?',
        options: ['Because LLMs are too expensive to evaluate', 'Because agent behavior is non-deterministic and failures compound across steps', 'Because users don\'t care about quality', 'Because there are no tools for evaluation'],
        correct: 1,
        explanation: 'Agent behavior is non-deterministic, and the agent loop means failures compound across steps. You can\'t improve what you can\'t measure — making systematic evaluation essential.'
      },
      {
        question: 'What cost management strategy uses cheap models for routine steps and expensive models only for complex reasoning?',
        options: ['Caching', 'Token budgeting', 'Model routing', 'Early termination'],
        correct: 2,
        explanation: 'Model routing directs easy steps to cheap models (GPT-4o-mini, Haiku) and reserves expensive models (GPT-4, Opus) for complex reasoning — optimizing cost without sacrificing quality where it matters.'
      },
      {
        question: 'Which deployment pattern ensures agent actions can be safely retried without side effects?',
        options: ['Rate limiting', 'Sandboxing', 'Idempotency', 'Human-in-the-loop'],
        correct: 2,
        explanation: 'Idempotency means performing the same action multiple times produces the same result. This makes agent actions safely retryable — critical when network errors or timeouts require re-execution.'
      },
      {
        question: 'What is the recommended approach to building evals for an agent?',
        options: ['Build evals after the agent is complete', 'Build evals before building the agent', 'Skip evals and rely on user feedback', 'Only evaluate the final output'],
        correct: 1,
        explanation: 'Build evals BEFORE the agent. This forces you to define what success looks like upfront, enables test-driven development, and ensures you can measure improvement from day one.'
      }
    ]
  },
  {
    id: 'business-opportunities',
    title: 'Business Opportunities',
    takeaway: 'Vertical agents (deep in one domain) beat horizontal wrappers every time. Agent-as-a-Service and skill marketplaces are emerging models. The biggest wins come from building deep domain expertise, not from thin API wrappers around frontier models.',
    subtopics: ['Vertical agents', 'Agent-as-a-Service', 'Skill marketplaces', 'Infrastructure & tooling', 'Building vs wrapping'],
    lessons: [
      `<p><strong>Vertical agents</strong> with deep domain expertise are the most profitable opportunity. The thesis: general-purpose agents are cool, but domain-specific agents win. Examples: healthcare (medical coding, clinical trial matching), legal (contract review, legal research), finance (bookkeeping, compliance), real estate (property research, document prep), education (tutoring, grading).</p><p>Why vertical wins: domain-specific data, regulations, and workflows create <em>moats</em>. A legal agent trained on case law has an unfair advantage over a generalist. The AI agent market was valued at over $5 billion in 2024, projected to grow to $52 billion by 2030.</p>`,
      `<p><strong>Agent-as-a-Service</strong> is a business model where you build an agent that performs a specific function and charge per-use or subscription. Examples: customer support agent ($/conversation), sales development agent ($/qualified lead), data analysis agent ($/report), content generation agent ($/article).</p><p>Key pricing insight: <strong>outcome-based pricing</strong> (pay for results, not API calls) is more compelling than usage-based pricing. Customers care about solved problems, not tokens consumed.</p>`,
      `<p><strong>Skill/plugin marketplaces</strong> represent the "app store" model for agents. Build specialized capabilities that agents can use across platforms: OpenAI's GPT Store, CrewAI's skill ecosystem, OpenClaw's skill marketplace, or custom integrations connecting Agent X to System Y.</p><p>The agent ecosystem will need thousands of specialized tools. If you build the best tool for a specific task, every agent platform becomes a distribution channel.</p>`,
      `<p><strong>Infrastructure & tooling</strong> — don't build agents, build what agents need. Opportunities: <strong>Observability</strong> (Langfuse, LangSmith competitors), <strong>Evaluation frameworks</strong> (automated testing), <strong>Memory systems</strong> (better vector stores), <strong>Safety tools</strong> (prompt injection detection), <strong>Deployment platforms</strong> (hosting, scaling), <strong>Agent orchestration</strong> (multi-agent coordination).</p><p>Infrastructure has higher moats and is more defensible than application-layer wrappers. The picks-and-shovels strategy during a gold rush.</p>`,
      `<p><strong>Building vs wrapping</strong> — the key question: are you building <em>on top of</em> foundation models (wrapper) or building <em>novel infrastructure</em> (platform)? <strong>Wrappers</strong> (apps on top of LLMs) are fast to build, have low moat, and are vulnerable to model updates. <strong>Platforms</strong> (infrastructure for agents) are slower to build, have higher moat, and are defensible.</p><p>Strategy: start as a wrapper to validate demand, then build infrastructure moats (data, integrations, domain expertise). General-purpose agents will be commoditized — the money is in specificity and distribution.</p>`
    ],
    quiz: [
      {
        question: 'Why do vertical agents (domain-specific) tend to outperform general-purpose agents as businesses?',
        options: ['They use more powerful models', 'Domain-specific data, regulations, and workflows create competitive moats', 'They are cheaper to build', 'They don\'t need any training data'],
        correct: 1,
        explanation: 'Vertical agents build moats through domain-specific data, regulatory knowledge, and workflow expertise. A legal agent trained on case law has an unfair advantage over a generalist — this moat is hard to replicate.'
      },
      {
        question: 'What pricing model is most compelling for Agent-as-a-Service?',
        options: ['Per API call / token consumed', 'Flat monthly subscription only', 'Outcome-based pricing (pay for results)', 'Free with ads'],
        correct: 2,
        explanation: 'Outcome-based pricing (pay per conversation resolved, per qualified lead) aligns costs with value. Customers care about solved problems, not tokens consumed.'
      },
      {
        question: 'What is the recommended strategy for the "building vs wrapping" dilemma?',
        options: ['Always build infrastructure from day one', 'Always stay as a thin wrapper', 'Start as a wrapper to validate demand, then build infrastructure moats', 'Avoid both and use open-source only'],
        correct: 2,
        explanation: 'Start as a wrapper to validate demand quickly, then transition to building infrastructure moats (data, integrations, domain expertise). This combines speed-to-market with long-term defensibility.'
      },
      {
        question: 'Which business opportunity follows the "picks and shovels" strategy during a gold rush?',
        options: ['Vertical agents for healthcare', 'Agent-as-a-Service for customer support', 'Infrastructure & tooling (observability, evaluation, memory systems)', 'Skill marketplace listings'],
        correct: 2,
        explanation: 'Building infrastructure (observability, evals, memory, safety tools) is the picks-and-shovels play — you\'re building what all agents need, regardless of which specific agents win. Higher moats, more defensible.'
      }
    ]
  },
  {
    id: 'future-directions',
    title: 'Future Directions',
    takeaway: 'Capabilities are expanding exponentially while costs drop — making previously impossible use cases viable each year. Multi-agent orchestration is maturing toward an "app store moment." The safest bet: invest in fundamentals that survive any model swap.',
    subtopics: ['Capability trends', 'Cost trends', 'Multi-agent maturation', 'Safety', 'App store moment', 'What to learn now'],
    lessons: [
      `<p><strong>Capability trends:</strong> Better reasoning models (o1, o3, Claude's extended thinking) enable more reliable planning. <strong>Multimodal agents</strong> (vision, audio) will interact with the world more naturally. <strong>Computer use agents</strong> (OpenAI CUA, Anthropic) will operate GUIs like humans — clicking, typing, and navigating software designed for people.</p><p>The trajectory: agents are moving from text-only reasoning to perceiving and acting across all modalities humans use, dramatically expanding what's possible.</p>`,
      `<p><strong>Cost trends:</strong> Smaller, faster models are getting surprisingly good at tasks previously requiring frontier models. <strong>Model routing</strong> will become standard practice — use the cheapest model that works for each step. Caching and optimization will reduce costs 10-100x over time.</p><p>This cost reduction is the key enabler: many agent use cases are technically possible today but economically impractical. As costs drop 10-100x, entire categories of applications become viable.</p>`,
      `<p><strong>Multi-agent maturation</strong> is heading toward standard protocols for inter-agent communication (like <em>MCP</em> — Model Context Protocol — for tools). We'll see agent marketplaces where specialized agents are discovered and composed. "Agent swarms" for large-scale parallel tasks will become practical as coordination overhead decreases.</p><p>The analogy: where we are now is like the early web before HTTP standardization. Once communication protocols mature, composability explodes — just as APIs enabled the modern software ecosystem.</p>`,
      `<p><strong>Safety</strong> is critically underfunded relative to capability development. Expect regulation: agent actions will need audit trails, consent mechanisms, and liability frameworks. Alignment techniques (constitutional AI, RLHF) must extend to agentic settings where agents take real actions in the world.</p><p>The challenge: current safety research focuses on single-turn interactions, but agents operate in loops with accumulated effects. A misaligned agent making thousands of small decisions can cause significant harm without any single decision being obviously wrong.</p>`,
      `<p>The <strong>"App Store" moment</strong> for agents is coming: agent platforms will have distribution similar to mobile app stores. Skill/plugin ecosystems will create new developer economies. The best agents will combine multiple modalities, tools, and domain knowledge into seamless experiences.</p><p>This mirrors the mobile revolution: first came the platform (iPhone), then the distribution channel (App Store), then the explosion of specialized apps. We're somewhere between the platform and the distribution channel phase for agents.</p>`,
      `<p><strong>What to learn now</strong> to be ahead in 2-3 years: (1) <strong>Agent design patterns</strong> — ReAct, Plan-and-Execute, Reflexion deeply (they're the building blocks). (2) <strong>Evaluation methodology</strong> — rigorously testing agent systems (this is the bottleneck). (3) <strong>Tool design</strong> — clean, well-documented tool interfaces. (4) <strong>Domain expertise</strong> — pick an industry and learn it deeply. (5) <strong>Safety & alignment</strong> — prompt injection, jailbreaking, defense. (6) <strong>Systems thinking</strong> — agents are systems, not prompts. (7) <strong>MCP</strong> — Model Context Protocol, an emerging standard. (8) <strong>Practical building</strong> — ship agents, learn from failures.</p>`
    ],
    quiz: [
      {
        question: 'What is the key enabler that will make many currently-impractical agent use cases viable?',
        options: ['Larger language models', 'Government regulation', 'Cost reduction (10-100x) through better models, routing, and caching', 'More programming frameworks'],
        correct: 2,
        explanation: 'Many use cases are technically possible today but economically impractical. As costs drop 10-100x through better small models, model routing, and caching, entire categories become viable.'
      },
      {
        question: 'What is the current state of agent safety research relative to capability development?',
        options: ['Safety research is overfunded', 'Safety and capability are equally funded', 'Safety is critically underfunded', 'Safety research is unnecessary'],
        correct: 2,
        explanation: 'Safety research is critically underfunded relative to capability development. Current safety research focuses on single-turn interactions, but agents operate in loops with accumulated effects — a significant gap.'
      },
      {
        question: 'Which emerging standard for tool connectivity is likely to be important for agents?',
        options: ['REST API', 'GraphQL', 'MCP (Model Context Protocol)', 'SOAP'],
        correct: 2,
        explanation: 'MCP (Model Context Protocol) is an emerging standard for tool connectivity that enables standardized tool integration across agent platforms — similar to how HTTP standardized web communication.'
      },
      {
        question: 'What is the most practical advice for staying ahead in the agent field over the next 2-3 years?',
        options: ['Wait for the best framework to emerge', 'Focus exclusively on the largest models', 'Invest in fundamentals (design patterns, evaluation, tool design) that survive any model swap', 'Only learn one specific framework deeply'],
        correct: 2,
        explanation: 'Fundamentals like design patterns, evaluation methodology, tool design, and systems thinking survive any model swap. Frameworks and models will change, but these building blocks remain valuable.'
      }
    ]
  }
];

const STATES = ['not-started', 'learning', 'mastered'];

// ==================== State Management ====================

function getState() {
  try {
    return JSON.parse(localStorage.getItem('ai-agents-tracker') || '{}');
  } catch { return {}; }
}

function saveState(state) {
  localStorage.setItem('ai-agents-tracker', JSON.stringify(state));
}

function getQuizState() {
  try {
    return JSON.parse(localStorage.getItem('ai-agents-quiz') || '{}');
  } catch { return {}; }
}

function saveQuizState(state) {
  localStorage.setItem('ai-agents-quiz', JSON.stringify(state));
}

function getStatus(topicId, subIdx) {
  const state = getState();
  return state[`${topicId}-${subIdx}`] || 'not-started';
}

function setStatus(topicId, subIdx, status) {
  const state = getState();
  state[`${topicId}-${subIdx}`] = status;
  saveState(state);
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

// ==================== Rendering ====================

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

  const quizState = getQuizState();

  container.innerHTML = TOPICS.map((topic, tIdx) => {
    const prog = getTopicProgress(topic);
    const isMastered = prog.mastered === prog.total;
    const wasExpanded = expandedState[topic.id] !== undefined ? expandedState[topic.id] : true;

    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (prog.percent / 100) * circumference;
    const circleColor = isMastered ? 'var(--mastered)' : prog.learning ? 'var(--learning)' : 'var(--not-started)';

    const topicQuiz = quizState[topic.id];
    const quizScoreHTML = topicQuiz ? `<span class="quiz-score-badge">Quiz: ${topicQuiz.score}/${topic.quiz.length}</span>` : '';

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
            <button class="quiz-btn" onclick="event.stopPropagation(); startQuiz('${topic.id}')">📝 Take Quiz</button>
            ${quizScoreHTML}
            ${topic.subtopics.map((sub, sIdx) => {
              const status = getStatus(topic.id, sIdx);
              const badgeClass = status === 'mastered' ? 'badge-ms' : status === 'learning' ? 'badge-ln' : 'badge-ns';
              const badgeText = status === 'mastered' ? '✓ Mastered' : status === 'learning' ? '⟳ Learning' : '○ Not Started';
              const nameClass = status === 'mastered' ? ' mastered-text' : status === 'learning' ? ' learning-text' : '';
              const rowClass = status === 'mastered' ? ' mastered-row' : '';
              return `
                <div class="subtopic-row${rowClass}" onclick="openLesson('${topic.id}', ${sIdx})">
                  <div class="status-btns">
                    <button class="status-btn ns${status === 'not-started' ? ' active' : ''}" onclick="event.stopPropagation(); setStatus('${topic.id}', ${sIdx}, 'not-started'); render();" title="Not Started"></button>
                    <button class="status-btn ln${status === 'learning' ? ' active' : ''}" onclick="event.stopPropagation(); setStatus('${topic.id}', ${sIdx}, 'learning'); render();" title="Learning"></button>
                    <button class="status-btn ms${status === 'mastered' ? ' active' : ''}" onclick="event.stopPropagation(); setStatus('${topic.id}', ${sIdx}, 'mastered'); render();" title="Mastered"></button>
                  </div>
                  <span class="subtopic-name${nameClass}">${sub}</span>
                  <span class="subtopic-badge ${badgeClass}">${badgeText}</span>
                  <span class="lesson-icon">📖</span>
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

// ==================== Lesson Overlay ====================

function openLesson(topicId, subIdx) {
  const topic = TOPICS.find(t => t.id === topicId);
  if (!topic || !topic.lessons || !topic.lessons[subIdx]) return;

  const overlay = document.getElementById('lessonOverlay');
  const title = document.getElementById('lessonTitle');
  const content = document.getElementById('lessonContent');
  const actions = document.getElementById('lessonActions');

  title.textContent = `${topic.subtopics[subIdx]}`;
  content.innerHTML = topic.lessons[subIdx];
  actions.innerHTML = `
    <button class="lesson-btn lesson-learned" onclick="markLesson('${topicId}', ${subIdx}, 'learning')">⟳ Mark as Learning</button>
    <button class="lesson-btn lesson-mastered" onclick="markLesson('${topicId}', ${subIdx}, 'mastered')">✓ Mark as Mastered</button>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLesson() {
  document.getElementById('lessonOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function markLesson(topicId, subIdx, status) {
  setStatus(topicId, subIdx, status);
  render();
  closeLesson();
  if (status === 'mastered') {
    const topic = TOPICS.find(t => t.id === topicId);
    const prog = getTopicProgress(topic);
    if (prog.mastered === prog.total) {
      showCelebration(topic.title);
    }
  }
}

// ==================== Quiz System ====================

let currentQuiz = null;

function startQuiz(topicId) {
  const topic = TOPICS.find(t => t.id === topicId);
  if (!topic || !topic.quiz) return;

  currentQuiz = {
    topicId,
    topic,
    questions: topic.quiz,
    current: 0,
    score: 0,
    answers: []
  };

  showQuizQuestion();
}

function showQuizQuestion() {
  if (!currentQuiz) return;
  const q = currentQuiz.questions[currentQuiz.current];
  const overlay = document.getElementById('quizOverlay');
  const content = document.getElementById('quizContent');

  content.innerHTML = `
    <div class="quiz-header">
      <span class="quiz-topic-name">${currentQuiz.topic.title}</span>
      <span class="quiz-progress-label">Question ${currentQuiz.current + 1} of ${currentQuiz.questions.length}</span>
    </div>
    <div class="quiz-progress-bar-container">
      <div class="quiz-progress-bar" style="width: ${((currentQuiz.current) / currentQuiz.questions.length) * 100}%"></div>
    </div>
    <h3 class="quiz-question">${q.question}</h3>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-option" onclick="answerQuiz(${i})">${opt}</button>
      `).join('')}
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function answerQuiz(selected) {
  if (!currentQuiz) return;
  const q = currentQuiz.questions[currentQuiz.current];
  const correct = selected === q.correct;

  if (correct) currentQuiz.score++;
  currentQuiz.answers.push({ selected, correct: q.correct, isCorrect: correct });

  const content = document.getElementById('quizContent');
  content.innerHTML = `
    <div class="quiz-header">
      <span class="quiz-topic-name">${currentQuiz.topic.title}</span>
      <span class="quiz-progress-label">Question ${currentQuiz.current + 1} of ${currentQuiz.questions.length}</span>
    </div>
    <div class="quiz-progress-bar-container">
      <div class="quiz-progress-bar" style="width: ${((currentQuiz.current + 1) / currentQuiz.questions.length) * 100}%"></div>
    </div>
    <h3 class="quiz-question">${q.question}</h3>
    <div class="quiz-options">
      ${q.options.map((opt, i) => {
        let cls = 'quiz-option';
        if (i === q.correct) cls += ' quiz-correct-answer';
        else if (i === selected && !correct) cls += ' quiz-wrong-answer';
        else cls += ' quiz-dimmed';
        return `<button class="${cls}" disabled>${opt}</button>`;
      }).join('')}
    </div>
    <div class="quiz-feedback ${correct ? 'feedback-correct' : 'feedback-incorrect'}">
      <strong>${correct ? '✅ Correct!' : '❌ Incorrect'}</strong>
      <p>${q.explanation}</p>
    </div>
    <button class="quiz-next-btn" onclick="${currentQuiz.current + 1 < currentQuiz.questions.length ? 'showQuizQuestion()' : 'finishQuiz()'}">
      ${currentQuiz.current + 1 < currentQuiz.questions.length ? 'Next Question →' : 'See Results →'}
    </button>
  `;

  currentQuiz.current++;
}

function finishQuiz() {
  if (!currentQuiz) return;
  const { topicId, topic, score, questions, answers } = currentQuiz;
  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  // Save quiz results
  const quizState = getQuizState();
  quizState[topicId] = { score, total, pct, answers, date: new Date().toISOString() };
  saveQuizState(quizState);

  // Update subtopic statuses based on performance
  const subtopicCount = topic.subtopics.length;
  if (pct >= 80) {
    topic.subtopics.forEach((_, i) => setStatus(topicId, i, 'mastered'));
  } else if (pct >= 50) {
    topic.subtopics.forEach((_, i) => {
      if (getStatus(topicId, i) === 'not-started') setStatus(topicId, i, 'learning');
    });
  }
  // < 50%: leave as-is (or not-started)

  const content = document.getElementById('quizContent');
  let emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚';
  let message = pct >= 80 ? 'Outstanding! You\'ve demonstrated mastery!' :
                pct >= 50 ? 'Good progress! Keep learning to reach mastery.' :
                'Keep studying! Review the lessons and try again.';

  content.innerHTML = `
    <div class="quiz-results">
      <div class="quiz-results-emoji">${emoji}</div>
      <h2>Quiz Complete!</h2>
      <div class="quiz-results-score">${score} / ${total}</div>
      <div class="quiz-results-pct">${pct}%</div>
      <p class="quiz-results-msg">${message}</p>
      <div class="quiz-results-breakdown">
        ${answers.map((a, i) => `
          <div class="quiz-result-item ${a.isCorrect ? 'result-correct' : 'result-incorrect'}">
            <span>${a.isCorrect ? '✅' : '❌'}</span> Q${i + 1}
          </div>
        `).join('')}
      </div>
      <div class="quiz-results-actions">
        <button class="quiz-btn-retake" onclick="startQuiz('${topicId}')">🔄 Retake Quiz</button>
        <button class="quiz-btn-close" onclick="closeQuiz()">✓ Done</button>
      </div>
    </div>
  `;

  currentQuiz.current = total; // prevent re-answering
}

function closeQuiz() {
  document.getElementById('quizOverlay').classList.remove('active');
  document.body.style.overflow = '';
  currentQuiz = null;
  render();
}

// ==================== Celebration ====================

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

// ==================== Event Listeners ====================

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.add('active');
});

document.getElementById('cancelReset').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('active');
});

document.getElementById('confirmReset').addEventListener('click', () => {
  localStorage.removeItem('ai-agents-tracker');
  localStorage.removeItem('ai-agents-quiz');
  document.getElementById('modalOverlay').classList.remove('active');
  render();
});

document.getElementById('closeCelebration').addEventListener('click', () => {
  document.getElementById('celebration').classList.remove('active');
});

// Swipe support for quiz
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (!currentQuiz) return;
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2) {
    if (dx < 0 && currentQuiz.current < currentQuiz.questions.length) {
      // Swipe left - could advance, but we require answer first
    }
  }
}, { passive: true });

// Initial render
render();