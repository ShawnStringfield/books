import { NextAuthOptions, Session, Profile, Account, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Define the complete event payload types
export interface AuthEventPayload {
  signIn: {
    user: User;
    account: Account | null;
    profile?: Profile;
    isNewUser?: boolean;
  };
  signOut: {
    session: Session;
    token: JWT;
  };
  createUser: {
    user: User;
  };
  updateUser: {
    user: User;
  };
  session: {
    session: Session;
    token: JWT;
  };
  linkAccount: {
    user: User;
    account: Account;
    profile?: Profile;
  };
}

type EventHandlers = {
  [K in keyof AuthEventPayload]?: (payload: AuthEventPayload[K]) => void | Promise<void>;
};

export const createAuthEventHandlers = (handlers: EventHandlers): Partial<NextAuthOptions['events']> => {
  return {
    createUser: async (message) => {
      await handlers.createUser?.({ user: message.user });
    },
    updateUser: async (message) => {
      await handlers.updateUser?.({ user: message.user });
    },
    linkAccount: async (message: { user: User; account: Account; profile: User }) => {
      // For linkAccount, we need to handle the profile differently as it comes as a User type
      await handlers.linkAccount?.({
        user: message.user,
        account: message.account,
        profile: {
          name: message.profile.name || undefined,
          email: message.profile.email || undefined,
          image: message.profile.image || undefined,
        },
      });
    },
    session: async (message) => {
      await handlers.session?.({
        session: message.session,
        token: message.token,
      });
    },
    signIn: async (message) => {
      await handlers.signIn?.({
        user: message.user,
        account: message.account,
        profile: message.profile as Profile | undefined,
        isNewUser: message.isNewUser,
      });
    },
    signOut: async (message) => {
      await handlers.signOut?.({
        session: message.session,
        token: message.token,
      });
    },
  };
};
