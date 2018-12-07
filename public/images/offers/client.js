var ws = new WebSocket('ws://echo.websocket.org/');

ws.onopen = function() {
        console.log('WebSocket-Verbindung aufgebaut'); 
        ws.send('Hallo WebSocket Endpoint!');
        console.log('Uebertragene Nachricht: Hallo WebSocket Endpoint !');
};

ws.onmessage = function() {
        console.log('Der Server sagt: ' + message.data);
        ws.close();
};

ws.onclose = function() {
        console.log('Der Server WebSocket wurde geschlossen oder konnte nicht aufgebaut werden.');
};

ws.onerror = function() {
        console.log('Something gone wrong. See Description below');
        console.log('Fehlermeldung: ' + event.reason + ' (' + event.code + ')' );
};

