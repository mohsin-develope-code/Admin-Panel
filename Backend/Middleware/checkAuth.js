const { getAdmin } = require("../Utils/jwt");



const checkAuth = (req, res, next) => {

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    
    
    if(!token){
        return res.status(401)
                  .json({ message: "Unauthorized User", 
                          status: false});
    }


    const checkToken = getAdmin(token);
    if(!checkToken){
        return res.status(401)
                  .json({ message: "Unauthorized User", 
                          status: false});
    }



    req.user = checkToken;

    next();
}





module.exports = checkAuth;