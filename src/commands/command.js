'use strict';

import Request from '../request.js';

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

export default Command;