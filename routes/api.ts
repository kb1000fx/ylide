import { Context, DefaultState, Next } from "koa";
import Router from "koa-router";
import CONFIG from "../config";

const router = new Router<DefaultState, Context>();
router.prefix('/api');

router.get('/getNotice', async (ctx:Context, next:Next) => {
    ctx.body = {
        msg: CONFIG.notice,
        code: 123,
    }
})

export default router