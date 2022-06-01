const express = require("express");
const Photo = require("../models/photo.model");
const routes = require("../routes/index.router");
const app = express();
app.use(express.json());
app.use("/api", routes);
const mongoose = require("mongoose");
const supertest = require("supertest");
const fs = require('fs');
const path = require('path');
var imagePath = path.join(path.resolve(__dirname, '..'), '/uploads/shared/');

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

test("GET /api/photo", async () => {
    const photo = await Photo.create({ user_id: "62931991234110098d13655d", title: "title", description: "description", photo: "/shared/photo-1653821713030.png" });

    await supertest(app).get("/api/photo")
        .expect(200)
        .then((response) => {
            // Check type and length
            expect(Array.isArray(response._body.data)).toBeTruthy();

            // Check data
            expect(response._body.data[0]._id).toBe(photo.id);
            expect(response._body.data[0].title).toBe(photo.title);
            expect(response._body.data[0].description).toBe(photo.description);
            expect(response._body.data[0].photo).toBe(photo.photo);
        });
});

test("POST /api/posts", async () => {
    const data = { user_id: "62931991234110098d13655d", title: "Post 1", description: "Lorem ipsum", photo: "/photo-1653821713030.jpg" };

    await supertest(app).post("/api/photo")
        .field('user_id', data.user_id)
        .field('title', data.title)
        .field('description', data.description)
        .attach('file', fs.readFileSync(`${imagePath}photo-1653821713030.jpg`), 'tests/photo-1653821713030.jpg')
        .expect(200)
        .then(async (response) => {
            // Check the response
            expect(response._body.status).toBeTruthy();
            expect(response._body.status).toBe(true);
        });
});

test("DELETE /api/posts/:id", async () => {
    const photo = await Photo.create({ user_id: "62931991234110098d13655d", title: "title", description: "description", photo: "/shared/photo-1653821713030.jpg" });

    await supertest(app)
        .delete("/api/photo/" + photo.id)
        .expect(200)
        .then(async () => {
            expect(await Photo.findOne({ _id: photo.id })).toBeFalsy();
        });
});