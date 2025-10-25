import { initInstance } from "./methods/init-instance";
import { connectInstance } from "./methods/connect-instance";
import { isServiceActive } from "./methods/activity";
import { checkTokenValidity } from "./methods/check-token";
import { createTunnel } from "./methods/tunnels/create";
import { checkIncomingDevData } from "./methods/secure/dev-data/check-incoming";
import { getTunnel } from "../secure/services/tunnels/methods/get";

// For ALL nass related functions, make a "test" instance for developers to test their code locally and a "live" instance for production use.

const nass = {
    connection : {
        checkIncomingMetadata : checkIncomingDevData
    },
    instance : {
        init : initInstance,
        connection : connectInstance,
        isActive : isServiceActive
    },
    tunnel : {
        create : createTunnel,
        get : getTunnel
    },
    token : {
        valid : checkTokenValidity
    }
}

export default nass;