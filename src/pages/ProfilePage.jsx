import {
  useEffect,
  useState,
} from 'react';

import {
  createProject,
  getProjects,
} from '../api/projectApi';

import CreateProjectForm
  from '../components/profile/CreateProjectForm';

import ProfileHeader
  from '../components/profile/ProfileHeader';

import ProjectList
  from '../components/profile/ProjectList';

import {
  useAuth,
} from '../context/AuthContext';

import {
  defaultProfile,
} from '../data/profileData';

const PROFILE_STORAGE_KEY =
  'collabboard-profile';

function loadProfile() {
  try {
    const saved =
      localStorage.getItem(
        PROFILE_STORAGE_KEY,
      );

    return saved
      ? {
          ...defaultProfile,
          ...JSON.parse(
            saved,
          ),
        }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export default function ProfilePage() {
  const {
    user,
  } = useAuth();

  const [
    profile,
    setProfile,
  ] = useState(
    loadProfile,
  );

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    projectsLoading,
    setProjectsLoading,
  ] = useState(true);

  const [
    projectsError,
    setProjectsError,
  ] = useState('');

  const [
    showCreateProject,
    setShowCreateProject,
  ] = useState(false);

  const displayedProfile =
    user
      ? {
          ...profile,

          name:
            user.name ??
            profile.name,

          userId:
            user.email ??
            profile.userId,
        }
      : profile;

  useEffect(() => {
    async function loadProjects() {
      try {
        setProjectsLoading(
          true,
        );

        setProjectsError(
          '',
        );

        const data =
          await getProjects();

        setProjects(
          data,
        );
      } catch (error) {
        setProjectsError(
          error.message ||
            'Unable to load projects',
        );
      } finally {
        setProjectsLoading(
          false,
        );
      }
    }

    loadProjects();
  }, []);

  const saveProfile = (
    nextProfile
  ) => {
    setProfile(
      nextProfile,
    );

    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(
        nextProfile,
      ),
    );
  };

  async function handleCreateProject(
    values
  ) {
    const project =
      await createProject(
        values
      );

    setProjects(
      (current) => [
        project,
        ...current,
      ],
    );

    setShowCreateProject(
      false,
    );
  }

  return (
    <div className="relative min-h-screen bg-stone-50 font-sans text-stone-800">

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative mx-auto max-w-5xl px-4 py-6 pb-24 sm:px-6 sm:py-10 lg:px-8">

        <ProfileHeader
          profile={
            displayedProfile
          }
          onSave={
            saveProfile
          }
        />

        {projectsLoading && (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 text-center font-bold text-stone-500">
            Loading projects...
          </div>
        )}

        {projectsError && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {projectsError}
          </div>
        )}

        {!projectsLoading &&
          !projectsError && (
            <ProjectList
              projects={
                projects
              }
            />
          )}

      </main>

      <button
        type="button"
        onClick={() =>
          setShowCreateProject(
            true,
          )
        }
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-3xl font-light text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-800"
        aria-label="Create a new project"
        title="Create project"
      >
        +
      </button>

      {showCreateProject && (
        <CreateProjectForm
          onCreate={
            handleCreateProject
          }
          onCancel={() =>
            setShowCreateProject(
              false,
            )
          }
        />
      )}

    </div>
  );
}