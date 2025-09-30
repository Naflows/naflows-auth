import axios from "axios";
import type { AlertContentProps } from "../../../../../../global/error-alert/Alert";
import GlobalLoader from "../../../../../../root/components/global-loader";
import type { ServiceDescriptionProps } from "../../../../create/sub-component/ServiceDescription";


export async function savePublicServiceData(newService: ServiceDescriptionProps, setAlert: React.Dispatch<React.SetStateAction<AlertContentProps>>, setIsDirty: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {
    setAlert({
        status: 0,
        success: true,
        closeAlert: false,
        message: (
            <GlobalLoader loading={true} content={
                <>Saving changes made to <strong>{newService.name}</strong></>
            } />
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

export default savePublicServiceData;