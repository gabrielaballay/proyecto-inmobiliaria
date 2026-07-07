import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadPath = process.env.UPLOAD_PATH ??
    path.resolve("uploads");

const propertyPath =
    path.join(uploadPath, "properties");

if (!fs.existsSync(propertyPath)) {
    fs.mkdirSync(propertyPath, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, propertyPath);
    },

    filename(req, file, cb) {

        const extension =
            path.extname(file.originalname);

        cb(
            null,
            crypto.randomUUID() + extension
        );

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
            return cb(null, true);
        }

        cb(new Error("Formato de imagen inválido."));
    }
});
