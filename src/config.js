'use strict';

class Config {
    static init (args = {}) {
        globalThis.rayConfig = {
            protocol: args.protocol ?? 'http',
            host: args.host ?? '127.0.0.1',
            port: args.port ?? 23517,
            remote_path: args.remote_path ?? null,
            local_path: args.local_path ?? null,
            host_name: args.host_name ?? crypto.randomUUID(),
            hasErrorListener: false,
        };

        if(globalThis.rayConfig.hasErrorListener === false) {

            globalThis.rayConfig.hasErrorListener = true;

            window.addEventListener('error', async (error) => {
                const err = `${error.type}: ${error.message}
                    at ${error.filename}:${error.lineno}`;

                await (await Ray.dump(err)).red();
            });
        }
    }
}

export default Config;