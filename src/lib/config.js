// Edit this file with the real business details before launch.
// Everything on the site pulls from here — change it once, updates everywhere.

// Email domains allowed to access the admin panel.
// Only users with an email address from one of these domains can log in.
export const ACCESS_DOMAINS = ["de5.net"];

export const business = {
  name: "Nuga Best Ruai",
  tagline: "Thermal jade therapy · Ruai",
  phone: "", // optional phone number shown when available
  whatsappDigits: "254700000000", // digits only, international format, used for wa.me links
  address: "Gatwick Mall, Ruai Town, Nairobi",
  hours: "Daily, 8:00 AM – 6:00 PM",
  pricing: {
    onSite: { amount: 300, duration: "30 minutes", currency: "KES" },
    offSite: { amount: 1500, duration: "1 hr 10 min", currency: "KES" },
  },
  // Default map center for Ruai Town — the booking pin starts here and the
  // client drags it to their exact location, so this only needs to be
  // roughly right, not the precise studio address.
  location: { lat: -1.2553, lng: 36.9861 },
};
