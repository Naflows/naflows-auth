"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.db = void 0;
var serve_1 = require("./public/method/serve");
var dir_1 = require("./secure/dir");
var mongoose_1 = require("mongoose");
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
// Connect to the mongo database
var mongoURI = process.env.MONGO_URL || "mongodb://" + process.env.MONGO_INITDB_ROOT_USERNAME + ":" + process.env.MONGO_INITDB_ROOT_PASSWORD + "@mongo:27017/nass?authSource=admin";
console.log("Connecting to MongoDB at:", mongoURI);
// Authenticate and connect to MongoDB
if (!process.env.MONGO_INITDB_ROOT_USERNAME || !process.env.MONGO_INITDB_ROOT_PASSWORD) {
    console.error('MongoDB credentials are not set in environment variables');
    process.exit(1);
}
mongoose_1["default"].connect(mongoURI);
mongoose_1["default"].connection.on('error', function (err) {
    console.error("MongoDB connection error: " + err);
});
// Confirm successful connection
mongoose_1["default"].connection.once('open', function () {
    console.log('Connected to MongoDB');
});
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var ip, blacklistCollection, blacklistedIP;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Middleware to log requests
                console.log(req.method + " request for '" + req.url + "'");
                // Log all req informations 
                console.log('Request Headers:', req.headers);
                console.log('Request Body:', req.body);
                ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                blacklistCollection = mongoose_1["default"].connection.collection("blacklist");
                if (!blacklistCollection) return [3 /*break*/, 2];
                return [4 /*yield*/, blacklistCollection.findOne({
                        ip: ip
                    })];
            case 1:
                blacklistedIP = _a.sent();
                console.log('Related IPs:', blacklistedIP);
                if (blacklistedIP) {
                    console.log("IP " + ip + " is blacklisted.");
                    serve_1.serve("IP Blacklisted", "blacklist.css", "blacklist.html", res, {
                        "blacklist_date": blacklistedIP.date.toISOString(),
                        "blacklist_reason": blacklistedIP.reason
                    });
                    return [2 /*return*/];
                }
                else {
                    console.log("IP " + ip + " is not blacklisted.");
                    next();
                }
                return [3 /*break*/, 3];
            case 2:
                res.status(500).send("Internal server error.");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/blacklist', function (req, res) {
    // Serve the blacklist page 
    serve_1.serve("IP Blacklisted", "blacklist.css", "blacklist.html", res, {
        "blacklist_date": new Date().toISOString(),
        "blacklist_reason": "No reason provided"
    });
});
app.get('/', function (req, res) {
    res.send('Welcome to the Auth API');
});
/*

    WARNING : THIS PART IS THE ONLY ONE THAT IS NOT
    SUBMITTED TO THE NASS.

*/
app.post('/team/add/service/post', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, usersCollection, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                console.log('Received request to add service:', body);
                if (!(body.db_username != process.env.MONGO_INITDB_ROOT_USERNAME || body.db_password != process.env.MONGO_INITDB_ROOT_PASSWORD)) return [3 /*break*/, 2];
                return [4 /*yield*/, dir_1["default"].blacklist(mongoose_1["default"], req, res, "Invalid MongoDB credentials provided when trying to add a new session to the NASS.")];
            case 1:
                _a.sent();
                return [3 /*break*/, 6];
            case 2:
                usersCollection = mongoose_1["default"].connection.collection('users');
                return [4 /*yield*/, usersCollection.findOne({
                        identifier: dir_1["default"].crypt(body.user_identifier)
                    })];
            case 3:
                user = _a.sent();
                if (!(!user ||
                    user === null ||
                    user === undefined ||
                    (user && user.password !== dir_1["default"].crypt(body.user_password) && user.password !== body.user_password))) return [3 /*break*/, 5];
                return [4 /*yield*/, dir_1["default"].blacklist(mongoose_1["default"], req, res, "Invalid user credentials provided when trying to add a new service to the NASS.")];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                console.log("Service added: " + body.name + " - " + body.description);
                // Add connection and service token
                return [2 /*return*/, res.status(200).send("Service " + body.name + " added successfully")];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.get('/team/add/service', function (req, res) {
    serve_1.serve("Add service", "form-style.css", "add-service.html", res);
});
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("NASS is running on http://localhost:" + PORT);
});
exports.db = mongoose_1["default"].connection;
