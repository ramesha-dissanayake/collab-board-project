import PouchDB from 'pouchdb-browser';

export const localDb = new PouchDB(
  'collabboard-local',
);

function safeSegment(value) {
  return String(value)
    .replace(
      /[^a-zA-Z0-9_-]/g,
      '_',
    );
}

export function projectDocId(
  userId,
  projectId,
) {
  return `project:${safeSegment(
    userId,
  )}:${projectId}`;
}

export function taskDocId(
  userId,
  projectId,
  taskId,
) {
  return `task:${safeSegment(
    userId,
  )}:${projectId}:${taskId}`;
}

export function taskDocPrefix(
  userId,
  projectId,
) {
  return `task:${safeSegment(
    userId,
  )}:${projectId}:`;
}

export async function putLocalDocument(
  id,
  data,
) {
  let existing = null;

  try {
    existing =
      await localDb.get(id);
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }
  }

  const document = {
    ...(existing ?? {}),
    ...data,
    _id: id,
    cachedAt:
      new Date().toISOString(),
  };

  return localDb.put(
    document,
  );
}

export async function getLocalDocument(
  id,
) {
  try {
    return await localDb.get(
      id,
    );
  } catch (error) {
    if (error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function listLocalDocumentsByPrefix(
  prefix,
) {
  const result =
    await localDb.allDocs({
      include_docs: true,
      startkey: prefix,
      endkey: `${prefix}\ufff0`,
    });

  return result.rows
    .map(
      (row) => row.doc,
    )
    .filter(Boolean);
}

export async function removeLocalDocument(
  id,
) {
  const document =
    await getLocalDocument(id);

  if (!document) {
    return false;
  }

  await localDb.remove(
    document,
  );

  return true;
}