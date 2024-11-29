

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedUser } from '@/actions';
import { Pagination, Title } from '@/components';

import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';

export default async function OrdersPage() {

  const { ok, users = [] } = await getPaginatedUser()

  if (!ok) return redirect('/auth/login')

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />

        <Pagination totalPages={3} />
      </div>
    </>
  );
}