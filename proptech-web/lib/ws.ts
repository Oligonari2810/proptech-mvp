// Cliente WebSocket para Next.js con namespaces y autenticación

import { io, Socket } from "socket.io-client";

const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:8000";
const wsBase = base.replace(/^https?:\/\//, ""); // Remover protocolo para SocketIO

/**
 * Cliente WebSocket para chat de propiedades
 */
export const chatWS = (token: string): Socket => {
  const socket = io(`${base}/chat`, {
    transports: ["websocket"],
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 8000,
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("[WS Chat] Conectado al namespace /chat");
  });

  socket.on("disconnect", () => {
    console.log("[WS Chat] Desconectado del namespace /chat");
  });

  socket.on("connect_error", (error) => {
    console.error("[WS Chat] Error de conexión:", error);
  });

  return socket;
};

/**
 * Cliente WebSocket para notificaciones en tiempo real
 */
export const notificationsWS = (token: string): Socket => {
  const socket = io(`${base}/notifications`, {
    transports: ["websocket"],
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 8000,
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("[WS Notifications] Conectado al namespace /notifications");
  });

  socket.on("disconnect", () => {
    console.log("[WS Notifications] Desconectado del namespace /notifications");
  });

  socket.on("connect_error", (error) => {
    console.error("[WS Notifications] Error de conexión:", error);
  });

  return socket;
};

/**
 * Cliente WebSocket para recomendaciones IA en tiempo real
 */
export const aiWS = (token: string): Socket => {
  const socket = io(`${base}/ai`, {
    transports: ["websocket"],
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 8000,
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("[WS AI] Conectado al namespace /ai");
  });

  socket.on("disconnect", () => {
    console.log("[WS AI] Desconectado del namespace /ai");
  });

  socket.on("connect_error", (error) => {
    console.error("[WS AI] Error de conexión:", error);
  });

  return socket;
};

/**
 * Hook helper para obtener token desde localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("habitatpro_token");
};

/**
 * Ejemplo de uso:
 * 
 * ```ts
 * import { chatWS, getToken } from '@/lib/ws';
 * 
 * const token = getToken();
 * if (token) {
 *   const socket = chatWS(token);
 *   socket.on("connect", () => {
 *     socket.emit("join_property_chat", { propertyId: "1" });
 *   });
 *   socket.on("new_message", (msg) => {
 *     console.log("Nuevo mensaje:", msg);
 *   });
 * }
 * ```
 */

