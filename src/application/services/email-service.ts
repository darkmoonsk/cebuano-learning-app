export interface EmailService {
  sendPasswordResetEmail(params: {
    toEmail: string;
    resetLink: string;
  }): Promise<void>;
}
