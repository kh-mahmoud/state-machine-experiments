import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { useMachines } from "../providers/MachineHook";

const UserForm = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const { userRef: actorRef } = useMachines();

  const currentState = useSelector(actorRef, (state) => state.value);

  useEffect(() => {
    if (currentState === "loaded") {
      actorRef.send({ type: "new_User" });
    }
  }, [currentState, actorRef]);

  const isSaving = useSelector(actorRef, (state) => state.matches({addForm:"saving"}));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Add New User</h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a new user and save it to the system.
          </p>
        </div>

        {/* State Card */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Machine State
            </span>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {JSON.stringify(currentState)}
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();

              if (!name.trim()) return;

              actorRef.send({
                type: "SUBMIT_USER",
                user: {
                  id: Date.now(),
                  name,
                },
              });

              setName("");
              navigate("/");
            }}
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                User Name
              </label>

              <input
                id="name"
                name="name"
                disabled={isSaving}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter user name..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!name.trim() || isSaving}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
