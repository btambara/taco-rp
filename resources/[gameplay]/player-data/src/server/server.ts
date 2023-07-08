import fetch from 'node-fetch';

class FiveMServer {
    maxClients: number;
    clients: FiveMClient[];

    constructor() {
        this.maxClients = GetConvarInt('sv_maxclients', 32);
        this.clients = [];
    }

    getMaxClients(): number {
        return this.maxClients;
    }

    getNumClients(): number {
        return this.clients.length;
    }

    getClient(name: string): FiveMClient {
        const maxClients = this.getMaxClients();
        for (let i = 0; i < maxClients; i++) {
            console.log(this.clients[i]);
            if (this.clients[i].name == name) {
                return this.clients[i];
            }
        }

        return null;
    }

    addClient(client: FiveMClient): void {
        this.clients.unshift(client);
    }

    dropClient(client: FiveMClient) {
        const index = this.clients.indexOf(client, 0);
        if (index != -1) {
            delete this.clients[index];
        }
    }
}

class FiveMClient {
    localId: number;
    apiId: number;
    name: string;
    steam: string;
    fivem: string;
    ip: string;

    constructor(localId: number, name: string, steam: string, fivem: string, ip: string) {
        this.apiId = -1;
        this.localId = localId;
        this.name = name;
        this.steam = steam;
        this.fivem = fivem;
        this.ip = ip;
    }
}

const fivemServer = new FiveMServer();

on(
    'playerConnecting',
    (
        playerName: string,
        setKickReason: (reason: string) => void,
        deferrals: { defer: any; done: any; handover: any; presentCard: any; update: any }
    ) => {
        deferrals.defer();

        const player = global.source;

        setTimeout(() => {
            console.log(`${playerName} is attemping to connect.`);
            deferrals.update('Attemping to connect...');

            setTimeout(() => {
                if (fivemServer.getNumClients() >= fivemServer.getMaxClients()) {
                    setKickReason('Server full...');
                    CancelEvent();
                }

                setTimeout(() => {
                    deferrals.update('Checking in...');

                    const steamIdentifier = getIdentifier(String(player), 'steam:');
                    const fivemIdentifier = getIdentifier(String(player), 'fivem:');
                    const ipIdentifier = getIdentifier(String(player), 'ip:');

                    if (!steamIdentifier) {
                        deferrals.done('Steam ID not found. Is Steam running?');
                    } else if (!fivemIdentifier) {
                        deferrals.done('FiveM ID not found.');
                    } else if (!ipIdentifier) {
                        deferrals.done('IP not found.');
                    } else {
                        deferrals.done();
                    }
                }, 0);
            }, 0);
        }, 0);
    }
);

on('playerDropped', (reason: string): void => {
    const playerName = GetPlayerName(String(global.source));
    const client = fivemServer.getClient(playerName);
    if (client != null && client.apiId != -1) {
        setLoginPlayer(client, client.apiId, false);
    }

    console.log(`Player ${GetPlayerName(String(global.source))} dropped (Reason: ${reason}).`);
});

onNet('player-data:playerActivated', (): void => {
    const player = global.source;
    const steamIdentifier = getIdentifier(String(player), 'steam:');
    const fivemIdentifier = getIdentifier(String(player), 'fivem:');
    const ipIdentifier = getIdentifier(String(player), 'ip:');
    const playerName = GetPlayerName(String(player));

    const client: FiveMClient = new FiveMClient(
        player,
        playerName,
        steamIdentifier.replace('steam:', ''),
        fivemIdentifier.replace('fivem:', ''),
        ipIdentifier.replace('ip:', '')
    );

    checkInPlayer(client);
});

async function checkInPlayer(client: FiveMClient) {
    await fetch(`http://taco-rp-api/api/v1/players/playername/${client.name}`).then(response => {
        if (response.status == 404) {
            createPlayer(client);
            return;
        } else if (response.ok) {
            response.json().then(data => {
                setLoginPlayer(client, data['id'], true);
            });
            return;
        }

        throw new Error(response.statusText);
    });
}

async function setLoginPlayer(client: FiveMClient, id: number, isLogin: boolean) {
    await fetch(`http://taco-rp-api/api/v1/players/${id}`, {
        method: 'put',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            player_name: client.name,
            steam: client.steam,
            fivem: client.fivem,
            ip_address: client.ip,
            is_logged_in: isLogin,
            is_active: true
        })
    }).then(response => {
        if (response.status == 404) {
            throw new Error(response.statusText);
        } else if (response.ok) {
            client.apiId = id;

            if (isLogin) {
                fivemServer.addClient(client);
            } else {
                fivemServer.dropClient(client);
            }
        }
    });
}

async function createPlayer(client: FiveMClient) {
    await fetch('http://taco-rp-api/api/v1/players', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            player_name: client.name,
            steam: client.steam,
            fivem: client.fivem,
            ip_address: client.ip,
            is_logged_in: false,
            is_active: true
        })
    }).then(response => {
        if (response.status == 404) {
            throw new Error(response.statusText);
        } else {
            response.json().then(data => {
                console.log(`Created player ${client.name}`);
                setLoginPlayer(client, data['id'], true);
            });
        }
    });
}

function getIdentifier(playerSrc: string, identifierSrc: string): string {
    for (let i = 0; i < GetNumPlayerIdentifiers(playerSrc); i++) {
        const identifier = GetPlayerIdentifier(playerSrc, i);

        if (identifier.includes(identifierSrc)) {
            return identifier;
        }
    }

    return '';
}
