import { appRouter } from "../../..";

const express = require('express');


// Security level: Developer
appRouter.post('/secure/test', (req : Request, res : Response) =>  {
    
});

// Security level: Administrator
appRouter.post('/secure/add', (req : Request, res : Response) =>  {

});

// Security level: Administrator
appRouter.post('/secure/deactive', (req : Request, res : Response) =>  {

});


// Security level: Administrator
appRouter.post('/secure/block', (req : Request, res : Response) =>  {

});

// Security level: Developer
appRouter.post('/routes/directory', (req: Request, res : Response) => {

});

// Security level: Administrator
appRouter.post('/team/user/add', (req: Request, res : Response) => {

});

// Security level: Administrator
appRouter.post('/team/user/revoke', (req: Request, res : Response) => {

});

// Security level: Administrator
appRouter.post('/team/user/update', (req: Request, res : Response) => {

});

