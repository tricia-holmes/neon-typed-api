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
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const random_words_1 = __importDefault(require("random-words"));
const user_1 = __importDefault(require("./db/models/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/words', (req, res) => {
    const words = (0, random_words_1.default)(250);
    res.json(words);
});
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (body.username === '') {
        return res.status(400).send(`username can't be blank`);
    }
    if (body.username.length <= 3) {
        return res.status(400).send(`username must be longer than 3 characters`);
    }
    if (body.password === '') {
        return res.status(400).send(`password can't be blank`);
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const newUser = {
        username: body.username,
        password: yield bcrypt_1.default.hash(body.password, salt),
    };
    const created_user = yield user_1.default.create(newUser);
    res.status(201).json(created_user);
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
