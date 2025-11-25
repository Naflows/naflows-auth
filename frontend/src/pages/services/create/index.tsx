import React, { useEffect, useState } from "react";
import type { UserBodyProps } from "../../../types/UserBodyProps";
import Loader from "../../../global/components/Loader";
import AccountHeader from "../../account/account-header/AccountHeader";
import '../../../../public/root/pages/services/create/index.scss';
import { type ServiceDescriptionProps } from "./sub-components/service-details";
import type { ServiceCreationSteps } from "./sub-components/footer/HeaderButtons";
import { type ServiceConfigurationProps } from "./sub-components/configuration";
import Alert from "../../../global/error-alert/Alert";
import type { AlertContentProps } from "../../../types/AlertContentProps.type";
import { useFetchUserInfo } from "../../../scripts/account/use/fetch-user-info";
import { getSwitchStep } from "./use/useSwitchStep";
import { NotificationProvider } from "../../../global/action-information/NotificationContent";
import NotificationContainer from "../../../global/action-information/NotificationContainer";


const stepContent = {
    "disclaimer": {
        title: "Service Creation Guidelines",
        description: "Please read and accept the service creation guidelines before proceeding."
    },
    "wizard-init": {
        title: "Service Details",
        description: "Provide the basic details for your new service."
    },
    "wizard-configure": {
        title: "Service Configuration",
        description: "Configure the technical settings of your service."
    },
    "wizard-review": {
        title: "Review & Create",
        description: "Review your service details and create your service."
    }
}

const CreateService = () => {
    const [user, setUser] = useState<UserBodyProps | undefined>(undefined);

    // Production default : "disclaimer"
    const [serviceCreationStep, setServiceCreationStep] = useState<ServiceCreationSteps>("wizard-configure");
    // Pruduction default : false
    const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
    const [serviceDescription, setServiceDescription] = useState<ServiceDescriptionProps>({
        id: "",
        name: "",
        description: "",
        profileImage: "",
        allow_public_visibility: false,
        bannerImage: ""
    });
    const [serviceConfiguration, setServiceConfiguration] = useState<ServiceConfigurationProps>({
        plans: {
            id: 0,
            name: "",
            description: "",
            price: 0,
            features: [],
            type: "cloud",
            storage: 0,
            RPS: 0
        },
        config: {
            ip_address: "",
            dns: "",
        },
        settings: {
            allow_public_registration: false,
        }
    });

    const [component, setComponent] = useState<React.JSX.Element | null>(null);
    const [displayAlert, setDisplayAlert] = useState<AlertContentProps>({
        status: 0,
        message: "",
        success: false,
        closeAlert: true,
        displayCode: false,
    }); // Warning: if defined to {}, Alert component appears with no content. So, please keep it this way.


    useFetchUserInfo({ setUserInfo: setUser });





    useEffect(() => {
        const stepComponent = getSwitchStep({
            serviceCreationStep,
            guidelinesAccepted,
            setServiceCreationStep,
            setDisplayAlert,
            serviceDescription,
            serviceConfiguration,
            setGuidelinesAccepted,
            setServiceDescription,
            setServiceConfiguration
        }) || null;

        setComponent(stepComponent);
    }, [serviceCreationStep, guidelinesAccepted, serviceDescription, serviceConfiguration]);








    if (!user) {
        return (
            <div
                className="nass__page__loader"
                style={{
                    display: user == null ? "flex" : "none",
                }}
            >
                <h3>Loading user data...</h3>
                <Loader loading={user == null} />
            </div>
        );
    } else {
        return (
            <NotificationProvider>
                <NotificationContainer />
                <Alert alert={displayAlert} setAlert={setDisplayAlert} />
                <div className="nass__page user__page services__creation__page">
                    <AccountHeader selectedTab="services" userFetch={user} />
                    <div className="user__body__section services__creation__section">
                        <div className="services__section__header">
                            <div className="section__header__content">
                                <h3 className="services__header__title">{
                                    stepContent[serviceCreationStep].title
                                }</h3>
                                <p>{stepContent[serviceCreationStep].description}</p>
                            </div>
                        </div>
                        {component}
                    </div>
                </div>
            </NotificationProvider>
        );
    }
}

export default CreateService;