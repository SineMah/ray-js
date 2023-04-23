'use strict';

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

export default Request;