import Koa from "koa";
import server from "koa-static";
import views from "koa-views";
import bodyParser from "koa-bodyparser";
import path from "path"

import Redirect from "./middleware/Redirect";
import Auth from "./middleware/Auth";
//import DB from "./middleware/Database";
import pageRoutes from "./routes/page";
import apiRoutes from "./routes/api";
import CONFIG from "./config";

const app = new Koa();

// 中间件
app.use(bodyParser());
app.use(Redirect);
//app.use(Database);

// 静态资源
app.use(server(path.resolve(__dirname, "./dist")));
// 模板引擎
app.use(views(path.resolve(__dirname, "./views/page"), {
    extension: "njk",
    map: {
        njk: "nunjucks",
    },
}));

app.use(Auth(CONFIG.secret));

// 路由
app.use(pageRoutes.routes());
app.use(apiRoutes.routes());

app.listen(CONFIG.port, () => {
    console.log(`Server running on port ${CONFIG.port}`);
});
