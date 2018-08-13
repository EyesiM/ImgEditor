let path = require('path');
let webpack = require('webpack');
let serverHost = "localhost";
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        app: './src/index.js',
        // darkroom: [
        //     './src/plugin/darkroom/js/core/bootstrap.js',
        //     './src/plugin/darkroom/js/core/darkroom.js',
        //     './src/plugin/darkroom/js/core/transformation.js',
        //     './src/plugin/darkroom/js/core/plugin.js',
        //     './src/plugin/darkroom/js/core/ui.js',
        //     './src/plugin/darkroom/js/core/utils.js',
        //     './src/plugin/darkroom/js/plugins/darkroom.history.js',
        //     './src/plugin/darkroom/js/plugins/darkroom.rotate.js',
        //     './src/plugin/darkroom/js/plugins/darkroom.crop.js',
        //     './src/plugin/darkroom/js/plugins/darkroom.save.js'
        // ]
        darkroom: './temp/darkroom.js'
    },
    output: {
        path: path.join(__dirname, './'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: 'dist/',
        filename: '[name].js'
    },
    //加载器
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /src\/plugin/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ["es2015"]
                    }
                }]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "raw-loader"
                }]
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader!css-loader'
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader!css-loader!sass-loader'
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            {
                //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                //如下配置，将小于8192byte的图片转成base64码
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader?limit=8192&name=images/[hash].[ext]'
                }]
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     title:"test3",
        //     filename:"./dist/index.html",//输出html文件，打包时插入js,不用自己手动引入
        //     inject: 'body',  //js插入的位置，true/'head'/'body'/false
        //     hash: true
        // }),
        new HtmlWebpackPlugin({
            filename: 'index.html', //通过模板生成的文件名
            template: 'index.html',//模板路径
            inject: 'body' //是否自动在模板文件添加 自动生成的js文件链接
        })
    ],
    //使用webpack-dev-server
    devServer: {
        contentBase: './',
        host: serverHost,
        port: 9090, //默认9090
        inline: true, //可以监控js变化
        hot: true//热启动
    }
};
