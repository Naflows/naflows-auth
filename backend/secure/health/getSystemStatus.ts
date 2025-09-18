

export default async function getSystemStatus() {
    // Get docker running status & RAM / CPU / Disk usage
    const os = await import('os');
    const si = await import('systeminformation');

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = (usedMem / totalMem) * 100;
    const cpuLoad = await si.currentLoad();
    const disk = await si.fsSize();
    const diskUsagePercent = disk.length > 0 ? disk[0].use : 0;


    return {
        status: 200,
        message: "System status retrieved successfully",
        success: true,
        data: {
            memory: {
                usagePercent: memUsagePercent.toFixed(2)
            },
            cpu: {
                load: cpuLoad.currentLoad,
                model: os.cpus()[0].model,
                cores: os.cpus().length
            },
            disk: {
                usagePercent: diskUsagePercent.toFixed(2)
            },
            software: {
                version: process.env.NASS_VERSION || "unknown",
                environment: process.env.NODE_ENV || "development",
                platform: os.platform(),
                architecture: os.arch(),
                name: process.env.NASS_NAME || "NASS Auth Service",
                author: "Naflows"
            }
        }
    };
}
