import Koa from 'koa';

export default async (ctx:Koa.Context, next:Koa.Next) => {
    try {
        await next();
        if (ctx.status != 200) {
            ctx.throw(ctx.status)
        }
    } catch (error:any) {
        switch (error.status) {
            case 404:
                ctx.response.redirect("/404");
                break;    
            case 401:
                ctx.response.redirect("/login");
                break; 
            default:
                console.log(error)
                break;
        }
    }
}