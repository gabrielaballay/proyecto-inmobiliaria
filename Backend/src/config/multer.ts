import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadPath = path.resolve("uploads/properties");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
        recursive: true
    });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {
        const extension = path.extname(file.originalname);
        const fileName =
            crypto.randomUUID() + extension;

        cb(null, fileName);
    }
});

export default multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter(req, file, cb) {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/webp"
        ) {
            cb(null, true);
            return;
        }

        cb(new Error("Formato de imagen inválido."));
    }

});