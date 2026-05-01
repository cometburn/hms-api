import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "HMS API",
            version: "1.0.0",
            description: "Hotel Management System API",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: "/",
                description: "Development server",
            },
        ],
    },
    apis: ["./src/v1/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    if (process.env.NODE_ENV !== "production") {
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        }));

        app.get("/docs.json", (req: Request, res: Response) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swaggerSpec);
        });
    }
};