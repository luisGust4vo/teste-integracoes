export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface EnrichedUser {
  linkedin: string;
  github: string;
}
