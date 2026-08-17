import { useState } from 'react';
import ContactHub from '../components/profile/ContactHub';
import Icon from '../components/profile/Icons';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProjectList from '../components/profile/ProjectList';
import { defaultProfile, projectsData } from '../data/profileData';

const PROFILE_STORAGE_KEY = 'collabboard-profile';

function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(loadProfile);
  const [contactsOpen, setContactsOpen] = useState(false);

  const saveProfile = (nextProfile) => {
    setProfile(nextProfile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
  };

  return (
    <div className="relative min-h-screen bg-stone-50 font-sans text-stone-800">
      <div className="pointer-events-none fixed inset-0 opacity-[0.025] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <main className="relative mx-auto max-w-5xl px-4 py-6 pb-28 sm:px-6 sm:py-10 lg:px-8">
        <ProfileHeader profile={profile} onSave={saveProfile} />
        <ProjectList projects={projectsData} />
      </main>
      <button type="button" onClick={() => setContactsOpen(true)} className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-[0_12px_30px_rgba(5,150,105,0.35)] transition hover:-translate-y-1 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:bottom-8 sm:right-8" aria-label="Open contacts menu">
        <Icon name="plus" className="h-7 w-7" />
      </button>
      <ContactHub open={contactsOpen} onClose={() => setContactsOpen(false)} />
    </div>
  );
}
