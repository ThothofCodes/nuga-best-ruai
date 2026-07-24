# Nuga Best Ruai

Website and booking system for a thermal jade stone therapy studio at Gatwick Mall, Ruai — on-site or at home.

## Before you launch

Open `src/lib/config.js` and confirm/replace the placeholders:

- Real business name (currently `"Nuga Best Ruai"`)
- Real phone/WhatsApp number (currently `0700 000 000`)
- Opening days if not every day (currently daily, 8:00 AM – 6:00 PM)
- Exact studio location — the map pin defaults to central Ruai; drag it to the
  real spot in Gatwick Mall the first time you test a home-visit booking

## Setup

```bash
npm install
cp .env.example .env.local   # then add your MongoDB Atlas connection string
npm run dev
```

Visit `http://localhost:3000`.

## Deploy

Push to GitHub and deploy on Vercel (or any Node host). Add `MONGODB_URI` as
an environment variable in your hosting dashboard — don't commit `.env.local`.

## What's built

- **Homepage** — brand, pricing, healing-factor copy, studio/home comparison
- **`/book`** — booking form with on-site/home-visit toggle, date + time
  picker, and a drag-to-set location pin (Leaflet + OpenStreetMap, no API
  key needed) for home visits
- **`/api/bookings`** — saves booking requests to MongoDB

## Not built yet

- Automatic notification to the business when a booking comes in — see the
  `TODO` in `src/app/api/bookings/route.js`. Africa's Talking SMS or the
  WhatsApp Business API both work well for this in Kenya.
- Admin view to see/confirm incoming bookings — for now, check MongoDB Atlas
  directly, or ask Claude to build a simple admin page next
- Online payment / deposit collection for home visits
- Automated booking reminders

## License

MIT — see [`LICENSE`](./LICENSE). © Thoth of Codes.
