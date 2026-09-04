import {
  useState,
} from 'react';

import {
  addProjectMember,
  findMemberCandidate,
  removeProjectMember,
} from '../api/projectApi';

function initials(
  name = '',
) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase(),
    )
    .join('');
}

export default function ProjectMembers({
  project,
  currentUser,
  onProjectChange,
}) {
  const [
    email,
    setEmail,
  ] = useState('');

  const [
    candidate,
    setCandidate,
  ] = useState(null);

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    message,
    setMessage,
  ] = useState('');

  const isOwner =
    project.ownerId ===
    currentUser?.id;

  async function handleFindUser(
    event
  ) {
    event.preventDefault();

    if (!email.trim()) {
      setError(
        'Enter the member email address',
      );

      return;
    }

    try {
      setSearching(
        true,
      );

      setError('');
      setMessage('');
      setCandidate(null);

      const user =
        await findMemberCandidate(
          project.id,
          email.trim(),
        );

      setCandidate(
        user,
      );
    } catch (err) {
      setError(
        err.message ||
          'Unable to find user',
      );
    } finally {
      setSearching(
        false,
      );
    }
  }

  async function handleAddMember() {
    if (!candidate) {
      return;
    }

    try {
      setError('');
      setMessage('');

      const updatedProject =
        await addProjectMember(
          project.id,
          candidate.id,
        );

      onProjectChange(
        updatedProject,
      );

      setMessage(
        `${candidate.name} was added to the project`,
      );

      setCandidate(null);
      setEmail('');
    } catch (err) {
      setError(
        err.message ||
          'Unable to add member',
      );
    }
  }

  async function handleRemoveMember(
    member
  ) {
    const confirmed =
      window.confirm(
        `Remove ${member.name} from this project?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setMessage('');

      const updatedProject =
        await removeProjectMember(
          project.id,
          member.id,
        );

      onProjectChange(
        updatedProject,
      );

      setMessage(
        `${member.name} was removed from the project`,
      );
    } catch (err) {
      setError(
        err.message ||
          'Unable to remove member',
      );
    }
  }

  return (
    <section className="mb-7 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Collaboration
          </p>

          <h2 className="mt-1 text-xl font-extrabold text-stone-900">
            Project Members
          </h2>

        </div>

        <span className="text-sm font-bold text-stone-400">
          {
            (
              project.members ??
              []
            ).length
          } member(s)
        </span>

      </div>

      <div className="mt-4 flex flex-wrap gap-3">

        {(project.members ?? []).map(
          (member) => (
            <div
              key={
                member.id
              }
              className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2"
            >

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-800 text-xs font-extrabold text-white">
                {initials(
                  member.name,
                )}
              </span>

              <div>

                <div className="flex items-center gap-2">

                  <p className="text-sm font-extrabold text-stone-800">
                    {
                      member.name
                    }
                  </p>

                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700">
                    {
                      member.role
                    }
                  </span>

                </div>

                <p className="text-xs text-stone-500">
                  {
                    member.email
                  }
                </p>

              </div>

              {isOwner &&
                member.role !==
                  'owner' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveMember(
                        member,
                      )
                    }
                    className="ml-2 text-xs font-extrabold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}

            </div>
          ),
        )}

      </div>

      {isOwner && (
        <div className="mt-5 border-t border-stone-100 pt-5">

          <p className="text-sm font-extrabold text-stone-800">
            Add a member
          </p>

          <p className="mt-1 text-xs text-stone-500">
            Enter the email of a registered CollabBoard user.
          </p>

          <form
            onSubmit={
              handleFindUser
            }
            className="mt-3 flex flex-col gap-2 sm:flex-row"
          >

            <input
              type="email"
              value={email}
              onChange={(
                event
              ) => {
                setEmail(
                  event.target.value,
                );

                setCandidate(
                  null,
                );

                setError('');
              }}
              placeholder="ruwan@example.com"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <button
              type="submit"
              disabled={
                searching
              }
              className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-stone-800 disabled:opacity-60"
            >
              {searching
                ? 'Searching...'
                : 'Find User'}
            </button>

          </form>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              {message}
            </p>
          )}

          {candidate && (
            <div className="mt-4 flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-sm font-extrabold text-white">
                  {initials(
                    candidate.name,
                  )}
                </span>

                <div>

                  <p className="font-extrabold text-stone-900">
                    {
                      candidate.name
                    }
                  </p>

                  <p className="text-sm text-stone-500">
                    {
                      candidate.email
                    }
                  </p>

                </div>

              </div>

              <button
                type="button"
                disabled={
                  candidate.alreadyMember
                }
                onClick={
                  handleAddMember
                }
                className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                {
                  candidate.alreadyMember
                    ? 'Already a Member'
                    : '+ Add to Project'
                }
              </button>

            </div>
          )}

        </div>
      )}

    </section>
  );
}