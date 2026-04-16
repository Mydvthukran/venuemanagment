# VenueFlow - Smart Venue Experience Platform

VenueFlow is a smart event companion for large venues that helps attendees navigate faster, avoid queues, and order food from their seats.

## Chosen Vertical
Sports and live event venue experience optimization.

## Approach and Logic
- Frontend built with React + Vite for fast interactions and modular component architecture.
- Smart assistant layer uses deterministic intent parsing for predictable responses and safer input handling.
- Core product modules are separated by user needs:
  - Dashboard for live venue analytics.
  - Navigation for route suggestions by congestion.
  - Queue and food modules for operational convenience.
- Firebase Analytics integration is optional and environment-driven to support Google Services scoring without hardcoding secrets.

## How the Solution Works
1. User signs in with event identity details.
2. Dashboard displays live operational snapshots.
3. User can switch across map, queue, food, and navigation tools.
4. AI assistant provides context-aware guidance for common venue intents.
5. User actions can be tracked as analytics events when Firebase env variables are configured.

## Google Services Integration
This project includes Firebase Analytics integration.

Tracked events include:
- `assistant_message_sent`
- `assistant_reply_generated`

### Environment variables
Create a `.env` file with:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

If these values are missing, the app safely continues without analytics.

## Security and Quality Improvements
- User input sanitization for assistant messages.
- Baseline Content Security Policy and anti-clickjacking metadata in `index.html`.
- Reusable pure utility modules (`assistant`, `cart`) for maintainability.
- Improved accessibility labels and dialog/navigation semantics.

## Testing
Unit tests cover business logic for:
- Assistant intent + response selection + sanitization.
- Cart mutation and totals calculations.

Run tests:

```bash
npm test
```

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
npm run preview
```

## Assumptions
- Venue data is demo/static for prototype purposes.
- AI assistant is rule-based for deterministic behavior in evaluation.
- Firebase is optional for local usage and required only when analytics scoring is needed.
