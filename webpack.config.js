const webpack = require('webpack');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const alias = {
	svelte: path.resolve('node_modules', 'svelte')
};
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];

module.exports = {
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		resolve: {
			alias,
			extensions,
			mainFields
		},
		module: {
			rules: [{
				test: /\.(svelte|html)$/,
				use: {
					loader: 'svelte-loader',
					options: {
						dev,
						hydratable: true,
						hotReload: false // pending https://github.com/sveltejs/svelte/issues/2377
					}
				}
			}]
		},
		mode,
		plugins: [

			new WebpackPwaManifest({
				name: 'My Car Log',
				short_name: 'MyCarLog',
				description: 'PWA para llevar el control de su vehículo',
				background_color: '#ffffff',
				theme_color: '#2196F3',
				crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
				ios: true,
				orientation: "any",
				display: "standalone",
				icons: [{
						src: "./static/favicon/android-icon-36x36.png",
						sizes: "36x36",
						type: "image/png"
					},
					{
						src: "./static/favicon/android-icon-48x48.png",
						sizes: "48x48",
						type: "image/png"
					},
					{
						src: "./static/favicon/android-icon-72x72.png",
						sizes: "72x72",
						type: "image/png"
					},
					{
						src: "./static/favicon/android-icon-96x96.png",
						sizes: "96x96",
						type: "image/png"
					},
					{
						src: "./static/favicon/android-icon-144x144.png",
						sizes: "144x144",
						type: "image/png"
					},
					{
						src: "./static/favicon/android-icon-192x192.png",
						sizes: "192x192",
						type: "image/png"
					}
				]
			}),
			// pending https://github.com/sveltejs/svelte/issues/2377
			// dev && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
		].filter(Boolean),
		devtool: dev && 'inline-source-map'
	},

	server: {
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: {
			alias,
			extensions,
			mainFields
		},
		externals: Object.keys(pkg.dependencies).concat('encoding'),
		module: {
			rules: [{
				test: /\.(svelte|html)$/,
				use: {
					loader: 'svelte-loader',
					options: {
						css: false,
						generate: 'ssr',
						dev
					}
				}
			}]
		},
		mode: process.env.NODE_ENV,
		performance: {
			hints: false // it doesn't matter if server.js is large
		}
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode: process.env.NODE_ENV
	}
};