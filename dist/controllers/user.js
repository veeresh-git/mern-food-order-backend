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
exports.getUserController = exports.updateUserController = exports.createUserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield user_1.default.findById(req.userId);
        if (!existingUser) {
            res.status(404).json({
                message: "User not found!",
            });
        }
        else {
            res.status(200).json(existingUser.toObject());
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error getting user!",
        });
    }
});
exports.getUserController = getUserController;
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id } = req.body;
        const existingUser = yield user_1.default.findOne({ auth0Id });
        if (existingUser) {
            res.status(200).send();
        }
        else {
            const newUser = new user_1.default(req.body);
            newUser.save();
            res.status(201).json(newUser.toObject());
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error creating user!",
        });
    }
});
exports.createUserController = createUserController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, addressLine1, city, country } = req.body;
        const existingUser = yield user_1.default.findById(req.userId);
        if (!existingUser) {
            res.status(404).json({
                message: "User not found!",
            });
        }
        else {
            existingUser.name = name;
            existingUser.addressLine1 = addressLine1;
            existingUser.city = city;
            existingUser.country = country;
            existingUser.save();
            res.status(200).json(existingUser.toObject());
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error updating user!",
        });
    }
});
exports.updateUserController = updateUserController;
