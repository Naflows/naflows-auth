const request = require('supertest');
const express = require('express');
const { describe, it, expect } = require('@jest/globals');

const url = 'http://localhost:3000';

describe("AUTH API", () => {
    it("should return an auth token for naflouille", async () => {
        const response = await request(url).post('/auth/build')
            .send({
                username: "naflouille",
                ipAdress: '192.168.1.111',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                passphrase: null,
                password: 'admin'
            })
        expect(response.status).toBe(200);
        // Expect response to be {
        //     success: true,
        //     message: 'User authenticated successfully.',
        //     infos: {
        //         token : something
        //     }
        //}
        
        expect(response.body).toEqual(expect.objectContaining({
            success: true,
            message: 'User authenticated successfully.',
            infos: expect.objectContaining({
                token: expect.any(String)
            })
        }));
        console.log("Auth token for naflouille:", response.body.infos.token);
    });

    it("should return an error for user "+ "naflouille with wrong password", async () => {
        const response = await request(url).post('/auth/build')
            .send({
                username: "naflouille",
                ipAdress: '192.168.1.111',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                passphrase: null,
                password: 'wrongpassword'
            });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(expect.objectContaining({
            success: false,
            message: 'User not found or invalid credentials.'
        }));
    });
});
