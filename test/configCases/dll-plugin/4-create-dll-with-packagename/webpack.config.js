var webpack = require("../../../../"); // eslint-disable-line
var path = require("path");

module.exports = {
	entry: ["./a", "./b", "./_d", "./_e", "./g.abc", "./h"],
	resolve: {
		extensions: [".js"]
	},
	output: {
		filename: "dll.js",
		chunkFilename: "[id].dll.js",
		libraryTarget: "commonjs2"
	},
	module: {
		rules: [
			{
				test: /\.abc\.js$/,
				loader: "./g-loader.js",
				options: {
					test: 1
				}
			}
		]
	},
	plugins: [
		new webpack.DllPlugin({
			packageName: "testPackage",
			path: path.resolve(__dirname, "../../../js/config/dll-plugin/manifest1.json")
		})
	]
};
