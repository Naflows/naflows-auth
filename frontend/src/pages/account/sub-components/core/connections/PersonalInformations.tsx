import type React from "react";

export type DataKeys =
  | "PHONE"
  | "EMAIL"
  | "FIRST AND LAST NAME"
  | "ADDRESS"
  | "BIRTHDATE";
export const dataPreferences: Record<
  DataKeys,
  { title: string; description: string, svg: React.JSX.Element }
> = {
  PHONE: {
    title: "Phone Number",
    description: "View and use your phone number.",
    svg: (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80-120q-33 0-56.5-23.5T0-200v-560q0-33 23.5-56.5T80-840h800q33 0 56.5 23.5T960-760v560q0 33-23.5 56.5T880-120H80Zm280-280q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM84-200h552q-42-75-116-117.5T360-360q-86 0-160 42.5T84-200Zm616-280q0-21 4-40.5t10-39.5h46q10 0 18-4t14-12l27-36q9-12 8-27t-12-26l-28-28q-11-11-27-11.5T732-694q-43 40-67.5 97.5T640-480q0 59 24.5 116.5T732-266q12 11 28 10.5t27-11.5l28-28q11-11 12-26t-8-27l-27-36q-6-8-14-12t-18-4h-46q-6-18-10-38.5t-4-41.5Z" /></svg>)
  },
  EMAIL: {
    title: "Email Address",
    description: "View and use your email address.",
    svg: (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80-120q-33 0-56.5-23.5T0-200v-560q0-33 23.5-56.5T80-840h800q33 0 56.5 23.5T960-760v560q0 33-23.5 56.5T880-120H80Zm280-280q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM84-200h552q-42-75-116-117.5T360-360q-86 0-160 42.5T84-200Zm516-320h200q17 0 28.5-11.5T840-560v-120q0-17-11.5-28.5T800-720H600q-17 0-28.5 11.5T560-680v120q0 17 11.5 28.5T600-520Zm100-90 74-52q8-6 17-1.5t9 14.5q0 1-7 14l-70 49q-11 8-23 8t-23-8l-70-49q-1-1-7-14 0-10 9-14.5t17 1.5l74 52Z" /></svg>)
  },
  "FIRST AND LAST NAME": {
    title: "First and Last Name",
    description: "View and use your first and last name.",
    svg: (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M720-440q17 0 28.5-11.5T760-480q0-17-11.5-28.5T720-520H600q-17 0-28.5 11.5T560-480q0 17 11.5 28.5T600-440h120Zm0-120q17 0 28.5-11.5T760-600q0-17-11.5-28.5T720-640H600q-17 0-28.5 11.5T560-600q0 17 11.5 28.5T600-560h120ZM360-440q-36 0-65 6.5T244-413q-21 13-32 29.5T201-348q0 12 9 20t22 8h256q13 0 22-8.5t9-21.5q0-17-11-33t-32-30q-22-14-51-20.5t-65-6.5Zm0-40q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z" /></svg>)
  },
  "ADDRESS": {
    title: "Address",
    description: "View and use your address.",
    svg: (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120H160q-33 0-56.5-23.5T80-200v-360q0-19 8.5-36t23.5-28l240-180q11-8 23-12t25-4q13 0 25 4t23 12l132 100q10 8 7.5 20T572-668q-39 14-69 42.5T456-559q-17 38-16.5 79.5T457-400q5 13 .5 25.5T441-357q-42 19-64 37t-36 44q-11 18-16 38.5t-5 41.5v36q0 17-11.5 28.5T280-120Zm360-200q54 0 104.5 14t96.5 41q18 11 28.5 29.5T880-196q0 32-22 54t-54 22H476q-32 0-54-22t-22-54q0-21 10.5-39.5T439-265q46-27 96.5-41T640-320Zm0-40q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" /></svg>)
  },
  "BIRTHDATE": {
    title: "Birthdate",
    description: "View and use your birthdate.",
    svg: (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-80q-17 0-28.5-11.5T120-120v-160q0-33 23.5-56.5T200-360h560q33 0 56.5 23.5T840-280v160q0 17-11.5 28.5T800-80H160Zm40-360v-120q0-33 23.5-56.5T280-640h160v-58q-18-12-29-29t-11-41q0-15 6-29.5t18-26.5l42-42q2-2 14-6 2 0 14 6l42 42q12 12 18 26.5t6 29.5q0 24-11 41t-29 29v58h160q33 0 56.5 23.5T760-560v120H200Z" /></svg>)
  },
};
