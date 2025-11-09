import type { ServiceUser } from "../../../../../../../../types/ServicesForUserProps";
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes";
import SmallRight from "./small-right";


const RightItemCheck = ({
    list,
    setCurrentRights,
    setFiltered,
    selected,
    setCurrentAllTypes
}: {
    list: ServiceUser["rights"] | ServiceRights[],
    filtered: ServiceRights[],
    setCurrentRights: React.Dispatch<React.SetStateAction<ServiceUser["rights"]>>,
    setFiltered: React.Dispatch<React.SetStateAction<ServiceRights[]>>,
    selected?: boolean,
    setCurrentAllTypes: React.Dispatch<React.SetStateAction<ServiceUser["rights"]>>;
}) => {
    return (

        list.map((right) => {
            return (
                <div className="item" style={{
                    backgroundColor: `hsl(${right.hue}deg 70% 50% / 0.2)`,
                    borderColor: `hsl(${right.hue}deg 70% 50% / 0.5)`
                }}

                    onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = `hsl(${right.hue}deg 70% 50% / 0.4)`;
                    }}
                    onMouseLeave={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = `hsl(${right.hue}deg 70% 50% / 0.2)`;
                    }}

                    onClick={() => {
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
                    <SmallRight key={right.id} id={right.id} name={right.name} hue={right.hue} description={right.description} />
                    <input type="checkbox" className="no-fill"
                        // Checkbox is checked if the right is in currentRights
                        checked
                        // Apply color based on right hue - background, filled, border
                        style={{
                            borderColor:  `hsl(${right.hue}deg 70% 50%)`,
                            backgroundColor: selected ? `hsl(${right.hue}deg 70% 50%)` : "transparent",
                        }}

                    // If checked, show a filled checkbox

                    />
                </div>
            )
        })

    )
}

export default RightItemCheck;