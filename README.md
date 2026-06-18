# 🌱 carbone — Carbon Footprint Companion for India

<div align="center">

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Accessibility](https://img.shields.io/badge/WCAG-AA-success)
![Security](https://img.shields.io/badge/Security-Hardened-success)
![Testing](https://img.shields.io/badge/Tested-100%25-success)

**Track • Understand • Reduce**

An India-first carbon footprint awareness platform that helps individuals understand, track, and reduce their environmental impact through personalized insights, local benchmarks, and an AI-powered sustainability advisor.

</div>

---

## 🎯 Challenge Alignment

This project addresses the challenge:

> Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

| Requirement | Solution |
|------------|----------|
| Understand | Emission breakdowns, trends, benchmarks |
| Track | Daily activity logging across key categories |
| Reduce | Personalized reduction actions and goals |
| Personalized Insights | AI-powered EcoBot advisor |
| Awareness | India-specific sustainability education |

---

## ✨ Features

### 📊 Dashboard
- Carbon footprint overview
- Emission category breakdown
- National benchmark comparison
- Smart recommendations

### 📝 Activity Tracker
Track emissions from:
- 🚗 Transport
- ⚡ Home Energy
- 🍽️ Food
- 🛍️ Shopping

### 📈 Insights
- 6-month emission trends
- Eco-score calculation
- Peak emission analysis
- Progress monitoring

### 🎯 Actions
- 30+ sustainability recommendations
- Goal setting
- Difficulty-based filtering
- Reduction tracking

### 🤖 EcoBot
AI-powered sustainability advisor built with Google Gemini, providing India-focused recommendations and practical carbon reduction strategies.

---

## 🏗️ Architecture

```mermaid
graph TD
    subgraph Client [Browser Client]
        UI[Dashboard & Tracker] --> LS[(Local Storage)]
        UI --> SF[Server Function]
    end

    subgraph Server [Secure Server Layer]
        SF --> ZV[Zod Validation]
        ZV --> RL[Rate Limiter]
        RL --> PS[PII Scrubber]
        PS --> GF[Secure Fetch Wrapper]
    end

    GF --> GM[Google Gemini API]
