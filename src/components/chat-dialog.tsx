
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';

interface ChatMessage {
  id?: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
}

const translations = {
    ur: {
        message: "Pegham",
        chatWith: "ke sath Guftugu",
        typeMessage: "Apna pegham likhein...",
        noMessages: "Abhi tak koi pegham nahi.",
        loadingChat: "Chat load ho rahi hai...",
        chat: "Chat",
    },
    en: {
        message: "Message",
        chatWith: "Chat with",
        typeMessage: "Type a message...",
        noMessages: "No messages yet.",
        loadingChat: "Loading chat...",
        chat: "Chat",
    }
}


export function ChatDialog({ 
    chatPartnerName, 
    chatPartnerId, 
    rideId, 
    chatId,
    trigger,
 } : { 
    chatPartnerName: string, 
    chatPartnerId: string, 
    rideId?: string,
    chatId?: string,
    trigger?: React.ReactNode,
}) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let chatPath;
    if (rideId) {
        chatPath = `rides/${rideId}/messages`;
    } else if (chatId) {
        chatPath = `chats/${chatId}/messages`;
    } else {
        return;
    }

    setLoading(true);
    const messagesCollection = collection(db, chatPath);
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChatMessage));
      setMessages(fetchedMessages);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [rideId, chatId, isOpen]);
  
  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div');
            if (viewport) viewport.scrollTop = viewport.scrollHeight;
        }, 100);
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

     let chatPath;
    if (rideId) {
        chatPath = `rides/${rideId}/messages`;
    } else if (chatId) {
        chatPath = `chats/${chatId}/messages`;
    } else {
        return;
    }

    const messagesCollection = collection(db, chatPath);
    
    await addDoc(messagesCollection, {
        senderId: user.uid,
        text: newMessage,
        timestamp: serverTimestamp()
    });

    setNewMessage('');
  };

  const defaultTrigger = (
     <Button variant="outline" className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" /> {t.message}
     </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle>{t.chatWith} {chatPartnerName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4 bg-muted/50 rounded-lg" ref={scrollAreaRef}>
           <div className="space-y-4">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : messages.length > 0 ? messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.senderId === user?.uid ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.senderId !== user?.uid && (
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={`https://picsum.photos/seed/${chatPartnerId}/100/100`} />
                    <AvatarFallback>{chatPartnerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm break-words ${
                    msg.senderId === user?.uid
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border'
                  }`}
                >
                  <p>{msg.text}</p>
                   <p className={`text-xs mt-1 text-right ${
                    msg.senderId === user?.uid
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}>
                      {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) || ''}
                  </p>
                </div>
                 {msg.senderId === user?.uid && (
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} />
                    <AvatarFallback>{(user.displayName || "A").charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            )) : (
                <div className="text-center text-muted-foreground py-8">{t.noMessages}</div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t.typeMessage}
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
