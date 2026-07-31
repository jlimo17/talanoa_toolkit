import { useState, useEffect, useRef } from "react";
import {
  Mic, Wifi, WifiOff, Check, CheckCircle2, Users, Sparkles,
  Send, PenLine, Clock, Globe2, Loader2, RefreshCw, BarChart3,
  ArrowRight, X,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

/* ---------- shared signature mark: a talanoa (gathering circle) ripple ---------- */
function Ripple({ size = 20, active = false }) {
  return (
    <svg className={`tt-ripple ${active ? "tt-ripple--active" : ""}`} width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" className="tt-ripple-ring tt-ripple-ring--1" />
      <circle cx="20" cy="20" r="11" className="tt-ripple-ring tt-ripple-ring--2" />
      <circle cx="20" cy="20" r="4" className="tt-ripple-dot" />
    </svg>
  );
}

const STEPS = [
  { id: 1, label: "Session Builder", hint: "Choose a framework, generate prompts" },
  { id: 2, label: "Capture", hint: "Record with consent, online or off" },
  { id: 3, label: "Synthesis", hint: "Draft themes, facilitator-validated" },
  { id: 4, label: "Blueprint", hint: "A plan both sides sign" },
  { id: 5, label: "Closing the Loop", hint: "Report back, track reciprocity" },
];

const FRAMEWORKS = {
  fonofale: {
    name: "Fonofale",
    origin: "Pacific health model",
    blurb: "Wellbeing as a fale (house): a shared roof, a family foundation, and pillars that hold each other up.",
    prompts: [
      "Foundation — What does your family need to feel steady right now?",
      "Culture — Where in your day do you feel most connected to who you are?",
      "Spiritual — What gives you strength when things are hard?",
      "Physical & mental — What would make it easier to look after yourself here?",
    ],
  },
  tewhare: {
    name: "Te Whare Tapa Whā",
    origin: "Māori health model",
    blurb: "Four walls of a wharenui, each load-bearing: none can be neglected without the house leaning.",
    prompts: [
      "Taha whānau — Who do you lean on, and who leans on you?",
      "Taha wairua — What matters most to you beyond the day-to-day?",
      "Taha tinana — What helps your body feel well at work or at home?",
      "Taha hinengaro — What's been sitting heavy in your mind lately?",
    ],
  },
  sautu: {
    name: "Sautu",
    origin: "Fijian (iTaukei) health model",
    blurb: "Wellbeing as harmony — four interdependent dimensions that must stay in balance for sautu to be reached.",
    prompts: [
      "Vanua — What place or land makes you feel most like yourself?",
      "Bula vakayalo (spiritual) — What connects you to your ancestors, faith, or something bigger than yourself?",
      "Bula vakayago (physical) — What helps your body feel strong and cared for?",
      "Bula vakasama (mental & emotional) — What's been weighing on your mind, and who do you share that with?",
    ],
  },
  fonuaola: {
    name: "Fonua Ola",
    origin: "Tongan health model",
    blurb: "Five dimensions of life, inter-woven like a mat — none cared for at the expense of another.",
    prompts: [
      "Laumalie (spiritual) — What gives your life meaning beyond the everyday?",
      "'Atamai (mental) — What's been on your mind that you haven't said out loud?",
      "Sino (physical) — What does your body need more of right now?",
      "Kāinga (collective/community) — Who is your kāinga here, and how do you support each other?",
      "'Atakai (environment) — How does the place around you affect how you feel?",
    ],
  },
  vakaatafaga: {
    name: "Te Vaka Atafaga",
    origin: "Tokelauan assessment model",
    blurb: "Wellbeing as a vaka (canoe): six aspects that all need tending to keep the crew steady.",
    prompts: [
      "Physical — What helps you feel physically well day to day?",
      "Mental — What's been taking up space in your mind lately?",
      "Social — Who do you turn to outside your immediate family?",
      "Family — What does your family need from you right now, and what do you need from them?",
      "Spiritual — What keeps you grounded when things feel uncertain?",
      "Environmental — How does the place you live affect your sense of wellbeing?",
    ],
  },
  tivaevae: {
    name: "Tivaevae",
    origin: "Cook Islands framework",
    blurb: "Not a list of domains but a way of working together — named after the collaborative stitching of a quilt.",
    prompts: [
      "Taokotai (collaboration) — Who do you rely on to get things done, and who relies on you?",
      "Tu akangateitei (respect) — When do you feel most respected here?",
      "Uriuri kite (reciprocity) — What have you given, and what have you received, that felt fair?",
      "Tu inangaro (relationships) — Which relationships here matter most to you right now?",
      "Akāri kite (shared vision) — If this place worked exactly as it should, what would that look like?",
    ],
  },
  maiuraoi: {
    name: "Te Maiu Raoi",
    origin: "I-Kiribati wellbeing model",
    blurb: "Five interwoven domains — none used without the others — for te maiu raoi, wellbeing rooted in land, custom, and self-reliance.",
    prompts: [
      "Te maiu n tamnei (spiritual) — What connects you to your land, and to whoever guides you from above?",
      "Te toronibwai (self-reliance) — What skills or knowledge from your elders do you rely on most?",
      "Te katei (customary practices) — Where do you feel your culture most alive in daily life?",
      "Marin abara (environment) — How does your land or sea provide for you right now?",
      "Te rabwata (physical) — What do you need to be able to fulfil your role for your family?",
    ],
  },
  niue: {
    name: "Ko e Niu e",
    origin: "Niuean wellbeing model",
    blurb: "Wellbeing as a niu (coconut) — a hard outer shell protecting a soft interior, four dimensions balanced around moui olaola.",
    prompts: [
      "Moui fakaagaaga (spiritual) — What's your connection to your ancestors, your faith, and your land?",
      "Loto logona hifo (emotional) — When did you last feel truly content, and what made that possible?",
      "Malolo tino (physical) — What does your body need to stay strong for your family and village?",
      "Manamanatuaga (psychological) — Which relationships give you the clearest sense of who you are?",
    ],
  },
  lokahi: {
    name: "Lōkahi Triangle",
    origin: "Native Hawaiian health model",
    blurb: "Health as balance between three points — akua, ʻāina, and kānaka — none more important than the others.",
    prompts: [
      "Akua (spiritual) — What connects you to something greater than yourself?",
      "ʻĀina (land) — What's your relationship with the land, ocean, or place around you right now?",
      "Kānaka (people) — Which relationships keep you steady, and which ones cost you the most?",
      "Lōkahi (balance) — Where in your life do you feel most out of balance right now?",
    ],
  },
  perma: {
    name: "PERMA",
    origin: "General wellbeing model",
    blurb: "Five measurable elements of flourishing — a familiar starting point where a local framework isn't yet chosen.",
    prompts: [
      "Positive emotion — What's one moment this month that felt genuinely good?",
      "Engagement — When do you lose track of time in a good way?",
      "Relationships — Who makes this place feel like a community?",
      "Meaning — What part of this work matters most to you?",
    ],
  },
};

const TRANSCRIPT = [
  { who: "Facilitator", line: "Let's start with the foundation — what does your family need to feel steady right now?" },
  { who: "Participant A", line: "Honestly, just more time together. Everyone's stretched between two jobs." },
  { who: "Participant B", line: "And knowing the clinic's actually open when it says it is." },
  { who: "Facilitator", line: "Where do you feel most connected to who you are?" },
  { who: "Participant A", line: "Sunday, when the whole family cooks together." },
  { who: "Participant C", line: "I'd rather someone from here ran these sessions, not someone flown in." },
];

const THEMES = [
  { id: "t1", title: "Time together is scarce", mentions: 6, note: "Multiple participants raised the strain of balancing paid work with family time." },
  { id: "t2", title: "Trust in service reliability", mentions: 4, note: "Concern that clinics and services don't always operate as advertised." },
  { id: "t3", title: "Food and ritual as connection", mentions: 5, note: "Shared meals and cooking came up repeatedly as a source of identity and closeness." },
  { id: "t4", title: "Preference for local facilitation", mentions: 3, note: "A preference for programs led by trusted community members over outside providers." },
];

const ACTIONS = [
  { priority: "Flexible scheduling", detail: "Shift sessions to evenings or weekends around multiple jobs.", owner: "Program partner", when: "Month 1" },
  { priority: "Reliability commitments", detail: "Publish service hours and hold to them; name a point of contact.", owner: "Service provider", when: "Month 1–2" },
  { priority: "Shared-meal sessions", detail: "Structure sessions around a shared meal, not just a meeting.", owner: "Community facilitator", when: "Ongoing" },
  { priority: "Community-led facilitation", detail: "Train and pay local facilitators to lead future sessions.", owner: "Program + community", when: "Month 2–3" },
];

const REPORTBACKS = [
  { month: "Mar", sent: 1 }, { month: "Apr", sent: 2 }, { month: "May", sent: 2 },
  { month: "Jun", sent: 3 }, { month: "Jul", sent: 4 },
];

const HONORARIA = [
  { group: "Household focus group — Vaitele", status: "Paid" },
  { group: "Youth session — Nukuʻalofa", status: "Paid" },
  { group: "Elders talanoa — Suva", status: "Pending" },
  { group: "Family group — Apia", status: "Paid" },
];

export default function TalanoaToolkitDemo() {
  const [step, setStep] = useState(1);

  return (
    <div className="tt-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .tt-root {
          --ink: #0F1D1A;
          --ink-soft: #33453F;
          --paper: #F3ECDA;
          --paper-dim: #E7DEC7;
          --ocean: #1F5951;
          --ocean-deep: #143C36;
          --sunset: #D98A3D;
          --coral: #B85C43;
          --seafoam: #8FB6AB;
          --line: rgba(15,29,26,0.12);
          --line-on-dark: rgba(243,236,218,0.16);
          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--ink);
          background: var(--ocean-deep);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 1px 0 rgba(0,0,0,0.2);
          max-width: 100%;
        }
        .tt-root * { box-sizing: border-box; }
        .tt-display { font-family: 'Fraunces', serif; }
        .tt-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.02em; }

        .tt-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px; background: var(--ocean-deep);
          border-bottom: 1px solid var(--line-on-dark);
        }
        .tt-brand { display: flex; align-items: center; gap: 10px; }
        .tt-brand-name { color: var(--paper); font-size: 18px; font-weight: 500; }
        .tt-brand-tag { color: var(--seafoam); font-size: 12.5px; margin-top: 1px; }
        .tt-header-right { display: flex; align-items: center; gap: 10px; }
        .tt-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 11px; border-radius: 100px; font-size: 12.5px;
          background: rgba(243,236,218,0.08); color: var(--paper);
          border: 1px solid var(--line-on-dark);
        }

        .tt-body { display: grid; grid-template-columns: 236px 1fr; min-height: 620px; }
        @media (max-width: 780px) { .tt-body { grid-template-columns: 1fr; } }

        .tt-nav {
          background: var(--ocean-deep); padding: 18px 12px 18px;
          border-right: 1px solid var(--line-on-dark);
        }
        .tt-nav-item {
          display: flex; align-items: flex-start; gap: 10px; width: 100%;
          text-align: left; background: transparent; border: none; cursor: pointer;
          padding: 11px 10px; border-radius: 10px; margin-bottom: 2px;
          color: var(--seafoam); transition: background 0.15s ease;
        }
        .tt-nav-item:hover { background: rgba(243,236,218,0.06); }
        .tt-nav-item:focus-visible { outline: 2px solid var(--sunset); outline-offset: 2px; }
        .tt-nav-item--active { background: rgba(243,236,218,0.1); }
        .tt-nav-num {
          font-size: 11px; padding-top: 2px; color: var(--seafoam); min-width: 20px;
        }
        .tt-nav-item--active .tt-nav-num { color: var(--sunset); }
        .tt-nav-label { color: var(--paper); font-size: 13.5px; font-weight: 500; line-height: 1.3; }
        .tt-nav-hint { color: var(--seafoam); font-size: 11.5px; margin-top: 2px; line-height: 1.3; }

        .tt-main {
          background: var(--paper); padding: 30px 34px 40px;
          overflow-y: auto;
        }
        .tt-eyebrow { color: var(--coral); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .tt-h1 { font-size: 26px; font-weight: 500; margin: 0 0 8px; }
        .tt-lede { color: var(--ink-soft); font-size: 14.5px; line-height: 1.5; max-width: 640px; margin-bottom: 26px; }

        .tt-card {
          background: #fff; border: 1px solid var(--line); border-radius: 14px;
          padding: 18px 20px;
        }
        .tt-grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; }
        @media (max-width: 780px) { .tt-grid-3 { grid-template-columns: 1fr; } }
        .tt-diagram-label { font-size: 12px; color: var(--ink-soft); text-align: center; margin-bottom: 10px; }
        .tt-diagram-ring { border: 1.5px dashed var(--line); border-radius: 20px; padding: 16px; }
        .tt-diagram-center { text-align: center; font-size: 11.5px; color: var(--coral); margin-top: 10px; font-style: italic; }

        .tt-fw-card {
          text-align: left; cursor: pointer; border-radius: 14px; padding: 16px;
          border: 1.5px solid var(--line); background: #fff; transition: border-color 0.15s ease, transform 0.1s ease;
        }
        .tt-fw-card:hover { border-color: var(--ocean); }
        .tt-fw-card:focus-visible { outline: 2px solid var(--sunset); outline-offset: 2px; }
        .tt-fw-card--active { border-color: var(--ocean); background: #FDFAF2; box-shadow: inset 0 0 0 1px var(--ocean); }
        .tt-fw-name { font-family: 'Fraunces', serif; font-size: 16.5px; font-weight: 500; }
        .tt-fw-origin { font-size: 11px; color: var(--coral); text-transform: uppercase; letter-spacing: 0.05em; margin: 2px 0 8px; }
        .tt-fw-blurb { font-size: 12.5px; color: var(--ink-soft); line-height: 1.45; }

        .tt-diagram { margin: 18px 0 22px; padding: 18px; background: #fff; border: 1px solid var(--line); border-radius: 14px; }
        .tt-diagram-roof { background: var(--ocean); color: var(--paper); text-align: center; padding: 8px; border-radius: 8px 8px 2px 2px; font-size: 12.5px; font-weight: 500; }
        .tt-diagram-pillars { display: grid; gap: 6px; margin: 6px 0; }
        .tt-diagram-pillar { background: var(--seafoam); color: var(--ocean-deep); text-align: center; padding: 10px 4px; font-size: 11.5px; font-weight: 500; border-radius: 4px; }
        .tt-diagram-foundation { background: var(--sunset); color: var(--ocean-deep); text-align: center; padding: 8px; border-radius: 2px 2px 8px 8px; font-size: 12.5px; font-weight: 500; }
        .tt-diagram-perma { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .tt-diagram-petal { background: var(--seafoam); color: var(--ocean-deep); padding: 12px 14px; border-radius: 100px; font-size: 12px; font-weight: 500; text-align: center; }

        .tt-prompt-list { display: grid; gap: 8px; }
        .tt-prompt { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; background: #fff; border: 1px solid var(--line); border-radius: 10px; font-size: 13.5px; line-height: 1.45; }
        .tt-prompt-mark { color: var(--coral); font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; padding-top: 2px; }

        .tt-btn {
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
          padding: 11px 18px; border-radius: 100px; font-size: 13.5px; font-weight: 500;
          border: none; transition: opacity 0.15s ease, transform 0.1s ease;
        }
        .tt-btn:active { transform: scale(0.98); }
        .tt-btn:focus-visible { outline: 2px solid var(--ocean); outline-offset: 2px; }
        .tt-btn--primary { background: var(--ocean); color: var(--paper); }
        .tt-btn--primary:hover { background: var(--ocean-deep); }
        .tt-btn--ghost { background: transparent; color: var(--ocean); border: 1.5px solid var(--line); }
        .tt-btn--ghost:hover { border-color: var(--ocean); }
        .tt-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .tt-section-label { font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--ink-soft); margin: 22px 0 10px; }
        .tt-section-label:first-of-type { margin-top: 0; }

        .tt-toggle-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .tt-toggle {
          padding: 9px 14px; border-radius: 100px; font-size: 12.5px; cursor: pointer;
          border: 1.5px solid var(--line); background: #fff; color: var(--ink-soft);
        }
        .tt-toggle--active { border-color: var(--ocean); background: var(--ocean); color: var(--paper); }
        .tt-toggle:focus-visible { outline: 2px solid var(--sunset); outline-offset: 2px; }

        /* Capture module */
        .tt-capture-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; }
        @media (max-width: 780px) { .tt-capture-layout { grid-template-columns: 1fr; } }
        .tt-record-panel { text-align: center; padding: 26px 16px; }
        .tt-record-btn {
          width: 84px; height: 84px; border-radius: 50%; border: none; cursor: pointer;
          background: var(--coral); color: #fff; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px; position: relative;
        }
        .tt-record-btn--active { background: var(--ocean); }
        .tt-record-btn:focus-visible { outline: 2px solid var(--ocean); outline-offset: 3px; }
        .tt-timer { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--ink-soft); }
        .tt-status-row { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 14px; font-size: 12px; }
        .tt-status-row--offline { color: var(--coral); }
        .tt-status-row--online { color: var(--ocean); }
        .tt-consent-block { margin-top: 20px; text-align: left; }
        .tt-consent-note { font-size: 12px; color: var(--ink-soft); line-height: 1.5; margin-top: 8px; background: var(--paper-dim); padding: 10px 12px; border-radius: 10px; }

        .tt-transcript { display: flex; flex-direction: column; gap: 10px; min-height: 260px; }
        .tt-line { display: flex; gap: 10px; opacity: 0; animation: tt-fade-in 0.4s ease forwards; }
        .tt-line-who { min-width: 96px; font-size: 11.5px; color: var(--coral); font-family: 'IBM Plex Mono', monospace; padding-top: 2px; }
        .tt-line-text { font-size: 13.5px; line-height: 1.5; }
        @keyframes tt-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

        /* Synthesis */
        .tt-theme { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; background: #fff; margin-bottom: 10px; }
        .tt-theme--confirmed { border-color: var(--ocean); background: #F3F8F6; }
        .tt-theme-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .tt-theme-title { font-family: 'Fraunces', serif; font-size: 15.5px; font-weight: 500; }
        .tt-theme-mentions { font-size: 11px; color: var(--ink-soft); font-family: 'IBM Plex Mono', monospace; }
        .tt-theme-note { font-size: 12.5px; color: var(--ink-soft); margin-top: 6px; line-height: 1.45; }
        .tt-theme-actions { display: flex; gap: 8px; margin-top: 10px; }
        .tt-mini-btn { font-size: 11.5px; padding: 6px 11px; border-radius: 100px; cursor: pointer; border: 1px solid var(--line); background: #fff; display: inline-flex; align-items: center; gap: 5px; }
        .tt-mini-btn--confirm { color: var(--ocean); }
        .tt-mini-btn--confirm.tt-mini-btn--on { background: var(--ocean); color: #fff; border-color: var(--ocean); }

        /* Blueprint */
        .tt-doc { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 24px 26px; }
        .tt-doc-title { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 500; margin-bottom: 2px; }
        .tt-doc-sub { font-size: 12px; color: var(--ink-soft); margin-bottom: 18px; }
        .tt-doc-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        .tt-doc-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-soft); padding: 6px 8px; border-bottom: 1px solid var(--line); }
        .tt-doc-table td { padding: 10px 8px; border-bottom: 1px solid var(--line); vertical-align: top; }
        .tt-sign-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 22px; }
        @media (max-width: 780px) { .tt-sign-row { grid-template-columns: 1fr; } }
        .tt-sign-box { border: 1.5px dashed var(--line); border-radius: 12px; padding: 16px; text-align: center; }
        .tt-sign-box--signed { border-style: solid; border-color: var(--ocean); background: #F3F8F6; }
        .tt-sign-role { font-size: 11.5px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .tt-sign-name { font-family: 'Fraunces', serif; font-style: italic; font-size: 16px; margin: 6px 0 4px; }
        .tt-sign-date { font-size: 11px; color: var(--ink-soft); }

        /* Closing the loop */
        .tt-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 22px; }
        @media (max-width: 780px) { .tt-metrics { grid-template-columns: 1fr 1fr; } }
        .tt-metric { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; }
        .tt-metric-num { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 500; }
        .tt-metric-label { font-size: 11.5px; color: var(--ink-soft); margin-top: 2px; }
        .tt-chart-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px; margin-bottom: 20px; }
        .tt-chart-title { font-size: 12.5px; font-weight: 500; margin-bottom: 4px; }
        .tt-honoraria-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 4px; border-bottom: 1px solid var(--line); font-size: 12.5px; }
        .tt-honoraria-row:last-child { border-bottom: none; }
        .tt-status-pill { font-size: 11px; padding: 3px 9px; border-radius: 100px; }
        .tt-status-pill--paid { background: #E4F0EC; color: var(--ocean); }
        .tt-status-pill--pending { background: #F5E7DD; color: var(--coral); }
        .tt-confirm-banner { display: flex; align-items: center; gap: 8px; background: #F3F8F6; border: 1px solid var(--ocean); color: var(--ocean-deep); padding: 12px 14px; border-radius: 10px; font-size: 13px; margin-top: 14px; }

        .tt-spin { animation: tt-spin 0.9s linear infinite; }
        @keyframes tt-spin { to { transform: rotate(360deg); } }

        .tt-ripple-ring { fill: none; stroke: currentColor; opacity: 0.55; }
        .tt-ripple-dot { fill: currentColor; }
        .tt-ripple { color: var(--sunset); }
        .tt-ripple--active .tt-ripple-ring--1 { animation: tt-pulse 1.8s ease-out infinite; }
        .tt-ripple--active .tt-ripple-ring--2 { animation: tt-pulse 1.8s ease-out 0.3s infinite; }
        @keyframes tt-pulse { 0% { opacity: 0.6; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.3); } }
        @media (prefers-reduced-motion: reduce) {
          .tt-ripple--active .tt-ripple-ring--1, .tt-ripple--active .tt-ripple-ring--2 { animation: none; }
          .tt-line { animation: none; opacity: 1; }
        }
      `}</style>

      <header className="tt-header">
        <div className="tt-brand">
          <Ripple size={26} />
          <div>
            <div className="tt-brand-name tt-display">Talanoa Toolkit</div>
            <div className="tt-brand-tag">Co-design wellbeing, together</div>
          </div>
        </div>
        <div className="tt-header-right">
          <span className="tt-chip"><Globe2 size={13} /> Demo workspace</span>
        </div>
      </header>

      <div className="tt-body">
        <nav className="tt-nav" aria-label="Toolkit modules">
          {STEPS.map((s) => (
            <button
              key={s.id}
              className={`tt-nav-item ${step === s.id ? "tt-nav-item--active" : ""}`}
              onClick={() => setStep(s.id)}
            >
              <span className="tt-nav-num tt-mono">{String(s.id).padStart(2, "0")}</span>
              <span>
                <div className="tt-nav-label">{s.label}</div>
                <div className="tt-nav-hint">{s.hint}</div>
              </span>
            </button>
          ))}
        </nav>

        <main className="tt-main">
          {step === 1 && <SessionBuilder />}
          {step === 2 && <Capture />}
          {step === 3 && <Synthesis />}
          {step === 4 && <Blueprint />}
          {step === 5 && <ClosingTheLoop />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- 01 Session Builder ---------------- */
function SessionBuilder() {
  const [framework, setFramework] = useState("fonofale");
  const [sessionType, setSessionType] = useState("group");
  const [generated, setGenerated] = useState(false);
  const fw = FRAMEWORKS[framework];

  return (
    <div>
      <div className="tt-eyebrow tt-mono">01 · Session Builder</div>
      <h1 className="tt-h1 tt-display">Start from a framework your community already trusts</h1>
      <p className="tt-lede">Pick the wellbeing model this session should be grounded in. Prompts, the diagram, and the language shown to participants adjust automatically — nothing here is one-size-fits-all.</p>

      <div className="tt-section-label">Framework</div>
      <div className="tt-grid-3">
        {Object.entries(FRAMEWORKS).map(([key, f]) => (
          <button
            key={key}
            className={`tt-fw-card ${framework === key ? "tt-fw-card--active" : ""}`}
            onClick={() => { setFramework(key); setGenerated(false); }}
          >
            <div className="tt-fw-name">{f.name}</div>
            <div className="tt-fw-origin">{f.origin}</div>
            <div className="tt-fw-blurb">{f.blurb}</div>
          </button>
        ))}
      </div>

      <div className="tt-diagram">
        {framework === "fonofale" && (
          <>
            <div className="tt-diagram-roof">Roof — Culture</div>
            <div className="tt-diagram-pillars" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div className="tt-diagram-pillar">Physical</div>
              <div className="tt-diagram-pillar">Mental</div>
              <div className="tt-diagram-pillar">Spiritual</div>
              <div className="tt-diagram-pillar">Social</div>
            </div>
            <div className="tt-diagram-foundation">Foundation — Family</div>
          </>
        )}
        {framework === "tewhare" && (
          <div className="tt-diagram-pillars" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div className="tt-diagram-pillar">Taha tinana<br />(physical)</div>
            <div className="tt-diagram-pillar">Taha hinengaro<br />(mental)</div>
            <div className="tt-diagram-pillar">Taha whānau<br />(family)</div>
            <div className="tt-diagram-pillar">Taha wairua<br />(spiritual)</div>
          </div>
        )}
        {framework === "sautu" && (
          <>
            <div className="tt-diagram-label">Four interdependent dimensions — none cared for at the expense of another</div>
            <div className="tt-diagram-pillars" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div className="tt-diagram-pillar">Vanua<br />(land & belonging)</div>
              <div className="tt-diagram-pillar">Bula vakayalo<br />(spiritual)</div>
              <div className="tt-diagram-pillar">Bula vakayago<br />(physical)</div>
              <div className="tt-diagram-pillar">Bula vakasama<br />(mental)</div>
            </div>
          </>
        )}
        {framework === "fonuaola" && (
          <>
            <div className="tt-diagram-label">Five dimensions, inter-woven like a mat</div>
            <div className="tt-diagram-perma">
              {["Laumalie (spiritual)", "'Atamai (mental)", "Sino (physical)", "Kāinga (community)", "'Atakai (environment)"].map((p) => (
                <div key={p} className="tt-diagram-petal">{p}</div>
              ))}
            </div>
          </>
        )}
        {framework === "vakaatafaga" && (
          <>
            <div className="tt-diagram-roof">The Vaka — six aspects that keep the crew steady</div>
            <div className="tt-diagram-pillars" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="tt-diagram-pillar">Physical</div>
              <div className="tt-diagram-pillar">Mental</div>
              <div className="tt-diagram-pillar">Social</div>
              <div className="tt-diagram-pillar">Family</div>
              <div className="tt-diagram-pillar">Spiritual</div>
              <div className="tt-diagram-pillar">Environmental</div>
            </div>
          </>
        )}
        {framework === "tivaevae" && (
          <>
            <div className="tt-diagram-label">Five values stitched together, not five separate parts</div>
            <div className="tt-diagram-ring">
              <div className="tt-diagram-perma">
                {["Taokotai\n(collaboration)", "Tu akangateitei\n(respect)", "Uriuri kite\n(reciprocity)", "Tu inangaro\n(relationships)", "Akāri kite\n(shared vision)"].map((p) => (
                  <div key={p} className="tt-diagram-petal" style={{ whiteSpace: "pre-line" }}>{p}</div>
                ))}
              </div>
            </div>
          </>
        )}
        {framework === "maiuraoi" && (
          <>
            <div className="tt-diagram-label">Five interwoven domains — one cannot be used without the others</div>
            <div className="tt-diagram-perma">
              {["Te maiu n tamnei (spiritual)", "Te toronibwai (self-reliance)", "Te katei (custom)", "Marin abara (environment)", "Te rabwata (physical)"].map((p) => (
                <div key={p} className="tt-diagram-petal">{p}</div>
              ))}
            </div>
          </>
        )}
        {framework === "niue" && (
          <>
            <div className="tt-diagram-label">Niu (coconut) — a hard shell, a soft heart</div>
            <div className="tt-diagram-ring">
              <div className="tt-diagram-pillars" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                <div className="tt-diagram-pillar">Moui fakaagaaga<br />(spiritual)</div>
                <div className="tt-diagram-pillar">Loto logona hifo<br />(emotional)</div>
                <div className="tt-diagram-pillar">Malolo tino<br />(physical)</div>
                <div className="tt-diagram-pillar">Manamanatuaga<br />(psychological)</div>
              </div>
              <div className="tt-diagram-center">moui olaola — at the core</div>
            </div>
          </>
        )}
        {framework === "lokahi" && (
          <>
            <div className="tt-diagram-label">Three points held in lōkahi — balance</div>
            <div className="tt-diagram-pillars" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="tt-diagram-pillar">Akua<br />(spiritual)</div>
              <div className="tt-diagram-pillar">ʻĀina<br />(land)</div>
              <div className="tt-diagram-pillar">Kānaka<br />(people)</div>
            </div>
          </>
        )}
        {framework === "perma" && (
          <div className="tt-diagram-perma">
            {["Positive emotion", "Engagement", "Relationships", "Meaning", "Accomplishment"].map((p) => (
              <div key={p} className="tt-diagram-petal">{p}</div>
            ))}
          </div>
        )}
      </div>

      <div className="tt-section-label">Session type</div>
      <div className="tt-toggle-row">
        {[
          { id: "individual", label: "Individual" },
          { id: "group", label: "Group" },
          { id: "collective", label: "Family / collective" },
        ].map((t) => (
          <button
            key={t.id}
            className={`tt-toggle ${sessionType === t.id ? "tt-toggle--active" : ""}`}
            onClick={() => setSessionType(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tt-section-label">Card-kit preview</div>
      <div className="tt-prompt-list">
        {fw.prompts.map((p, i) => (
          <div className="tt-prompt" key={i}>
            <span className="tt-prompt-mark">{String(i + 1).padStart(2, "0")}</span>
            <span className="tt-line-text">{p}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="tt-btn tt-btn--primary" onClick={() => setGenerated(true)}>
          <Sparkles size={15} /> Generate session pack
        </button>
        {generated && (
          <div className="tt-confirm-banner" style={{ maxWidth: 420 }}>
            <CheckCircle2 size={16} />
            Session pack ready — {fw.name}, {sessionType} format. Sent to the facilitator's device for offline use.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- 02 Capture ---------------- */
function Capture() {
  const [recording, setRecording] = useState(false);
  const [offline, setOffline] = useState(false);
  const [consent, setConsent] = useState("collective");
  const [seconds, setSeconds] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const intervalRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (recording) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      lineRef.current = setInterval(() => {
        setVisibleLines((v) => (v < TRANSCRIPT.length ? v + 1 : v));
      }, 1300);
    }
    return () => { clearInterval(intervalRef.current); clearInterval(lineRef.current); };
  }, [recording]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div>
      <div className="tt-eyebrow tt-mono">02 · Capture</div>
      <h1 className="tt-h1 tt-display">Record the room, not just one voice</h1>
      <p className="tt-lede">Works fully offline and syncs later. Consent can be given by one person, or by the group as a whole — the record reflects however the session actually agreed.</p>

      <div className="tt-capture-layout">
        <div className="tt-card tt-record-panel">
          <button
            className={`tt-record-btn ${recording ? "tt-record-btn--active" : ""}`}
            onClick={() => { setRecording((r) => !r); if (recording) { setSeconds(0); setVisibleLines(0); } }}
          >
            <Mic size={26} />
          </button>
          <div className="tt-timer">{recording ? fmt(seconds) : "Ready to record"}</div>

          <div
            className={`tt-status-row ${offline ? "tt-status-row--offline" : "tt-status-row--online"}`}
            style={{ cursor: "pointer" }}
            onClick={() => setOffline((o) => !o)}
            role="button"
            tabIndex={0}
          >
            {offline ? <WifiOff size={14} /> : <Wifi size={14} />}
            {offline ? "Offline — saved locally" : "Online — click to simulate offline"}
          </div>

          <div className="tt-consent-block">
            <div className="tt-section-label" style={{ marginTop: 18 }}>Consent</div>
            <div className="tt-toggle-row">
              <button className={`tt-toggle ${consent === "individual" ? "tt-toggle--active" : ""}`} onClick={() => setConsent("individual")}>Individual</button>
              <button className={`tt-toggle ${consent === "collective" ? "tt-toggle--active" : ""}`} onClick={() => setConsent("collective")}>Collective</button>
            </div>
            <div className="tt-consent-note">
              {consent === "individual"
                ? "This person consents to their voice being recorded and used for this program."
                : "The group consents together, as recognised by their chosen representative. One record, shared ownership."}
            </div>
          </div>
        </div>

        <div className="tt-card">
          <div className="tt-section-label" style={{ marginTop: 0 }}>Live transcript</div>
          <div className="tt-transcript">
            {!recording && visibleLines === 0 && (
              <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>Press record to begin. Speaker turns appear here as they're captured.</p>
            )}
            {TRANSCRIPT.slice(0, visibleLines).map((t, i) => (
              <div className="tt-line" key={i}>
                <span className="tt-line-who">{t.who}</span>
                <span className="tt-line-text">{t.line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 03 Synthesis ---------------- */
function Synthesis() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmed, setConfirmed] = useState({});

  const run = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setDone(true); }, 1400);
  };

  const toggle = (id) => setConfirmed((c) => ({ ...c, [id]: !c[id] }));

  return (
    <div>
      <div className="tt-eyebrow tt-mono">03 · Synthesis</div>
      <h1 className="tt-h1 tt-display">Themes are drafts until your facilitator says otherwise</h1>
      <p className="tt-lede">Clustering runs on the transcript from Capture. Nothing here is final — a facilitator confirms, edits, or removes each theme before it becomes part of the record.</p>

      {!done && (
        <button className="tt-btn tt-btn--primary" onClick={run} disabled={running}>
          {running ? <Loader2 size={15} className="tt-spin" /> : <Sparkles size={15} />}
          {running ? "Clustering session notes…" : "Run synthesis"}
        </button>
      )}

      {done && (
        <>
          <div className="tt-section-label" style={{ marginTop: 6 }}>Draft themes — from 6 speaker turns, 3 participants</div>
          {THEMES.map((t) => (
            <div key={t.id} className={`tt-theme ${confirmed[t.id] ? "tt-theme--confirmed" : ""}`}>
              <div className="tt-theme-top">
                <div className="tt-theme-title">{t.title}</div>
                <div className="tt-theme-mentions">{t.mentions} mentions</div>
              </div>
              <div className="tt-theme-note">{t.note}</div>
              <div className="tt-theme-actions">
                <button
                  className={`tt-mini-btn tt-mini-btn--confirm ${confirmed[t.id] ? "tt-mini-btn--on" : ""}`}
                  onClick={() => toggle(t.id)}
                >
                  <Check size={12} /> {confirmed[t.id] ? "Confirmed" : "Confirm"}
                </button>
                <button className="tt-mini-btn"><PenLine size={12} /> Edit</button>
                <button className="tt-mini-btn"><X size={12} /> Remove</button>
              </div>
            </div>
          ))}
          <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
            {Object.values(confirmed).filter(Boolean).length} of {THEMES.length} confirmed. A blueprint can only include confirmed themes.
          </p>
        </>
      )}
    </div>
  );
}

/* ---------------- 04 Blueprint ---------------- */
function Blueprint() {
  const [signed, setSigned] = useState({ org: false, community: false });

  return (
    <div>
      <div className="tt-eyebrow tt-mono">04 · Blueprint</div>
      <h1 className="tt-h1 tt-display">A plan both sides put their name to</h1>
      <p className="tt-lede">Confirmed themes become recommended actions with clear ownership. It's signed by the organisation and by a community representative — an agreement, not just a summary.</p>

      <div className="tt-doc">
        <div className="tt-doc-title">Wellbeing Program Blueprint</div>
        <div className="tt-doc-sub">Drafted from 1 co-design session · 3 participants · Fonofale framework</div>

        <table className="tt-doc-table">
          <thead>
            <tr><th>Priority</th><th>Action</th><th>Owner</th><th>When</th></tr>
          </thead>
          <tbody>
            {ACTIONS.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{a.priority}</td>
                <td>{a.detail}</td>
                <td>{a.owner}</td>
                <td className="tt-mono">{a.when}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tt-sign-row">
          <div className={`tt-sign-box ${signed.org ? "tt-sign-box--signed" : ""}`}>
            <div className="tt-sign-role">Organisation representative</div>
            {signed.org ? (
              <>
                <div className="tt-sign-name">Program Lead</div>
                <div className="tt-sign-date">Signed just now</div>
              </>
            ) : (
              <button className="tt-btn tt-btn--ghost" onClick={() => setSigned((s) => ({ ...s, org: true }))}>
                <PenLine size={13} /> Sign
              </button>
            )}
          </div>
          <div className={`tt-sign-box ${signed.community ? "tt-sign-box--signed" : ""}`}>
            <div className="tt-sign-role">Community representative</div>
            {signed.community ? (
              <>
                <div className="tt-sign-name">Community Facilitator</div>
                <div className="tt-sign-date">Signed just now</div>
              </>
            ) : (
              <button className="tt-btn tt-btn--ghost" onClick={() => setSigned((s) => ({ ...s, community: true }))}>
                <PenLine size={13} /> Sign
              </button>
            )}
          </div>
        </div>

        {signed.org && signed.community && (
          <div className="tt-confirm-banner">
            <CheckCircle2 size={16} /> Blueprint co-signed. It now moves to delivery, and the community will see progress in Closing the Loop.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- 05 Closing the Loop ---------------- */
function ClosingTheLoop() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <div className="tt-eyebrow tt-mono">05 · Closing the Loop</div>
      <h1 className="tt-h1 tt-display">People who give their time hear what happened next</h1>
      <p className="tt-lede">The most common failure of consultation is silence afterward. This is where results go back to the communities that gave them, and where reciprocity gets tracked, not assumed.</p>

      <div className="tt-metrics">
        <div className="tt-metric"><div className="tt-metric-num tt-display">12</div><div className="tt-metric-label">Sessions run</div></div>
        <div className="tt-metric"><div className="tt-metric-num tt-display">148</div><div className="tt-metric-label">People consulted</div></div>
        <div className="tt-metric"><div className="tt-metric-num tt-display">4</div><div className="tt-metric-label">Themes confirmed</div></div>
        <div className="tt-metric"><div className="tt-metric-num tt-display">92%</div><div className="tt-metric-label">Honoraria paid</div></div>
      </div>

      <div className="tt-chart-card">
        <div className="tt-chart-title">Report-backs sent, last 5 months</div>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <BarChart data={REPORTBACKS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--line)" }} />
              <Bar dataKey="sent" fill="var(--ocean)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="tt-card" style={{ marginBottom: 20 }}>
        <div className="tt-chart-title" style={{ marginBottom: 10 }}>Honoraria / koha tracker</div>
        {HONORARIA.map((h, i) => (
          <div className="tt-honoraria-row" key={i}>
            <span>{h.group}</span>
            <span className={`tt-status-pill ${h.status === "Paid" ? "tt-status-pill--paid" : "tt-status-pill--pending"}`}>{h.status}</span>
          </div>
        ))}
      </div>

      <button className="tt-btn tt-btn--primary" onClick={() => setSent(true)} disabled={sent}>
        <Send size={15} /> {sent ? "Report sent" : "Send report-back to participants"}
      </button>
      {sent && (
        <div className="tt-confirm-banner" style={{ maxWidth: 460 }}>
          <CheckCircle2 size={16} /> Sent to 3 participating communities, in Samoan, Tongan, and English.
        </div>
      )}
    </div>
  );
}
