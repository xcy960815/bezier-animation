import typescript from 'rollup-plugin-typescript2'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import del from 'rollup-plugin-delete' //
import commonjs from '@rollup/plugin-commonjs' //将CommonJS模块转换为ES6, 方便rollup直接调用
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
const isProduction = process.env.NODE_ENV === 'production'
import path from 'path'
const getPath = (_path) => path.resolve(__dirname, _path)

export default {
    input: './src/index.ts',
    output: [
        {
            format: 'umd',
            file: 'dist/index.umd.js',
            name: 'bezierAnimation',
        },
        {
            format: 'umd',
            file: 'demo/index.umd.js',
            name: 'bezierAnimation',
        },
    ],
    plugins: [
        del({ targets: ['dist', 'demo/index.umd.js'] }),
        commonjs({
            include: 'node_modules/**',
        }),
        isProduction && terser(),
        babel({
            exclude: 'node_modules/**',
        }),
        // 开启服务
        !isProduction &&
            serve({
                open: false,
                host: 'localhost',
                port: 9008,
                historyApiFallback: true,
                contentBase: 'demo',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }),
        // 热更新
        !isProduction && livereload(),

        typescript({
            tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
            extensions: ['.js', '.ts', '.tsx'],
        }),
        sourceMaps(),
    ],
}
