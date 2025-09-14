export interface ServiceStoragePlan {
  plan : "FREE" | "PRO" | "ENTERPRISE";
  type: "LOCAL" | "CLOUD";
  size: 32 | 128 | 512 | 1024; // in GB
  used_space : number; // in MB
}
export interface ServiceSettings {
  rates : 100 | 500 | 1000 | 10000;
}

