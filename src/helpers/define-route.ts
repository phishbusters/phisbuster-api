import Express from 'express';

export function defineBodyRoute<ReqBody>(
  handler: (
    req: Express.Request<any, any, ReqBody>,
    res: Express.Response,
  ) => void,
) {
  return (req: Express.Request<any, any, ReqBody>, res: Express.Response) =>
    handler(req, res);
}

export function defineParamsRoute<ReqParams>(
  handler: (
    req: Express.Request<ReqParams, any, any>,
    res: Express.Response,
  ) => void,
) {
  return (req: Express.Request<ReqParams, any, any>, res: Express.Response) =>
    handler(req, res);
}
