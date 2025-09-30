import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../../types/ServicesForUserProps";
import CreateServiceDescription, { type ServiceDescriptionProps } from "../../../create/sub-component/ServiceDescription";
import SaveChanges from "../../../../../root/components/save";
import Alert, { type AlertContentProps } from "../../../../../global/error-alert/Alert";
import savePublicServiceData from "./scripts/save-changes";


const ManageServiceEdition = ({
    service
}: {
    service: ServicesForUserProps
}) => {

    const [newService, setNewService] = useState<ServiceDescriptionProps>({
        name: service.name,
        description: service.description || "",
        profileImage: service.picture || "",
        allow_public_visibility: service.public_settings.allow_public_visibility,
        bannerImage: service.banner || "",
        id: service.id
    });

    const [isDirty, setIsDirty] = useState(false);
    const [alert, setAlert] = useState<AlertContentProps>({
        status: 0,
        message: "",
        success: false,
        closeAlert: true,
    })

    useEffect(() => {
        if (service) {
            setIsDirty(
                newService.name !== service.name ||
                newService.description !== (service.description || "") ||
                newService.profileImage !== (service.picture || "") ||
                newService.allow_public_visibility !== service.public_settings.allow_public_visibility ||
                newService.bannerImage !== (service.banner || "")
            )
        }
    }, [newService])




    return (
        <>
            <Alert alert={alert} setAlert={setAlert} />
            <SaveChanges onChange={() => {
                savePublicServiceData(newService, setAlert, setIsDirty);
            }}
                appear={isDirty}
            />
            <div className="manage__service__body">
                <div className="services__creation__body user__body__section">
                    <CreateServiceDescription serviceDescription={newService} setServiceDescription={setNewService} editMode={true} />
                </div>

            </div>
        </>
    );
}

export default ManageServiceEdition;