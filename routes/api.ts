import { Context, DefaultState, Next } from "koa";
import jwt from 'jsonwebtoken';
import Router from "koa-router";
import CONFIG from "../config";

const router = new Router<DefaultState, Context>();
router.prefix('/api');

router.get('/getNotice', async (ctx:Context, next:Next) => {
    ctx.body = {
        msg: CONFIG.notice,
        code: 123,
    }
});

router.post('/login', async (ctx:Context, next:Next) => {
    const token = jwt.sign({user_name:'Jack', id:3, email: '1234@gmail.com'}, 'my_app_secret', { expiresIn:  '1h' });
    ctx.body = {
        status: true,
        msg: "login succeed",
        token: token,
    };
    ctx.cookies.set("Authorization", token)
});

router.get('/logout', async (ctx:Context, next:Next) => {
    ctx.body = {
        msg: "logout succeed",
    };
    ctx.cookies.set("Authorization", "")
});

export default router