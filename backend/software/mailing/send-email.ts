import { User } from "../../types/.types/collections.type";
import mailing from "./dir";


const dummyUser: User = {
  id: "usr_7f9a2b8c3d4e5f6g",
  identifier: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewRuMqMmKVj1.uPy", // hashed: "user_alexandre_2024"
  password: "$2b$12$EIXYBj9RKtJGbr2/9k3JvOuO8Y7XqQ5zRwC.nHf8NJ1mK4L6pQ2Rm", // hashed: "SecurePass123!"
  email: "alexandre.dubois@email.fr",
  created_at: new Date("2024-03-15T10:30:00Z"),
  last_login: new Date("2025-08-30T14:22:15Z"),
  last_update: new Date("2025-08-28T09:15:30Z"),
  services: {
    1001: { // Naflows main service
      rights: ["DEVELOPER", "USER"],
      joined_at: 1710504600000, // March 15, 2024 timestamp
      active: true
    },
    2003: { // Analytics service
      rights: ["USER"],
      joined_at: 1720876800000, // July 13, 2024 timestamp
      active: true
    },
    5007: { // Beta testing service
      rights: ["ADMINISTRATOR", "DEVELOPER", "USER"],
      joined_at: 1722470400000, // August 1, 2024 timestamp
      active: false
    }
  },
  username: "alex_dev",
  first_name: "Alexandre",
  last_name: "Dubois",
  profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexandre",
  country: "France",
  language: "fr-FR",
  postal_code: "75001",
  adress: "12 Rue de la Paix, Paris",
  phone_number: "+33 6 12 34 56 78",
  phone_verified: true,
  email_verified: true
};


console.log("----- Configuration settings --------")
console.log("SMTP Host:", process.env.SMTP_HOST);
console.log("SMTP Port:", process.env.SMTP_PORT);
console.log("SMTP Secure:", process.env.SMTP_SECURE);
console.log("SMTP User:", process.env.SMTP_USER);
console.log("SMTP Pass:", process.env.SMTP_PASS);

(async () => {
  const s = await mailing.send(
    "mougel.david.pro@gmail.com",
    " « Naflows » account verification ",
    (await mailing.patterns.customLink("503514", dummyUser,"Naflows"))
  );
  console.log(s);
})();