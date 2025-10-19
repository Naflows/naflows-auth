// ############################################################## //
// Service Traffic Log : logs of the requests made to the service //
// that will be used to display usage statistics and monitor      //
// service health.                                                //
// ############################################################## //



// Since traffic logs can be quite large, we will only store the necessary information
interface TrafficLogEntry {
    type : "USER" | "DEVELOPER", // Type of traffic log entry
    id : string; // Unique ID for the traffic log entry
    timestamp: number; // Timestamp of the request
    endpoint: string; // Endpoint that was accessed
    method: string; // HTTP method used
}

interface ServiceTraffic {
  id: string; // Traffic log ID
  service_id: string; // Service ID, the service that owns the traffic log
  requests : TrafficLogEntry[]; // Array of traffic log entries
}


export { ServiceTraffic, TrafficLogEntry };
