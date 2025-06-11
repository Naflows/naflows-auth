"use strict";

db = db.getSiblingDB('NASS');
db.createCollection('users');
db.createCollection('sessions');
db.createCollection('tokens'); // User tokens, used for authentication

db.createCollection('connections'); // Service connections for direct access to the NASS

db.createCollection('service-tokens'); // Tokens for services to authenticate with the NASS

db.createCollection('nass_contracts');
db.createCollection('blacklist');
db.createCollection('logs');
db.createCollection('requests'); // Logging requests to the NASS

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
db.connections.createIndex({
  id: 1
}, {
  unique: true
});
db.connections.createIndex({
  ip: 1
});
db.connections.createIndex({
  token_id: 1
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
});
db.users.insertOne({
  id: 1,
  identifier: "100000:bb27678ee563cd25c9dd1ada61c35dfe:6d4e898c7ff538f3e812ef214aaacc047b5cadb651468cd8fdf90e5f00923aa84b9870bb37d73b2c5ccd6d2a0f713d884fc2111e55cdae59d26820d97edbb738",
  password: "100000:2c81db81a7fef7d38788dfd20e07b7bd:964121f6ee65a9e0a70764956de9b5d054cf268124ecefe72f27b64af92aec15476a4a9393da274d6c557c6ae4b6192d7ff56b0a51e626969d1274ed8f92a1be",
  email: "administration@naflows.com",
  username: "NAFLOWS",
  rights: "SUPER_ADMIN",
  created_at: new Date().getTime(),
  updated_at: new Date().getTime()
});