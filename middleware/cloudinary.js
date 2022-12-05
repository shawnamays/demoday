const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dnfcfaahy', 
    api_key: '178783243816617', 
    api_secret: 'g-PIA839_By0EExW8vfGN1q0rF4',
   
  });



// require("dotenv").config({ path: "./config/.env" });

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

module.exports = cloudinary;
