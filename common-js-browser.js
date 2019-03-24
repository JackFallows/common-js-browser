window.initialiseRequire = function (moduleSource, scope) {
    (scope || window).require = async function (module) {
        const modules = {};

        let source = modules[module] || null;

        if (source == null) {
            if (typeof moduleSource === "string") {
                source = { source: `${moduleSource}/${module}.js`, loaded: false, module: null };
            } else if (typeof moduleSource === "function") {
                source = { source: await moduleSource(module), loaded: false, module: null };
            }

            modules[module] = source;
        }

        if (!source.loaded) {
            window.module = {
                exports: null
            };
            
            await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.onload = function (e) {
                    resolve();
                };

                script.onerror = function () {
                    reject("Could not load " + this.src);
                };

                script.src = source.source;

                document.getElementsByTagName("head")[0].appendChild(script);
            });
            
            source.module = window.module.exports;
            window.module.exports = null;
            
            return source.module;
        }
        
        return source.module;
    };
};