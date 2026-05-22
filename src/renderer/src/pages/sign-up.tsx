import { JSX } from 'react'
import { SignUp } from '@clerk/react'

const SignUpPage = (): JSX.Element => {
  return <SignUp routing="hash" signInUrl="/sign-in" />
}
export default SignUpPage
