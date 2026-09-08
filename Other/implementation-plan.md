# Implementation Plan — On-Device Payment Fraud Detector (Android)

> **Stack decision:** Built native (Kotlin) rather than React Native/Expo. The riskiest, highest-weight parts of this build — on-device OCR and the local LLM reasoning step — depend on Qualcomm's NPU acceleration tooling, which is native-Android-first. Skipping a JS bridge layer on top of that reduces the chance of something breaking under demo pressure, and event mentor support is more likely geared toward native Android integration.

## 1. Feature Triage

| Feature | Status | Why |
|---|---|---|
| Screenshot/message scan (camera + gallery) | **MVP** | Core input path, needed for any demo |
| Share-sheet integration | **MVP** | Cheap to build (native Android intent), huge demo impact — scan straight from WhatsApp |
| Scam Signal Engine (rule-based) | **MVP** | Deterministic, fast, reliable — don't make the whole demo depend on a model behaving well live |
| On-device AI reasoning (local LLM explanation) | **MVP** | This is your "local model at the core" story — required for the on-device AI bonus |
| Trust/Risk Score with reasoning breakdown | **MVP** | Main visual payoff of the demo |
| Multilingual voice output (TTS) | **MVP** | Cheap via Android's built-in TextToSpeech, strong accessibility + "creative phone use" story |
| QR decode + "Before You Pay" confirmation | **MVP** | Directly matches "how India actually transacts," moderate effort via CameraX + ML Kit |
| Family Guardian Mode ("Ask My Family") | **MVP** | Very cheap to build (just a share intent with a pre-filled message) for how much narrative payoff it gives |
| Senior-Friendly Mode | **High-value add-on** | Just a plain-language string variant + simplified UI — cheap, strong impact angle |
| Scam DNA (local repeat-pattern memory) | **High-value add-on** | Store a lightweight signature of flagged scams locally (Room/SQLite); compare new scans against it. Good technical-depth story, moderate effort |
| Fake payment screenshot detection | **Simplify, don't cut** | Skip true pixel-level tamper forensics (too unreliable in 30 hrs) — fold it into the Scam Signal Engine instead: flag missing transaction ID, inconsistent formatting, generic "payment successful" text with no bank branding, etc. |
| Live call screening | **Cut from the build** | Two real problems, not just time: (1) capturing live call audio is restricted or blocked outright on many Android OEM builds for privacy reasons, so it may not even work on the loaner device, and (2) it's the one feature most likely to fail live on stage. Keep it as a "future roadmap" line in your pitch, not a built feature. |

## 2. Tech Stack

- **Language / UI:** Kotlin + Jetpack Compose
- **OCR:** ML Kit Text Recognition (on-device, works offline for Latin script — test early on your target language, since regional-script accuracy varies)
- **QR/Barcode:** ML Kit Barcode Scanning
- **Camera:** CameraX
- **On-device LLM:** Confirm the exact runtime at check-in — the hackathon's Office Kit/SDK will likely point you to a specific path for Phi-3-mini or Gemma 2B (options generally include MediaPipe LLM Inference API or ONNX Runtime Mobile). Don't lock this in blind; ask a mentor on day one which path is fastest on the loaner phone's NPU.
- **TTS:** Android TextToSpeech API (built-in, no extra model needed)
- **Local storage:** Room (SQLite) — for Scam DNA signatures and user prefs, nothing leaves the device
- **Sharing:** Android Intents — `ACTION_SEND` / `ACTION_SEND_MULTIPLE` to *receive* shared content into the app, and `ACTION_SEND` again to forward a flagged message to a trusted contact for Family Guardian mode

## 3. App Modules

1. **Input Handler** — camera capture, gallery picker, share-sheet receiver, QR scanner
2. **OCR & Extraction** — pulls text/structure from screenshots and messages
3. **Scam Signal Engine** — rule-based, deterministic scoring (urgency language, OTP requests, mismatched UPI handles, suspicious links, missing transaction fields, etc.)
4. **On-device AI Reasoning** — takes the extracted text + signal list, returns a plain-language explanation via the local model
5. **Risk Score & Result UI** — Trust Score with the "why" breakdown
6. **Voice Module** — TTS playback in selected language, plus a "Why?" follow-up
7. **Scam DNA Store** — Room database of previously flagged patterns for instant repeat-scam detection
8. **Family Guardian** — outbound share intent with a pre-filled summary
9. **Senior-Friendly Mode** — a simplified string/UI variant toggle, same underlying engine

## 4. Data Flow

Capture/share/scan → Input Handler identifies content type → OCR/QR extraction (on-device) → Scam Signal Engine scores known indicators → On-device LLM turns signals + context into a plain-language explanation → Risk Score UI renders the verdict and breakdown → TTS speaks it aloud → (optional) Scam DNA checks/stores the pattern → (optional) user taps "Ask My Family" to forward it.

## 5. Screens

- **Home** — Scan button, gallery picker, recent scans
- **Processing** — brief loading state while OCR/signals/LLM run
- **Result** — Risk Score, plain-language breakdown, "Why?" voice button, "Ask My Family" button
- **Before You Pay** (QR flow) — recipient, amount, risk level, Confirm/Cancel
- **Settings** — language, Senior-Friendly toggle, trusted contact for Family Guardian

## 6. Rough Build Timeline (30-hour city battle)

Exact Red Light/Green Light block timing will be confirmed at check-in — this maps roughly to the ~55% phone-only / ~45% phone+laptop split:

1. **Phone-only block 1 (~5–6 hrs):** Camera capture, gallery picker, share-sheet receiver, QR scanner UI — get every input path working end to end with dummy/placeholder results.
2. **Laptop-bridge block (~6–7 hrs):** Wire up OCR, the Scam Signal Engine, and the on-device LLM reasoning call — this is the hardest integration, budget the most time here.
3. **Phone-only block 2 (~5–6 hrs):** Result screen, Trust Score UI, TTS playback, Family Guardian share intent, Senior-Friendly toggle.
4. **Laptop-bridge block (~5–6 hrs):** Scam DNA storage, Before You Pay QR flow, bug fixing, edge cases.
5. **Final phone-only stretch (~3–4 hrs):** Polish, localization strings, rehearse the live demo repeatedly on the actual loaner device.

## 7. If You're a Team of 2–3

- **Person A:** Input Handler + OCR/QR (camera, share-sheet, ML Kit integration)
- **Person B:** Scam Signal Engine + on-device LLM integration (the technical core — pair this person with whoever is strongest at model/API work)
- **Person C:** UI/UX in Compose, TTS, Family Guardian, Senior-Friendly mode, and owns rehearsing the demo

If solo, build in the module order above — input path first, reasoning core second, polish last — so you always have *something* demoable even if you run out of time.

## 8. Demo Script (tight, ~90 seconds)

1. Share a fake "payment successful" WhatsApp screenshot into the app → instant "Possible Fake Payment" verdict with reasons shown.
2. Scan a suspicious QR code → "Before You Pay" screen shows the real recipient and a high-risk warning.
3. Switch language and trigger the spoken explanation.
4. Tap "Ask My Family" to show the forward-to-trusted-contact flow.

That sequence alone touches every rubric category — working product, novelty, camera/voice/on-device AI, technical depth, and a clean pitch — without needing the riskier features to work live.
