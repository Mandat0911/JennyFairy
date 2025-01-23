import jwt from "jsonwebtoken"
import Account from "../../Auth/models/account.models.js";
import User from "../../User/models/user.models.js";


export const protectRoute = 
(allowedRoles = []) => 
    async (req, res, next) => {
        try {
            const token = req.cookies.accessToken;

            if(!token){
                return res.status(401).json({error: "Unauthorized: No token provided!"});
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const account = await Account.findOne({email: decoded.email});

            if(!account) {
                return res.status(401).json({error: "Unauthorized: Account not found!"});
            }

            if(!allowedRoles.includes(account.userType)){
                return res.status(401).json({error: "Forbidden: You do not have access to this resource!"});
            }

            req.account = account;

            if(account.userType === "USER") {
                const user = await User.findOne({accountId: account.id}).select("-password");
                req.user = user;
            }

            // if(account.userType === "MANAGER") {
            //     const user = await User.findOne({accountId: account.id}).select("-password");
            //     req.user = user;
            // }

            // if(account.userType === "ADMIN") {
            //     const user = await User.findOne({accountId: account.id}).select("-password");
            //     req.user = user;
            // }
            next();
        } catch (error) {
            console.error("Error in protectRout middleware: ", error.message);
            return res.status(500).json({error: "Internal Server Error!"});
        }
    
}