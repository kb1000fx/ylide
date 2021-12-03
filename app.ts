import Koa from 'koa';
import server from "koa-static";
import views from "koa-views";
import path from "path";
import bodyParser from "koa-bodyparser";

import Redirect404 from "./middleware/404Redirect";
import pageRoutes from "./routes/page";
import apiRoutes from "./routes/api";
import CONFIG from "./config";

const app = new Koa();

//中间件
app.use(bodyParser());
app.use(Redirect404);

//静态资源
app.use(server(__dirname + '/dist'))
//模板引擎
app.use(views(__dirname + '/views/page', {
    extension: 'njk',
    map: {
        njk: 'nunjucks'
    }
}))
  
//路由
app.use(pageRoutes.routes());
app.use(apiRoutes.routes());

app.listen(CONFIG.port, ()=>{
    console.log(`Server running on port ${CONFIG.port}`);
});

