import { Hono } from 'hono';
import { openAPIRouteHandler } from 'hono-openapi';

const app = new Hono();

app.get(
    '/openapi',
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: 'Teleport API',
                version: '1.0.0',
                description: 'Teleport API Document',
            },
            servers: [
                { url: 'http://localhost:3000', description: 'Local Server' },
                { url: 'https://teleport.edgeone.app', description: 'EdgeOne Edge Functions' }
            ],
        },
    })
)

export default app;