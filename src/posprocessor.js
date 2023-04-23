'use strict';

import Request from "./request";

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

export default PostProcessor;