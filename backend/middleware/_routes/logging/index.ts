import { appRouter } from "../../..";


// Security level: Developer 
// Token rights : LOGS_VIEW (Developer) / DATA_VIEW (Administrator)
appRouter.get('/logs/get', (req : Request, res : Response) => {

});


// Security level: Administrator
// NASS RIGHTS
appRouter.post('/logs/add', (req : Request, res : Response) => {

});