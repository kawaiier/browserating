export function mergeQuizProfileDetails(results, profileDetails) {
  const detailsById = new Map(profileDetails.map((profile) => [profile.id, profile]));

  return {
    ...results,
    topResults: results.topResults.map((profile) => ({
      ...(detailsById.get(profile.id) ?? {}),
      ...profile,
    })),
    profileDetailsLoaded: true,
  };
}
