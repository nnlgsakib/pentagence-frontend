import { Link } from "react-router-dom";
export default function AdminUsersPage() {
  const users = [
    { id: "u-001", name: "Demo Admin", email: "admin@pentagence.io", role: "admin", status: "active" },
    { id: "u-002", name: "Jane Doe", email: "jane@acme.com", role: "user", status: "active" },
    { id: "u-003", name: "Bob Smith", email: "bob@widgets.dev", role: "user", status: "locked" },
  ];
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Users</h1>
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-pen-border-soft bg-pen-elevated/30">
            <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Name</th>
            <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Email</th>
            <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Role</th>
            <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-pen-border-soft">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-pen-elevated/20">
                <td className="px-4 py-3"><Link to={`/admin/users/${u.id}`} className="text-sm text-pen-brand hover:text-pen-brand-hover">{u.name}</Link></td>
                <td className="px-4 py-3 text-sm text-pen-text-secondary">{u.email}</td>
                <td className="px-4 py-3 text-xs font-mono text-pen-text-muted">{u.role}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${u.status === "active" ? "text-pen-success" : "text-pen-danger"}`}>{u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
