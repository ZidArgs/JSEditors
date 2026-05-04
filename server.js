import WebService from "jswebservice/WebService.js";
import StaticService from "jswebservice/services/StaticService.js";

const enableCors = process.argv.indexOf("-cors") >= 1;
const port = process.argv.indexOf("-port") >= 1 ? process.argv[process.argv.indexOf("-port") + 1] : "15000";

const service = new WebService(port, {enableCors});
service.registerServiceModule(StaticService, "", {serveFolder: "./editor/web"});
service.registerServiceModule(StaticService, "/_libs/jseditors", {serveFolder: "./lib"});
service.registerServiceModule(StaticService, "/_libs/emcjs/core", {serveFolder: "./node_modules/@emcjs/core/lib"});
service.registerServiceModule(StaticService, "/_libs/emcjs/fe", {serveFolder: "./node_modules/@emcjs/fe/lib"});

service.printServerInfoPanel();
