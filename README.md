# Talanoa Toolkit

Co-designing wellbeing, together.

Talanoa Toolkit is a participatory design platform for building wellbeing programmes *with* the people they're meant to serve, not just *for* them. Most wellbeing and mental health apps ship generic content and see it fail: median 30-day retention across the category sits in the low single digits, and nearly 4 in 10 users cite "no measurable improvement" as their reason for quitting. The gap isn't content: it's relevance, trust, and genuine involvement.

Co-design already works. Academic and public-health literature consistently shows that when communities help shape a wellbeing programme (not just respond to a survey about one), outcomes, relevance, and trust all improve. But that process has only ever existed as bespoke research projects or one-off consulting engagements. Nothing productises it into a reusable tool an organisation can run itself, again and again, with its own people.

This repo is where we're building that tool.

## How it works

The platform is structured around five stages:

1. **Session Builder**: choose a wellbeing framework and generate context-appropriate prompts
2. **Capture**: offline-first recording with individual or collective consent
3. **Synthesis**: AI-assisted theming, never finalised without facilitator review
4. **Blueprint**: a co-signed action plan, not a one-sided report
5. **Closing the Loop**: report participants back to, plus honorarium/koha tracking

## A Pacific and Global South lens, built in from the foundation

This isn't layered on after the fact. Session Builder currently supports ten wellbeing frameworks, drawn from documented Pacific, Indigenous, and general models rather than a single default:

| Framework | Origin |
|---|---|
| Fonofale | Pan-Pacific / Samoan health model |
| Te Whare Tapa Whā | Māori health model |
| Sautu | Fijian (iTaukei) health model |
| Fonua Ola | Tongan health model |
| Te Vaka Atafaga | Tokelauan assessment model |
| Tivaevae | Cook Islands framework (collaborative process, not domains) |
| Te Maiu Raoi | I-Kiribati wellbeing model |
| Ko e Niu e | Niuean wellbeing model |
| Lōkahi Triangle | Native Hawaiian health model |
| PERMA | General wellbeing model, for when no local framework is chosen |

Beyond the frameworks themselves, the platform is built around: offline-first capture for unreliable connectivity, collective as well as individual consent, and data-sovereignty principles (CARE, not just GDPR/HIPAA) governing who controls what's collected.

## Running it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Building for deployment

```bash
npm run build
```

Outputs a static site to `dist/`, deployable to GitHub Pages, Netlify, Vercel, or any static host. If deploying to GitHub Pages, set the `base` path in `vite.config.js` to match your repo name.

## Status

This repository currently contains an interactive prototype and supporting design docs. It is early-stage and not yet production software.

Every framework above is simplified for demonstration purposes. None of them should be used in a real programme without support from cultural advisors from the relevant community first.

Feedback, critique, and cultural review from community partners are actively welcome.
