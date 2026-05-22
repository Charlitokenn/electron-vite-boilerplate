import { JSX } from 'react'
import { SignIn } from '@clerk/react'

const SignInPage = (): JSX.Element => {
  return <SignIn routing="hash" signUpUrl="/sign-up" />
}
export default SignInPage
