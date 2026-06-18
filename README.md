# 🌱 carbone — Carbon Footprint Companion for India

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Security](https://img.shields.io/badge/Security-Hardened-brightgreen)
![Accessibility](https://img.shields.io/badge/WCAG-AA_Compliant-brightgreen)
![Testing](https://img.shields.io/badge/Testing-Comprehensive-brightgreen)
![Local First](https://img.shields.io/badge/Architecture-Local--First-success)

### Track • Understand • Reduce

An India-first carbon footprint awareness platform that helps individuals understand, track, and reduce their environmental impact through personalized insights, local benchmarks, actionable recommendations, and an AI-powered sustainability advisor.

Built with privacy, accessibility, performance, and security at its core.

</div>

---

## 🎯 Challenge Alignment

This project addresses the challenge:

> Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

### How carbone Solves the Problem

| Challenge Requirement | carbone Solution |
|----------------------|------------------|
| Understand Carbon Footprint | Emission breakdowns, benchmarks, trends, and analytics |
| Track Carbon Footprint | Activity logging across transport, energy, food, and shopping |
| Reduce Carbon Footprint | Personalized recommendations and reduction actions |
| Personalized Insights | AI-powered EcoBot sustainability advisor |
| Carbon Awareness | India-specific sustainability education and benchmarks |

---

## ✨ Features

### 📊 Dashboard

Gain a complete understanding of your environmental impact.

- Total carbon footprint overview
- Emission category breakdown
- Visual analytics and charts
- National benchmark comparison
- Quick sustainability insights

### 📝 Activity Tracker

Track daily activities that contribute to emissions.

Categories include:

- 🚗 Transport
- ⚡ Home Energy
- 🍽️ Food
- 🛍️ Shopping

### 📈 Insights

Understand long-term behavior and trends.

- 6-month emissions trend
- Eco-score calculation
- Peak emission day analysis
- Historical performance tracking

### 🎯 Actions

Turn awareness into measurable improvements.

- 30+ sustainability recommendations
- Difficulty-based filtering
- Commitment tracking
- Practical reduction strategies

### 🤖 EcoBot AI Advisor

An AI-powered sustainability companion built with Google Gemini.

EcoBot provides:

- Personalized sustainability guidance
- India-specific recommendations
- Low-carbon alternatives
- Practical emission reduction suggestions

---

## 🏗️ Architecture

```mermaid
graph TD
    subgraph Client [Browser Client (React + TanStack Start)]
        UI[Dashboard & Tracker] --> LS[(Local Storage)]
        UI --> SF[Server Function]
    end

    subgraph Server [Secure Server Layer]
        SF --> ZV[Zod Validation]
        ZV --> RL[Rate Limiter]
        RL --> PS[PII Scrubber]
        PS --> GF[Secure Fetch Wrapper]
    end

    subgraph AI [AI Upstream]
        GF --> GM[Google Gemini API]
    end
```

### Architecture Highlights

✅ Local-first design

✅ Privacy-focused storage

✅ Secure server-side AI access

✅ Input validation and sanitization

✅ PII protection before AI processing

✅ Abuse prevention through rate limiting

---

## 🏆 Evaluation Criteria Mapping

### 1️⃣ Code Quality

carbone follows modern software engineering best practices.

#### Type Safety

- TypeScript Strict Mode enabled
- Strongly typed models and interfaces
- No unsafe runtime assumptions

#### Clean Architecture

- Modular folder structure
- Separation of concerns
- Reusable React components
- Shared utility layer

#### Functional Design

Carbon calculations are implemented as pure functions.

Benefits:

- Predictable outputs
- Easy testing
- High maintainability
- Reduced bugs

#### Code Standards

- ESLint enforced
- Consistent formatting
- Minimal technical debt
- Readable and maintainable codebase

---

### 2️⃣ Security

Security is implemented using a defense-in-depth approach.

#### API Key Protection

The Gemini API key is never exposed to the client.

- Server-only access
- Environment variable management
- Secret Manager compatible deployment

#### Input Validation

All requests pass through:

- Zod schema validation
- Type-safe parsing
- Request sanitization

#### PII Protection

Sensitive information is removed before AI processing.

Protected identifiers:

- Aadhaar numbers
- PAN numbers
- Email addresses
- Phone numbers

#### Rate Limiting

Per-IP protection:

```text
20 requests per minute
```

Prevents:

- Abuse
- Prompt flooding
- Resource exhaustion

#### XSS Protection

User-generated content is sanitized before rendering.

#### Resource Protection

Secure fetch wrapper includes:

- 10-second timeout
- 2 MB response limit
- Request cancellation support

#### Security Threat Matrix

| Threat | Mitigation |
|----------|------------|
| API Key Exposure | Server-side secret management |
| Prompt Abuse | Request rate limiting |
| PII Leakage | Automatic PII scrubbing |
| XSS | Input sanitization |
| Invalid Requests | Zod validation |
| Resource Exhaustion | Timeout and payload limits |

---

### 3️⃣ Efficiency

#### Local-First Architecture

Most user data remains on-device.

Stored locally:

- Activities
- Goals
- Dashboard state
- Progress tracking

Benefits:

- Instant loading
- Reduced network usage
- Offline resilience
- Better privacy

#### Performance Optimization

React optimizations include:

- useMemo
- useCallback
- Efficient state management

#### Lightweight Frontend

- Tailwind CSS v4
- SVG assets
- Minimal dependencies
- Optimized bundle size

#### Network Efficiency

Only AI interactions require server communication.

Tracking and analytics calculations execute locally.

---

### 4️⃣ Testing

Multiple layers of automated testing ensure reliability.

#### Unit Testing

Verifies:

- Carbon calculations
- Emission factors
- Edge cases
- Boundary conditions

#### Property-Based Testing

Uses fast-check to validate:

- Mathematical invariants
- Non-negative emissions
- Consistency guarantees

#### Accessibility Testing

Automated accessibility validation using:

- vitest-axe

#### Security Testing

Verifies:

- Sanitization behavior
- Validation logic
- Rate limiting functionality

#### Test Coverage Areas

| Area | Status |
|--------|--------|
| Carbon Calculations | ✅ |
| Edge Cases | ✅ |
| Property-Based Tests | ✅ |
| Accessibility Tests | ✅ |
| Security Validation | ✅ |

---

### 5️⃣ Accessibility

Target Standard:

**WCAG 2.1 AA**

#### Accessibility Features

##### Semantic HTML

Uses proper landmarks:

```html
<main>
<nav>
<section>
<aside>
```

##### Screen Reader Support

- Descriptive ARIA labels
- Accessible chart descriptions
- Landmark navigation

##### Keyboard Navigation

- Fully keyboard accessible
- Visible focus indicators
- Logical tab order

##### Reduced Motion Support

Respects:

```css
prefers-reduced-motion
```

##### Accessibility Validation

Tested using:

- vitest-axe
- Manual keyboard navigation checks

---

### 6️⃣ Problem Statement Alignment

carbone directly supports all challenge objectives.

#### Understand

Users can:

- View emission breakdowns
- Analyze trends
- Compare against benchmarks
- Understand emission sources

#### Track

Users can log:

- Transportation activities
- Home energy usage
- Food consumption
- Shopping behavior

#### Reduce

Users receive:

- Personalized recommendations
- Sustainability actions
- Reduction strategies
- Habit-building guidance

#### Personalized Insights

EcoBot provides:

- Context-aware recommendations
- Personalized sustainability coaching
- AI-assisted decision support

---

## 🇮🇳 India-First Design

Unlike generic carbon footprint calculators, carbone is designed specifically for Indian users.

### Localized Benchmarks

Includes:

- Indian electricity emission factors
- Indian lifestyle assumptions
- Average Indian carbon footprint benchmarks

### Localized Recommendations

EcoBot provides:

- India-specific sustainability alternatives
- Local transportation suggestions
- Practical low-carbon lifestyle improvements

---

## 🧪 Technology Stack

| Category | Technology |
|-----------|------------|
| Frontend | React 19 |
| Language | TypeScript |
| Router | TanStack Start |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Testing | Vitest |
| Accessibility Testing | vitest-axe |
| Property Testing | fast-check |
| AI Model | Gemini 2.0 Flash |
| Deployment | Google Cloud Run |

---

## 📂 Project Structure

```text
src/
├── components/
├── routes/
├── hooks/
├── lib/
│   ├── ecobot.functions.ts
│   ├── rate-limit.ts
│   ├── pii-scrub.ts
│   └── input-sanitizer.ts
├── utils/
│   └── carbonCalc.ts
├── types/
└── __tests__/
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js 22+

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Start Development Server

```bash
npm run dev
```

Application will run at:

```text
http://localhost:5173
```

### Run Tests

```bash
npm run test
```

### Run Linter

```bash
npm run lint
```

---

## ☁️ Deployment to Google Cloud Run

### Enable Required Services

```bash
gcloud services enable artifactregistry.googleapis.com run.googleapis.com
```

### Deploy

```bash
gcloud run deploy carbone \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars=NODE_ENV=production \
  --update-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest
```

### Secret Management

Store your Gemini API key securely in Google Secret Manager:

```text
GEMINI_API_KEY
```

before deploying.

---

## 🌍 Impact

carbone transforms carbon awareness into meaningful action.

Users can:

- Measure their environmental impact
- Understand major emission sources
- Track sustainable habits
- Receive personalized guidance
- Make informed low-carbon decisions

By combining accessibility, privacy, AI-powered recommendations, and India-specific sustainability insights, carbone helps individuals build more environmentally conscious lifestyles.

---

## 📜 License

Licensed under the MIT License.

---

<div align="center">

### 🌱 Built for India. Designed for Sustainability.

Helping individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

</div>
