export const RATING = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4
};

export const createInitialCardState = (wordIndex) => ({
  wordIndex,
  status: 'new', // 'new', 'learning', 'review'
  repetition: 0,
  interval: 0,
  easeFactor: 2.5,
  nextReviewDate: Date.now(),
});

export const calculateNextReview = (rating, card) => {
  let { repetition, interval, easeFactor } = card;

  if (rating === RATING.AGAIN) {
    repetition = 0;
    interval = 1; // 1 minute
  } else if (rating === RATING.HARD) {
    if (repetition === 0) {
      interval = 10; // 10 minutes
    } else {
      interval = interval * 1.2;
    }
  } else if (rating === RATING.GOOD) {
    if (repetition === 0) {
      interval = 24 * 60; // 1 day
    } else if (repetition === 1) {
      interval = 6 * 24 * 60; // 6 days
    } else {
      interval = interval * easeFactor;
    }
    repetition++;
  } else if (rating === RATING.EASY) {
    if (repetition === 0) {
      interval = 4 * 24 * 60; // 4 days
    } else {
      interval = interval * easeFactor * 1.3;
    }
    easeFactor = easeFactor + 0.15;
    repetition++;
  }

  // Penalty for failing/hard
  if (rating === RATING.AGAIN) {
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (rating === RATING.HARD) {
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  }

  // Interval is in minutes. Calculate nextReviewDate
  const nextReviewDate = Date.now() + interval * 60 * 1000;
  
  const status = (interval < 24 * 60) ? 'learning' : 'review';

  return {
    ...card,
    status,
    repetition,
    interval,
    easeFactor,
    nextReviewDate
  };
};

export const formatInterval = (minutes) => {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))}m`;
  if (minutes < 24 * 60) return `${Math.round(minutes / 60)}h`;
  if (minutes < 30 * 24 * 60) return `${Math.round(minutes / (24 * 60))}d`;
  return `${Math.round(minutes / (30 * 24 * 60))}mo`;
};

// Function to preview the interval for a rating without saving it
export const previewInterval = (rating, card) => {
  const nextCard = calculateNextReview(rating, card);
  return formatInterval(nextCard.interval);
};
