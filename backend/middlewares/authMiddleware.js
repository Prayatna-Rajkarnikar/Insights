import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  // Get the token from the request cookies
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // Verify the token using the secret stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //store the decoded user information in the request object
    req.user = decoded;

    //pass control to next middleware or handler
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
