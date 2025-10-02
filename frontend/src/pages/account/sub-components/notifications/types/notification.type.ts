
export interface Notification {
  id: string;
  user_id: string; // User ID, the user that owns the notification
  title: string; // Title of the notification
  message: string; // Message of the notification
  link?: string; // Link associated with the notification, optional
  created_at: number; // Date when the notification was created
  read: boolean; // Whether the notification has been read or not
  read_at?: number; // Date when the notification was read, if read is true
  type: "INFO" | "WARNING" | "ALERT"; // Type of the notification
  associated_service?: string; // Service ID, the service that generated the notification, if any
}