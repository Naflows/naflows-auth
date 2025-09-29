import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../../types/ServicesForUserProps";
import CreateServiceDescription, { type ServiceDescriptionProps } from "../../../create/sub-component/ServiceDescription";
import SaveChanges from "../components/save";
import Alert, { type AlertContentProps } from "../../../../../global/error-alert/Alert";
import axios from "axios";
import Loader from "../../../../../global/components/Loader";


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


    async function saveChangesToServer() {
        setAlert({
            status: 0,
            success: true,
            closeAlert: false,
            message: (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "100%",
                }}>
                    <span>Saving changes made to <strong>{newService.name}</strong></span>
                    <Loader loading={true} />
                </div>
            )
        })
        try {
            const response = await axios.put(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/update`, {
                serviceDetails: {
                    name: newService.name,
                    description: newService.description,
                    profileImage: newService.profileImage,
                    allow_public_visibility: newService.allow_public_visibility,
                    bannerImage: newService.bannerImage,
                    id: newService.id
                }
            }, {
                withCredentials: true
            });
            if (response.status === 200) {
                setAlert({
                    status: 200,
                    message: "Changes saved successfully.",
                    success: true,
                    closeAlert: false,
                })
                setIsDirty(false);
            } else {
                setAlert({
                    status: response.status,
                    message: "Failed to save changes. Please try again.",
                    success: false,
                    closeAlert: false,
                })
            }
        } catch (error) {
            console.error("Error saving changes:", error);
            setAlert({
                status: 500,
                message: "An error occurred while saving changes. Please try again.",
                success: false,
                closeAlert: false,
            })
        }
    }

    return (
        <>
            <Alert alert={alert} setAlert={setAlert} />
            <SaveChanges onChange={() => {
                saveChangesToServer();
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