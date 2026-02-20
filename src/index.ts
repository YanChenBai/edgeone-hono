import 'dotenv/config'

import { Redis } from '@upstash/redis';
import { type } from 'arktype';
import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import { describeRoute, resolver, validator, } from 'hono-openapi'
import process from 'node:process';

const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

const SignalingInput = type({
    roomId: "string",
    userId: "string",
    sdp: "string",
    "type?": "'offer'|'answer'|'ice-candidate'"
});

const app = new Hono().basePath('/');

app.get('/',
    describeRoute({
        summary: '同步并获取房间信令',
        description: '上传当前用户的 SDP, 并获取房间内所有用户的信令映射表。',
        responses: {
            200: {
                description: '成功返回房间内所有用户的信令字典',
                content: {
                    'application/json': {
                        schema: resolver(type({
                            ok: "boolean",
                            data: "Record<string, string>"
                        }))
                    }
                }
            }
        }
    }),
    validator('query', SignalingInput),
    async (c) => {
        const { roomId, userId, sdp } = c.req.valid('query')

        const redis = new Redis({
            url: REDIS_URL,
            token: REDIS_TOKEN,
        });

        const roomKey = `room:${roomId}`;

        await redis.hset(roomKey, { [userId]: sdp });
        await redis.expire(roomKey, 300);

        const allSignaling = await redis.hgetall(roomKey);

        return c.json({
            ok: true,
            data: allSignaling ?? {},
        });
    });

serve(app)

