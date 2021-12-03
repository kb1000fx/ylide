import { Context, DefaultState, Next } from "koa";
import Router from "koa-router";
import CONFIG from "../config";

const router = new Router<DefaultState, Context>();

const layout = {
    layout: {
        website: CONFIG.title,
        title: "主页",
        year: new Date().getFullYear(),
        version: CONFIG.version,
        UserImg: "https://garybear.cn/download/avatar.png",
        UserName: "John Doe",
        badge: 1
    },
};

const layout2 = {
    layout: {
        website: CONFIG.title,
        title: "帐号",
        year: new Date().getFullYear(),
        version: CONFIG.version,
        UserImg: "https://garybear.cn/download/avatar.png",
        UserName: "John Doe",
        badge: 1
    },
    account: {
        avatar: "gravatar",
        studentID: "12345",
        email: "abcde123@qwer.zxc",
        name: "John Doe",
    },
};

router.get('/', async (ctx:Context, next:Next) => {
    await ctx.render('index', layout)
});

router.get('/account', async (ctx:Context, next:Next) => {
    await ctx.render('account', layout2)
});

router.get('/login', async (ctx:Context, next:Next) => {
    await ctx.render('login', layout)
});

router.get('/404', async (ctx:Context, next:Next) => {
    await ctx.render('error', {
        title: '404'
    })
});


export default router