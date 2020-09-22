import { IncomingMessage, ServerResponse } from "http";

const createHttpListener = <C, R>(
  buildContext: (req: IncomingMessage) => C,
  handler: (context: C, eq: IncomingMessage) => R,
  mapErrors: (e: Error) => [number, { error: string }] | null,
) => 
  (req: IncomingMessage, res: ServerResponse) =>
    Promise.resolve()
      .then(() => buildContext(req))
      .then(context => 
        handler(context, req)
      )
      .then(result =>
        result != null ? [200, result] : [404, { error: 'Not Found' }]
      )
      .catch((err: Error) => 
        mapErrors(err) ?? [500, { error: err.message }]
      )
      .then(([code, data]: [number, any]) => {
        res.statusCode = code;
        res.end(JSON.stringify(data, null, 2))
      });

export default createHttpListener;