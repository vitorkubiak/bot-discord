"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
app.use(cors_1.default());
app.get('/', function (request, response) {
    response.send({
        server: "online"
    });
});
app.listen(process.env.PORT || 5000, function () { return console.log("🚀 Botzera API tá online gurizao"); });
//# sourceMappingURL=api.js.map