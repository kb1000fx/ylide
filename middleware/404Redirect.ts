import Koa from 'koa';

export default async (ctx:Koa.Context, next:Koa.Next) => {
    await next();
    if(ctx.status === 404){
        ctx.response.redirect("/404")
    } else if(ctx.status === 401){
        console.log("401")
    }
}