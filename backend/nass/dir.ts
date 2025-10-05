import { initInstance } from "./methods/init-instance";
import { connectInstace } from "./methods/connect-instance";
import { isServiceActive } from "./methods/activity";

// For ALL nass related functions, make a "test" instance for developers to test their code locally and a "live" instance for production use.

const nass = {
    instance : {
        init : initInstance,
        connection : connectInstace,
        isActive : isServiceActive
    }
}

export default nass;