import { useEffect, useState } from "react";
import type { ServiceConfigurationProps } from ".";
import Input from "../../../../../global/components/Input";

function changeIPAddress(value: string, serviceConfiguration: ServiceConfigurationProps, setServiceConfiguration: React.Dispatch<React.SetStateAction<ServiceConfigurationProps>>) {
    if (serviceConfiguration) {
        setServiceConfiguration({
            ...serviceConfiguration,
            config: {
                ...serviceConfiguration.config,
                ip_address: value.toString().toLowerCase()
            }
        });
    }
}
const IPRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;


function changeDNS(value: string, serviceConfiguration: ServiceConfigurationProps, setServiceConfiguration: React.Dispatch<React.SetStateAction<ServiceConfigurationProps>>) {
    if (serviceConfiguration) {
        setServiceConfiguration({
            ...serviceConfiguration,
            config: {
                ...serviceConfiguration.config,
                dns: value.toString().toLowerCase()
            }
        });
    }
}
const DNSRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;




const ServiceCreationNetworkConfiguration = ({
    serviceConfiguration,
    setServiceConfiguration
}: {
    serviceConfiguration: ServiceConfigurationProps,
    setServiceConfiguration: React.Dispatch<React.SetStateAction<ServiceConfigurationProps>>;
}) => {

    const [ipValue, setIPValue] = useState("");
    const [dnsValue, setDNSValue] = useState("");

    useEffect(() => {
        if (serviceConfiguration) {
            setIPValue(serviceConfiguration.config.ip_address);
            setDNSValue(serviceConfiguration.config.dns);
        } else {
            setIPValue("");
            setDNSValue("");
        }
    }, [serviceConfiguration]);

    return (
        <div className="form__content">
            <div className="inputs__container two-rows" style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5
            }}>
                <Input
                    label="Service IP Address"
                    type="text"
                    name="ip_address"
                    value={ipValue}
                    autoComplete={false}
                    fitContent={false}
                    onChange={(v) => {
                        const value = v.toString();
                        changeIPAddress(value, serviceConfiguration, setServiceConfiguration);
                    }}
                    required={true}
                    maxChar={15}
                    displayMaxChar={true}
                    errorMessage="Please enter a valid IP address."
                    onError={(value) => {
                        return !IPRegex.test(value);
                    }}
                />
                <Input
                    label="Service DNS"
                    type="text"
                    name="dns"
                    value={dnsValue}
                    fitContent={false}
                    onChange={(value) => {
                        changeDNS(value.toString(), serviceConfiguration, setServiceConfiguration);
                    }}
                    required={true}
                    errorMessage="Please enter a valid DNS."
                    autoComplete={false}
                    onError={(value) => {
                        return !DNSRegex.test(value);
                    }}
                />
            </div>
        </div>
    )
}

export default ServiceCreationNetworkConfiguration;