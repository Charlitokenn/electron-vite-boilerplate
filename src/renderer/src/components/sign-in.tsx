import React from 'react'
import { SignIn } from '@clerk/react'

const SignInPage = (): React.JSX.Element => {
  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <SignIn/>
    </section>
  )
}
export default SignInPage
