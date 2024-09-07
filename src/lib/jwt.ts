import jwt, { JwtPayload } from "jsonwebtoken";

interface ISignOption {
  expiresIn: string | number;
}

const DEFAULT_SIGN_OPTION: ISignOption = {
  expiresIn: "1d",
};

export function signJwt(payload: JwtPayload, option = DEFAULT_SIGN_OPTION) {
  const secret = process.env.JWT_USER_ID_SECRET!;
  const token = jwt.sign(payload, secret);

  return token;
}

export function verifyJwt(token: string) {
  try {
    const secret = process.env.JWT_USER_ID_SECRET!;
    const decoded = jwt.verify(token, secret);
    return decoded as JwtPayload;
  } catch (error) {
    console.error(error);
    return null;
  }
}
