
export interface TrafficLogEntry {
    type : "USER" | "DEVELOPER", // Type of traffic log entry
    id : string; // Unique ID for the traffic log entry
    timestamp: number; // Timestamp of the request
    endpoint: string; // Endpoint that was accessed
    method: string; // HTTP method used
}

export interface ServiceTraffic {
  id: string; // Traffic log ID
  service_id: string; // Service ID, the service that owns the traffic log
  requests : TrafficLogEntry[]; // Array of traffic log entries
}


