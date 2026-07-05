import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import serve from 'rollup-plugin-serve'

const isProduction = process.env.NODE_ENV === 'production'

export default {
    input: './src/index.ts',
    output: [
        {
            format: 'umd',
            file: 'dist/index.umd.js',
            name: 'bezierAnimation',
            exports: 'named',
        },
        {
            format: 'es',
            file: 'dist/index.esm.js',
        },
        {
            format: 'umd',
            file: 'demo/index.umd.js',
            name: 'bezierAnimation',
            exports: 'named',
        },
    ],
    plugins: [
        del({ targets: ['dist', 'demo/index.umd.js'], runOnce: true }),
        resolve({
            browser: true,
            extensions: ['.mjs', '.js', '.json', '.ts'],
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            compilerOptions: {
                module: 'ESNext',
                moduleResolution: 'Bundler',
                declaration: false,
                declarationDir: undefined,
            },
        }),
        isProduction && terser(),
        !isProduction &&
            serve({
                open: false,
                host: '127.0.0.1',
                port: 9908,
                historyApiFallback: true,
                contentBase: 'demo',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }),
    ].filter(Boolean),
}
