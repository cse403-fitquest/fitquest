import { Timestamp } from 'firebase/firestore';

export const fromTimestampToDate = (timestamp: Timestamp) => {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};
