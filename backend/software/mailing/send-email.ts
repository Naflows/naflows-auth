import { User } from "../../types/.types/collections.type";
import mailing from "./dir";


const dummyUser : User = {
    id : "1",
    identifier : "100000:8ae7a11eb6919690bf6b81c0fab32804:d03e7cea89287a3b8e4bdcff25a002f58bdb78032941ff693aa751f16306acc6123782a1a136d2198cf2fd9ccce2a5bd56d0515abac8a3d11fb304e8915e82e0",
    password : "100000:5ee1efc5ad26b93e2cd51ceeedc18451:c986c5f6a979289c7da5146868b6832198835f656eb3c9683d597fa781ae64b2bd9684db0cfff6a64fcd630a2a46fbece8858f4ad9eccb394844e591a8cb35d8",
    email : "mougel.david.pro@gmail.com",
    username : "Naflouille",
    first_name : "David",
    last_name : "Mougel",
    country : "France",
    language : "en",
    city : "Paris",
    postal_code : "75000",
    address : "Naflows Street",
    address_complement : "Apt 42",
    phone_number : "0123456789",
    phone_verified : true,
    email_verified : true,
    profile_picture : "https://avatars.githubusercontent.com/u/188961317?s=400&u=d2b087040380d0a38c83fa26469d1bc919d0bf74&v=4",
    services : {
        0 : {
            rights : ["ADMINISTRATOR"],
            joined_at: new Date().getTime(),
            active : true,
            data_preferences : {
                usage_data : "FULL",
                personal_data : [
                    "PHONE",
                    "EMAIL",
                    "FIRST AND LAST NAME",
                    "ACCOUNT SECURITY MEASURES",
                    "BILLING DETAILS"
                ],
            }
        },
        1 : {
            rights : ["USER"],
            joined_at: new Date().getTime(),
            active : true,
            data_preferences : {
                usage_data : "FULL",
                personal_data : [
                    "EMAIL",
                    "FIRST AND LAST NAME",
                ],
            }
        },
        2 : {
            rights : ["USER"],
            joined_at: new Date().getTime(),
            active : false,
            data_preferences : {
                usage_data : "FULL",
                personal_data : [
                    "PHONE",
                    "EMAIL",
                ],
            }
        }
    },
    created_at : new Date().getTime(),
    last_update : new Date().getTime(),
    last_login : new Date().getTime(),
};


console.log("----- Configuration settings --------")
console.log("SMTP Host:", process.env.SMTP_HOST);
console.log("SMTP Port:", process.env.SMTP_PORT);
console.log("SMTP Secure:", process.env.SMTP_SECURE);
console.log("SMTP User:", process.env.SMTP_USER);
console.log("SMTP Pass:", process.env.SMTP_PASS);

(async () => {
  const s = await mailing.send(
    'Naflows',
    "mougel.david.pro@gmail.com",
    " « Naflows » account verification ",
    (await mailing.patterns.customLink("503514", dummyUser,"Naflows"))
  );
  console.log(s);
})();