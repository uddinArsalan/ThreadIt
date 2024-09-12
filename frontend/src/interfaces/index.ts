export interface SequenceObjectType {
    type: 'paragraph' | 'code' | 'heading' | 'img';
    content: string;
  }

export interface UserCredentials {
    accessToken: string;
    secret: string;
    username : string;
}

export type TwitterCredentials = {
  accessToken: string
  secret: string
}