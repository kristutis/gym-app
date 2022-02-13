export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    hashedPassword?: string;
    createDate: Date;
    modifyDate: Date;
    comparePassword(candidatePassword: string): Promise<boolean> 
}