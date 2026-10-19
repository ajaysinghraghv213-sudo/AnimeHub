export type ChatRequest = {
  message: string;
  room_id: string;
};

export type ChatSocketHandlers = {
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent<string>) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
};

const getChatSocketUrl = (roomId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_WS_URL ?? " https://animehub-3-kbnb.onrender.com";
  const access = localStorage.getItem("accessToken") ?? "";
  const url = new URL(`/ws/chat/${roomId}/?token=${access}`, baseUrl);

  if (url.protocol === "http:") url.protocol = "ws:";
  if (url.protocol === "https:") url.protocol = "wss:";
  if (url.protocol !== "ws:" && url.protocol !== "wss:") {
    throw new Error("NEXT_PUBLIC_WS_URL must use ws:// or wss://");
  }

  return url.toString();
};

export const connectChatSocket = (
  roomId: string,
  handlers: ChatSocketHandlers = {},
): WebSocket => {
  if (typeof window === "undefined") {
    throw new Error("Chat WebSocket connections must be created in the browser");
  }
  if (!/^[\w-]+$/.test(roomId)) {
    throw new Error("A valid chat room ID is required");
  }

  const socket = new WebSocket(getChatSocketUrl(roomId));
  socket.onopen = handlers.onOpen ?? null;
  socket.onmessage = handlers.onMessage ?? null;
  socket.onerror = handlers.onError ?? null;
  socket.onclose = handlers.onClose ?? null;

  return socket;
};

export const chat = connectChatSocket;

export const sendChatMessage = (
  socket: WebSocket,
  request: ChatRequest,
): boolean => {
  if (socket.readyState !== WebSocket.OPEN) return false;

  socket.send(JSON.stringify(request));
  return true;
}; 