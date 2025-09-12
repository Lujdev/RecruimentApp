'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  refreshTrigger: number;
  lastRoleCreated: string | null;
  lastCvUploaded: string | null;
}

type AppAction = 
  | { type: 'ROLE_CREATED'; roleId: string }
  | { type: 'CV_UPLOADED'; candidateId: string }
  | { type: 'REFRESH_DATA' };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  triggerRefresh: () => void;
  notifyRoleCreated: (roleId: string) => void;
  notifyCvUploaded: (candidateId: string) => void;
}

const initialState: AppState = {
  refreshTrigger: 0,
  lastRoleCreated: null,
  lastCvUploaded: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ROLE_CREATED':
      return {
        ...state,
        refreshTrigger: state.refreshTrigger + 1,
        lastRoleCreated: action.roleId,
      };
    case 'CV_UPLOADED':
      return {
        ...state,
        refreshTrigger: state.refreshTrigger + 1,
        lastCvUploaded: action.candidateId,
      };
    case 'REFRESH_DATA':
      return {
        ...state,
        refreshTrigger: state.refreshTrigger + 1,
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const triggerRefresh = () => {
    dispatch({ type: 'REFRESH_DATA' });
  };

  const notifyRoleCreated = (roleId: string) => {
    dispatch({ type: 'ROLE_CREATED', roleId });
  };

  const notifyCvUploaded = (candidateId: string) => {
    dispatch({ type: 'CV_UPLOADED', candidateId });
  };

  const value: AppContextType = {
    state,
    dispatch,
    triggerRefresh,
    notifyRoleCreated,
    notifyCvUploaded,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export type { AppState, AppAction, AppContextType };
