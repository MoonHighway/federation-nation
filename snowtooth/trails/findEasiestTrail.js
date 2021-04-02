const trailRatings = [
  {
    level: "BEGINNER",
    groomed: true
  },
  {
    level: "BEGINNER",
    groomed: false
  },
  {
    level: "INTERMEDIATE",
    groomed: true
  },
  {
    level: "ADVANCED",
    groomed: true
  },
  {
    level: "INTERMEDIATE",
    groomed: false
  },
  {
    level: "EXPERT",
    groomed: true
  },
  {
    level: "ADVANCED",
    groomed: false
  },
  {
    level: "EXPERT",
    groomed: false
  }
];

module.exports = function findEasiestTrail(trails) {
  return trailRatings.reduce(
    (prev, next) =>
      prev
        ? prev
        : trails.find(
            trail =>
              trail.difficulty === next.level && trail.groomed === next.groomed
          ),
    null
  );
};
