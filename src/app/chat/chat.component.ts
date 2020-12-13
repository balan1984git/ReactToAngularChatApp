import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { ChatService } from '../shared/services/chat.service';
import { Author, Showcontent } from '../shared/model/messages'
import * as Twilio from 'twilio-chat';
import Client from "twilio-chat";
import { Channel } from "twilio-chat/lib/channel";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  isLoading = true;
  isLoadingChat = false;
  currentUserName: string;
  restoken;
  user: Author;
  messages = [];

  public chatClient: Client;
  public currentChannel: Channel;

  constructor(private activatedRoute: ActivatedRoute,
    private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(user => {
      this.currentUserName = user.userName;
      this.user = {
        id: user.userName,
        name: user.userName
      };
    });

    let identity = encodeURIComponent(this.currentUserName);
    if (this.currentUserName) {
      this.chatService.sendToken(identity).subscribe(data => {
        this.restoken = data;
        if (this.restoken) {
          this.createChat(this.restoken.token)
        }
      }, (error) => {
        this.isLoadingChat = true;
        console.log("something wrong")
      });
    }
  }

  createChat(token): void {
    Twilio.Client.create(token).then((client: Client) => {
      this.chatClient = client;
      this.setupChatClient(this.chatClient);
    })
  }

  setupChatClient(client): void {
    this.chatClient = client;
    this.chatClient
      .getChannelByUniqueName('general2')
      .then(channel => channel)
      .catch(error => {
        if (error.body.code === 50300) {
          return this.chatClient.createChannel({ uniqueName: 'general2' });
        } else {

        }
      })
      .then(channel => {
        this.currentChannel = channel;
        return this.currentChannel.join().catch(() => { });
      })
      .then(() => {
        this.currentChannel.getMessages().then((messagePage) => this.messagesLoaded(messagePage));
        this.currentChannel.on('messageAdded', (message) => this.messageAdded(message));
      })
  }

  messagesLoaded(messagePage): void {
    this.isLoading = false;
    this.messages = messagePage.items.map(this.twilioMessageToKendoMessage);
  }

  messageAdded(message): void {
    this.isLoading = false;
    this.messages = [...this.messages, this.twilioMessageToKendoMessage(message)];
  }

  twilioMessageToKendoMessage(message) {
    return {
      text: message.body,
      author: { id: message.author, name: message.author },
      timestamp: message.timestamp
    };
  }

  sendMessage(event: SendMessageEvent): void {
    this.currentChannel.sendMessage(event.message.text);
  }
}
