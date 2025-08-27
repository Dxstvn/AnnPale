export * from './dj-k9-profile';
export * from './dj-bullet-profile';
export * from './j-perry-profile';

import { djK9Profile, djK9Auth, djK9Reviews, djK9SampleVideos } from './dj-k9-profile';
import { djBulletProfile, djBulletAuth, djBulletReviews, djBulletSampleVideos } from './dj-bullet-profile';
import { jPerryProfile, jPerryAuth, jPerryReviews, jPerrySampleVideos } from './j-perry-profile';

export const demoProfiles = [djK9Profile, djBulletProfile, jPerryProfile];
export const demoAuthAccounts = [djK9Auth, djBulletAuth, jPerryAuth];
export const demoReviews = [...djK9Reviews, ...djBulletReviews, ...jPerryReviews];
export const demoSampleVideos = [...djK9SampleVideos, ...djBulletSampleVideos, ...jPerrySampleVideos];

export const getDemoProfileById = (id: string) => {
  return demoProfiles.find(profile => profile.id === id);
};

export const getDemoAuthByEmail = (email: string) => {
  return demoAuthAccounts.find(auth => auth.email === email);
};

export const getDemoReviewsByCreatorId = (creatorId: string) => {
  return demoReviews.filter(review => review.creator_id === creatorId);
};

export const getDemoSampleVideosByCreatorId = (creatorId: string) => {
  return demoSampleVideos.filter(video => video.creator_id === creatorId);
};