import { createContext } from "react";

const AdminPanlContext = createContext();

export const AdminPanelProvider = ({ children }) => {
  // service states

  //application states
  const [appTab, setAppTab] = useState(0);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
};
