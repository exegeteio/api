export interface IConfig {
  enable_allow_list: boolean;
  allow_list?: string[];
}

const config = {
  enable_allow_list: true,
  allow_list: ["MadhouseSteve"],
};

if (config.allow_list) {
  config.allow_list = config.allow_list.map((m) => m.toLowerCase());
}

export default config;
