package com.chatapp.chatapp.controller;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import model.ChatMessage;

@Controller
public class ChatController {
	
	// Message a destination de /app/chat.sendmessage utilisera la methode sendMessage et envoyer vers le chemin topic/public
	 @MessageMapping("/chat.sendMessage")
	 @SendTo("/topic/public")
	 public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
	      return chatMessage;
	  }

	 @MessageMapping("/chat.addUser")
	 @SendTo("/topic/public")
	 public ChatMessage addUser(@Payload ChatMessage chatMessage,SimpMessageHeaderAccessor headerAccessor) {
		 	// Add username in web socket session
		 	headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
	   		return chatMessage;
	 }

}
