import { create } from "zustand";

type ConnectedUserType = {
  socketId: string;
  userName: string;
};

type ActiveUserStoreType = {
  activeConnectedUsers: Map<string, ConnectedUserType>;
  setActiveConnectedUsers: (users: Map<string, ConnectedUserType>) => void;
};

const useActiveUserStore = create<ActiveUserStoreType>((set) => ({
  activeConnectedUsers: new Map(),
  setActiveConnectedUsers: (users) => set({ activeConnectedUsers: users }),
}));

export default useActiveUserStore;
