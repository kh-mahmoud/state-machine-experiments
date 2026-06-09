import { Link } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { useMachines } from "../providers/MachineHook";

const Home = () => {
  const { userRef: actorRef } = useMachines();

  const users = useSelector(actorRef, (state) => state.context.users);
  const currentState = useSelector(actorRef, (state) => state.value);
  const isdeleting = useSelector(actorRef, (state) => state.matches("deleting"));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your application users
            </p>
          </div>

          <Link
            to="/add"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            + Add User
          </Link>
        </div>

        {/* Status Card */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Machine State
            </span>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              {JSON.stringify(currentState)}
            </span>
          </div>
        </div>

        {/* Users List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">
              Users ({users.length})
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No users found
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 transition hover:bg-slate-50"
                >
                  <div>
                    <h3 className="font-medium text-slate-900">
                      {user.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      ID: {user.id}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      actorRef.send({
                        type: "DELETE",
                        id: user.id,
                      })
                    }
                    disabled={isdeleting}
                    className="rounded-lg cursor-pointer border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;