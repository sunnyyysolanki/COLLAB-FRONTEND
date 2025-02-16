import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Collaborators from "./Collaborators";
import PropTypes from "prop-types";
import Add_Collaborators from "./Add_Collaborators";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import {
  disconnectSocket,
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../../socket";
import { useSelector } from "react-redux";
import Markdown from "markdown-to-jsx";
import WorkSpace from "./WorkSpace";
import Ai_File_Container from "./Ai_File_Container";
import { getWebContainer } from "../../webContainer";

const Chat = ({ project, users }) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(project.messages);
  const messagesEndRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [filetree, setfiletree] = useState(project.fileTree || {});
  const [webContainer, setWebContainer] = useState(null);

  const { user } = useSelector((state) => state.user);
  const { id: project_id } = useParams();
  const [socket, setSocket] = useState(null);

  // ✅ Clear state when switching projects
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["project"] });
    setCurrentFile(null);
    setOpenFiles([]);
    setfiletree(project.fileTree || {});
    setMessages(project.messages);
  }, [project_id, project, queryClient, user]);

  // ✅ Initialize WebSocket when project changes
  useEffect(() => {
    const socket = initializeSocket(project_id);
    setSocket(socket);

    socket.on("connect", () => console.log("✅ Connected to WebSocket"));

    receiveMessage("project-message", async (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);

      scrollToBottom();
    });

    return () => {
      socket.off("project-message");
      socket.off("project-code");
      disconnectSocket();
    };
  }, [project_id]);

  // ✅ Unmount and reinitialize WebContainer when project changes
  useEffect(() => {
    if (webContainer) {
      webContainer.teardown().then(() => {
        getWebContainer().then((container) => {
          setWebContainer(container);
          console.log("✅ WebContainer reinitialized for new project.");
        });
      });
    } else {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log("✅ WebContainer booted.");
      });
    }
  }, [project_id]);

  // ✅ Handle AI-generated filetree messages
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.sender?.email === "gemini@ai.com") {
      try {
        const aiMessage = JSON.parse(latestMessage.message);
        if (aiMessage?.fileTree && webContainer) {
          webContainer.mount(aiMessage.fileTree);

          setfiletree((prevFileTree) => ({
            ...prevFileTree, // Keep existing files
            ...aiMessage.fileTree, // Merge new files
          }));
        }
      } catch (error) {
        console.error("❌ Error parsing AI message:", error);
      }
    }
  }, [messages, webContainer, project_id]);

  // ✅ Save message to MongoDB
  async function saveMessageToDB(messageData) {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/project/chat-message`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("✅ Message stored in DB:", response.data);
    } catch (error) {
      console.error("❌ Error storing message:", error);
    }
  }

  async function handlesendMessage() {
    if (!message.trim()) return;

    const newMessage = {
      project_id,
      sender: { email: user?.email },
      message,
    };

    sendMessage("project-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    scrollToBottom();

    await saveMessageToDB(newMessage);
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function writeAIMessage(message) {
    const aiMessage = JSON.parse(message);

    return (
      <div className="break-words w-full text-lg whitespace-pre-wrap bg-gray-800 text-white rounded-md p-4">
        <Markdown>{aiMessage.text}</Markdown>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-88px)]">
      {/* Left Panel - Chat Section */}
      <div className="w-1/4 border-r-2 flex flex-col h-full bg-gray-100 shadow-lg rounded-lg">
        {/* ✅ Top Section */}
        <div className="top w-full h-14 bg-blue-500 text-white font-semibold px-3 flex justify-between items-center rounded-t-lg">
          <Add_Collaborators users={users} project={project} />
          <Collaborators users={project?.user} />
        </div>

        {/* ✅ Messages Section */}
        <div className="message-box flex-1 overflow-y-auto bg-white p-4 w-full space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col max-w-full ${
                msg.sender?.email === user?.email
                  ? "self-end items-end"
                  : "self-start items-start"
              }`}
            >
              <div
                className={`px-3 rounded-xl max-w-[80%] shadow-md flex flex-col ${
                  msg.sender?.email === user?.email
                    ? "bg-slate-700 text-white rounded-tr-none"
                    : "bg-slate-200 text-slate-900 rounded-tl-none"
                }`}
              >
                <p className="text-xs pt-2 text-blue-500 break-words">
                  {msg.sender?.email}
                </p>
                {msg.sender?.email === "gemini@ai.com" ? (
                  writeAIMessage(msg.message)
                ) : (
                  <p className="break-words w-full text-lg whitespace-pre-wrap">
                    {msg.message}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Auto-scroll reference */}
        </div>

        {/* ✅ Input Section */}
        <div className="bottom h-16 w-full bg-gray-200 flex items-center pl-2 pr-2 gap-2 rounded-b-lg">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-3 w-[80%] bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter message..."
          />
          <div className="h-14 w-14 rounded-2xl bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition">
            <button
              onClick={handlesendMessage}
              className="h-full w-full text-white"
            >
              🚀
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - File Containers */}
      {Object.keys(filetree).length > 0 && (
        <Ai_File_Container
          filetree={filetree}
          setCurrentFile={setCurrentFile}
          setOpenFiles={setOpenFiles}
          openFiles={openFiles}
        />
      )}
      <WorkSpace
        fileTree={filetree}
        currentFile={currentFile}
        setCurrentFile={setCurrentFile}
        setFileTree={setfiletree}
        openFiles={openFiles}
        setOpenFiles={setOpenFiles}
        webContainer={webContainer}
        socket={socket}
      />
    </div>
  );
};

export default Chat;

Chat.propTypes = {
  project: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};
