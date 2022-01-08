import koaJwt  from  'koa-jwt';

export default (secret:string)=>{
    return koaJwt({
            secret: secret,
            cookie: "Authorization",
            key: "user",
        }).unless({
            path: [
                /^\/login/, 
                /^\/api\/login/,
                /^\/api\/logout/,
            ]
        })
}