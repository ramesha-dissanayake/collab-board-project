import {
  useState,
} from 'react';

export default function CreateProjectForm({
  onCreate,
  onCancel,
}) {
  const [
    name,
    setName,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError(
        'Project name is required',
      );

      return;
    }

    try {
      setSaving(true);
      setError('');

      await onCreate({
        name:
          name.trim(),

        description:
          description.trim(),

        status:
          'Ongoing',
      });
    } catch (err) {
      setError(
        err.message ||
          'Unable to create project',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4">

      <form
        onSubmit={
          handleSubmit
        }
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >

        <div className="flex items-start justify-between gap-4">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              New workspace
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-stone-900">
              Create project
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onCancel
            }
            className="rounded-lg px-3 py-1 text-xl font-bold text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close create project form"
          >
            ×
          </button>

        </div>

        <label className="mt-6 block text-sm font-bold text-stone-700">

          Project name

          <input
            type="text"
            value={name}
            onChange={(
              event
            ) =>
              setName(
                event.target.value,
              )
            }
            placeholder="e.g. Mobile App Redesign"
            className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            autoFocus
          />

        </label>

        <label className="mt-4 block text-sm font-bold text-stone-700">

          Description

          <textarea
            value={
              description
            }
            onChange={(
              event
            ) =>
              setDescription(
                event.target.value,
              )
            }
            placeholder="What is this project about?"
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-stone-200 px-4 py-3 font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

        </label>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={
              onCancel
            }
            className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              saving
            }
            className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? 'Creating...'
              : 'Create Project'}
          </button>

        </div>

      </form>

    </div>
  );
}