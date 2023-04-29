class Auth {
    constructor(option) {
        this._baseUrl = option.baseUrl;
        this._headers = option.headers
    }


    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject('Произошла ошибка');
    }

    register(data) {
        return fetch(`${this._baseUrl}/signup`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(data)
        })
            .then(this._checkResponse)
    }

    login(data) {
        return fetch(`${this._baseUrl}/signin`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(data)
        })
            .then(this._checkResponse)
    }

    checkToken(jwt) {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(this._checkResponse)
    }

}

const auth = new Auth({
    baseUrl: 'https://api.mesto.insta.nomoredomains.monster',
    //baseUrl: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    }
});

export { auth };