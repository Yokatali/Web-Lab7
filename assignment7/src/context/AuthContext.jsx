import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext(null);

const initialState = { user: null };

function reducer(state, action) {
  switch (action.type) {
    case "LOGGED_IN":
      return { user: action.payload };
    case "LOGGED_OUT":
      return { user: null };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
