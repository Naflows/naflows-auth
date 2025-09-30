import type { ServicesForUserProps } from "../../../../../types/ServicesForUserProps"
import SecurityMeasures from "../../sub-component/SecurityMeasures"
import ServiceCapacities from "../../sub-component/ServiceCapacities"
import ServiceDescription from "../../sub-component/ServiceDescription"


const ManageServiceOverview = ({
    service,
} : {
    service : null | ServicesForUserProps
}) => {
    return (
        <div className="manage__service__body">
            <div
                className="parent__of__section row__layout service__manage__content"
                style={{
                    width: "100%"
                }}
            >
                <div className="parent__of__section column__layout first__row" style={{
                    flex: 1.5,
                    height: "max-content",
                    justifyContent: "space-between",
                    alignSelf: "stretch",
                    minHeight: "100%"
                }}>
                    <div className="parent__of__section row__layout" style={{
                        flex: 1,

                    }}>
                        <ServiceDescription service={service} />
                    </div>
                </div>
                <SecurityMeasures service={service} />

                <div className=" second__management__content" style={{
                    maxWidth: "350px",
                }}>

                    <ServiceCapacities service={service} />
                </div>
            </div>
        </div>
    )
}

export default ManageServiceOverview;