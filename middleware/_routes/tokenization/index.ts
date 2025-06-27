import { appRouter } from "../../..";

// Security level: User
// Build a user session
// Token rights: TOKEN_RENEWAL (User)
appRouter.post('/token/build/user', (req : Request, res : Response) => {

});

// Security level: Developer
// Build a service session
// Token rights: SERVICES_CREATE (Developer)
appRouter.post('/token/build/service', (req: Request, res : Response) => {

});

// Security level: Developer
// Kill a user token
// Token rights: DATA_EDIT (Developer)
appRouter.post('/token/kill/user', (req: Request, res : Response) => {

});

// Security level: Developer
// Kill a service token
// Token rights: SERVICES_DELETE (Developer)
appRouter.post('/token/kill/service', (req: Request, res : Response) => {

});

// Security level: User
// Check if a token is available
// Token rights: USER_READ_OWN (User), DATA_VIEW (Developer)
appRouter.post('/token/check/availability', (req: Request, res : Response) => {
    
});

// Security level: Developer
// Check token rights
// Token rights: USER_READ_OWN (User), DATA_VIEW (Developer)
appRouter.post('/token/check/rights', (req: Request, res : Response) => {

});


// Security level: User
// Build a user token
// Token rights: TOKEN_RENEWAL
appRouter.post('/token/build/user', (req : Request, res : Response) => {

});

// Security level: Developer
// Build a service token
// Token rights: SERVICES_CREATE
appRouter.post('/token/build/service', (req: Request, res : Response) => {

});

// Security level: Developer
// Kill a user token
// Token rights: DATA_EDIT
appRouter.post('/token/kill/user', (req: Request, res : Response) => {

});

// Security level: Developer
// Kill a service token
// Token rights: SERVICES_DELETE
appRouter.post('/token/kill/service', (req: Request, res : Response) => {

});



