const db = db.getSiblingDB('NASS');



db.createCollection('users');
db.createCollection('sessions');
db.createCollection('tokens'); // User tokens, used for authentication
db.createCollection('services'); // Service connections for direct access to the NASS
db.createCollection("pictures"); // User and service pictures storage
db.createCollection('service_tokens'); // Tokens for services to authenticate with the NASS
db.createCollection('service_logs'); // Logs for services to log actions and events
db.createCollection('nass_api_keys');
db.createCollection('blacklist');
db.createCollection('logs');
db.createCollection('requests'); // Logging requests to the NASS
db.createCollection('user_connections'); // Connections between users and services

db.createCollection('mailings'); // Mailing list for notifications and updates
db.createCollection('notifications'); // User notifications


db.createCollection('security_codes'); // Security codes for actions like email verification, password reset, etc.
db.createCollection('2fa_logs'); // Logs for 2FA actions



db.createCollection('service_rights');
db.createCollection('instance_tunneling_rights');
db.createCollection('user_rights');
db.createCollection('service_tunneling');
db.createCollection('service_devs'); // Service developers


const users = db.getCollection('users');
const sessions = db.getCollection('sessions');
const tokens = db.getCollection('tokens');
const services = db.getCollection('services');
const service_tokens = db.getCollection('service_tokens');
const nass_api_keys = db.getCollection('nass_api_keys');
const blacklist = db.getCollection('blacklist');
const logs = db.getCollection('logs');
const requests = db.getCollection('requests');
const mailings = db.getCollection('mailings'); // Mailing list for notifications and updates
const securityCodes = db.getCollection('security_codes'); // Security codes for actions like email verification, password reset, etc.
const twofaLogs = db.getCollection('2fa_logs'); // Logs for 2FA actions
const notifications = db.getCollection('notifications'); // User notifications

const userConnections = db.getCollection('user_connections'); // Connections between users and services

const serviceLogs = db.getCollection('service_logs'); // Logs for services to log actions and events

const serviceRights = db.getCollection('service_rights'); // Rights for services
const instanceTunnelingRights = db.getCollection('instance_tunneling_rights'); // Rights for instance tunneling

const userRights = db.getCollection('user_rights'); // Rights for users

const serviceTunneling = db.getCollection('service_tunneling'); // Service tunneling configurations
const serviceDevs = db.getCollection('service_devs'); // Service developers


const service_traffic = db.getCollection('service_traffic'); // Service traffic logs

const pictures = db.getCollection('pictures');


// Create indexes for the collections to improve performance and ensure uniqueness where necessary
db.users.createIndex({ id: 1 }, { unique: true });
db.users.createIndex({ identifier: 1 }, { unique: true });

db.sessions.createIndex({ id: 1 }, { unique: true });
db.sessions.createIndex({ user_id: 1 });
db.sessions.createIndex({ expires_at: 1 });

db.tokens.createIndex({ id: 1 }, { unique: true });
db.tokens.createIndex({ user_id: 1 });
db.tokens.createIndex({ expires_at: 1 });
db.tokens.createIndex({ frozen_until: 1 });
db.tokens.createIndex({ session_id: 1 });


db.services.createIndex({ id: 1 }, { unique: true });
db.services.createIndex({ ip_address: 1 });

db.nass_api_keys.createIndex({ id: 1 }, { unique: true });
db.nass_api_keys.createIndex({ apiId: 1 }, { unique: true });
db.nass_api_keys.createIndex({ key: 1 }, { unique: true });

db.blacklist.createIndex({ id: 1 }, { unique: true });
db.blacklist.createIndex({ ip: 1 }, { unique: true });

db.logs.createIndex({ id: 1 }, { unique: true });

db.requests.createIndex({ id: 1 }, { unique: true });
db.requests.createIndex({ associated_service: 1 });
db.requests.createIndex({ ip: 1 });

db.service_tokens.createIndex({ token: 1 }, { unique: true });

db.userConnections.createIndex({ id: 1 }, { unique: true });
db.userConnections.createIndex({ user_id: 1 });
db.userConnections.createIndex({ service_id: 1 });


db.mailings.createIndex({ id: 1 }, { unique: true });
db.mailings.createIndex({ email: 1 }, { unique: true });
db.mailings.createIndex({ created_at: 1 });
db.mailings.createIndex({ subscribed: 1 });

