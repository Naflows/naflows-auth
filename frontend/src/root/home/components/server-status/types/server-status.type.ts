export interface ServerStatus {
  data: {
    memory: { usagePercent: string };
    cpu: { load: number; model: string; cores: number };
    disk: { usagePercent: string };
    software: {
      version: string;
      environment: string;
      platform: string;
      architecture: string;
      name: string;
      author: string;
    };
  };
  status: number;
  message: string;
}