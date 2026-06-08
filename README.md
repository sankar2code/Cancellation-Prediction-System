# Foresight — Hotel Booking Cancellation Prediction System

URL - https://sankar.work/Cancellation-Prediction-System/ 

> Interactive, high‑fidelity UI mockups generated from `HotelBooking-PRD.pdf`.
> A revenue‑manager workspace that scores every new booking for cancellation risk in real time, explains the drivers, and recommends the intervention that protects revenue — *before the guest cancels.*

![status](https://img.shields.io/badge/status-interactive%20mockup-4f46e5)
![build](https://img.shields.io/badge/build-zero--build-22c55e)
![stack](https://img.shields.io/badge/stack-HTML%20·%20Tailwind%20·%20Chart.js%20·%20Lucide-0ea5e9)
![data](https://img.shields.io/badge/data-illustrative-f59e0b)

---

## What this is

A clickable prototype of the product specified in the PRD — a **machine‑learning Cancellation Prediction System** built on a Random Forest classifier (87.9% test accuracy). It is **not** a consumer hotel‑booking site; it is the internal **revenue‑manager tool** that turns model scores into action.

Every screen is a self‑contained HTML file. There is **no build step, no install, and no backend** — open it in a browser and click through. All data is realistic but illustrative.

> ⚠️ This is a design mockup for stakeholder review. Charts and tables use synthetic data; "Sign in" accepts any credentials.

## Quick start

**Option A — just open it**

```bash
open index.html        # macOS
# or double‑click index.html in your file browser
```

**Option B — serve locally** (recommended; mirrors how it's hosted)

```bash
python3 -m http.server 4173
# then visit http://localhost:4173
```

**Option C — GitHub Pages**

Push this folder to a repo, then enable **Settings → Pages → Deploy from branch** and pick the branch/folder. `index.html` is the entry point, so the site works at the repo's Pages URL with no configuration.

## The screens

Start at **`index.html`** (the project hub) — it links to everything below. Inside the app, the left sidebar navigates between screens.

| Screen | File | What it shows |
| --- | --- | --- |
| 🔐 Sign in | `login.html` | Branded entry point to the workspace |
| 📊 Dashboard | `dashboard.html` | North‑Star revenue recovered, KPIs, live alerts, today's at‑risk queue |
| 📋 At‑Risk Queue | `at-risk-queue.html` | Bookings ranked by risk with a **working threshold slider**, search & segment filters |
| 🔍 Booking Detail | `booking-detail.html` | Risk gauge, **top‑3 plain‑language drivers**, all 16 logged features, intervention flow |
| 📅 Overbooking Forecast | `forecast.html` | Per‑arrival cancellation forecast at **30/14/7‑day horizons** with confidence intervals |
| ⚙️ Automation Rules | `automation-rules.html` | IF/THEN policy engine with a rule builder and compliance guardrails |
| 🎯 Intervention ROI | `interventions.html` | **A/B holdout** proving interventions cut cancellations 42%, ROI by type |
| 📈 Model Monitoring | `model-monitoring.html` | Rolling accuracy vs the 85% gate, confusion matrix, model comparison, retraining log |
| 🥧 Segment Analytics | `segment-analytics.html` | Cancellation drivers by segment, lead‑time band, price band, season |
| 🛠️ Settings | `settings.html` | Risk threshold (live preview), alerts, automation guardrails, GDPR/partial‑data |

> 💡 Try this flow: **Dashboard → Open queue → click a booking → log an intervention.**

## Highlights

- **Real‑time risk scoring** surfaced as a ranked, filterable queue (FR1, FR3, FR12).
- **Explainability first** — every score comes with its top‑3 drivers in plain English and a full audit of the 16 features used (FR2, FR10), because revenue managers won't act on a black box.
- **Honest measurement** — a 10% A/B holdout drives the North‑Star "revenue recovered" metric, not vanity numbers.
- **Compliance baked in** — GDPR Art. 22 guardrails: punitive automated actions require a stricter ≤5% false‑positive threshold and human review for the first 90 days.
- **Consistent design system** — one shared `assets/` layer (tokens, app shell, widgets) keeps all screens visually identical.

## Project structure

```
.
├── index.html                 # Project hub: storyboard, flow map, PRD traceability
├── login.html
├── dashboard.html
├── at-risk-queue.html
├── booking-detail.html        # reads ?id=INN-… to drill into a booking
├── forecast.html
├── automation-rules.html
├── interventions.html
├── model-monitoring.html
├── segment-analytics.html
├── settings.html
└── assets/
    ├── app.css                # design tokens + components (Tailwind fills the rest)
    ├── data.js                # single shared dataset (bookings, model stats, forecasts)
    └── app.js                 # sidebar/topbar shell, risk gauge, queue, modals, toasts
```

## Tech stack

- **HTML** — one file per screen, fully self‑contained.
- **[Tailwind CSS](https://tailwindcss.com)** (CDN) — layout & utilities.
- **[Chart.js](https://www.chartjs.org)** (CDN) — trend lines, bars, forecasts.
- **[Lucide](https://lucide.dev)** (CDN) — icons.
- **Vanilla JS** — no framework, no bundler.

All dependencies load from CDNs, so an internet connection is needed the first time you open the files.

## Traceability to the PRD

| Area | PRD reference |
| --- | --- |
| Real‑time scoring + ranked dashboard | FR1, FR3, FR4, Flow 1–2 |
| Explainability & auditability | FR2, FR10, Story 1 |
| Overbooking forecast | FR9, Story 3 |
| Policy automation | FR7, Flow 3 |
| Intervention effectiveness | FR8, Story 4, §8 (North Star) |
| Model monitoring & retraining | FR5, FR6, §5 |
| Segment policy calibration | Story 2, §2.1, §2.6 |

## Assumptions made

The PRD was silent on UI specifics, so the following were chosen and are easy to change:

- **Product name** "Foresight" (the PRD's "Cancellation Prediction System").
- **Persona** "Alex Rivera, Revenue Manager" as the signed‑in user.
- **Brand** indigo, with red / amber / green risk semantics (high ≥70%, medium 40–69%, low <40%).
- **Illustrative figures** anchored to PRD facts: 33% → 24.6% cancellation rate, 87.9% accuracy, ~$150–$312/night, INN Hotels Group data.

---

<sub>Generated by the <code>mockup-generator</code> agent from <code>HotelBooking-PRD.pdf</code>. Design mockup only — not a production application.</sub>
