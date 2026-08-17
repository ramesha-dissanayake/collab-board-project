import { useState } from 'react';
import Avatar from './Avatar';
import Icon from './Icons';

function EditProfileDialog({ profile, onClose, onSave }) {
  const [form, setForm] = useState(profile);
  const [error, setError] = useState('');

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Please choose an image smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, photo: reader.result }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.userId.trim()) {
      setError('Name and user ID are required.');
      return;
    }
    onSave({
      ...form,
      name: form.name.trim(),
      userId: form.userId.trim().toUpperCase(),
      description: form.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-stone-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-xl sm:rounded-3xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Personal details</p>
            <h2 id="edit-profile-title" className="mt-1 text-2xl font-extrabold text-stone-900">Edit profile</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900" aria-label="Close edit profile">
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-stone-50 p-5">
            <div className="relative">
              <Avatar person={form} size="lg" />
              <label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700" aria-label="Upload profile photo">
                <Icon name="camera" className="h-4 w-4" />
                <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadPhoto} />
              </label>
            </div>
            <p className="text-center text-xs text-stone-500">JPG, PNG or WebP · maximum 2 MB</p>
            {form.photo && <button type="button" onClick={() => setForm((current) => ({ ...current, photo: '' }))} className="text-xs font-bold text-rose-600 hover:text-rose-700">Remove photo</button>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-bold text-stone-700">
              Name <span className="text-rose-500">*</span>
              <input name="name" value={form.name} onChange={updateField} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-medium text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </label>
            <label className="space-y-1.5 text-sm font-bold text-stone-700">
              User ID <span className="text-rose-500">*</span>
              <input name="userId" value={form.userId} onChange={updateField} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-medium uppercase text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </label>
          </div>

          <label className="block space-y-1.5 text-sm font-bold text-stone-700">
            Age <span className="font-medium text-stone-400">(optional)</span>
            <input name="age" type="number" min="13" max="120" value={form.age} onChange={updateField} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-medium text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Add your age" />
          </label>

          <label className="block space-y-1.5 text-sm font-bold text-stone-700">
            Description <span className="font-medium text-stone-400">(optional)</span>
            <textarea name="description" rows="4" maxLength="180" value={form.description} onChange={updateField} className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-medium text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Tell your teammates a little about yourself" />
            <span className="block text-right text-xs font-medium text-stone-400">{form.description.length}/180</span>
          </label>

          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">{error}</p>}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-stone-200 px-5 py-3 font-bold text-stone-600 hover:bg-stone-50">Cancel</button>
            <button type="submit" className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-sm hover:bg-emerald-700">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfileHeader({ profile, onSave }) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end">
          <Avatar person={profile} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">My profile</p>
            <h1 className="mt-1 truncate text-3xl font-extrabold tracking-tight text-stone-900">{profile.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-stone-500">
              <span>ID: {profile.userId}</span>
              {profile.age && <span>Age: {profile.age}</span>}
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{profile.description || 'No description added yet.'}</p>
          </div>
          <button type="button" onClick={() => setEditing(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 shadow-sm transition hover:border-emerald-500 hover:text-emerald-700 sm:w-auto">
            <Icon name="edit" className="h-4 w-4" />
            Edit profile
          </button>
        </div>
      </section>
      {editing && <EditProfileDialog profile={profile} onClose={() => setEditing(false)} onSave={(next) => { onSave(next); setEditing(false); }} />}
    </>
  );
}
