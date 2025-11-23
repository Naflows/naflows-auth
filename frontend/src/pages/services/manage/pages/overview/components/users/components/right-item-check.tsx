import type { ServiceUser } from "../../../../../../../../types/ServicesForUserProps";
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes";
import ServiceRightsSmall from "./small-right";


const RightItemCheck = ({
    list,
    setCurrentRights,
    setFiltered,
    setCurrentAllTypes,
    userRights
}: {
    list: ServiceRights[],
    filtered: ServiceRights[],
    setCurrentRights: React.Dispatch<React.SetStateAction<ServiceUser["rights"]>>,
    setFiltered: React.Dispatch<React.SetStateAction<ServiceRights[]>>,
    setCurrentAllTypes: React.Dispatch<React.SetStateAction<ServiceUser["rights"]>>;
    userRights?: ServiceUser["rights"];
}) => {

    
    return (

        list.map((right) => {
            const selected = userRights ? userRights.some(ur => ur.id === right.id) : false;

            return (
                <div className={`item ${right.can_edit ? "editable" : "not-editable"} ${selected ? "selected" : ""}`} 
                    onClick={() => {
                        if (!right.can_edit) return;

                        if (selected) {
                            // Remove from currentRights
                            setCurrentRights(prev => prev.filter(r => r.id !== right.id));
                            // Add to filtered
                            setFiltered(prev => [...prev, right as ServiceRights]);
                            setCurrentAllTypes(prev => prev.filter(r => r.id !== right.id));
                        } else {
                            // Add to currentRights
                            setCurrentRights(prev => [...prev, right as ServiceUser["rights"][0]]);
                            // Remove from filtered
                            setFiltered(prev => prev.filter(r => r.id !== right.id));
                            setCurrentAllTypes(prev => [...prev, right as ServiceUser["rights"][0]]);
                        }
                    }}
                >
                    <ServiceRightsSmall key={right.id} id={right.id} name={right.name} hue={right.hue} />
                    <input type="checkbox" 
                        // Checkbox is checked if the right is in currentRights

                        // Apply color based on right hue - background, filled, border
 
                        checked={userRights ? userRights.some(ur => ur.id === right.id) : selected}
                        readOnly
                    />
                </div>
            )
        })

    )
}

export default RightItemCheck;