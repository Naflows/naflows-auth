import { getService } from "./get-service";
import { registerService } from "./register.service";



export const services = {
    service: {
        register : registerService,
        get : getService
    }
}