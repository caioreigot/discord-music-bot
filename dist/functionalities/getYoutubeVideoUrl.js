"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const ytSearch = require('youtube-search-api');
const google = __importStar(require("googleapis"));
const youtube = new google.youtube_v3.Youtube({
    version: "v3",
    auth: process.env.GOOGLE_KEY
});
function getYoutubeVideoUrl(input, channel, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
        * API da Google que fornece o ID do vídeo no Youtube, para então
        * conseguir dar play através da concatenação no URL
        */
        try {
            youtube.search.list({
                q: input,
                part: ["snippet"],
                fields: "items(id(videoId), snippet(title,channelTitle))",
                type: ["video"]
            }, function (err, resultado) {
                if (err) {
                    alternativeSearch(input, channel, callback);
                    return;
                }
                else if (resultado) {
                    let videoId = resultado.data.items[0].id.videoId;
                    callback(`https://www.youtube.com/watch?v=${videoId}`);
                }
            });
        }
        catch (err) {
            console.warn(err);
            alternativeSearch(input, channel, callback);
        }
    });
}
exports.default = getYoutubeVideoUrl;
// Pesquisa no Youtube sem a API da Google
const alternativeSearch = (input, channel, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield ytSearch.GetListByKeyword(input, false);
        let firstVideoId = data.items[0].id;
        let link = `https://www.youtube.com/watch?v=${firstVideoId}`;
        callback(link);
    }
    catch (err) {
        channel.send(errorMessages_json_1.default.playAudioUnknownError +
            "```" + err + "```");
    }
});
