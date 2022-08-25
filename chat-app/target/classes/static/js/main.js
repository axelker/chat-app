'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();// recupère nom utilisateur du formulaire et enleve les epaces si y'en a avec trim'

    if(username) {
        usernamePage.classList.add('hidden'); // Cache la page saisie de nom utilsiateur
        chatPage.classList.remove('hidden'); // Affiche la page de chat

        var socket = new SockJS('/ws'); // connexion au serv websocket par le point ws définis dans la config en java
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError); // Connect le client et appels onconnect si celui-ci est connecté sinon la fonction d'erreur'
    }
    event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Tell the  username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim(); //Recupée le message saisie en input grace à la variable messageInput recuperer du dom
    if(messageContent && stompClient) { // Si le message existe et la connexion à la websocket a été établie on envoi le message dans le cat
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

//Fonction permettant de fournir le message dans le front 
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');
	//Affiche si l'utilisateur viens de seconnecter '
    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
        //Si l'utilisateur se deconnecte'
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } 
    //Sinon affiche le message envoyer avec icon(avater) pour un user
    else {
        messageElement.classList.add('chat-message');
	//Construit l'avatar avec la première lettre du nom renseigné ainsi qu'un background'
        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender); // fournis le background avatar à l'aide de la foncton getavatarcolor permettant de générer aléatoirement une couleur parmis celle déclaré

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

//Tire un code couleur aléatoirement dans le tableau colors selon le nom de l'utilsiateur'
function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

// listener sur les deux formulaires ( création nom utilisateur et envoi de message)
usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)