db.security_codes.createIndex({ id: 1 }, { unique: true });
db.security_codes.createIndex({ user_id: 1 });
db.security_codes.createIndex({ code: 1 });
db.security_codes.createIndex({ expires_at: 1 });

db.notifications.createIndex({ id: 1 }, { unique: true });
db.notifications.createIndex({ user_id: 1 });
db.notifications.createIndex({ created_at: 1 });
db.notifications.createIndex({ read: 1 });

db.service_logs.createIndex({ id: 1 }, { unique: true });
db.service_logs.createIndex({ service_id: 1 });
db.service_logs.createIndex({ created_at: 1 });

db.service_rights.createIndex({ id: 1 }, { unique: true });
db.service_rights.createIndex({ service_id: 1 });
db.service_rights.createIndex({ type: 1 });
db.instance_tunneling_rights.createIndex({ id: 1 }, { unique: true });
db.instance_tunneling_rights.createIndex({ name: 1 }, { unique: true });


db.user_rights.createIndex({ id: 1 }, { unique: true });
db.user_rights.createIndex({ user_id: 1 });

db.service_tunneling.createIndex({ id: 1 }, { unique: true });
db.service_tunneling.createIndex({ service_id: 1 });
db.service_tunneling.createIndex({ target_url: 1}, { unique: true });

db.service_devs.createIndex({ id: 1 }, { unique: true });
db.service_devs.createIndex({ service_id: 1 });

db.service_traffic.createIndex({ id: 1 }, { unique: true });
db.service_traffic.createIndex({ service_id: 1 });

db.twofaLogs.createIndex({ id: 1 }, { unique: true });
db.twofaLogs.createIndex({ user_id: 1 });
db.twofaLogs.createIndex({ action: 1 });
db.twofaLogs.createIndex({ created_at: 1 });


db.pictures.createIndex({ id: 1 }, { unique: true });

