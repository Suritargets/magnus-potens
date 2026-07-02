import { redirect } from 'next/navigation'

// Vangnet: /sign-in zonder taalprefix doorsturen naar /en/sign-in
export default function SignInRedirect() {
  redirect('/en/sign-in')
}
