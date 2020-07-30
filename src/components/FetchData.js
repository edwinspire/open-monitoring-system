import {
    APPLocalStorage
} from "./Stores.js";
import {
    hex_sha1, str_sha1
} from "./sha1.js";

export class FetchData {
    async post(url, data, headers) {

        let response;

        try {
            let response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
            });
            //cache.put(event.request, response.clone());
            return response;
        } catch (err) {
            console.log(err);
            //const response = await cache.match(event.request);
            if (response) return response;
            throw err;
        }

    }
    get(url, query, headers) {
        let searchURL = new URLSearchParams(query);
        let urlq = url + "?" + searchURL.toString();
        return fetch(urlq, {
            method: "GET",
            headers: headers,
        });
    }

    async login(url, user, password) {
        let LStorage = new APPLocalStorage();
        let pwdoff = await this.digestMessage(user + password);
        try {
            let f = await this.post(url, {
                username: user,
                pwd: password
            }, {
                "Content-Type": "application/json"
            });

            let data = await f.json();
            data.offline = pwdoff;
            LStorage.setUser(data);
            return data;

        } catch (error) {
            console.log(error);
            let data = {};
            data.login = false;
            let user = LStorage.getUser(data);

            console.log(user);

            if (user.offline == pwdoff) {
                data = user;
            }

            return data;
        }
    }

    async digestMessage(message) {
        /*
        console.log(hex_sha1('hola'), str_sha1('hola'));
        const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
        console.log(crypto);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""); // convert bytes to hex string
            */
        return hex_sha1(message);
    }

}