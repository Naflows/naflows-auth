![NAFLOWS Logo](./public/logo.png)


# IMPORTANT
THIS PROJECT IS UNDER ACTIVE DEVELOPMENT AND IS NOT STABLE NOR READY. 

## About `auth.naflows.com`
`auth.naflows.com` is the authentication service for the NAFLOWS system. It handles user registration, login, and session management. This service is crucial for ensuring secure access to the NAFLOWS platform. 
`auth.naflows.com` is also called the "NAFLOWS AUTHENTICATION SERVICE SYSTEM" (**NASS**).

## Security Considerations
The `.env` file contains sensitive parameters that are not to be modified without proper authorization AND consideration. 

Disabling security tunnels puts the whole system at risk, as it allows unauthenticated access to the service. This should only be done in a controlled environment for testing purposes. Only administrators should have access to the `.env` file, and it should be protected with appropriate permissions.


## Project Assets
The global project assets (schemas, notes, todos, etc) are currently not available, but will be scanned and hosted in the future. For now, you can ask for project management details from the NAFLOWS team.


## Production Notice
See the following file before production deployment:
* [`./mongo-init/init.js`](./mongo-init/init.js) - Contains dummy data that can cause security issues if not removed or modified before going live.
* [`./.env`](./.env) - Contains sensitive environment variables that should be configured correctly for production use.
* [`./TODO.TODO`](./TODO.TODO) - Contains a list of tasks that need to be completed before production deployment.
