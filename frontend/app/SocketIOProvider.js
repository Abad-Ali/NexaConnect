'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setOnlineUsers } from '@/redux/chatSlice';
import { setLikeNotification } from '@/redux/rtnSlice';

// Create a React context to provide socket instance
const SocketContext = createContext(null);

export function SocketIOProvider({ children }) {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Create socket connection
       socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
        query: { userId: user._id },
        // transports: ['websocket']
        withCredentials: true,
      });

      // Listen for online users event
      socketRef.current.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers)); // Dispatch serializable data only!
      });
       
      //Listen the new notification 
      socketRef.current.on('notification', (notification)=>{
        dispatch(setLikeNotification(notification));
      });

      // Cleanup on unmount or user change
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } else {
      // If no user, ensure socket is disconnected
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      // Clear online users from Redux if needed
      dispatch(setOnlineUsers([]));
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

// Custom hook to use socket instance anywhere
export function useSocket() {
  return useContext(SocketContext);
}


// Not Working Showing Error's
// 'use client';

// import {io} from "socket.io-client";
// import { useEffect } from 'react';
// import { setSocket } from '@/redux/socketSlice.js'; 
// import { setOnlineUsers } from '@/redux/chatSlice.js';
// import { useDispatch, useSelector } from "react-redux";

// function App({ children }) {
//   const {user} = useSelector(store=>store.auth);
//   const { socket } = useSelector(store => store.socketio);
//   const dispatch = useDispatch();

//   useEffect(()=>{
//     if(user){
//       const socketio = io('http://localhost:8000',{
//         query: {
//           userId: user?._id
//         },
//         transports:['websocket']
//       })
//       dispatch(setSocket(socketio));

//       //Listen all the events
//       socketio.on('getOnlineUsers', (onlineUsers)=>{
//         dispatch(setOnlineUsers(onlineUsers));
//       });

//       return ()=>{
//         socketio.close();
//         dispatch(setSocket(null));
//       }
//     }else if(socket){
//       socket.close();
//       dispatch(setSocket(null));
//     }
//   },[user, dispatch]);

//   return <>{children}</>;
// };

// export function SocketIOProvider({ children }) {
//   return (
//     <App>
//         {children}
//     </App>
//   );
// }