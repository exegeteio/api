import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import Ban from "../../data/Ban";

export default async (req: Request, res: Response) => {
  // Check user is an admin
  try {
    if (
      !req.headers.authorization ||
      (jwt.verify(req.headers.authorization, process.env.JWT_KEY) as any)
        .role !== "admin"
    ) {
      throw new Error();
    }
  } catch (e) {
    return res.sendStatus(403);
  }

  let bans = (await Ban.find().exec()).map((ban) => ({
    twitch_id: ban.twitch_id,
    twitch_name: ban.twitch_name,
  }));

  res.json(bans);
};
