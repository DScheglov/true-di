import { IncomingMessage } from "http";

export const readHeader = (req: IncomingMessage, headerName: string): string => {
  const headerValue = req.headers[headerName.toLocaleLowerCase()];
  return Array.isArray(headerValue) ? headerValue[0] : headerValue;
}