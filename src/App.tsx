import {  Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserForm from "./components/UserForm";
import { MachineProvider } from "./providers/MachineProvider";

const App = () => {


  return (
    <MachineProvider >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<UserForm />} />
      </Routes>
    </MachineProvider>
  );
};

export default App;