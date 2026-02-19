import React from 'react';
import View from './view';
import { useNavigate } from 'react-router-dom';
import NotFound from './notFound';
import Button from '../components/button';
import { pizzaService } from '../service/service';
import { Franchise, FranchiseList, Role, Store, User } from '../service/pizzaService';
import { TrashIcon } from '../icons';

interface Props {
  user: User | null;
}

export default function AdminDashboard(props: Props) {
  const navigate = useNavigate();
  const [franchiseList, setFranchiseList] = React.useState<FranchiseList>({ franchises: [], more: false });
  const [franchisePage, setFranchisePage] = React.useState(0);
  const filterFranchiseRef = React.useRef<HTMLInputElement>(null);

  // Users state
  const [users, setUsers] = React.useState<User[]>([]);
  const [usersMore, setUsersMore] = React.useState(false);

  // FIX: page starts from 1
  const [usersPage, setUsersPage] = React.useState(1);

  const filterUserRef = React.useRef<HTMLInputElement>(null);
  const [usersLoading, setUsersLoading] = React.useState(false);
  const [usersError, setUsersError] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      setFranchiseList(await pizzaService.getFranchises(franchisePage, 3, '*'));
    })();
  }, [props.user, franchisePage]);

  async function loadUsers(page: number, nameFilter: string) {
    if (!Role.isRole(props.user, Role.Admin)) return;

    setUsersError('');
    try {
      setUsersLoading(true);

      const result = await (pizzaService as any).getUsers(page, 10, nameFilter);
      const list = Array.isArray(result) ? result : result?.users ?? [];
      const more = Array.isArray(result) ? false : Boolean(result?.more);

      setUsers(list);
      setUsersMore(more);
    } catch (err: any) {
      setUsers([]);
      setUsersMore(false);
      setUsersError(err?.message ?? 'Failed to fetch');
    } finally {
      setUsersLoading(false);
    }
  }

  React.useEffect(() => {
    (async () => {
      if (!Role.isRole(props.user, Role.Admin)) return;

      // FIX: usersPage starts from 1, load all with '*'
      await loadUsers(usersPage, '*');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user, usersPage]);

  function createFranchise() {
    navigate('/admin-dashboard/create-franchise');
  }

  async function closeFranchise(franchise: Franchise) {
    navigate('/admin-dashboard/close-franchise', { state: { franchise: franchise } });
  }

  async function closeStore(franchise: Franchise, store: Store) {
    navigate('/admin-dashboard/close-store', { state: { franchise: franchise, store: store } });
  }

  async function filterFranchises() {
    setFranchiseList(await pizzaService.getFranchises(franchisePage, 10, `*${filterFranchiseRef.current?.value}*`));
  }

  // FIX: send name as-is, use '*' only if empty
  async function searchUsers() {
    const q = filterUserRef.current?.value?.trim() ?? '';
    const name = q ? q : '*';
    setUsersPage(1);
    await loadUsers(1, name);
  }

  // FIX: same logic for refresh
  async function refreshUsers() {
    const q = filterUserRef.current?.value?.trim() ?? '';
    const name = q ? q : '*';
    await loadUsers(usersPage, name);
  }

  async function deleteUser(target: User) {
    if (!Role.isRole(props.user, Role.Admin)) return;

    const confirmed = window.confirm(`Delete user "${target.name}" (${target.email})?`);
    if (!confirmed) return;

    setUsersError('');
    try {
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
      await (pizzaService as any).deleteUser(target.id);

      const q = filterUserRef.current?.value?.trim() ?? '';
      const name = q ? q : '*';
      await loadUsers(usersPage, name);
    } catch (err: any) {
      setUsersError(err?.message ?? 'Failed to delete user');
      const q = filterUserRef.current?.value?.trim() ?? '';
      const name = q ? q : '*';
      await loadUsers(usersPage, name);
    }
  }

  // FIX: render roles consistently (supports roles as [{role:"admin"}] or role as string)
  function renderUserRoles(u: any): string {
    if (Array.isArray(u?.roles)) {
      return u.roles.map((r: any) => (typeof r === 'string' ? r : r?.role)).filter(Boolean).join(', ');
    }
    if (typeof u?.role === 'string') return u.role;
    return '';
  }

  let response = <NotFound />;
  if (Role.isRole(props.user, Role.Admin)) {
    response = (
      <View title="Mama Ricci's kitchen">
        <div className="text-start py-8 px-4 sm:px-6 lg:px-8">
          <h3 className="text-neutral-100 text-xl">Franchises</h3>
          <div className="bg-neutral-100 overflow-clip my-4">
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="uppercase text-neutral-100 bg-slate-400 border-b-2 border-gray-500">
                        <tr>
                          {['Franchise', 'Franchisee', 'Store', 'Revenue', 'Action'].map((header) => (
                            <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      {franchiseList.franchises.map((franchise, findex) => {
                        return (
                          <tbody key={findex} className="divide-y divide-gray-200">
                            <tr className="border-neutral-500 border-t-2">
                              <td className="text-start px-2 whitespace-nowrap text-l font-mono text-orange-600">{franchise.name}</td>
                              <td className="text-start px-2 whitespace-nowrap text-sm font-normal text-gray-800" colSpan={3}>
                                {franchise.admins?.map((o) => o.name).join(', ')}
                              </td>
                              <td className="px-6 py-1 whitespace-nowrap text-end text-sm font-medium">
                                <button
                                  type="button"
                                  className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                                  onClick={() => closeFranchise(franchise)}
                                >
                                  <TrashIcon />
                                  Close
                                </button>
                              </td>
                            </tr>

                            {franchise.stores.map((store, sindex) => {
                              return (
                                <tr key={sindex} className="bg-neutral-100">
                                  <td className="text-end px-2 whitespace-nowrap text-sm text-gray-800" colSpan={3}>
                                    {store.name}
                                  </td>
                                  <td className="text-end px-2 whitespace-nowrap text-sm text-gray-800">{store.totalRevenue?.toLocaleString()} ₿</td>
                                  <td className="px-6 py-1 whitespace-nowrap text-end text-sm font-medium">
                                    <button
                                      type="button"
                                      className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                                      onClick={() => closeStore(franchise, store)}
                                    >
                                      <TrashIcon />
                                      Close
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        );
                      })}
                      <tfoot>
                        <tr>
                          <td className="px-1 py-1">
                            <input type="text" ref={filterFranchiseRef} name="filterFranchise" placeholder="Filter franchises" className="px-2 py-1 text-sm border border-gray-300 rounded-lg" />
                            <button
                              type="submit"
                              className="ml-2 px-2 py-1 text-sm font-semibold rounded-lg border border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                              onClick={filterFranchises}
                            >
                              Submit
                            </button>
                          </td>
                          <td colSpan={4} className="text-end text-sm font-medium">
                            <button
                              className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                              onClick={() => setFranchisePage(franchisePage - 1)}
                              disabled={franchisePage <= 0}
                            >
                              «
                            </button>
                            <button
                              className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                              onClick={() => setFranchisePage(franchisePage + 1)}
                              disabled={!franchiseList.more}
                            >
                              »
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Button className="w-36 text-xs sm:text-sm sm:w-64" title="Add Franchise" onPress={createFranchise} />
        </div>

        <div className="text-start py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h3 className="text-neutral-100 text-xl">Users</h3>
            <button
              type="button"
              className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800 disabled:opacity-60"
              onClick={refreshUsers}
              disabled={usersLoading}
            >
              Refresh
            </button>
          </div>

          {usersError ? <div className="mt-3 text-sm text-red-300">{usersError}</div> : null}

          <div className="bg-neutral-100 overflow-clip my-4">
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="uppercase text-neutral-100 bg-slate-400 border-b-2 border-gray-500">
                        <tr>
                          {['Name', 'Email', 'Role', 'Action'].map((header) => (
                            <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {usersLoading ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-sm text-gray-700">
                              Loading...
                            </td>
                          </tr>
                        ) : users.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-sm text-gray-700">
                              No users found.
                            </td>
                          </tr>
                        ) : (
                          users.map((u) => (
                            <tr key={String(u.id)} className="bg-neutral-100">
                              <td className="text-start px-6 py-3 whitespace-nowrap text-sm text-gray-800">{u.name}</td>
                              <td className="text-start px-6 py-3 whitespace-nowrap text-sm text-gray-800">{u.email}</td>
                              <td className="text-center px-6 py-3 whitespace-nowrap text-sm text-gray-800">{renderUserRoles(u as any)}</td>

                              <td className="px-6 py-3 whitespace-nowrap text-end text-sm font-medium">
                                <button
                                  type="button"
                                  className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                                  onClick={() => deleteUser(u)}
                                >
                                  <TrashIcon />
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>

                      <tfoot>
                        <tr>
                          <td className="px-2 py-2" colSpan={2}>
                            <input ref={filterUserRef} type="text" placeholder="Name" className="px-2 py-1 text-sm border border-gray-300 rounded-lg" />
                            <button type="button" className="ml-2 px-2 py-1 text-sm font-semibold rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100" onClick={searchUsers}>
                              Search
                            </button>
                          </td>
                          <td className="px-2 py-2 text-end" colSpan={2}>
                            <button
                              className="w-16 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                              onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                              disabled={usersPage <= 1}
                            >
                              Prev
                            </button>
                            <button
                              className="w-16 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                              onClick={() => setUsersPage((p) => p + 1)}
                              disabled={!usersMore}
                            >
                              Next
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </View>
    );
  }

  return response;
}