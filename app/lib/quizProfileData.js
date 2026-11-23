import { getBrowserSlug } from './getBrowserSlug.js';

function getBrowsersByName(browsers) {
  return new Map(browsers.map((browser) => [browser.name.toLowerCase(), browser]));
}

export function decorateQuizProfiles(profiles, browsers) {
  const browsersByName = getBrowsersByName(browsers);

  return profiles.map((profile) => {
    const browser = browsersByName.get(profile.name.toLowerCase());
    return {
      ...profile,
      logo: browser?.logo ?? null,
      website: browser?.website ?? null,
      slug: browser ? getBrowserSlug(browser.name) : null,
    };
  });
}

export function getQuizProfileSummary(profile) {
  return {
    id: profile.id,
    name: profile.name,
    logo: profile.logo ?? null,
    traits: profile.traits,
    platforms: profile.platforms,
    discontinued: profile.discontinued,
  };
}

export function getQuizProfileSummaries(profiles, browsers) {
  return decorateQuizProfiles(profiles, browsers).map(getQuizProfileSummary);
}
