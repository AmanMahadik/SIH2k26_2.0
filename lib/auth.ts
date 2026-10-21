// lib/auth.ts - Microsoft Entra ID Authentication Options for NextAuth
import { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { AppRole } from './types';

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
      tenantId: process.env.AZURE_AD_TENANT_ID || 'common',
      authorization: {
        params: {
          scope: 'openid profile email User.Read',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (profile) {
        // Extract Microsoft Entra App Role claims
        const roles = (profile as any).roles || [];
        if (roles.includes('officer')) {
          token.role = 'officer' as AppRole;
        } else if (roles.includes('admin')) {
          token.role = 'admin' as AppRole;
        } else if (roles.includes('auditor')) {
          token.role = 'auditor' as AppRole;
        } else if (roles.includes('institution')) {
          token.role = 'institution' as AppRole;
        } else {
          // Default role for authenticated organization users
          token.role = 'officer' as AppRole;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role || 'officer';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'nirikshai_sih2026_super_secret_aicte_key_secure_random_32',
};
