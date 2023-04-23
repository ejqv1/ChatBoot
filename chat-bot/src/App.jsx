import ChatBot from "react-simple-chatbot";

const steps = [
  {
    id: "1",

    message: "Hola, Bienvenido a la clinica Quiroz",

    trigger: "2",
  },

  {
    id: "2",

    message: "Cual es tu nombre?",

    trigger: "3",
  },

  {
    id: "3",

    user: true,

    trigger: "4",
  },

  {
    id: "4",

    message: "Hola {previousValue}, Selecciona tu pregunta",

    trigger: "5",
  },

  {
    id: "5",

    options: [
      {
        value: "direccion",

        label: "Dirección",

        trigger: "direccion",
      },

      {
        value: "Hora de atencion",
        label: "Horario de atencion",
        trigger: "Hora de atencion",
      },
    ],
  },

  {
    id: "direccion",

    message: "Estamos en cochabamba av. Victor Uztaris km6",

    end: true,
  },

  {
    id: "Hora de atencion",

    message: "Atendemos todos los dias de 8am a 6pm",

    end: true,
  },
];
console.log(steps);
function App() {
  return <ChatBot steps={steps} />;
}

export default App;
