export default function ConnectionStatus({
  status,
  pendingCount,
  onRetry,
}) {
  const isOffline =
    status === 'offline';

  const isSyncing =
    status === 'syncing';

  let label =
    'Online';

  if (isOffline) {
    label =
      'Offline — changes saved locally';
  }

  if (isSyncing) {
    label =
      'Syncing local changes...';
  }

  return (
    <div className="mb-5 flex flex-col gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isOffline
              ? 'bg-amber-500'
              : isSyncing
                ? 'bg-blue-500'
                : 'bg-emerald-500'
          }`}
        />

        <div>
          <p className="text-sm font-extrabold text-stone-800">
            {label}
          </p>

          {pendingCount > 0 && (
            <p className="text-xs font-medium text-stone-500">
              {pendingCount}{' '}
              change
              {pendingCount === 1
                ? ''
                : 's'}{' '}
              waiting to sync
            </p>
          )}
        </div>

      </div>

      {(isOffline ||
        pendingCount > 0) && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isSyncing}
          className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-extrabold text-stone-700 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Retry sync
        </button>
      )}

    </div>
  );
}