### About UCR
UCR (User-Client Request) is a request format used in the NASS system to handle user requests. It is designed to be flexible and extensible, allowing for various types of requests to be processed efficiently.

However, UCR's base is designed to give a lot of informations about the request itself - defining the request, user, and client information. This is done to ensure that the request can be processed correctly and securely. 

UCR is made off three different information blocks:
1. **User Information**: Contains details about the user making the request, such as user ID, credentials, device fingerprint, origin, IP adress, etc.
2. **Client Information**: Contains details about the client making the request, such as client IP, DNS, related service, token informations, etc.
3. **Request Information**: Contains details about the request itself, such as request route, the expected response, expected request, parameters, various temporal information, etc.

Some informations, such as the IP adress, session ID, Identifier / Password are hashed before being processed. 

UCR's user part must have either token and identifier and password, but not both. This is to ensure that the request can be authenticated securely without exposing sensitive information.

UCR is the only acceptable request format for the NASS system, and it is used to ensure that all requests are processed in a consistent and secure manner.