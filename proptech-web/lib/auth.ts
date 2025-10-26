import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Autenticación simple
        if (credentials?.email === 'admin@habitatpro.com' && credentials?.password === 'admin123') {
          return { id: '1', email: 'admin@habitatpro.com', role: 'admin' }
        }
        if (credentials?.email === 'user@habitatpro.com' && credentials?.password === 'user123') {
          return { id: '2', email: 'user@habitatpro.com', role: 'user' }
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
})
