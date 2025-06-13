"use strict";

var db = db.getSiblingDB('NASS');
db.createCollection('users');
db.createCollection('sessions');
db.createCollection('tokens'); // User tokens, used for authentication

db.createCollection('services'); // Service connections for direct access to the NASS

db.createCollection('service_tokens'); // Tokens for services to authenticate with the NASS

db.createCollection('nass_contracts');
db.createCollection('blacklist');
db.createCollection('logs');
db.createCollection('requests'); // Logging requests to the NASS

var users = db.getCollection('users');
var sessions = db.getCollection('sessions');
var tokens = db.getCollection('tokens');
var services = db.getCollection('services');
var service_tokens = db.getCollection('service_tokens');
var nass_contracts = db.getCollection('nass_contracts');
var blacklist = db.getCollection('blacklist');
var logs = db.getCollection('logs');
var requests = db.getCollection('requests'); // Create indexes for the collections to improve performance and ensure uniqueness where necessary

db.users.createIndex({
  id: 1
}, {
  unique: true
});
db.users.createIndex({
  identifier: 1
}, {
  unique: true
});
db.sessions.createIndex({
  id: 1
}, {
  unique: true
});
db.sessions.createIndex({
  user_id: 1
});
db.sessions.createIndex({
  expires_at: 1
});
db.tokens.createIndex({
  id: 1
}, {
  unique: true
});
db.tokens.createIndex({
  user_id: 1
});
db.tokens.createIndex({
  expires_at: 1
});
db.tokens.createIndex({
  frozen_until: 1
});
db.services.createIndex({
  id: 1
}, {
  unique: true
});
db.services.createIndex({
  ip_address: 1
});
db.services.createIndex({
  service_token: 1
}, {
  unique: true
});
db.nass_contracts.createIndex({
  id: 1
}, {
  unique: true
});
db.nass_contracts.createIndex({
  service: 1
});
db.blacklist.createIndex({
  id: 1
}, {
  unique: true
});
db.blacklist.createIndex({
  ip: 1
}, {
  unique: true
});
db.logs.createIndex({
  id: 1
}, {
  unique: true
});
db.requests.createIndex({
  id: 1
}, {
  unique: true
});
db.requests.createIndex({
  ip: 1
}); // See the .env file in the root directory of the naflows-system repository for the unhashed password

db.users.insertOne({
  id: 1,
  identifier: "100000:bb27678ee563cd25c9dd1ada61c35dfe:6d4e898c7ff538f3e812ef214aaacc047b5cadb651468cd8fdf90e5f00923aa84b9870bb37d73b2c5ccd6d2a0f713d884fc2111e55cdae59d26820d97edbb738",
  password: "100000:2c81db81a7fef7d38788dfd20e07b7bd:964121f6ee65a9e0a70764956de9b5d054cf268124ecefe72f27b64af92aec15476a4a9393da274d6c557c6ae4b6192d7ff56b0a51e626969d1274ed8f92a1be",
  email: "administration@naflows.com",
  username: "NAFLOWS",
  rights: "SUPER_ADMIN",
  created_at: new Date().getTime(),
  updated_at: new Date().getTime()
}); // Dummy data for testing purposes - should be removed in production

/*
    The following data is only available in the NASS. 
*/

db.services.insertOne({
  id: "1",
  name: "Test Service : token is not expired",
  ip_address: "127.0.0.1",
  dns: "local.nass.com",
  description: "This is a test service for the NASS.",
  created_at: 123456789,
  created_by: "NASS",
  status: "ACTIVE",
  service_token: "1"
});
db.services.insertOne({
  id: "2",
  name: "Test Service : token is expired",
  ip_address: "127.0.0.1",
  dns: "local.nass.com",
  description: "This is a test service for the NASS.",
  created_at: new Date().getTime(),
  created_by: "NASS",
  status: "ACTIVE",
  service_token: "2"
});
db.services.insertOne({
  id: "3",
  name: "Test Service : expired",
  ip_address: "127.0.0.1",
  dns: "local.nass.com",
  description: "This is a test service for the NASS.",
  created_at: new Date().getTime(),
  created_by: "NASS",
  status: "INACTIVE",
  service_token: "3"
});
db.service_tokens.insertOne({
  id: "1",
  service_id: "1",
  token: "test-service-token",
  created_at: 1749676800,
  expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime(),
  // 24 hours
  lifespan: 1000 * 60 * 60 * 24 * 100,
  // 24 hours
  uses: 0
});
db.service_tokens.insertOne({
  id: "2",
  service_id: "2",
  token: "test-service-token-expired",
  created_at: new Date().getTime(),
  expires_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24).getTime(),
  // 24 hours ago
  lifespan: 1,
  // 24 hours
  uses: 0
});
db.service_tokens.insertOne({
  id: "3",
  service_id: "3",
  token: "test-service-token-inactive",
  created_at: 1749676800,
  expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime(),
  // 24 hours
  lifespan: 1000 * 60 * 60 * 24 * 100,
  // 24 hours
  uses: 0
});