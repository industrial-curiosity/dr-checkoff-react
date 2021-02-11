const self = {
    "baseUrl": "https://example.com",
    "formatGetRequest": (authToken) => {
        let headers = {
            'Authorization': `Bearer ${authToken}`
        };
        return {
            method: "GET",
            headers
        };
    },
    "formatPostRequest": (json, authToken) => {
        let body = (typeof json === 'object' ? JSON.stringify(json) : json);
        let headers = {
            'Content-Type': 'application/json'
        };
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        return {
            method: "POST",
            headers,
            body
        };
    },
};

export default self;