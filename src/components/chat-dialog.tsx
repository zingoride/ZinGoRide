
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface ChatMessage {
  sender: 'driver' | 'rider';
  text: string;
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  {
    sender: 'rider',
    text: 'Aap kahan tak pohanchay?',
    timestamp: '10:30 AM',
  },
  {
    sender: 'driver',
    text: 'Bas 5 minute mein aa raha hoon.',
    timestamp: '10:31 AM',
  },
   {
    sender: 'rider',
    text: 'Theek hai, main intezar kar raha hoon.',
    timestamp: '10:32 AM',
  },
];

export function ChatDialog({ riderName }: { riderName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: ChatMessage = {
      sender: 'driver',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle>Chat with {riderName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4 bg-muted/50 rounded-lg">
           <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.sender === 'driver' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'rider' && (
                  <Avatar className="h-8 w-8">
                     <AvatarImage src="https://picsum.photos/100/100?random=1" />
                    <AvatarFallback>{riderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    msg.sender === 'driver'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border'
                  }`}
                >
                  <p>{msg.text}</p>
                   <p className={`text-xs mt-1 ${
                    msg.sender === 'driver'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
