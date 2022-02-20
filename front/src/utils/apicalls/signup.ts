export const signupUserCall = async (
  payload: SignupUserProps
): Promise<string> => {
  return Promise.resolve('')
}

export interface SignupUserProps {
  name: string
  surname: string
  email: string
  password: string
}
