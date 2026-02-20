import { Hono } from 'hono';

const app = new Hono().basePath('/')
  .get('/', async (c) => {

    const resp = await fetch('https://www.5dm.link/timeline')
    const text = await resp.text()

    return c.html(text)
  });


// EdgeOne Functions export
export function onRequest(context: {
  request: Request;
  params: Record<string, string>;
  env: Record<string, any>;
}): Response | Promise<Response> {
  return app.fetch(context.request, context.env);
}
