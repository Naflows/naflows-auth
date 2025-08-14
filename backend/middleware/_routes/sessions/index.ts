import { appRouter } from "../../..";


// Security level: User
// Build a user session
// Token rights: SESSION_RENEWAL (User only)
appRouter.post('/sessions/build/user', (req: Request, res: Response) => {
  
});

// Security level: User
// Build a service session
// Token rights: USER_EDIT_OWN (User), DATA_EDIT (Developer)
appRouter.post('/sessions/kill', (req: Request, res: Response) => {

});


// Security level: User
// Create a session confirmation
// Token rights: USER_READ_OWN (User), DATA_EDIT (Developer) 
appRouter.post('/sessions/confirm/create', (req: Request, res: Response) => {

});

// Security level: User
// Confirm a session
// Token rights: SESSION_CONFIRMATION
appRouter.post('/sessions/confirm', (req: Request, res: Response) => {

});