// See the .env file in the root directory of the naflows-system repository for the unhashed password
db.users.insertOne({
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
        "naflows_backend" : {
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
        "moo_deng_bar" : {
            rights : ["USER"],
            joined_at: new Date().getTime(),
            active : true,
            data_preferences : {
                usage_data : "FULL",
                personal_data : "ANONYMOUS",
                personal_data : [
                    "EMAIL",
                    "FIRST AND LAST NAME",
                ],
            }
        },
        "the_pookie_shop" : {
            rights : ["USER"],
            joined_at: new Date().getTime(),
            active : false,
            data_preferences : {
                usage_data : "FULL",
                personal_data : "IDENTIFIED",
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
    birthdate : new Date("1990-01-01").getTime()
});

db.users.insertOne({
    id : "2",
    identifier : "100000:137db0ce6e8b0b238a304614ebc5dc33:64c94524560e67d1e78a96dc67ba92af545d490077fa2e5b13473107f6b7f5e7a6841f89eea8a7cd6ac740969b521f82fb88cd815d6b3f26d96677ef7c224dfe",
    password : "100000:137db0ce6e8b0b238a304614ebc5dc33:64c94524560e67d1e78a96dc67ba92af545d490077fa2e5b13473107f6b7f5e7a6841f89eea8a7cd6ac740969b521f82fb88cd815d6b3f26d96677ef7c224dfe",
    email : "eadjjawn@gmail.com",
    username : "The Penguin",
    first_name : "Oswald",
    last_name : "Cobblepot",
    profile_picture : "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.uIM2fG4I4rMhoGWm1PG0PgHaMD%3Fpid%3DApi&sp=1758813750T7b7eefd8e6cccadb8df319c8d18806d26d7f31e06337f3d6992a13e8301fcbcb",
    services : {
        "moo_deng_bar" : {
            rights : ["USER"],
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
        "the_pookie_shop" : {
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
        }
    },
    created_at : new Date().getTime(),
    updated_at : new Date().getTime()
})


db.users.insertOne({
    id : "3",
    identifier : "100000:bde933e36fd5ba991a274b3eca227195:8d9cdf2aa5dc7b52ac7d3e6ae6086f3a27f2c53d08827bd9e4cc9534935e906602da9545d5580c22e38905b3c2aaa1b8d86a06542f6379a57409c4c1ae03a838",
    password : "100000:bde933e36fd5ba991a274b3eca227195:8d9cdf2aa5dc7b52ac7d3e6ae6086f3a27f2c53d08827bd9e4cc9534935e906602da9545d5580c22e38905b3c2aaa1b8d86a06542f6379a57409c4c1ae03a838",
    email : "dummy@gmail.com",
    username : "Dummy User Session Expired",
    services : {
        1 : {
            rights : ["USER"],
            joined_at: new Date().getTime(),
            active : true
        }
    },
    created_at : new Date().getTime(),
    updated_at : new Date().getTime()
})



db.sessions.insertOne({
    id: "1",
    user_id: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    ip : "1.1.1.2",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-1",
    expires_at: new Date().getTime() + 1000 * 60 * 60 * 24 * 10000, // 24 hours
    created_at: new Date().getTime(),
    token_id: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
    last_activity: new Date().getTime(),
    service_id: "1",
    active : true,
    supertest : true
})

db.sessions.insertOne({
    id: "2",
    user_id: "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
    ip : "1.1.1.3",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-2",
    expires_at: new Date().getTime() - 1000 * 60 * 60 * 24, // Expired session
    created_at: new Date().getTime() - 1000 * 60 * 60 * 24, // Created 24 hours ago
    token_id: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    last_activity: new Date().getTime() - 1000 * 60 * 60 * 24, // Last activity 24 hours ago
    service_id : "2",
    active : true,
    supertest : true
});

db.sessions.insertOne({
    id : "3",
    user_id : "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    ip : "5.5.5.5",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-3",
    expires_at: new Date().getTime() + 1000 * 60 * 60 * 10000, // 1000 hours
    created_at: new Date().getTime(),
    token_id: "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
    last_activity: new Date().getTime(),
    service_id : "3",
    active : true,
    supertest : true
})

db.tokens.insertOne({
    id : "1",
    token : "100000:78f3190a46b65297fc09746096c41f3e:d4315b094991b076800d174f1c5f6caff167999b93837a3c2b24097190c0828a1afbdbb5fd8c4d05e4446838e0374f934c41bb73dad6ed26846650252914e299",
    user_id : "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    session_id : "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
    rights : ["USER_READ_OWN","USER_EDIT_OWN"],
    created_at : new Date().getTime(),
    expires_at : new Date().getTime() + 1000 * 60 * 60 * 24, // 24 hours
    renewable : true,
    frozen_until : null,
    frozen_at: null,
    uses : 0,
    enabled : true,
    max_uses : 1000, // Unlimited uses
});

db.tokens.insertOne({
    id : "2",
    token : "100000:30d90e3400f273e7878002b8109b8429:ea813c082f49336693f4d40b8cef124d511a11922f7525bc8effb096969d8a67055baf108893457ba7317f835dace357aba19191af7b90a71b715e1e6c2d62e7",
    user_id : "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
    session_id : "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
    rights : ["USER_READ_OWN","USER_EDIT_OWN"],
    created_at : new Date().getTime(),
    expires_at : new Date().getTime() + 1000 * 60 * 60 * 24, // 24 hours
    renewable : true,
    frozen_until : null,
    frozen_at: null,
    uses : 0,
    enabled : true,
    max_uses : 1000, // Unlimited uses
});

db.tokens.insertOne({
    id : "3",
    token : "100000:f0d5f25a65c22f6007ebebe206746c02:8ddf11c1cfecad25c5bf63dbf31c3ceb9b860bd6bd3bc61facf7a1d8c424a5c3c47324c2f6467b578b832584bba538a1e5d66afea2ebba41ccfd54bee0af61aa",
    user_id : "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    session_id : "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
    rights : ["USER_READ_OWN","USER_EDIT_OWN"],
    created_at : new Date().getTime() - 10,
    expires_at : new Date().getTime() - 5, 
    renewable : true,
    frozen_until : 0, // Frozen for 30 seconds
    frozen_at: Date.now(), // Frozen now
    uses : 0,
    enabled : true,
    max_uses : 1000, // Unlimited uses
    supertest : true,
});



// Dummy data for testing purposes - should be removed in production
/*
    The following data is only available in the NASS. 
*/
db.services.insertOne({
    id: "1",
    name : "Test Service : token is not expired",
    ip_address : "::ffff:172.18.0.6",
    dns : "local.nass.com",
    description : "This is a test service for the NASS.",
    created_at : 123456789,
    created_by : "NASS",
    status : "ACTIVE",
    service_token : "1"
})

db.services.insertOne({
    id: "2",
    name : "Test Service : token is expired",
    ip_address : "::ffff:172.18.0.6",
    dns : "local.nass.com",
    description : "This is a test service for the NASS.",
    created_at : new Date().getTime(),
    created_by : "NASS",
    status : "ACTIVE",
    service_token : "2"
})

db.services.insertOne({
    id: "3",
    name : "Test Service : expired",
    ip_address : "::ffff:172.18.0.6",
    dns : "local.nass.com",
    description : "This is a test service for the NASS.",
    created_at : new Date().getTime(),
    created_by : "NASS",
    status : "INACTIVE",
    service_token : "3"
})

db.services.insertOne({
    id : "test_aim_id",
    name : "Contracts Service",
    ip_address : "::ffff:172.18.0.6",
    dns : "contracts.nass.com",
    description : "This is a test service for the NASS.",
    created_at : new Date().getTime(),
    created_by : "NASS",
    status : "ACTIVE",
    service_token : "contracts_service_token"
})





db.service_tokens.insertOne({
    id : "1",
    service_id : "1",
    token : "test-service-token",
    created_at :1750658147765,
    lifespan: 1000 * 60 * 60 * 24 * 10000,
    uses : 0  
})

db.service_tokens.insertOne({
    id : "2",
    service_id : "2",
    token : "test-service-token-expired",
    created_at :1749962909, // 24 hours ago
    lifespan: 1, // 24 hours
    uses : 0
})


db.service_tokens.insertOne({
    id : "3",
    service_id : "3",
    token : "test-service-token-inactive",
    created_at : new Date().getTime(),
    lifespan: 1000 * 60 * 60 * 24 * 100, // 24 hours
    uses : 0  
})

db.service_tokens.insertOne({
    id : "contracts_service_token",
    service_id : "test_aim_id",
    token : "contracts_service_token",
    created_at : new Date().getTime(),
    lifespan: 1000 * 60 * 60 * 24 * 100, // 24 hours
    uses : 0
})


/* -------------------------------- */
db.services.insertOne({
    id : "naflows_backend",
    name : "Naflows Backend Structure",
    ip_address : ["172.28.0.10","193.70.115.114"], // ::ffff:172.18.0.4
    dns : "nass.naflows.com",
    description : "The Naflows Backend Structure for secure API communication.",
    created_at : new Date().getTime(),
    created_by : "1",
    status : "ACTIVE",
    picture : "https://avatars.githubusercontent.com/u/188961317?s=200&v=4",
    banner : "https://www.naflows.com/public/showcase/banners/nass-banner.png",
    settings : {
        rates : 10000,
        allow_nass_payement_method : true, // Whether the service allows payment through NASS
    },
    plan : {
        plan : "ENTREPRISE",
        type : "CLOUD",
        used_space : 20480, // in MB
        size : 2048, // in GB
    },
    public_settings : {
        allow_user_registration : true,
        allow_service_connection : true,
        allow_public_visibility : true,
        required_data : [
            "PHONE",
            "EMAIL",
            "FIRST AND LAST NAME",
            "ADDRESS",
            "BIRTHDATE",
            "ACCOUNT SECURITY MEASURES",
            "BILLING DETAILS"
        ]
    },
    details : {
        users : 1, // Number of users in the service
        official : true, // Whether the service is official or third-party
    },
    public : {
        privacy_policy_url : "https://www.naflows.com/legal/privacy-policy",
        terms_of_service_url : "https://www.naflows.com/legal/terms-of-service",
        contact_email : "support@naflows.com"
    }
})

db.nass_api_keys.insertOne({
    id : "naflows_backend_key",
    apiId : "naflows_backend",
    issuerId: "1",
    issuedAt : new Date().getTime(),
    expiresAt : 1000000000000000000, // Never expires
    key : "naflows_backend_key"
})

db.service_tokens.insertOne({
    id : "naflows_backend_token",
    service_id : "naflows_backend",
    token : "naflows_backend_token",
    created_at : new Date().getTime(),
    lifespan: 1000 * 60 * 60 * 24 * 1000000000000000000, // Infinite
    uses : 0
});


db.service_logs.insertOne({
    id: "log_1",
    service_id: "naflows_backend",
    message: "Service started successfully.",
    level: "INFO",
    created_at: new Date().getTime(),
    metadata: {
        user_id: "1",
        ip_address: "::ffff:172.18.0.4"
    },
    type: "STATUS"
});


/* TEST PURPOSES - TO BE REMOVED IN PRODUCTION */
db.services.insertOne({
    id : "moo_deng_bar",
    name : "Moo Deng Bar",
    ip_address : ["dummy-api"], 
    dns : "moo-deng-bar.naflows.com",
    description : "Moo Deng Bar Service for testing purposes.",
    created_at : new Date().getTime(),
    created_by : "NASS",
    status : "ACTIVE",
    service_token : "moo_deng_bar_token",
    picture : "https://avatars.githubusercontent.com/u/188961317?s=200&v=4",
    banner : "https://www.naflows.com/public/showcase/banners/nass-banner.png",
    settings : {
        rates : 1000, // 1000 requests per second
        allow_nass_payement_method : true, // Whether the service allows payment through NASS
        ram : "512MB", // RAM allocated to the service
        cpu : "1 CORE" // CPU allocated to the service
    },
    plan : {
        plan : "FREE",
        type : "CLOUD",
        used_space : 6512, // in MB
        size : 32, // in GB
    },
    public_settings : {
        allow_user_registration : true,
        allow_service_connection : true,
        allow_public_visibility : true,
        required_data : [
            "EMAIL",
            "FIRST AND LAST NAME"
        ]
    },
    details : {
        users : 2, // Number of users in the service
        official : false, // Whether the service is official or third-party
    },
    public : {
        privacy_policy_url : "https://moo-deng-bar.naflows.com/privacy-policy",
        terms_of_service_url : "https://moo-deng-bar.naflows.com/terms-of-service",
        contact_email : "support@moo-deng-bar.naflows.com"
    }
})

db.service_tokens.insertOne({
    id : "moo_deng_bar_token",
    service_id : "moo_deng_bar",
    token : "moo_deng_bar_token",
    created_at : new Date().getTime(),
    lifespan: 1000 * 60 * 60 * 24 * 1000000000000000000, // Infinite
    uses : 0
})

db.services.insertOne({
    id : "the_pookie_shop",
    name : "The Pookie Shop",
    ip_address : ["dummy-api"],
    dns : "the-pookie-shop.naflows.com",
    description : "The Pookie Shop Service for testing purposes.",
    created_at : new Date().getTime(),
    created_by : "2",
    status : "INACTIVE",
    service_token : "the_pookie_shop_token",
    picture : "https://avatars.githubusercontent.com/u/188961317?s=200&v=4",
    banner : "https://www.naflows.com/public/showcase/banners/nass-banner.png",
    settings : {
        rates : 1000,
        allow_nass_payement_method : false, // Whether the service allows payment through NASS
        ram : "1GB", // RAM allocated to the service
        cpu : "2 CORES" // CPU allocated to the service
    },
    plan : {
        plan : "PRO",
        type : "CLOUD",
        used_space : 0, // in MB
        size : 32, // in GB
    },
    public_settings : {
        allow_user_registration : true,
        allow_service_connection : true,
        allow_public_visibility : true,
        required_data : [
            "PHONE",
            "EMAIL",
            "FIRST AND LAST NAME",
            "BILLING DETAILS"
        ]
    },
    details : {
        users : 2, // Number of users in the service
        official : false, // Whether the service is official or third-party
    },
    public : {
        privacy_policy_url : "https://the-pookie-shop.naflows.com/privacy-policy",
        terms_of_service_url : "https://the-pookie-shop.naflows.com/terms-of-service",
        contact_email : "support@the-pookie-shop.naflows.com"
    }
})

db.service_tokens.insertOne({
    id : "the_pookie_shop_token",
    service_id : "the_pookie_shop",
    token : "the_pookie_shop_token",
    created_at : new Date().getTime(),
    lifespan: 1000 * 60 * 60 * 24 * 1000000000000000000, // Infinite
    uses : 0
})
/* END OF TEST PURPOSES */