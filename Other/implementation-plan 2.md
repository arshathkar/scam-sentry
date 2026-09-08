# Implementation Plan — Scam Sentry (Web Prototype)

> **Stack decision:** Built as a web app / installable PWA rather than native Android. This trades some native reliability for zero install friction during judging and a faster iteration loop during a short build window — but it shifts the technical risk from "will the native SDK cooperate" to "will the browser's on-device APIs (WebGPU, Share Target, Web Speech) behave on the loaner device." Test each of those early and keep a fallback for each (see Section 6).

## 1. Feature Triage

| Feature | Status | Why (web-specific notes) |
|---|---|---|
| Screenshot/message scan (camera + gallery) | **MVP** | `<input type="file" accept="image/*" capture>` for camera; plain file picker for gallery. No native permission dance beyond a browser prompt. |
| Share-sheet integration | **MVP — test early** | Web Share Target API + PWA manifest lets Chrome/Android show "Scam Sentry" in the native share sheet from WhatsApp/Gallery — but only once the PWA is installed to the home screen, and only on browsers that support it. Confirm on the loaner device on day one; keep manual upload as the live-demo fallback. |
| Scam Signal Engine (rule-based) | **MVP** | Pure JS/TS — deterministic, fast, zero dependency on model behavior. Same logic as the native plan: never let the whole demo hinge on a model responding well live. |
| On-device AI reasoning (local LLM explanation) | **MVP** | In-browser LLM via WebGPU (WebLLM/MLC) — this is the "local model at the core" story. Real risk: WebGPU support and GPU memory on the loaner device. Build a template-based reasoning fallback (stitches plain-language sentences from the Signal Engine's output) that fires automatically if the model fails to load or times out. |
| Trust/Risk Score with reasoning breakdown | **MVP** | Same visual payoff as the native plan — just React state + UI, no platform dependency. |
| Multilingual voice output (TTS) | **MVP** | `window.speechSynthesis` — free, offline once the OS voice pack is installed, but language/voice coverage varies by device and OS build. Test your target languages on the actual loaner device, not just your dev machine. |
| QR decode + "Before You Pay" | **MVP** | Native `BarcodeDetector` API where available (Chrome/Android), with `jsQR` bundled as a fallback so it still works if `BarcodeDetector` isn't present. |
| Family Guardian Mode | **MVP** | `navigator.share()` opens the native Android share sheet directly to WhatsApp/SMS/Email — arguably simpler here than the native-intent version, and works even without installing as a PWA. |
| Senior-Friendly Mode | **High-value add-on** | Plain-language string variant + simplified layout toggle — same low cost as the native plan. |
| Scam DNA (local repeat-pattern memory) | **High-value add-on** | IndexedDB (via a thin wrapper like `idb`) stores a normalized-text signature of previously flagged messages; compare new scans with simple fuzzy matching. Caveat vs. native: cleared if the user clears site data — mention this trade-off if asked, don't over-promise durability. |
| Fake payment screenshot detection | **Simplify, don't cut** | Same call as the native plan — fold into the Signal Engine as text/structure heuristics (missing transaction ID, generic "payment successful" with no bank branding, inconsistent formatting). Skip pixel-level tamper forensics entirely. |
| Live call screening | **Cut from the build** | Even harder on web than native — browsers have no access to system call audio at all, only the mic. Keep it as a "future roadmap" line in the pitch, same as before. |

## 2. Tech Stack

- **Framework:** Vite + React + TypeScript — fast dev loop, ships as a static PWA with no backend to babysit during the demo
- **Styling:** Tailwind CSS
- **OCR:** Tesseract.js (WebAssembly, runs fully on-device) — pre-download and cache the trained-data files for your target languages so OCR still works if venue wifi drops
- **QR/Barcode:** `BarcodeDetector` API with `jsQR` as a polyfill fallback
- **Camera:** `getUserMedia` + `<canvas>` frame sampling for live QR scanning; plain file input with the `capture` attribute for screenshot capture
- **On-device LLM:** WebLLM (MLC-LLM) running a small quantized model (Gemma 2B / Phi-3-mini) via WebGPU. Confirm WebGPU is actually available and fast enough on the loaner device on day one — don't lock this in blind, same caution the native plan gave for MediaPipe/ONNX
- **TTS:** Web Speech Synthesis API — no extra model needed
- **Local storage:** IndexedDB (via `idb`) for Scam DNA signatures and user prefs
- **Inbound sharing:** Web Share Target API + PWA `manifest.json` (`share_target` entry) — requires HTTPS hosting and the app installed to the home screen ahead of time
- **Outbound sharing:** `navigator.share()` for Family Guardian forwarding
- **Offline/installability:** Service worker (via `vite-plugin-pwa`/Workbox) caching the app shell, OCR WASM assets, and LLM model weights, so the whole thing runs with no live network during the pitch
- **Hosting:** Static deploy (Vercel/Netlify/GitHub Pages) over HTTPS — required for camera access, Share Target, and PWA installability

## 3. App Modules

1. **Input Handler** — camera capture, gallery picker, Share Target receiver, QR scanner
2. **OCR & Extraction** — Tesseract.js pulls text/structure from screenshots and messages
3. **Scam Signal Engine** — rule-based, deterministic scoring (urgency language, OTP requests, mismatched UPI handles, suspicious links, missing transaction fields, etc.)
4. **On-device AI Reasoning** — WebLLM call (with template fallback) turns extracted text + signal list into a plain-language explanation
5. **Risk Score & Result UI** — Trust Score with the "why" breakdown
6. **Voice Module** — Web Speech TTS playback in the selected language, plus a "Why?" follow-up
7. **Scam DNA Store** — IndexedDB store of previously flagged patterns for instant repeat-scam detection
8. **Family Guardian** — `navigator.share()` call with a pre-filled summary
9. **Senior-Friendly Mode** — simplified string/UI variant toggle, same underlying engine

## 4. Data Flow

Capture/share/scan → Input Handler identifies content type → OCR/QR extraction (on-device, WASM) → Scam Signal Engine scores known indicators → On-device LLM (or template fallback) turns signals + context into a plain-language explanation → Risk Score UI renders the verdict and breakdown → Web Speech TTS speaks it aloud → (optional) Scam DNA checks/stores the pattern → (optional) user taps "Ask My Family" to forward it via `navigator.share()`.

## 5. Screens

- **Home** — Scan button, gallery picker, recent scans
- **Processing** — brief loading state while OCR/signals/LLM run
- **Result** — Risk Score, plain-language breakdown, "Why?" voice button, "Ask My Family" button
- **Before You Pay** (QR flow) — recipient, amount, risk level, Confirm/Cancel
- **Settings** — language, Senior-Friendly toggle, trusted contact for Family Guardian

## 6. Browser/Device Compatibility Checklist

Run through this on the actual loaner device (or as close a match as you can get) on day one — not the night before the pitch:

- [ ] WebGPU is available and fast enough to run the chosen LLM without a multi-second stall
- [ ] `BarcodeDetector` is present (if not, confirm the `jsQR` fallback path works)
- [ ] The PWA installs to the home screen cleanly, and the Share Target entry actually shows up in WhatsApp's/Gallery's share sheet afterward
- [ ] `speechSynthesis.getVoices()` returns usable voices for every language you plan to demo
- [ ] The full app flow works with wifi/data turned off, after the first load (validates your offline caching)
- [ ] Camera permission prompt and QR live-scan work under stage lighting, not just at a desk

## 7. Rough Build Timeline

This assumes standard laptop-based development throughout the event, since a web build (unlike the native/NPU-dependent build) doesn't have a "phone-only" coding phase — if the event's Red Light/Green Light format genuinely restricts laptop use during certain blocks, flag that with a mentor on day one, since it would change this timeline significantly.

1. **Hours 0–6:** Project scaffold (Vite/React/PWA config), Input Handler (camera, gallery, file input), QR scanner UI — get every input path working end to end with placeholder results
2. **Hours 6–13:** Wire up Tesseract.js OCR, the Scam Signal Engine, and the WebLLM reasoning call (plus its template fallback) — hardest integration, budget the most time here
3. **Hours 13–19:** Result screen, Trust Score UI, TTS playback, Family Guardian share, Senior-Friendly toggle
4. **Hours 19–25:** Scam DNA storage (IndexedDB), Before You Pay QR flow, PWA manifest + Share Target wiring, bug fixing
5. **Hours 25–30:** Run the full Compatibility Checklist (Section 6) on the actual loaner device, polish, localization strings, rehearse the live demo repeatedly

## 8. If You're a Team of 2–3

- **Person A:** Input Handler + OCR/QR (camera, file input, Tesseract.js, BarcodeDetector/jsQR)
- **Person B:** Scam Signal Engine + WebLLM integration (the technical core — pair this person with whoever is strongest at browser ML/API work)
- **Person C:** UI/UX in React, TTS, Family Guardian, Senior-Friendly mode, PWA/Share Target setup, and owns rehearsing the demo

If solo, build in the module order above — input path first, reasoning core second, polish last — so there's always something demoable even if you run out of time.

## 9. Demo Script (tight, ~90 seconds)

Prerequisite: install the PWA to the home screen and confirm offline mode *before* going on stage.

1. Share a fake "payment successful" WhatsApp screenshot into the app → instant "Possible Fake Payment" verdict with reasons shown
2. Scan a suspicious QR code → "Before You Pay" screen shows the real recipient and a high-risk warning
3. Switch language and trigger the spoken explanation
4. Tap "Ask My Family" to show the forward-to-trusted-contact flow via the native share sheet

Same rubric coverage as the native plan — working product, novelty, camera/voice/on-device AI, technical depth, and a clean pitch — without the riskier features needing to work live.
