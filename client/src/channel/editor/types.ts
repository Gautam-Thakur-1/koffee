export type RequestType = {
  userId: string;
  userName: string;
};

export interface ConnectUserData {
  userId : string;
  color : string;
  userName : string;
};

export interface UserCursor {
  user: {
    id: string;
    name: string;
    color: string;
  };
  cursor: {
    from: number;
    to: number;
  };
}

export type ConnectionStatusType = "connected" | "waiting" | "denied" | "error";
