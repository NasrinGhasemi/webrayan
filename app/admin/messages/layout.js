import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth-utils';

export default async function MessagesLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  if (!isAdmin(session.user)) {
    redirect('/auth/unauthorized');
  }

  return <>{children}</>;
}
