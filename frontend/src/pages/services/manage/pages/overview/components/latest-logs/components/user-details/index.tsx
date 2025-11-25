import { hslToRgba } from "../../../../../../../../../scripts/styling/hslToRgba";
import type { Log } from "../../../../../../../../../types/Logs.type";


const LogUserDetails = ({
    log
}: {
    log: Log | null
}) => {
    if (log != null && log.metadata && log.metadata.userData) {
        console.log("Rendering user details for log:", log);
        return (
            <div className="log__user__more">
                <div className="log__user__more__header">
                    {log.metadata.userData.picture && (
                        <img
                            src={log.metadata.userData.picture}
                            alt={`${log.metadata.userData.first_name ?? ""} ${log.metadata.userData.last_name ?? ""}`}
                            style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                        />
                    )}
                    <div className="log__user__placeholder">
                        <span className="log__user__name">
                            {log.metadata.userData.first_name ?? ""}{" "}
                            {log.metadata.userData.last_name ?? ""}
                        </span>
                        <span className="log__user__username">
                            @{log.metadata.userData.username || "Unknown User"}
                        </span>
                    </div>
                </div>
                <div className="log__rights__content">
                    <span className="log__rights__title">Rights</span>
                    <div className="rights__container__list">
                        {log.metadata.userData.rights && log.metadata.userData.rights.length > 0 ? (
                            log.metadata.userData.rights.map((right) => (
                                <div className="log__right">
                                    <div className="log__right__color" style={{
                                        backgroundColor: hslToRgba(parseInt(right.hue), 70, 50, 1)
                                    }}></div>
                                    <span className="log__right__name">{right.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="log__right">
                                <div className="log__right__color" style={{
                                    backgroundColor: "#ccc"
                                }}></div>
                                <span className="log__right__name">No Rights</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default LogUserDetails;