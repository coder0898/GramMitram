import React, { createContext, useContext, useReducer } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

/* ------------------ INITIAL STATE ------------------ */
const initialState = {
  user: {
    id: "USER001",
    name: "Ramesh Kumar",
    mobile: "9876543210",
    address: "Gram Panchayat Village",
    role: "Citizen",
  },

  services: [
    {
      id: "S001",
      name: "Birth Certificate",
      description: "Apply for birth certificate",
      category: "Certificates",
      requiredDocuments: ["Hospital Certificate", "Aadhaar"],
      status: "Active",
    },
    {
      id: "S002",
      name: "Income Certificate",
      description: "Apply for income certificate",
      category: "Certificates",
      requiredDocuments: ["Aadhaar", "Ration Card"],
      status: "Active",
    },
  ],

  applications: [],

  selectedServiceForApply: null,
};

/* ------------------ REDUCER ------------------ */
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_SERVICE":
      return { ...state, selectedServiceForApply: action.payload };

    case "CLEAR_SELECTED_SERVICE":
      return { ...state, selectedServiceForApply: null };

    case "APPLY_SERVICE":
      return {
        ...state,
        applications: [
          {
            id: `APP${state.applications.length + 1}`,
            status: "Submitted",
            submittedAt: new Date().toLocaleDateString(),
            statusHistory: [
              {
                status: "Submitted",
                date: new Date().toLocaleDateString(),
                remarks: "Application submitted by user",
              },
            ],
            ...action.payload,
          },
          ...state.applications,
        ],
      };

    default:
      return state;
  }
};

/* ------------------ PROVIDER ------------------ */
const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSelectedServiceForApply = (service) =>
    dispatch({ type: "SET_SELECTED_SERVICE", payload: service });

  const clearSelectedServiceForApply = () =>
    dispatch({ type: "CLEAR_SELECTED_SERVICE" });

  const applyForService = (data) =>
    dispatch({ type: "APPLY_SERVICE", payload: data });

  const getDashboardStats = () => ({
    total: state.applications.length,
    submitted: state.applications.filter((a) => a.status === "Submitted")
      .length,
    underReview: state.applications.filter((a) => a.status === "Under Review")
      .length,
    approved: state.applications.filter((a) => a.status === "Approved").length,
    rejected: state.applications.filter((a) => a.status === "Rejected").length,
  });

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        services: state.services,
        applications: state.applications,

        selectedServiceForApply: state.selectedServiceForApply,
        setSelectedServiceForApply,
        clearSelectedServiceForApply,

        applyForService,
        getDashboardStats,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
