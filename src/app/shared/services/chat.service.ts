import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ChatService {

  constructor(private http: HttpClient) {
  }

  sendToken(res: string) {
    const body = { identity: res }
    return this.http.post("http://localhost:4201/chat/token", body);
  }
}
