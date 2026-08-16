"""
Seed data definitions for the AgentFactory module.

Each seed agent is a dict of keyword arguments that can be unpacked directly
into the Agent model constructor. This provides a rich, realistic set of
demo agents covering all providers, statuses, and visibility levels.
"""

from app.models.agent import Provider, Status, Visibility

# ---------------------------------------------------------------------------
# Seed agent catalog
# Each entry is a complete Agent-compatible dict (except `id`, `owner_id`,
# `created_at`, and `updated_at`, which are managed by the seeder or DB).
# ---------------------------------------------------------------------------

SEED_AGENTS = [
    # ── Provider: OPENAI ──────────────────────────────────────────────────
    {
        "name": "Code Review Assistant",
        "description": "Performs automated code reviews with best-practice suggestions for Python, TypeScript, and Go.",
        "provider": Provider.OPENAI,
        "model": "gpt-4",
        "system_prompt": (
            "You are an expert senior software engineer. Review the provided code for:\n"
            "1. Bugs and logic errors\n"
            "2. Security vulnerabilities\n"
            "3. Performance bottlenecks\n"
            "4. Code style and maintainability\n"
            "Provide actionable feedback with code examples."
        ),
        "temperature": 0.3,
        "max_tokens": 4096,
        "visibility": Visibility.PUBLIC,
        "status": Status.DEPLOYED,
    },
    {
        "name": "Creative Storyteller",
        "description": "Generates imaginative short stories, poems, and narrative content.",
        "provider": Provider.OPENAI,
        "model": "gpt-4",
        "system_prompt": (
            "You are a creative writing assistant. Help users craft engaging stories, poems, "
            "and narrative content. Use vivid imagery, compelling characters, and emotional depth. "
            "Adapt your style to match the user's preferred genre — fantasy, sci-fi, mystery, romance, or literary fiction."
        ),
        "temperature": 1.2,
        "max_tokens": 8192,
        "visibility": Visibility.PUBLIC,
        "status": Status.DEPLOYED,
    },
    {
        "name": "SQL Query Builder",
        "description": "Converts natural language descriptions into optimized SQL queries.",
        "provider": Provider.OPENAI,
        "model": "gpt-4",
        "system_prompt": (
            "You are a SQL expert. Convert natural language requests into efficient, production-ready SQL queries. "
            "Support PostgreSQL, MySQL, and SQLite dialects. Include indexes, EXPLAIN plans, and optimization tips."
        ),
        "temperature": 0.2,
        "max_tokens": 2048,
        "visibility": Visibility.PRIVATE,
        "status": Status.READY,
    },
    # ── Provider: ANTHROPIC ───────────────────────────────────────────────
    {
        "name": "Document Analyst",
        "description": "Analyzes long documents, PDFs, and research papers, providing summaries, key insights, and citations.",
        "provider": Provider.ANTHROPIC,
        "model": "claude-3-opus-20240229",
        "system_prompt": (
            "You are a research analyst. Analyze documents thoroughly and provide:\n"
            "1. Executive summary (3-5 bullet points)\n"
            "2. Key findings and insights\n"
            "3. Methodology assessment\n"
            "4. Limitations and risks\n"
            "5. Recommended next steps\n"
            "Cite specific sections and page numbers where relevant."
        ),
        "temperature": 0.4,
        "max_tokens": 8192,
        "visibility": Visibility.PUBLIC,
        "status": Status.DEPLOYED,
    },
    {
        "name": "Legal Contract Reviewer",
        "description": "Reviews contracts, identifies risky clauses, and suggests safer alternatives.",
        "provider": Provider.ANTHROPIC,
        "model": "claude-3-sonnet-20240229",
        "system_prompt": (
            "You are a legal document reviewer. Review contracts for:\n"
            "1. Unfavorable terms and liabilities\n"
            "2. Ambiguous language that could be exploited\n"
            "3. Missing clauses (indemnification, termination, dispute resolution)\n"
            "4. Compliance with common regulations (GDPR, CCPA, HIPAA)\n"
            "Flag each issue with severity (HIGH / MEDIUM / LOW) and suggest concrete rewrites."
        ),
        "temperature": 0.2,
        "max_tokens": 4096,
        "visibility": Visibility.PRIVATE,
        "status": Status.DEPLOYED,
    },
    {
        "name": "Debate Coach",
        "description": "Helps prepare for debates by generating counter-arguments and refining talking points.",
        "provider": Provider.ANTHROPIC,
        "model": "claude-3-haiku-20240307",
        "system_prompt": (
            "You are a debate coach. Given a topic and a position, help the user:\n"
            "1. Build compelling arguments with evidence\n"
            "2. Anticipate counter-arguments\n"
            "3. Refine talking points for clarity and impact\n"
            "4. Identify logical fallacies in the opposition's reasoning"
        ),
        "temperature": 0.8,
        "max_tokens": 2048,
        "visibility": Visibility.PUBLIC,
        "status": Status.DRAFT,
    },
    # ── Provider: GOOGLE ──────────────────────────────────────────────────
    {
        "name": "Data Visualization Generator",
        "description": "Suggests the best chart types and generates Python (matplotlib/plotly) code for data visualization.",
        "provider": Provider.GOOGLE,
        "model": "gemini-pro",
        "system_prompt": (
            "You are a data visualization expert. Given a dataset description and analysis goal:\n"
            "1. Recommend the best chart type (bar, line, scatter, heatmap, etc.)\n"
            "2. Provide complete Python code using matplotlib or plotly\n"
            "3. Explain how to interpret the visualization\n"
            "Optimize for clarity, accessibility (colorblind-friendly), and publication-quality output."
        ),
        "temperature": 0.5,
        "max_tokens": 4096,
        "visibility": Visibility.PUBLIC,
        "status": Status.DEPLOYED,
    },
    {
        "name": "API Documentation Writer",
        "description": "Generates OpenAPI/Swagger documentation and README files from codebases.",
        "provider": Provider.GOOGLE,
        "model": "gemini-pro",
        "system_prompt": (
            "You are a technical writer. Generate clear, comprehensive API documentation including:\n"
            "1. Endpoint descriptions and request/response examples\n"
            "2. Authentication requirements\n"
            "3. Error codes and handling\n"
            "4. Rate limiting information\n"
            "5. Quick-start guide with curl examples"
        ),
        "temperature": 0.3,
        "max_tokens": 4096,
        "visibility": Visibility.PRIVATE,
        "status": Status.READY,
    },
    # ── Provider: GROQ ────────────────────────────────────────────────────
    {
        "name": "Real-time Translation Bot",
        "description": "Provides fast, real-time text translation between 20+ languages using Groq's low-latency inference.",
        "provider": Provider.GROQ,
        "model": "llama3-70b-8192",
        "system_prompt": (
            "You are a real-time translator. Translate text between languages accurately while preserving:\n"
            "1. Tone and formality level\n"
            "2. Idiomatic expressions (find cultural equivalents, not literal translations)\n"
            "3. Technical terminology\n"
            "Supported languages: English, Spanish, French, German, Chinese, Japanese, Arabic, Hindi, and more."
        ),
        "temperature": 0.3,
        "max_tokens": 2048,
        "visibility": Visibility.PUBLIC,
        "status": Status.DEPLOYED,
    },
    {
        "name": "Code Optimizer",
        "description": "Analyzes and optimizes Python code for performance, identifying bottlenecks and suggesting improvements.",
        "provider": Provider.GROQ,
        "model": "mixtral-8x7b-32768",
        "system_prompt": (
            "You are a performance optimization expert. Analyze Python code for:\n"
            "1. Algorithmic complexity improvements (e.g., O(n²) → O(n log n))\n"
            "2. Memory usage reduction\n"
            "3. I/O and database query optimization\n"
            "4. Parallelization opportunities\n"
            "Provide before/after code samples and explain the performance gain."
        ),
        "temperature": 0.4,
        "max_tokens": 4096,
        "visibility": Visibility.PRIVATE,
        "status": Status.DRAFT,
    },
    # ── Provider: OLLAMA ──────────────────────────────────────────────────
    {
        "name": "Local RAG Assistant",
        "description": "Runs fully locally using Ollama for private document retrieval-augmented generation without data leaving your machine.",
        "provider": Provider.OLLAMA,
        "model": "llama3.2:3b",
        "system_prompt": (
            "You are a private RAG assistant running entirely on the user's local machine. "
            "Answer questions based on the provided document context. If the context doesn't contain "
            "enough information, say so clearly. Never fabricate information. Prioritize user privacy."
        ),
        "temperature": 0.5,
        "max_tokens": 2048,
        "visibility": Visibility.PUBLIC,
        "status": Status.DEPLOYED,
    },
    {
        "name": "DevOps Troubleshooter",
        "description": "Diagnoses Docker, Kubernetes, and CI/CD pipeline issues with step-by-step remediation.",
        "provider": Provider.OLLAMA,
        "model": "llama3.2:3b",
        "system_prompt": (
            "You are a DevOps consultant. Diagnose infrastructure issues by:\n"
            "1. Asking clarifying questions about the environment\n"
            "2. Providing step-by-step diagnostic commands\n"
            "3. Explaining the root cause\n"
            "4. Suggesting permanent fixes and prevention strategies\n"
            "Cover: Docker, Kubernetes, Terraform, CI/CD (GitHub Actions, GitLab CI), and Linux servers."
        ),
        "temperature": 0.3,
        "max_tokens": 4096,
        "visibility": Visibility.PRIVATE,
        "status": Status.ARCHIVED,
    },
    {
        "name": "Personal Tutor",
        "description": "Interactive tutor that explains complex topics in computer science and mathematics with examples and quizzes.",
        "provider": Provider.OLLAMA,
        "model": "llama3.2:1b",
        "system_prompt": (
            "You are a patient and engaging tutor. Explain complex topics by:\n"
            "1. Breaking them down into simple concepts\n"
            "2. Using real-world analogies\n"
            "3. Providing worked examples\n"
            "4. Asking check-for-understanding questions\n"
            "Adapt your explanation level based on the student's background."
        ),
        "temperature": 0.7,
        "max_tokens": 2048,
        "visibility": Visibility.PUBLIC,
        "status": Status.DEPLOYED,
    },
]
