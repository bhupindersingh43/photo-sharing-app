const express = require("express");
const User = require("../models/user.model");
const routes = require("../routes/index.router");
const app = express();
app.use(express.json());
app.use("/api", routes);
const mongoose = require("mongoose");
const supertest = require("supertest");
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/MEANStackDB",
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done())
    });
});

test("POST /api/register", async () => {
    const data = { fullName: "Test Name", email: "test@test.com", password: "123456" };

    await supertest(app).post("/api/register")
        .send(data)
        .expect(200)
        .then((response) => {
            // Check type
            expect(response._body.status).toBe(true);
            // Check data
            expect(response._body.user.fullName).toBe(data.fullName);
            expect(response._body.user.email).toBe(data.email);
        });
});

test("GET /api/userProfile with 403", async () => {
    await supertest(app).get("/api/userProfile")
        .expect(403)
        .then((response) => {
            // Check type
            expect(response._body.auth).toBe(false);

            // Check data
            expect(response._body.message).toBe('No token provided.');
        });
});