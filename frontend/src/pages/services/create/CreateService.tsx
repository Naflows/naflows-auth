import React, { useEffect, useState } from "react";
import fetchData from "../../../scripts/account/get-user-info";
import type { AxiosResponse } from "axios";
import type { UserBodyProps } from "../../../types/UserBodyProps";
import Loader from "../../../global/components/Loader";
import AccountHeader from "../../account/account-header/AccountHeader";
import '../../../../public/root/pages/services/create/index.scss';
import ServiceCreationDisclaimer from "./sub-component/Disclaimer";
import ServiceCreationFooterButtons from "./sub-component/FooterButtons";
import CreateServiceDescription from "./sub-component/ServiceDescription";
import type { ServiceCreationSteps } from "./sub-component/HeaderButtons";
import ServiceConfiguration, { type ServiceConfigurationProps } from "./sub-component/ServiceConfiguration";
import Alert, { type AlertContentProps } from "../../../global/error-alert/Alert";
import { createServiceToNass } from "./scripts/create-service";


const stepContent = {
    "disclaimer" : {
        title: "Service Creation Guidelines",
        description: "Please read and accept the service creation guidelines before proceeding."
    },
    "wizard-init" : {
        title: "Service Details",
        description: "Provide the basic details for your new service."
    },
    "wizard-configure" : {
        title: "Service Configuration",
        description: "Configure the technical settings of your service."
    },
    "wizard-review" : {
        title: "Review & Create",
        description: "Review your service details and create your service."
    }   
}

const CreateService = () => {
    const [user, setUser] = useState<UserBodyProps | null>(null);
    useEffect(() => {
        // Fetch user data from the backend
        (async () => {
            try {
                const res = (await fetchData("user")) as AxiosResponse;
                if (res.data == null) {
                    throw new Error("Failed to fetch user data");
                }
                setUser(res.data.user as UserBodyProps);
            } catch (error) {
                console.error("Error initializing page:", error);
                window.location.href = "/login?redirect=" + window.location.pathname;
            }
        })();

    }, []);




    const [serviceCreationStep, setServiceCreationStep] = useState<ServiceCreationSteps>("disclaimer"); // Prod : disclaimer
    const [serviceDescription, setServiceDescription] = useState<{
        name: string;
        description: string;
        profileImage: string;
        allow_public_visibility: boolean;
        bannerImage?: string;
        id: string;
    }>({
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

    const [guidelinesAccepted, setGuidelinesAccepted] = useState(false); // Prod : false
    const [component, setComponent] = useState<React.JSX.Element | null>(null);

    const [displayAlert, setDisplayAlert] = useState<AlertContentProps>({
        status: 0,
        message: "",
        success: false,
        closeAlert: true,
        displayCode: false,
    });


    useEffect(() => {
        if (serviceCreationStep == "disclaimer") {
            setComponent(<div key={"disclaimer-header"} className="services__creation__body">
                <ServiceCreationDisclaimer setGuidelinesAccepted={setGuidelinesAccepted} guidelinesAccepted={guidelinesAccepted} />
                <button className={`primary-button width-100-auto ${guidelinesAccepted ? "active" : "inactive"}`} disabled={!guidelinesAccepted} onClick={() => {
                    if (guidelinesAccepted) {
                        setServiceCreationStep("wizard-init");
                    }
                }}>Proceed</button>
            </div>);
        } else if (serviceCreationStep == "wizard-init") {
            setComponent(<div key={"wizard-init"} className="services__creation__body">
                <CreateServiceDescription serviceDescription={serviceDescription} setServiceDescription={setServiceDescription} />
                <ServiceCreationFooterButtons serviceCreationStep={serviceCreationStep} setServiceCreationStep={setServiceCreationStep} nextConditionMet={serviceDescription?.name != "" && serviceDescription?.description != "" && serviceDescription?.profileImage != "" && serviceDescription?.bannerImage != ""} />
            </div>);
        } else if (serviceCreationStep == "wizard-configure") {
            setComponent(<div key={"wizard-configure"} className="services__creation__body">
                <ServiceConfiguration serviceConfiguration={serviceConfiguration} setServiceConfiguration={setServiceConfiguration} />
                <ServiceCreationFooterButtons serviceCreationStep={serviceCreationStep} setServiceCreationStep={setServiceCreationStep} nextConditionMet={
                    serviceConfiguration.config.ip_address !== "" &&
                    serviceConfiguration.config.dns !== ""
                } />
            </div>);
        } else if (serviceCreationStep == "wizard-review") {
            createServiceToNass({
                serviceDescription,
                serviceConfiguration,
                setDisplayAlert
            });
        } else {
            createServiceToNass({
                serviceDescription,
                serviceConfiguration,
                setDisplayAlert
            });
        }
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
            <>
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
            </>
        );
    }
}

export default CreateService;