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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("./db/models/user"));
const passport_jwt_1 = require("passport-jwt");
const passport_jwt_2 = require("passport-jwt");
passport_1.default.use('signup', new passport_local_1.Strategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const newUser = {
            username: username,
            password: yield bcrypt_1.default.hash(password, salt),
        };
        const created_user = yield user_1.default.create(newUser);
        return done(null, created_user);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use('login', new passport_local_1.Strategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield user_1.default.findOne({
            where: { username: `${username}` },
        });
        if (!foundUser) {
            return done(null, false, { message: 'User not found' });
        }
        const isValidPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
            const compare = yield bcrypt_1.default.compare(password, foundUser.password);
            return compare;
        });
        const validate = yield isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }
        return done(null, foundUser, { message: 'Logged in sucessfully' });
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: 'TOP_SECRET',
    jwtFromRequest: passport_jwt_2.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return done(null, token.user);
    }
    catch (error) {
        done(error);
    }
})));
