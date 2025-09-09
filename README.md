
<img width="1440" height="358" alt="nass-header" src="https://github.com/user-attachments/assets/e33829b9-935c-457e-9cc0-4ddecc2cfdb1" />

# Important notice
THIS PROJECT IS UNDER ACTIVE DEVELOPMENT AND IS NOT STABLE NOR READY. 

Please view the [first page](https://github.com/Naflows/naflows-auth/wiki/Getting-started-with-naflows%E2%80%90auth) of the wiki for more informations about this project.

<br/>

## Objectives
As for now, the NASS has completed it's first step: a basic authentication system based on a 4-layers security:
* Routes are pre-defined and not any other route can be accessed.
* The service (backend, API) must be registered to the NASS and valid at the time of the request.
* The user must be registered to the NASS (via the API or the service), as well as its tokens and sessions.
* Any action is monitored and logged by the NASS via the "contracts" system, which is a set of rules that the service must follow to be able to do anything with the NASS.


Now, the NASS has to be extended to allow the following features:
* **Contract management**: Allow services to ask for contracts to the NASS, which includes: 
    * Secure tokenization for APIs, renewing the token at some given times (and so, allowing the service to have x ∈ [1,2] tokens at the same time in order to prevent system interruptions).
    * Actions monitoring and logging, which is allowing the APIs to perform the requested actions by the user.
* **User management**: Allow users to manage their own accounts, including changing passwords, updating profile information, and managing sessions. Users must be able to register, log in, and log out securely. Users can also connect themselves to the NASS via the API they are using if it is not a NAFLOWS service, in order to manage their data. 
* **Service management**: Allow services to manage their own registrations, including updating service information and managing service tokens. Any user can register a service and manage it by themselves. The API key, also considered as a "service token", is used to authenticate the service with the NASS and is meant to be the sold product.


