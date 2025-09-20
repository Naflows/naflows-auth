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
import CreateServiceHeaderButtons from "./sub-component/HeaderButtons";


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
                setUser(res.data.data.user as UserBodyProps);
            } catch (error) {
                console.error("Error initializing page:", error);
                window.location.href = "/login?redirect=" + window.location.pathname;
            }
        })();

    }, []);




    const [serviceCreationStep, setServiceCreationStep] = useState<ServiceCreationSteps>("disclaimer");
    const [serviceDescription, setServiceDescription] = useState<{
        name: string;
        description: string;
        profileImage: string;
        allow_public_visibility: boolean;
        bannerImage? : string;
    }>({
        name: "",
        description: "",
        profileImage: "",
        allow_public_visibility: false,
        bannerImage : ""
    });
    const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
    const [component, setComponent] = useState<React.JSX.Element | null>(null);


    useEffect(() => {
        if (serviceCreationStep == "disclaimer") {
            setComponent(<div key={"disclaimer-header"} className="services__creation__body">
                <CreateServiceHeaderButtons setServiceCreationStep={setServiceCreationStep} currentStep={serviceCreationStep} />
                <ServiceCreationDisclaimer setGuidelinesAccepted={setGuidelinesAccepted} guidelinesAccepted={guidelinesAccepted} />
                <button className={`primary-button width-100-auto ${guidelinesAccepted ? "active" : "inactive"}`} disabled={!guidelinesAccepted} onClick={() => {
                    if (guidelinesAccepted) {
                        setServiceCreationStep("wizard-init");
                    }
                }}>Proceed</button>
            </div>);
        } else if (serviceCreationStep == "wizard-init") {
            setComponent(<div key={"wizard-init"} className="services__creation__body">
                <CreateServiceHeaderButtons setServiceCreationStep={setServiceCreationStep} currentStep={serviceCreationStep} />
                <CreateServiceDescription serviceDescription={serviceDescription} setServiceDescription={setServiceDescription} />
                <ServiceCreationFooterButtons setServiceCreationStep={setServiceCreationStep} nextConditionMet={ serviceDescription?.name != "" && serviceDescription?.description != "" && serviceDescription?.profileImage != "" && serviceDescription?.bannerImage != ""} />
            </div>);
        }
    }, [serviceCreationStep, guidelinesAccepted, serviceDescription]);








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
            <div className="nass__page user__page services__creation__page">
                <AccountHeader selectedTab="services" userFetch={user} />

                <div className="user__body__section services__creation__section">
                    <div className="services__section__header">
                        <div className="section__header__content">
                            <h3 className="services__header__title">Services Creation</h3>
                            <p>Create a new service.</p>
                        </div>
                    </div>
                    {component}
                </div>
            </div>
        );
    }
}

export default CreateService;