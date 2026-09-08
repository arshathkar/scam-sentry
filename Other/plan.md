# [App Name TBD] — On-Device Payment Fraud Detector

**Track:** FinTech and Commerce
**Event:** iQOO Hackathon 2026 — City Battle, Chennai (Sept 12–13)
**Team:** [Your name(s)] · [City]

---

## The Problem

Digital payment fraud has grown alongside UPI adoption in India — fake "payment received" screenshots, refund scam calls, swapped QR codes, and phishing SMS messages designed to trick someone into sending money instead of receiving it. The people most exposed are often the ones with the least support catching it in time: elderly users, people newer to smartphones, and anyone without a tech-savvy person nearby to double-check a suspicious message before it's too late.

## The Solution

An app that lets anyone point their phone camera at a payment screenshot, SMS, or QR code and get an instant, spoken verdict — in their own language — on whether it's likely a scam and why. Everything runs entirely on-device: no transaction data, screenshots, or personal details ever leave the phone.

## How It Works

1. **Capture** — user photographs or screenshots the suspicious message, QR code, or payment request.
2. **On-device OCR + vision** — extracts and reads the text/QR content locally, no cloud call.
3. **On-device reasoning** — a local model (e.g. Phi-3 / Gemma 2B) checks it against known scam patterns — mismatched UPI handles, urgency language, fake "received" screenshots, suspicious QR redirects — and explains the verdict in plain language.
4. **Spoken output** — the verdict is read aloud in the user's chosen language, so literacy or eyesight isn't a barrier to understanding it.

## What Makes This Different

- **Trust Score, not just a verdict** — instead of a flat safe/scam label, the app shows a plain-language breakdown of exactly which signals triggered concern (mismatched UPI handle, urgency language, a QR redirecting outside the expected domain). Transparency builds trust in the tool itself, not just in the answer.
- **Share-sheet integration** — works straight from WhatsApp, SMS, or Gallery via the phone's native share menu, so there's no "open the app, retype the message" friction. This also makes for a genuinely phone-native demo moment.
- **Family Guardian mode** — one tap forwards a flagged message, plus the reasoning behind it, to a trusted contact — so someone can double-check on behalf of an elderly or less tech-confident relative before any money actually moves.
- **On-device scam memory** — recognizes scam templates it has already flagged before (scammers reuse the same message across many victims), so repeat scams get caught instantly. This also demonstrates the model "learning" over time without any data ever leaving the phone.
- **Live call screening** *(stretch goal)* — during a suspicious "bank representative" call, the user records a short snippet; on-device audio analysis flags manipulation patterns like OTP requests or manufactured urgency.

## Why It Matters

This isn't a demo gimmick — it prevents real financial loss for people who currently have no one checking their payments for them. It's understandable in seconds, which matters in a short pitch window, and the fully offline design is also a genuine privacy feature: nobody has to trust a server with their bank screenshots.

## Why It Fits the Format

- **Phone-native by design** — built around the camera, mic, and on-device inference, not a web wrapper around an app.
- **Local model at the core** — no cloud API dependency, which is explicitly rewarded across the judging rubric.
- **Demo-able in 90 seconds** — scan a real fake screenshot on stage, phone calls it out loud, done.

## Ask

Looking for mentor guidance on the best on-device OCR + scam-pattern detection approach available within the iQOO SDK / on-device AI tooling provided at the event.
