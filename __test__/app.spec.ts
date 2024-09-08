import { describe, test, expect } from "@jest/globals";
import app from "../src/server.js";
import request from "supertest";
import { configuration } from "../src/config.js";
import { esPrimo } from "../src/numeros.js";
import { esPalindromo } from "../src/palindromo.js";



describe("Test Suite App", () => {

   /* test("endpoint /", () => {
        expect(1 + 1).toBe(2);
    });
*/
    test("endpoint  /key", async () => {
        return await request(app)
        .get("/key")
        .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe(`Hola, esta api contiene la siguiente api-key: ${configuration.apiKey}`);
            })
    });
    test("funcion palabra palindromo", () => {
        expect(esPalindromo("girafarig")).toBe(true);
        expect(esPalindromo("Farigiraf ")).toBe(true);
        expect(esPalindromo("Dudunsparce ")).toBe(false);

    });
    test("endpoint  /palindromo", async () => {
        return await request(app)
        .get("/palindromo/girafarig")
        .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe("Hola, La frase ingresada es palindromo");
            })
    });
    test("Funcion Número Primo", () => {
        expect(esPrimo(2)).toBe(true);
        expect(esPrimo(1)).toBe(false);
        expect(esPrimo(8)).toBe(false);
    });
    test("endpoint  /primo", async () => {
        return await request(app)
        .get("/primo/7")
        .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe("Hola, el numero ingresado es un numero primo");
            })
    });

    test("test de endpoint /", async () => {
        return await request(app)
            .get("/")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe(`Hola, esta api fue configurada por el usuario ${configuration.username}`);
            })
    });
});