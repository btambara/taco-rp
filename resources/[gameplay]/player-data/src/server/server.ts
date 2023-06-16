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

    clientJoining(client: FiveMClient): void {
        this.clients.unshift(client);
    }

    clientDropped(client: FiveMClient) {
        const index = this.clients.indexOf(client, 0);
        if (index != -1) {
            delete this.clients[index];
        }
    }
}

class FiveMClient {
    localId: number;
    name: string;
    steam: string;
    fivem: string;
    ip: string;

    constructor(localId: number, name: string, steam: string, fivem: string, ip: string) {
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
                        setKickReason('Steam ID not found.');
                    } else if (!fivemIdentifier) {
                        setKickReason('FiveM ID not found.');
                    } else if (!ipIdentifier) {
                        setKickReason('IP not found.');
                    } else {
                        const fivemClient: FiveMClient = new FiveMClient(
                            player,
                            playerName,
                            steamIdentifier.replace('steam:', ''),
                            fivemIdentifier.replace('fivem:', ''),
                            ipIdentifier.replace('ip:', '')
                        );
                        fivemServer.clientJoining(fivemClient);

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
    if (client != null) {
        fivemServer.clientDropped(client);
    }

    console.log(`Player ${GetPlayerName(String(global.source))} dropped (Reason: ${reason}).`);
});

function getIdentifier(playerSrc: string, identifierSrc: string): string {
    for (let i = 0; i < GetNumPlayerIdentifiers(playerSrc); i++) {
        const identifier = GetPlayerIdentifier(playerSrc, i);

        if (identifier.includes(identifierSrc)) {
            return identifier;
        }
    }

    return '';
}
