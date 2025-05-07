// webpack.config.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  entry: {
    'content-script': './extension/content/content-script.entry.js',
  },
  output: {
    path: path.resolve(__dirname, 'extension/content'),
    filename: 'content-script.js',
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      util: false,
    },
  },
};
