import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "@/redux/chatSlice";
import { useSocket } from "@/app/SocketIOProvider"; // <-- imported contex

const useGetRTM = () => {
  const dispatch = useDispatch();
  const socket = useSocket(); // <-- use socket from context

  useEffect(() => {
    if (!socket) {
      // console.log("No socket instance available");
      return;
    }

    // console.log("Setting up socket listener for newMessage");

    const handleNewMessage = (newMessage) => {
      // console.log("Received newMessage on client:", newMessage); // <-- this should log!
      dispatch(addMessage(newMessage));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);
};

export default useGetRTM;