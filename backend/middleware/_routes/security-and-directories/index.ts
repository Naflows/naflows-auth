import { appRouter } from "../../..";

const express = require('express');


// Security level: Developer
// Check if a connection is secure and accepted
// Token rights: NASS_SECURITY_CHECK
appRouter.post('/secure/check', (req : Request, res : Response) =>  {
    
});

// Security level: Administrator
// Add a new secure connection
// Token rights: NASS_SECURITY_ADD
appRouter.post('/secure/add', (req : Request, res : Response) =>  {

});

// Security level: Administrator
// Deactivate a secure connection
// Token rights: NASS_SECURITY_DEACTIVE
appRouter.post('/secure/deactive', (req : Request, res : Response) =>  {

});


// Security level: Administrator
// Block a connection
// Token rights: BLACKLIST_CREATE
appRouter.post('/secure/block', (req : Request, res : Response) =>  {

});

// Security level: Developer
// Returns all the accessible routes of the system
// Token rights: NASS_VIEW_STRUCTURE
appRouter.post('/routes/directory', (req: Request, res : Response) => {

});

// Security level: Administrator
// Add a new user to the team
// Token rights: NASS_TEAM_ADD
appRouter.post('/team/user/add', (req: Request, res : Response) => {

});

// Security level: Administrator
// Revoke a user from the team
// Token rights: NASS_TEAM_REVOKE
appRouter.post('/team/user/revoke', (req: Request, res : Response) => {

});

// Security level: Administrator
// Update a user in the team
// Token rights: NASS_TEAM_UPDATE
appRouter.post('/team/user/update', (req: Request, res : Response) => {

});

