import { terser } from 'rollup-plugin-terser';
export default {
  input: "./src/index.js",
  output: [
    {
      file: "./dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "./dist/index.mjs",
      format: "es",
    },
  ],
  plugins: [
    terser(), // 添加 terser 插件以进行代码压缩
  ],
};
