"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBase64File = exports.toS3 = exports.imageValidationAndUpdload = exports.fileUploadToS3 = void 0;
const fs = __importStar(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const path_1 = __importDefault(require("path"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
async function fileUploadToS3(ext, image) {
    const fileName = `${(0, Helpers_1.cuid)()}.${ext}`;
    await image.move(Application_1.default.tmpPath('uploads'), {
        name: fileName,
    });
    return await toS3(Application_1.default.tmpPath('uploads') + '/' + fileName);
}
exports.fileUploadToS3 = fileUploadToS3;
function getFileExtesion(file) {
    const lastDot = file.lastIndexOf('.');
    const ext = file.substring(lastDot + 1);
    return ext;
}
async function imageValidationAndUpdload(imgStr) {
    try {
        if (imgStr && !imgStr.startsWith('https')) {
            return await uploadBase64File(imgStr);
        }
        else if (imgStr && imgStr.startsWith('https')) {
            return imgStr;
        }
        else {
            return '';
        }
    }
    catch (exception) {
        throw exception;
    }
}
exports.imageValidationAndUpdload = imageValidationAndUpdload;
async function toS3(filePath, type) {
    return new Promise(async (resolve) => {
        aws_sdk_1.default.config.update({
            accessKeyId: process.env.AWS_S3_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET,
        });
        let ext = type ? type : getFileExtesion(filePath);
        const s3 = new aws_sdk_1.default.S3();
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: fs.createReadStream(filePath),
            Key: Date.now() + '_.' + ext,
            ACL: 'public-read',
        };
        if (ext == 'svg') {
            params['ContentType'] = 'image/svg+xml';
        }
        s3.upload(params, function (err, data) {
            if (err) {
                resolve('');
            }
            if (data) {
                if (fs.existsSync(filePath))
                    fs.unlinkSync(filePath);
                resolve(data.Location);
            }
        });
    });
}
exports.toS3 = toS3;
const checkValidImageOrNot = async (image) => {
    const isValid = false;
    const isString = typeof image === 'string' || image instanceof String;
    if (!isString) {
        let invalidType;
        if (image === null) {
            invalidType = 'null';
        }
        else {
            invalidType = typeof image;
            if (invalidType === 'object' &&
                image.constructor &&
                image.constructor.hasOwnProperty('name')) {
                invalidType = image.constructor.name;
            }
            else {
                invalidType = `a ${invalidType}`;
            }
        }
        return false;
    }
    const type = image.split(';')[0].split('/')[1];
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const validImage = type && matches && matches.length > 1 ? true : false;
    if (validImage) {
        const base64Image = matches && matches.length ? matches[2] : '';
        const notBase64 = /[^A-Z0-9+\/=]/i;
        const len = base64Image.length;
        if (!len || len % 4 !== 0 || notBase64.test(base64Image)) {
            return false;
        }
        const firstPaddingChar = base64Image.indexOf('=');
        return (firstPaddingChar === -1 ||
            firstPaddingChar === len - 1 ||
            (firstPaddingChar === len - 2 && base64Image[len - 1] === '='));
    }
    return isValid;
};
const convertBase64File = async (base64Data) => {
    return new Promise(async (resolve) => {
        if (await checkValidImageOrNot(base64Data)) {
            const type = base64Data.split(';')[0].split('/')[1];
            const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            const base64Image = matches[2];
            const fileName = new Date().getTime() + '.' + type;
            const imagePath = path_1.default.join(Application_1.default.tmpPath('uploads'), fileName);
            fs.writeFile(imagePath, base64Image, 'base64', async (err) => {
                if (!err) {
                    resolve(imagePath);
                }
                else {
                    resolve('');
                }
            });
        }
        else {
            console.log('Invalid Image');
            resolve('');
        }
    });
};
async function uploadBase64File(base64String) {
    if (await checkValidImageOrNot(base64String)) {
        let filePath = await convertBase64File(base64String);
        return toS3(filePath);
    }
    else {
        return '';
    }
}
exports.uploadBase64File = uploadBase64File;
//# sourceMappingURL=upload.js.map