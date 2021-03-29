// The MIT License (MIT)

// Copyright (c) 2019 Edrean Ernst

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

class OG {
    constructor(apikey, version='v2', apihost='api.opsgenie.com') {
        this.apikey = apikey;
        this.version = version;
        this.apihost = apihost;

        return this;
    }

    sendQuery(endpoint, method, body) {
        return new Promise((resolve, reject) => {
            try {
                var data = '';
                const https = require('https');
                var options = {
                    hostname: this.apihost,
                    path: '/' + this.version + '/' + endpoint,
                    method: method,
                    headers: {
                        'Authorization': 'GenieKey ' + this.apikey,
                        'Content-Type': 'application/json'
                    }
                };

                // resolve(JSON.stringify(options));

                const req = https.request(options, (res) => {
                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('end', () => {
                        if ((res.statusCode >= 200) & (res.statusCode < 300)) {
                            //Success
                            var result = {
                                success: true,
                                body: JSON.parse(data)
                            }
                            resolve(result);
                        } else {
                            //Failure
                            var result = {
                                success: false,
                                body: JSON.parse(data),
                                error: res.statusMessage
                            }
                            reject(result);
                        } 
                    });

                    res.on('error', (err) => {
                        var result = {
                            success: false,
                            body: JSON.parse(data),
                            error: err.message
                        }
                        reject(result);
                    });
                });
                req.write(JSON.stringify(body));
                req.end();
            } catch (error) {
                var result = {
                    success: false,
                    body: JSON.parse(data),
                    error: error.message
                }
                reject(result);
            }
        });
    }

    async getAccountInfo() {
        var result = {};
        try {
            result = await this.sendQuery('account', 'GET', {});
        } catch(error) {
            result = error;
        }
        return result;
    }

    async getAlerts() {
        var result = {};
        try {
            result = await this.sendQuery('alerts', 'GET', {});
        } catch(error) {
            result = error;
        }
        return result;
    }

    async createAlert(params) {
        var result = {};
        try {
            result = await this.sendQuery('alerts', 'POST', params);
        } catch (error) {
            result = error;
        }
        return result;
    }

    async closeAlert(identifier, identifierType, params={}) {
        var result = {};
        try {
            var aQuery = 'alerts/' + identifier + '/close?identifierType=' + identifierType;
            result = await this.sendQuery(aQuery, 'POST', params);
        } catch (error) {
            result = error;
        }
        return result;
    }
}

module.exports = OG;