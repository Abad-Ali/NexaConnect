'use client';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store.js';
// import {io} from "socket.io-client";
// import { useEffect } from 'react';
// import { setSocket } from '@/redux/socketSlice.js'; 
// import { setOnlineUsers } from '@/redux/chatSlice.js';

// function App({children}) {
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

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
