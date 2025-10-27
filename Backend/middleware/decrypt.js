const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = '12345678901234567890123456789012'; // 32 bytes for aes-256
const IV = '1234567890123456'; // 16 bytes for aes block size

const decryptMiddleware = (req, res, next) => {
  try {
    const { encryptedData } = req.body;

    if (!encryptedData) {
      return res.status(400).json({ error: "Missing 'encryptedData' in request body" });
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), IV);  //AES decipher

    //Decrypts Base64 text -> UTF8 plaintext
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");

    //parses decrypted json string
    try {
      req.decryptedData = JSON.parse(decrypted);
    } catch (e) {
      return res.status(400).json({ error: "Decryption succeeded, but JSON parsing failed" });
    }

    next(); //this will Proceed to PDA validation
    
  } catch (err) {
    console.error("Decryption error:", err.message);
    return res.status(500).json({ error: "Decryption failed", details: err.message });
  }
};

module.exports = decryptMiddleware;


/*
module.exports = function decrypt(req,res,next){
    req.decryptedPayload = req.body; //  implement actual decryption logic here later
    next();
};

*/
