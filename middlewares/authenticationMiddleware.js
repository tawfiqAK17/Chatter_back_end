import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => { 
    // the authorization header
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // extracting the actual jwt 
        const token = authHeader.split(' ')[1];

        // verifying the authentication token
        jwt.verify(token.replaceAll('"', ''), process.env.JWT_SECRET_STRING, (err, user) => {
            if (err) {
                return res.status(403).json({});
            }

            // adding the user to the request
            req.body.user = user;

            next();
        });
    } else {
        return res.status(401);
    }
}

export default authMiddleware;
