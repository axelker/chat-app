package com.chatapp.chatapp.configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Activation serveur websocket

public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
	


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS().setInterceptors(); //Point de connexion client à la websocket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app"); // Lieu ou le client peux envoyer des messages au websocket
        registry.enableSimpleBroker("/topic");  // point d'abonnement pour le client permettant de recevoir les messages envoyé sur ce point
    }
	

}
