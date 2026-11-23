import { getQuizData } from '../../../lib/getQuizData.js';
import { decorateQuizProfiles } from '../../../lib/quizProfileData.js';

export const runtime = 'nodejs';

let dataPromise;
function getData() {
  if (!dataPromise) {
    dataPromise = getQuizData().catch((error) => {
      dataPromise = null;
      throw error;
    });
  }
  return dataPromise;
}

export async function GET(request) {
  const ids = [...new Set(new URL(request.url).searchParams.getAll('id'))].slice(0, 3);
  if (ids.length === 0) return Response.json([]);

  const requestedIds = new Set(ids);
  const { profiles, browsers } = await getData();
  const selectedProfiles = profiles.filter((profile) => requestedIds.has(profile.id));

  return Response.json(decorateQuizProfiles(selectedProfiles, browsers));
}
