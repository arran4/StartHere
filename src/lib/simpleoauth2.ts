const config = {
    clientId: 'Iv1.ca1a0fb90330e819',
    // clientSecret: 'GITHUB CLIENT SECRET',
    redirectUri: 'http://localhost:5173/',
    allowedOrigins: ['http://localhost:5173/', 'https://arran4.github.io/StartHere/'],
};

// TODO This can't be done b/c of CORS using github pages. Need to have a server backend.

export function GenerateLoginUrl() : string {
    return `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&scopes=user,repo`
}

interface ExchangeResult {
    access_token?: string
    scope?: string
    token_type?: string
}

export async function Exchange(code : string) : Promise<ExchangeResult> {
    // TODO hopefully not required &client_secret=${config.clientSecret}
    const url = `https://github.com/login/oauth/access_token?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&code=${code}`;
    const result = await fetch(url, {
        headers: {
            "Accept": "application/json"
        }
    })
    return await result.json()
}

export async function GetUserDetails(accessToken : string) : Promise<unknown> {
    const url = `https://github.com/api/v2/json/user/show&access_token=${accessToken}`;
    const result = await fetch(url, {
        headers: {
            "Accept": "application/json"
        }
    })
    return await result.json()
}
