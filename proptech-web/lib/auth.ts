import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// NEXTAUTH_SECRET debe estar en .env.local o variables de entorno de Vercel
// Durante el build, usamos un valor por defecto temporal para evitar errores
const nextAuthSecret = process.env.NEXTAUTH_SECRET || 
  (process.env.NODE_ENV === 'production' && typeof window === 'undefined' 
    ? 'temp-build-secret-replace-in-production' 
    : undefined);

// Advertencia en desarrollo si no está configurado
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'development') {
  console.warn('⚠️ NEXTAUTH_SECRET no configurado. Usando secret temporal para desarrollo.');
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: nextAuthSecret || (process.env.NODE_ENV !== 'production' ? 'dev-secret-change-in-production' : undefined),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Autenticación enterprise con roles
        if (credentials?.email === 'admin@habitatpro.com' && credentials?.password === 'admin123') {
          return { id: '1', email: 'admin@habitatpro.com', role: 'admin' }
        }
        if (credentials?.email === 'broker@habitatpro.com' && credentials?.password === 'broker123') {
          return { id: '2', email: 'broker@habitatpro.com', role: 'broker' }
        }
        if (credentials?.email === 'user@habitatpro.com' && credentials?.password === 'user123') {
          return { id: '3', email: 'user@habitatpro.com', role: 'user' }
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) (token as any).role = (user as any).role
      return token
    },
    session({ session, token }) {
      (session.user as any).role = (token as any).role
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  }
})
