import createError from "http-errors";
import { verifyAccessToken } from "./tools.js";

export const JWTAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createError(401, "bearer token missing in the authorization header!"));
  } else {
    try {
      // 2. Extract the token from authorization header
      const token = req.headers.authorization.replace("Bearer ", "");

      // 3. Verify token (verify expiration date and check signature integrity), if everything is fine we should get back the payload ({_id, role})

      const payload = await verifyAccessToken(token);

      req.author = {
        _id: payload._id,
        role: payload.role,
      };

      next();
    } catch (error) {
      console.log(error);
      next(createError(401, "Token not valid!"));
    }
  }
};
