import { useState } from 'react';

import ProfileHeader from '../components/profile/ProfileHeader';
import ProjectList from '../components/profile/ProjectList';
import { defaultProfile, projectsData } from '../data/profileData';

const PROFILE_STORAGE_KEY = 'collabboard-profile';

function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);

    return saved
      ? { ...defaultProfile, ...JSON.parse(saved) }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(loadProfile);

  const saveProfile = (nextProfile) => {
    setProfile(nextProfile);
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(nextProfile),
    );
  };

  return (
    <div className="relative min-h-screen bg-stone-50 font-sans text-stone-800">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative mx-auto max-w-5xl px-4 py-6 pb-20 sm:px-6 sm:py-10 lg:px-8">
        <ProfileHeader
          profile={profile}
          onSave={saveProfile}
        />

        <ProjectList projects={projectsData} />
      </main>
    </div>
  );
}