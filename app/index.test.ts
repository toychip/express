import request from "supertest";
import { RedisClient, createApp } from "./app";
import * as redis from "redis";
export const LIST_KEY = "messages";


let app: Express.Application;
let client: RedisClient;

beforeAll(async() => {
    client = redis.createClient({url: "redis://localhost:6379" });
    await client.connect();
    app = createApp(client);
});

beforeEach(async() => {
    await client.flushDb();
});

afterAll(async() => {
    await client.flushDb();
    await client.quit();
})

describe("POST /messages", () => {
    it("responds with a success message", async () => {
    await client.lPush(LIST_KEY, ["msg1", "msg2"])

    const response = await request(app)
        .post("/messages")
        .send({ message: "testing with redis"});
        
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Message added to list");
    });
});

describe("GET /messages", () => {
    it("responds with all messages", async () => {
        const response = await request(app).get("/messages")
        expect(response.statusCode).toBe(200)
        // expect(response.body).toEqual(["msg2", "msg1"]);
    });
});