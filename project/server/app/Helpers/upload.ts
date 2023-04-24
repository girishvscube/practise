import * as fs from 'fs'
import AWS from 'aws-sdk'
import Application from '@ioc:Adonis/Core/Application'
import path from 'path'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export async function fileUploadToS3(ext, image) {
    const fileName = `${cuid()}.${ext}`
    await image.move(Application.tmpPath('uploads'), {
        name: fileName,
    })
    return await toS3(Application.tmpPath('uploads') + '/' + fileName)
}

function getFileExtesion(file) {
    const lastDot = file.lastIndexOf('.')
    const ext = file.substring(lastDot + 1)
    return ext
}

export async function imageValidationAndUpdload(imgStr) {
    try {
        if (imgStr && !imgStr.startsWith('https')) {
            return await uploadBase64File(imgStr)
        } else if (imgStr && imgStr.startsWith('https')) {
            return imgStr
        } else {
            return ''
        }
    } catch (exception) {
        throw exception
    }
}

export async function toS3(filePath, type?: any): Promise<string> {
    return new Promise(async (resolve) => {
        AWS.config.update({
            accessKeyId: process.env.AWS_S3_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET,
        })
        let ext = type ? type : getFileExtesion(filePath)
        const s3 = new AWS.S3()
        const params: any = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: fs.createReadStream(filePath),
            Key: Date.now() + '_.' + ext,
            ACL: 'public-read',
        }
        if (ext == 'svg') {
            params['ContentType'] = 'image/svg+xml'
        }

        s3.upload(params, function (err, data) {
            //handle error
            if (err) {
                resolve('')
            }
            //success
            if (data) {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
                resolve(data.Location)
            }
        })
    })
}

const checkValidImageOrNot = async (image: any) => {
    const isValid = false
    const isString = typeof image === 'string' || image instanceof String
    if (!isString) {
        let invalidType
        if (image === null) {
            invalidType = 'null'
        } else {
            invalidType = typeof image
            if (
                invalidType === 'object' &&
                image.constructor &&
                image.constructor.hasOwnProperty('name')
            ) {
                invalidType = image.constructor.name
            } else {
                invalidType = `a ${invalidType}`
            }
        }

        return false
    }

    const type = image.split(';')[0].split('/')[1]
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    const validImage = type && matches && matches.length > 1 ? true : false

    if (validImage) {
        const base64Image = matches && matches.length ? matches[2] : ''
        const notBase64 = /[^A-Z0-9+\/=]/i

        const len = base64Image.length
        if (!len || len % 4 !== 0 || notBase64.test(base64Image)) {
            return false
        }
        const firstPaddingChar = base64Image.indexOf('=')
        return (
            firstPaddingChar === -1 ||
            firstPaddingChar === len - 1 ||
            (firstPaddingChar === len - 2 && base64Image[len - 1] === '=')
        )
    }

    return isValid
}

const convertBase64File = async (base64Data: any) => {
    return new Promise(async (resolve) => {
        if (await checkValidImageOrNot(base64Data)) {
            const type = base64Data.split(';')[0].split('/')[1]
            const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
            const base64Image = matches[2]
            const fileName = new Date().getTime() + '.' + type
            const imagePath = path.join(Application.tmpPath('uploads'), fileName)
            fs.writeFile(imagePath, base64Image, 'base64', async (err) => {
                if (!err) {
                    resolve(imagePath)
                } else {
                    resolve('')
                }
            })
        } else {
            console.log('Invalid Image')
            resolve('')
        }
    })
}

export async function uploadBase64File(base64String) {
    if (await checkValidImageOrNot(base64String)) {
        let filePath = await convertBase64File(base64String)
        return toS3(filePath)
    } else {
        return ''
    }
}
