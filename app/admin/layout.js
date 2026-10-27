
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AdminShell from './components/AdminShell';

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/auth/login');
  }

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
