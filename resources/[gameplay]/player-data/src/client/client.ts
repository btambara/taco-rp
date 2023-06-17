setImmediate(() => {
    for (;;) {
        if (NetworkIsSessionStarted()) {
            TriggerServerEvent('player-data:playerActivated');
            break;
        }
    }
});
