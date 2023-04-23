import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";
const systemMessage = {
  role: "system",
  content: "Hola somos la clinica quiroz en que te puedo ayudar",
};

function App() {
  const [messages, setMessages] = useState([
    {
      message: "HOla soy un chatbot de la clinica",
      sentTime: "ahora",
      sender: "Clinica QUiroz",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    if (
      message.toLowerCase().includes("agendar una cita") ||
      message.toLowerCase().includes("agendar cita") ||
      message.toLowerCase().includes("reservar una hora") ||
      message.toLowerCase().includes("reservar hora") ||
      message.toLowerCase().includes("quedar una hora")
    ) {
      // Pedir la fecha, hora y nombre al usuario
      const appointmentDate = window.prompt(
        "Por favor ingresa la fecha de la cita (ejemplo: 2023-04-30)"
      );
      const appointmentTime = window.prompt(
        "Por favor ingresa la hora de la cita (ejemplo: 10:30 AM)"
      );
      const appointmentName = window.prompt(
        "Por favor ingresa tu nombre completo"
      );

      const appointment = {
        date: appointmentDate,
        time: appointmentTime,
        name: appointmentName,
      };

      // Agregar la nueva cita al estado de citas
      setAppointments([...appointments, appointment]);

      // Responder al usuario confirmando la cita
      setMessages([
        ...newMessages,
        {
          message: "¡Perfecto! Tu cita ha sido agendada.",
          sender: "Clinica Quiroz",
        },
      ]);

      setIsTyping(false);
    } else {
      // Si el mensaje no es para agendar una cita, procesar el mensaje con ChatGPT
      await processMessageToChatGPT(newMessages);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="ChatGPT is typing" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="Escribe tu mensaje"
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
