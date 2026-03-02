declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: "DRIVER" | "CLIENT" | "ADMIN";
      };
    }
  }
}

export {};
