export interface GoogleAuth {
    accessToken: string,
    tokenType: string,
    expiresIn: string,
    scope: string,
    state: string,
    issuedAt: number
  }

  export interface GoogleProfile {
      email: string, family_name: string, given_name: string, id: string, locale: string, name: string, picture: string, verified_email: boolean}

export interface AuthToken {
    email: string,
    name: string,
    picture: string
}