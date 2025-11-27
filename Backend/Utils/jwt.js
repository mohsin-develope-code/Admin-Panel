const jwt = require('jsonwebtoken');
require('dotenv').config()

const setAdmin = (user) => {
      
    payload = {
        adminId: user.adminId,
    }

    const token = jwt.sign(payload,process.env.SECRET_KEY)

    return token;
}




const getAdmin = (token) => {
    
    return jwt.verify(token, process.env.SECRET_KEY);
}



module.exports = {
    setAdmin, 
    getAdmin,
}