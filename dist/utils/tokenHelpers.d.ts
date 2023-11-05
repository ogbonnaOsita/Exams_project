import "dotenv/config";
export declare const generateToken: (id: number) => string;
export declare const verifyToken: (token: string) => Promise<any>;
