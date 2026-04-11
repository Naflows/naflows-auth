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
