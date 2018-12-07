const path = require('path');
const fs = require('fs');

const Webpack = require('webpack');
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const autoprefixer = require('autoprefixer');


const resolveRelativeToApp = path =>  path.resolve(fs.realpathSync(process.cwd()), path);
const paths = {
    dist: resolveRelativeToApp('dist'),
    indexHTML: resolveRelativeToApp('src/index.html'),
    indexJS: resolveRelativeToApp('src/app/index.tsx'),
    nodeModules: resolveRelativeToApp('node_modules'),
    packageJSON: resolveRelativeToApp('package.json'),
    src: resolveRelativeToApp('src'),
    tsConfig: resolveRelativeToApp('tsconfig.json'),
    tsLint: resolveRelativeToApp('tslint.json'),
};

const config = {
    devServer: {
        compress: true,
        contentBase: paths.dist,
        port: 8081,
        historyApiFallback: true,
        publicPath: '/'
    },
    externals: {
        fs: "commonjs fs",
        module: "commonjs module",
        path: "commonjs path",
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                include: paths.src,
                loader: require.resolve('source-map-loader'),
                test: /\.(js|jsx|mjs)$/,
            },
            {
                oneOf: [
                    {
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/]
                    },
                    {
                        include: [
                            paths.src,
                        ],
                        exclude: paths.nodeModules,
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: true,
                        },
                        test: /\.(js|jsx|mjs)$/
                    },
                    {
                        exclude: paths.nodeModules,
                        include: [
                            paths.src,
                        ],
                        test: /\.(ts|tsx)$/,
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
    performance: {
        hints: false,
    },
};

module.exports = [
    Object.assign({
        entry: {index: './src/index.ts'},
        mode: 'development',
        output: {
            filename: '[name].js',
            path: paths.dist,
        },
        plugins: [new Webpack.SourceMapDevToolPlugin({filename: '[name].js.map'})],
        target: 'electron-main',
    }, config),
    Object.assign({
        entry: [paths.indexJS],
        mode: 'development',
        output: {
            chunkFilename: 'static/js/[name].chunk.js',
            filename: 'static/js/bundle.js',
            path: paths.dist,
        },
        plugins: [
            new CleanWebpackPlugin(['dist'], {exclude: ['index.js']}),
            new HTMLWebpackPlugin({
                inject: true,
                template: paths.indexHTML,
            }),
            new ForkTSCheckerWebpackPlugin({
                async: false,
                tsconfigPath: paths.tsConfig,
                tslintPath: paths.tsLint,
                watch: paths.src,
            }),
            new WatchMissingNodeModulesPlugin(paths.nodeModules),
        ],
        target: 'electron-renderer',
    }, config)
];
