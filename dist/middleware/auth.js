"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtParse = exports.jwtCheck = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
exports.jwtCheck = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: "mern-food-order-api",
    issuerBaseURL: "https://dev-eddwjhkbhlud6eqn.us.auth0.com/",
    tokenSigningAlg: "RS256",
});
const jwtParse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.sendStatus(401);
    }
    else {
        const token = authorization.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            const user = yield user_1.default.findOne({ auth0Id: decoded.sub });
            if (!user) {
                res.sendStatus(401);
            }
            req.auth0Id = decoded.sub;
            req.userId = user === null || user === void 0 ? void 0 : user._id.toString();
            next();
        }
        catch (error) {
            console.log(error);
            res.sendStatus(401);
        }
    }
});
exports.jwtParse = jwtParse;
