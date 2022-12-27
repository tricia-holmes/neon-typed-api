"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const random_words_1 = __importDefault(require("random-words"));
const router = express_1.default.Router();
router.get('/words', (req, res, next) => {
    const words = (0, random_words_1.default)(250);
    res.json({
        message: 'Here are the randomized words!',
        user: req.user,
        token: req.query.secret_token,
        words: words,
    });
});
exports.default = router;
