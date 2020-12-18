export interface IConfig {
  enable_allow_list: boolean;
  allow_list?: string[];
  admins: string[];
}

const config = {
  enable_allow_list: true,
  allow_list: ["MadhouseSteve"],
  admins: ["MadhouseSteve"],
};

if (config.allow_list) {
  config.allow_list = config.allow_list.map((m) => m.toLowerCase());
}
config.admins = config.admins.map((m) => m.toLowerCase());

export default config;
