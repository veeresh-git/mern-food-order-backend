"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get("/", auth_1.jwtCheck, auth_1.jwtParse, user_1.getUserController);
router.post("/", auth_1.jwtCheck, user_1.createUserController);
router.put("/", auth_1.jwtCheck, auth_1.jwtParse, validation_1.validateMyUserRequest, user_1.updateUserController);
exports.default = router;
