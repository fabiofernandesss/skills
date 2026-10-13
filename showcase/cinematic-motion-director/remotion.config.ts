import path from "node:path";
import { Config } from "@remotion/cli/config";

// The motion kit lives in the skill folder (outside this project), so tell webpack
// to resolve "remotion"/"react" from this project's node_modules for those files too.
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    modules: [path.resolve(process.cwd(), "node_modules"), "node_modules"],
  },
}));
