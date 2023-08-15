import { Token } from "../models/token.js";

export const getTokenByTokenValue = async (req, res) => {
  try {
    const tokenValue = req.body.authToken;

    if (!tokenValue) {
      throw new Error('Token is required in request body');
    }

    const findedToken = await Token.findOne({ where: { tokenName: tokenValue } });

    if (!findedToken) {
      throw new Error('Token not found');
    }

    return findedToken;
  } catch (error) {
    throw error;
  }
}