// utils/getUserDetailsFromToken.js
import jwt from 'jsonwebtoken';

export function getUserDetailsFromToken(token) {
  try {
    const decodedToken = jwt.decode(token);

    const { id, name, email, user_type, level } = decodedToken || {};

    return { id, name, email, user_type, level };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
