const multer = require('multer');


const upload = multer({
    storeage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    }
})

module.exports = upload;