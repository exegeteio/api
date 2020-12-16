import { Request, Response } from "express";

export default (req: Request, res: Response) => {
  res.send(
    `https://id.twitch.tv/oauth2/authorize?redirect_uri=${req.query.return_url}&response_type=code&client_id=${process.env.TWITCH_CLIENT_ID}&scope=channel:moderate+chat:read+chat:edit+moderation:read`
  );
};
