/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const DelegatedModule = require("./DelegatedModule");

// options.source
// options.type
// options.context
// options.scope
// options.content
class DelegatedModuleFactoryPlugin {
	constructor(options) {
		this.options = options;
		options.type = options.type || "require";
		options.extensions = options.extensions || ["", ".js"];
	}

	apply(normalModuleFactory) {
		const scope = this.options.scope;
		if(scope) {
			normalModuleFactory.plugin("factory", factory => (data, callback) => {
				const dependency = data.dependencies[0];
				const request = dependency.request;
				if(request && request.indexOf(scope + "/") === 0) {
					const innerRequest = "." + request.substr(scope.length);
					let resolved;
					if(innerRequest in this.options.content) {
						resolved = this.options.content[innerRequest];
						return callback(null, new DelegatedModule(this.options.source, resolved, this.options.type, innerRequest, request));
					}
					for(let i = 0; i < this.options.extensions.length; i++) {
						const extension = this.options.extensions[i];
						const requestPlusExt = innerRequest + extension;
						if(requestPlusExt in this.options.content) {
							resolved = this.options.content[requestPlusExt];
							return callback(null, new DelegatedModule(this.options.source, resolved, this.options.type, requestPlusExt, request + extension));
						}
					}
				}
				return factory(data, callback);
			});
		} else {
			normalModuleFactory.plugin("module", module => {
				if(module.libIdent) {
					let request = module.libIdent(this.options);
					if(this.options.packageName && request.match(new RegExp(this.options.packageName))) {
						request = `${this.options.packageName}${request.split(this.options.packageName)[1]}`;
					}
					if(request && request in this.options.content) {
						const resolved = this.options.content[request];
						return new DelegatedModule(this.options.source, resolved, this.options.type, request, module);
					}
				}
				return module;
			});
		}
	}
}
module.exports = DelegatedModuleFactoryPlugin;
