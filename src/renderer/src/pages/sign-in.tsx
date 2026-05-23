import { JSX } from 'react'
import { SignIn } from '@clerk/react'

const SignInPage = (): JSX.Element => {
  return (
    <main className="flex items-center justify-center h-screen">
      <SignIn routing="hash" signUpUrl="/sign-up" />
    </main>
  )
}
export default SignInPage
