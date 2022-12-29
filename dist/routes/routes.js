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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../db/models/user"));
const router = express_1.default.Router();
router.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (username.length <= 3) {
        return res
            .status(400)
            .json({ message: `username must be longer than 3 characters` });
    }
    if (password.length <= 5) {
        return res
            .status(400)
            .json({ message: `password must be longer than 5 characters` });
    }
    const foundUser = yield user_1.default.findOne({ where: { username: `${username}` } });
    if (foundUser) {
        return res.status(400).json({ message: `username is already in use.` });
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const newUser = {
        username: username,
        password: yield bcrypt_1.default.hash(password, salt),
    };
    const user = yield user_1.default.create(newUser);
    res.json(user);
}));
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('login', (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                res.status(400);
                return res.send({ message: 'invalid username or password' });
            }
            req.login(user, { session: false }, (error) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    res.status(400);
                    return res.send({ message: 'invalid username or password' });
                }
                const body = { _id: user._id, username: user.username };
                const token = jsonwebtoken_1.default.sign({ user: body }, 'TOP_SECRET');
                return res.json({ token });
            }));
        }
        catch (error) {
            return next(error);
        }
    }))(req, res, next);
}));
exports.default = router;
