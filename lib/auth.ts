import jwt from "jsonwebtoken";

export function getUserId(req: any): number {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error("No token");
  }

  const token = authHeader.split(" ")[1];

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  );

  return decoded.userId;
}