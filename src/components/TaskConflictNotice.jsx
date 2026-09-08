export default function TaskConflictNotice({
  conflict,
  onUseServer,
  onApplyMine,
}) {
  if (!conflict) {
    return null;
  }

  const serverTask =
    conflict.current;

  const localChanges =
    conflict.changes ??
    {};

  return (
    <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-5 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-amber-700">
            Editing conflict detected
          </p>

          <h3 className="mt-1 text-lg font-extrabold text-stone-900">
            This task changed after you loaded it.
          </h3>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">
            CollabBoard stopped the stale update instead of silently overwriting another member&apos;s work.
          </p>

          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">

            <div className="rounded-lg bg-white p-3">
              <p className="font-bold text-stone-500">
                Current server version
              </p>

              <p className="mt-1 font-semibold text-stone-800">
                Status:{' '}
                {serverTask?.status ??
                  'Unknown'}
              </p>

              <p className="text-xs text-stone-500">
                Version:{' '}
                {serverTask?.version ??
                  'Unknown'}
              </p>
            </div>

            <div className="rounded-lg bg-white p-3">
              <p className="font-bold text-stone-500">
                Your attempted change
              </p>

              <p className="mt-1 font-semibold text-stone-800">
                Status:{' '}
                {localChanges.status ??
                  'No status change'}
              </p>

              <p className="text-xs text-stone-500">
                Based on version:{' '}
                {conflict.yourVersion ??
                  'Unknown'}
              </p>
            </div>

          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">

          <button
            type="button"
            onClick={onUseServer}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-extrabold text-stone-700 transition hover:border-stone-500"
          >
            Use Server Version
          </button>

          <button
            type="button"
            onClick={onApplyMine}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-amber-700"
          >
            Apply My Change
          </button>

        </div>

      </div>

    </div>
  );
}