import { ApiClient, HelixUser, StaticAuthProvider } from "twitch";
import { IUser } from "../data/User";
import { EventEmitter } from "events";
import { Client } from "tmi.js";

export class Channel extends EventEmitter {
  private user: IUser;
  private authProvider: StaticAuthProvider;
  private api: ApiClient;
  private chat: Client;
  private banList: HelixUser[] = [];

  constructor(user: IUser) {
    super();
    this.user = user;
    this.authProvider = new StaticAuthProvider(
      process.env.TWITCH_CLIENT_ID,
      user.access_token
    );
    this.api = new ApiClient({ authProvider: this.authProvider });
  }

  public async loadBanList() {
    try {
      const banList = await this.api.helix.moderation.getBannedUsers(
        this.user.twitch_id
      );
      for (const ban of banList.data) {
        const bannedUser = await ban.getUser();
        if (!bannedUser) {
          continue;
        }
        this.banList.push(bannedUser);
        this.emit("new_ban", {
          user: bannedUser,
          channel: this.user.twitch_name,
          reason: "Existing ban",
          expires_at: ban.expiryDate,
        });
      }
    } catch (e) {
      console.log("Error loading ban list: ", e);
    }
  }

  getChannelId(): string {
    return this.user.twitch_id;
  }

  getChannelName(): string {
    return this.user.twitch_name;
  }

  async close() {
    if (this.chat.readyState() === "OPEN") {
      await this.chat.disconnect();
    }
  }

  async connect() {
    try {
      this.chat = Client({
        connection: {
          secure: true,
          reconnect: true,
        },
        channels: [this.user.twitch_name],
        identity: {
          username: this.user.twitch_name,
          password: this.user.access_token,
        },
      });
      this.chat.on(
        "ban",
        (_channel: string, username: string, reason: string) => {
          this.channelBan(username, reason);
        }
      );
      this.chat.on("message", console.log);
      await this.chat.connect();
    } catch (e) {
      console.log("ERR", e);
    }
  }

  private async channelBan(username: string, reason: string) {
    console.log(reason);
    const user = await this.api.helix.users.getUserByName(username);
    this.emit("new_ban", { user, channel: this.user.twitch_name, reason });
    console.log(
      `Detected ban for ${user.displayName} / ${user.id} in channel ${this.user.twitch_name}`
    );
  }

  public async addBan(user: HelixUser, reason: string) {
    // Add a ban for the user if we haven't already banned them
    if (!this.banList.find((existing_ban) => existing_ban.id === user.id)) {
      try {
        await this.chat.ban(this.user.twitch_name, user.displayName, reason);
      } catch (e) {
        console.log(`ADDING BAN FAILED!!!! 😭 ${user.displayName}`);
      }
    }
  }

  public async addBanById(userId: string, reason: string) {
    this.addBan(await this.api.helix.users.getUserById(userId), reason);
  }
}
