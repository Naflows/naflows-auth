import { User } from "../../../../types/.types/collections.type";
import { Request, Response } from "express";

export async function getUsers(req : Request, res : Response, user : User) {
    // Check if user has the right to view users

}