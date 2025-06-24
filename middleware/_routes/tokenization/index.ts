import { appRouter } from "../../..";

// Security level: User
appRouter.post('/token/build/user', (req : Request, res : Response) => {

});

// Security level: Developer
appRouter.post('/token/build/service', (req: Request, res : Response) => {

});

// Security level: Developer
appRouter.post('/token/kill/user', (req: Request, res : Response) => {

});

// Security level: Developer
appRouter.post('/token/kill/service', (req: Request, res : Response) => {

});

// Security level: User
appRouter.post('/token/check/availability', (req: Request, res : Response) => {

});

// Security level: Developer
appRouter.post('/token/check/rights', (req: Request, res : Response) => {

});

