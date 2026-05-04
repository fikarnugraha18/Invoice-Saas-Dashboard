import jwt from "jsonwebtoken";

export function getUserFromReq(req: any) {
  const cookie = req.headers.cookie;

  if (!cookie) throw new Error("No cookie");

  const token = cookie
    .split(";")
    .find((c: string) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) throw new Error("No token");

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  );

  return decoded.userId;
}