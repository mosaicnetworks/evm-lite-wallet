const path = require('path');
const fs = require('fs');

const Webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const autoprefixer = require('autoprefixer');


const gui = [];
let memo = {};

const resolveApp = relativePath => {
    return path.resolve(fs.realpathSync(process.cwd()), relativePath);
};

const paths = {
    dist: resolveApp('dist'),
    indexHTML: resolveApp('src/index.html'),
    indexJS: resolveApp('src/app/index.tsx'),
    packageJSON: resolveApp('package.json'),
    src: resolveApp('src'),
    nodeModules: resolveApp('node_modules'),
    tsConfig: resolveApp('tsconfig.json'),
    tsLint: resolveApp('tslint.json'),
};

function getTSXFiles(initial) {
    fs.readdirSync(initial)
        .map((p) => {
            const fullPath = path.join(initial, p);
            if (fs.lstatSync(fullPath).isDirectory()) {
                getTSXFiles(fullPath);
            } else {
                if (p.match(/.*\.tsx$/)) {
                    gui.push(fullPath);
                }
            }
        });
}

function mapTSXFiles(initial) {
    getTSXFiles(initial);
    memo = gui.reduce((memo, file) => {
        memo[path.basename(file, path.extname(file))] = path.resolve(file);

        return memo
    }, {});
}

mapTSXFiles('src');

const commonConfig = {
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: paths.src,
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: true,
                        },
                    },
                    {
                        test: /\.(ts|tsx)$/,
                        include: paths.src,
                        exclude: paths.nodeModules,
                        use: [
                            {
                                loader: require.resolve('ts-loader'),
                                options: {
                                    transpileOnly: true,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.css$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9',
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ],
            }
        ]
    },
    node: {
        __dirname: false
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
    },
    externals: {
        fs: "commonjs fs",
        path: "commonjs path",
        module: "commonjs module"
    },
    performance: {
        hints: false,
    },
};

module.exports = [
    Object.assign({
        target: 'electron-main',
        entry: {main: './src/main.ts'},
        output: {
            path: paths.dist,
            filename: '[name].js',
        },
        plugins: [new Webpack.SourceMapDevToolPlugin({filename: '[name].js.map'})]
    }, commonConfig),
    Object.assign({
        target: 'electron-renderer',
        entry: [paths.indexJS],
        output: {
            path: paths.dist,
            filename: 'static/js/bundle.js',
            chunkFilename: 'static/js/[name].chunk.js',
        },
        plugins: [
            new CleanWebpackPlugin(['dist'], {exclude: ['main.js']}),
            new HTMLWebpackPlugin({
                inject: true,
                template: paths.indexHTML,
            }),
        ]
    }, commonConfig)
];
