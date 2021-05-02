import { randomBytes } from 'crypto';
import multer from 'multer';
import {Options, diskStorage} from 'multer';
const maxSizeUpload = 5000000
const {resolve} = require('path');

const storage = multer.diskStorage({
    destination: 'assets/',
})

export const multerI = multer({
    storage,
    dest: 'assets/',
    limits: {
        fieldSize: maxSizeUpload
    }
}).single('avatar');

export const multerIdentification = {
    dest: resolve(__dirname, '..', '..', '..', 'uploads'),
    storage: diskStorage({
        destination: (req: any, file: any, callback: any) => {
            callback(null, resolve(__dirname, '..', '..', '..', 'uploads'))
        },
        filename: (req: any, file: any, callback: any) => {
            randomBytes(16, (error: any, hash: any) => {
                if(error) {
                    callback(error, file.filename)
                }
                const filename = `${hash.toString('hex')}.png`
                callback(null, file.filename)
            })
        }
    }),
    limits: {
        fieldSize: maxSizeUpload
    },
    fileFilter: (req: any, file: any, callback: any) => {
        const formats = [
            'image/png',
            'image/jpg',
            'image/jpeg'
        ]

        if (formats.includes(file.mimetype)){
            callback(null, true)
        } else {
            callback(new Error('format invalid'))
        }
    }
} as Options