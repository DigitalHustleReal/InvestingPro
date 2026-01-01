# 🏦 INVESTINGPRO "AUTHORITY CMS" - MASTER ARCHITECTURE

## 🎯 OBJECTIVE
Transform the current CMS into an **Autonomous Editorial Board** that rivals **Investopedia** and **NerdWallet**.
The system will not just "write" articles; it will **Research, Plan, Draft, Critique, Fact-Check, and Schedule** them.

---

## 🏗️ 1. THE "MULTI-AGENT" PIPELINE
We will move from a linear script to a **Circular Ecosystem** of specialized AI Agents.

| Agent Role | Responsibility | Current Status | Missing |
|------------|----------------|----------------|---------|
| **🕵️ The Strategist** | Scans Google Trends, Competitors, and Keywords to find high-value topics. | ✅ Basic Script | ❌ Calendar Integration |
| **🧠 The Researcher** | Gathers data, stats, and quotes for the chosen topic. | ⚠️ Combined with Writer | ❌ Dedicated Step |
| **✍️ The Writer** | Drafts the article using the research data. | ✅ Robust (Gemini/Groq) | ✅ |
| **🧐 The Editor (Critic)** | Reviews the draft for SEO, tone, and accuracy.Scores it (0-100). | ❌ **MISSING** | **CRITICAL** |
| **📢 The Publisher** | Formats, adds images, and schedules the post. | ✅ Basic | ❌ Smart Scheduling |

---

## 💾 2. DATABASE SCHEMA UPGRADE (AUDIT)
To support this "Pro" workflow, we must upgrade the `articles` table.

### **Current Schema (Too Simple)**
- `status`: 'draft' | 'published'

### **Required "Authority" Schema**
- **`status`**: 'draft' → 'review' → 'scheduled' → 'published' → 'updating'
- **`quality_score`**: (0-100) - AI Auto-Score.
- **`editorial_notes`**: JSON field for AI feedback (e.g., *"Tone is too casual"*).
- **`difficulty_level`**: 'Beginner' | 'Intermediate' | 'Advanced'.
- **`checked_at`**: Last time the AI verified the stats (Auto-Update content).

---

## 🛡️ 3. ERROR HANDLING & ROBUSTNESS
**Current Issue**: If a script fails, the article likely dies or hangs.
**Pro Solution**: **State Machine Recovery**.
- If `Writer` fails → Status becomes `error_writing`.
- A "Rescue Cron" picks up `error_*` rows and retries with a different AI Provider.
- **Alerting**: Slack/Discord webhook on critical failures.

---

## 🎨 4. THE "DREAM" DASHBOARD (UI AUDIT)
The current List View is good, but for a Pipeline, we need a **Kanban Board**.

**Columns:**
1.  **Idea Pool** (From Strategist)
2.  **In Progress** (Writer Working)
3.  **In Review** (Editor Assessing) -> *Needs Human/AI Approval*
4.  **Scheduled**
5.  **Published**

---

## 📝 5. ACTION PLAN (WHAT I NEED TO BUILD)

### **Phase 1: The "Editor" Brain (Immediate)**
1.  Create `lib/agents/ai-editor.ts`.
2.  It takes a draft and returns: `{ score: 85, notes: ["Add more data"], verdict: "revise" }`.
3.  Update the **Content Factory** to use this Editor before publishing.

### **Phase 2: The "Kanban" UI**
1.  Build a Board View in `/admin/content-calendar`.
2.  Drag-and-drop to move from "Idea" to "Writer".

### **Phase 3: The "Deep" Researcher**
1.  Separate Research from Writing.
2.  researcher saves a "Brief" -> Writer reads "Brief" -> Writes Article.

---

## 🗣️ WHAT IS NEEDED FROM YOUR SIDE?
1.  **Approval**: To technically upgrade the Database Schema (Add `review` status, scores, notes).
2.  **Vision**: Do you want FULL automation (AI Editor auto-approves >90 score) or HUMAN gating (AI Editor sets to 'Pending Approval', you click 'Publish')?

*Recommendation: Start with **Human Gating**. Let the AI do 99% of the work, but you press the final button to ensure Brand Safety.*
