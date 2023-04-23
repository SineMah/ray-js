(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.debug = factory());
})(this, (function () { 'use strict';

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

    class Request {
        async send(data) {
            const response = await fetch(this.url(), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.text();

            return responseData === 'ok';
        }

        url() {
            return `${globalThis.rayConfig.protocol}://${globalThis.rayConfig.host}:${globalThis.rayConfig.port}`;
        }
    }

    class PostProcessor {

        static run(uuid, origin) {
            return new PostProcessor(uuid, origin);
        }

        constructor(uuid, origin) {
            this.uuid = uuid;
            this.origin = origin;
        }

        async purple () {
            await this.color('purple');

            return new PostProcessor(this.uuid, this.origin);
        }

        async green () {
            await this.color('green');

            return new PostProcessor(this.uuid, this.origin);
        }

        async orange () {
            await this.color('orange');

            return new PostProcessor(this.uuid, this.origin);
        }

        async blue () {
            await this.color('blue');

            return new PostProcessor(this.uuid, this.origin);
        }

        async grey () {
            await this.color('grey');

            return new PostProcessor(this.uuid, this.origin);
        }

        async red () {
            await this.color('red');

            return new PostProcessor(this.uuid, this.origin);
        }

        async color (color) {
            const req = new Request();
            const context = {
                uuid: this.uuid,
                payloads: [
                    {
                        type: 'color',
                        content:{
                            color: color
                        },
                        origin: this.origin
                    }
                ],
                meta: {}
            };

            await req.send(context);
        }
    }

    class Command {

        async processCommand(type, content) {
            const messageUuid = crypto.randomUUID();
            const origin = this.getOrigin();
            const payload = this.getPayload(messageUuid, type, content, origin);
            const req = new Request();

            await req.send(payload);

            return {
                uuid: messageUuid,
                origin: origin,
                payload: payload
            };
        }

        getPayload(uuid, type, context, origin) {
            return {
                uuid: uuid,
                payloads: [
                    {
                        type: type,
                        content: context,
                        origin: origin
                    }
                ],
                meta: {}
            };
        }

        getOrigin() {
            const source = this.getStackTrace();

            return {
                file: source.file,
                line_number: source.line,
                hostname: globalThis.rayConfig.host_name
            };
        }

        getStackTrace() {
            const error = new Error();
            let fileLine = error.stack
                .split('\n')
                .slice(-1)[0] ?? '';

            fileLine = fileLine.replace('at', '').trim();

            const lines = fileLine.split(':');

            // column -> not used atm
            lines.pop();

            const lineNumber = lines.pop();

            return {
                file: lines.join(':'),
                line: lineNumber
            }
        }
    }

    class Sanitizer {

        static getString(data) {

            if(typeof data !== 'string') {
                data = JSON.stringify(data, null, 4);
            }

            return data;
        }
    }

    class Notify extends Command {

        async run(text) {
            const content = {
                value: text
            };
            const response = await this.processCommand('notify', Sanitizer.getString(content));

            return new PostProcessor(response.uuid, response.origin);
        }
    }

    class Log extends Command {

        async run(text) {
            const content = {
                values: [text]
            };
            const response = await this.processCommand('log', Sanitizer.getString(content));

            return new PostProcessor(response.uuid, response.origin);
        }
    }

    class Json extends Command {

        async run(data) {
            const content = {
                value: Sanitizer.getString(data)
            };
            const response = await this.processCommand('json_string', content);

            return new PostProcessor(response.uuid, response.origin);
        }
    }

    class Time extends Command {

        async run() {
            const date = new Date();
            const content = {
                formatted: date.toISOString(),
                timestamp: Math.floor(Date.now()/1000),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            const response = await this.processCommand('carbon', content);

            return new PostProcessor(response.uuid, response.origin);
        }
    }

    class Custom extends Command {

        async run(data, label) {
            const content = {
                content: data,
                label: label
            };
            const response = await this.processCommand('custom', content);

            return new PostProcessor(response.uuid, response.origin);
        }
    }

    class Dump extends Command {

        async run(data) {
            const content = {
                content: `<pre class="relative overflow-x-auto w-full p-5 h-auto bg-gray-100 dark:bg-gray-800"><code class="h-auto">${Sanitizer.getString(data)}</code></pre>`,
                label: ''
            };
            const response = await this.processCommand('custom', content);

            return new PostProcessor(response.uuid, response.origin);
        }
    }

    let Ray$1 = class Ray {
        static config(args = {}) {
            Config.init(args);
        }

        static async log (text) {
            const log = new Log();
            const response = await log.run(text);

            return PostProcessor.run(response.uuid, response.origin);
        }

        static async json (data) {
            const json = new Json();
            const response = await json.run(data);

            return PostProcessor.run(response.uuid, response.origin);
        }

        static async time () {
            const time = new Time();
            const response = await time.run();

            return PostProcessor.run(response.uuid, response.origin);
        }

        static async notify (text) {
            const notify = new Notify();
            const response = await notify.run(text);

            return PostProcessor.run(response.uuid, response.origin);
        }

        static async custom (data, label) {
            const custom = new Custom();
            const response = await custom.run(data, label);

            return PostProcessor.run(response.uuid, response.origin);
        }

        static async dump (data) {
            const dump = new Dump();
            const response = await dump.run(data);

            return PostProcessor.run(response.uuid, response.origin);
        }
    };

    var index_umd = { ray: Ray$1 };

    return index_umd;

}));
//# sourceMappingURL=ray.js.map
