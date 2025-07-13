const db = db.getSiblingDB('NASS');



db.createCollection('users');
db.createCollection('sessions');
db.createCollection('tokens'); // User tokens, used for authentication
db.createCollection('services'); // Service connections for direct access to the NASS
db.createCollection('service_tokens'); // Tokens for services to authenticate with the NASS
db.createCollection('nass_contracts');
db.createCollection('blacklist');
db.createCollection('logs');
db.createCollection('requests'); // Logging requests to the NASS

const users = db.getCollection('users');
const sessions = db.getCollection('sessions');
const tokens = db.getCollection('tokens');
const services = db.getCollection('services');
const service_tokens = db.getCollection('service_tokens');
const nass_contracts = db.getCollection('nass_contracts');
const blacklist = db.getCollection('blacklist');
const logs = db.getCollection('logs');
const requests = db.getCollection('requests');




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


db.services.createIndex({ id: 1 }, { unique: true });
db.services.createIndex({ ip_address: 1 });
db.services.createIndex({ service_token: 1 }, { unique: true });

db.nass_contracts.createIndex({ id: 1 }, { unique: true });
db.nass_contracts.createIndex({ service: 1 });

db.blacklist.createIndex({ id: 1 }, { unique: true });
db.blacklist.createIndex({ ip: 1 }, { unique: true });

db.logs.createIndex({ id: 1 }, { unique: true });

db.requests.createIndex({ id: 1 }, { unique: true });
db.requests.createIndex({ ip: 1 });



// See the .env file in the root directory of the naflows-system repository for the unhashed password
db.users.insertOne({
    id : 1,
    identifier : "100000:bb27678ee563cd25c9dd1ada61c35dfe:6d4e898c7ff538f3e812ef214aaacc047b5cadb651468cd8fdf90e5f00923aa84b9870bb37d73b2c5ccd6d2a0f713d884fc2111e55cdae59d26820d97edbb738",
    password : "100000:2c81db81a7fef7d38788dfd20e07b7bd:964121f6ee65a9e0a70764956de9b5d054cf268124ecefe72f27b64af92aec15476a4a9393da274d6c557c6ae4b6192d7ff56b0a51e626969d1274ed8f92a1be",
    email : "administration@naflows.com",
    username : "NAFLOWS",
    rights : "SUPER_ADMIN",
    created_at : new Date().getTime(),
    updated_at : new Date().getTime()
});

db.users.insertOne({
    id : 2,
    identifier : "100000:137db0ce6e8b0b238a304614ebc5dc33:64c94524560e67d1e78a96dc67ba92af545d490077fa2e5b13473107f6b7f5e7a6841f89eea8a7cd6ac740969b521f82fb88cd815d6b3f26d96677ef7c224dfe",
    password : "100000:137db0ce6e8b0b238a304614ebc5dc33:64c94524560e67d1e78a96dc67ba92af545d490077fa2e5b13473107f6b7f5e7a6841f89eea8a7cd6ac740969b521f82fb88cd815d6b3f26d96677ef7c224dfe",
    email : "dummy@gmail.com",
    username : "Dummy User Session OK",
    rights : "USER",
    created_at : new Date().getTime(),
    updated_at : new Date().getTime()
})


db.users.insertOne({
    id : 3,
    identifier : "100000:bde933e36fd5ba991a274b3eca227195:8d9cdf2aa5dc7b52ac7d3e6ae6086f3a27f2c53d08827bd9e4cc9534935e906602da9545d5580c22e38905b3c2aaa1b8d86a06542f6379a57409c4c1ae03a838",
    password : "100000:bde933e36fd5ba991a274b3eca227195:8d9cdf2aa5dc7b52ac7d3e6ae6086f3a27f2c53d08827bd9e4cc9534935e906602da9545d5580c22e38905b3c2aaa1b8d86a06542f6379a57409c4c1ae03a838",
    email : "dummy@gmail.com",
    username : "Dummy User Session Expired",
    rights : "USER",
    created_at : new Date().getTime(),
    updated_at : new Date().getTime()
})



db.sessions.insertOne({
    id: "1",
    user_id: 2,
    ip : "1.1.1.2",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-1",
    expires_at: new Date().getTime() + 1000 * 60 * 60 * 24, // 24 hours
    created_at: new Date().getTime(),
    token_id: "1",
    last_activity: new Date().getTime(),
    user_origin: "NASS",
})

db.sessions.insertOne({
    id: "2",
    user_id: 3,
    ip : "1.1.1.3",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-2",
    expires_at: new Date().getTime() - 1000 * 60 * 60 * 24, // Expired session
    created_at: new Date().getTime() - 1000 * 60 * 60 * 24, // Created 24 hours ago
    token_id: "2",
    last_activity: new Date().getTime() - 1000 * 60 * 60 * 24, // Last activity 24 hours ago
    user_origin: "NASS",
});

db.sessions.insertOne({
    id : "3",
    user_id : 2,
    ip : "5.5.5.5",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-3",
    expires_at: new Date().getTime() + 1000 * 60 * 60 * 10000, // 1000 hours
    created_at: new Date().getTime(),
    token_id: "3",
    last_activity: new Date().getTime(),
    user_origin: "NASS",
})


db.tokens.insertOne({
    id : "1",
    token : "test-token",
    user_id : 2,
    session_id : "1",
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
    token : "test-token-2",
    user_id : 3,
    session_id : "2",
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
    token : "test-token-3-frozen",
    user_id : 2,
    session_id : "3",
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
    ip_address : "127.0.0.1",
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
    ip_address : "127.0.0.1",
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
    ip_address : "127.0.0.1",
    dns : "local.nass.com",
    description : "This is a test service for the NASS.",
    created_at : new Date().getTime(),
    created_by : "NASS",
    status : "INACTIVE",
    service_token : "3"
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

