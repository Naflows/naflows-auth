"use strict";
exports.__esModule = true;
exports.ServiceModel = void 0;
var mongoose_1 = require("mongoose");
var ServiceSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    created_at: { type: Date, "default": Date.now },
    created_by: { type: String, required: true },
    status: { type: String, "enum": ["ACTIVE", "INACTIVE", "DEPRECATED"], "default": "ACTIVE" },
    dns: { type: String, required: true },
    ip_address: { type: String, required: false },
    service_token: { type: String, required: false }
});
var ServiceModel = mongoose_1.model("Service", ServiceSchema);
exports.ServiceModel = ServiceModel;
