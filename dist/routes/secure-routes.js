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
const random_words_1 = __importDefault(require("random-words"));
const router = express_1.default.Router();
router.get('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.user);
}));
router.get('/words', (req, res) => {
    const words = (0, random_words_1.default)(250);
    res.json({
        message: 'Here are the randomized words!',
        user: req.user,
        token: req.query.secret_token,
        words: words,
    });
});
exports.default = router;
