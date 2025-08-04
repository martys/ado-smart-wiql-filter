# ADO Smart Filter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub top language](https://img.shields.io/github/languages/top/martys/ado-smart-wiql-filter)
![GitHub contributors](https://img.shields.io/github/contributors/martys/ado-smart-wiql-filter)
![GitHub issues](https://img.shields.io/github/issues/github/issues/martys/ado-smart-wiql-filter)
![GitHub forks](https://img.shields.io/github/forks/martys/ado-smart-wiql-filter?style=social)

Solving the frustrating limitations of Azure DevOps backlog filtering with a community-driven, smart search solution. This project aims to enhance Azure DevOps Boards with a robust, open-source filter, supporting advanced syntax and AI-powered natural language queries.

---

## 🌟 The Problem We're Solving

Azure DevOps Boards are incredibly powerful for managing work, but the built-in backlog and board filters often fall short for complex needs. They primarily offer basic keyword search and dedicated buttons for common fields (like State or Type). This means you **lack the ability to use advanced expressions** common in other powerful search tools, making it difficult to:

* Find items with specific **prefixes** or **wildcards** (e.g., `DAT* task` or `*user story`).
* Perform **exact phrase matches** (e.g., `"Critical Bug Fix"`).
* **Exclude** items based on specific criteria (e.g., `-tag:Blocked`).
* Search within **any work item field** (e.g., `tags:UI` or `priority:>2`).
* Combine **multiple complex conditions** (e.g., `assignedTo:currentUser AND createdDate:<"last month"`).
* Get **comprehensive results** when your backlog exceeds the loaded item limit (e.g., 1000 items), as client-side filtering won't find items outside this window.

This often forces users to create full WIQL queries outside the backlog view, disrupting their workflow.

## ✨ Our Solution: A Smarter Filter for ADO Boards

**ADO Smart Filter** provides a seamless, intuitive, and powerful search experience directly within Azure DevOps. We're building a hybrid filtering solution that brings advanced capabilities by supporting:

1.  **Mature, Structured Syntax for Advanced Expressions:** Empowering power users with SQL/filesystem-like precision for all work item fields, while also allowing quick, intuitive searches across common fields.
    * **Simple Phrase Search (Default Fields):** Just type your phrase. Automatically searches `Title`, `Description`, `Tags`, and `ID`.
        * `"User Authentication Flow"` (finds items with this exact phrase across default fields)
        * `DAT - task` (finds items containing these words across default fields)
    * **Wildcards:** Use `*` or `?` for partial matches. Can be applied to default fields (e.g., `bug* fix`) or explicit fields (e.g., `title:BugFix*`, `description:*user`, `name:J?hn`).
    * **Exclusions:** `-tag:Blocked`, `-assignedTo:unassigned`
    * **Ranges & Comparisons:** `storyPoints:5..10`, `createdDate:>"2025-01-01"`
    * **"Is Empty" / "Is Not Empty":** `description:empty`, `assignedTo:notempty`
    * **Relative Dates:** `created:"last month"`, `updated:today`
    * **Advanced Combinations:** `bugfix* AND assignedTo:me AND created:"last 2 weeks"`
2.  **AI-Powered Natural Language:** For effortless, conversational searching (e.g., "show me all open bugs I need to fix"), translating your plain language directly into powerful queries.

This project aims to demonstrate the immense value of such a feature and inspire Microsoft to introduce an official extensibility point for core filtering.

## 🚀 Getting Started (MVP - Proof of Concept)

This project is currently in active development. Our first goal is to build a robust proof-of-concept (PoC) that demonstrates the core filtering engine.

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn
* `tfx-cli` (Azure DevOps Extension CLI) for packaging: `npm install -g tfx-cli`
* An Azure DevOps Organization to test the extension.

### Setup & Running the Local PoC

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/martys/ado-smart-wiql-filter.git](https://github.com/martys/ado-smart-wiql-filter.git)
    cd ado-smart-wiql-filter
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Build the project:**
    ```bash
    npm run build
    ```
    *(Note: This command will be defined in your `package.json` later when you set up TypeScript compilation.)*
4.  **Run the local demo (for parser/WIQL generation):**
    *(You will set up a simple Node.js script or a basic web server to run the demo files from Phase 2/3.)*
    ```bash
    # Example: Running a test script for the parser
    # ts-node src/parser-test.ts
    ```

### How the Hybrid Filter Works (Concept)

Our intelligent frontend will:
1.  **Parse User Input:** Determine if the input matches our structured syntax or is natural language.
2.  **Generate WIQL:**
    * For **structured syntax**, it converts directly to precise WIQL.
    * For **natural language**, it makes a (simulated/actual) API call to an AI service (e.g., Azure OpenAI) which returns the WIQL.
3.  **Execute Server-Side Query:** The generated WIQL is sent to the Azure DevOps REST API (`wit/wiql` endpoint) to fetch exact results from the entire work item database.
4.  **Display Results:** The UI updates with the powerful, accurate search results.

## 💻 Core Technical Components

* **TypeScript:** The primary language for robust and maintainable code.
* **Structured Parser:** Converts syntax like `field:value` into structured filter clauses, including intelligent handling of default fields.
* **WIQL Generator:** Translates filter clauses into valid Azure DevOps WIQL queries.
* **AI Translator (Simulated):** A placeholder for integration with Natural Language Understanding (NLU) services to interpret conversational queries.
* **Azure DevOps REST API:** For executing WIQL queries and fetching work item details.

## 🤝 Contributing

We welcome contributions from the community! Whether you're a seasoned developer or just starting with open source, your help is valuable.

* **Found a bug?** Open an issue.
* **Have a feature idea?** Open an issue or start a discussion.
* **Want to contribute code?**
    1.  Fork the repository.
    2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
    3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
    4.  Push to the branch (`git push origin feature/AmazingFeature`).
    5.  Open a Pull Request.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 🗺️ Roadmap (Future Ideas)

* **Phase 1 MVP:** Core parser, WIQL generator, basic API integration, simple demo UI.
* **Phase 2 Hybrid:** Integration of AI natural language interpretation (simulated first, then real).
* **Phase 3 Extension:** Full packaging as an Azure DevOps custom hub extension.
* **Phase 4 Advanced UI:** Auto-completion, visual query builder, saved queries.
* **Phase 5 Community Features:** Testing framework, better error handling, more robust documentation.

## ©️ License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

* The Azure DevOps community for highlighting this persistent pain point.
* Google, GitHub, and Jira for pioneering intuitive search syntaxes.
* [Martynas](https://github.com/martys) - for starting this project.

---
