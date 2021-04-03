const fs = require("fs");
const util = require("util");
const path = require("path");

const writeFile = util.promisify(fs.writeFile);

let reviews = require("./reviews.json");

const saveReviews = async (newReviews = []) => {
  const fileName = path.join(__dirname, "reviews.json");
  const fileContents = JSON.stringify(newReviews, null, 2);
  try {
    await writeFile(fileName, fileContents);
    reviews = newReviews;
  } catch (error) {
    console.error("Error saving reviews");
    console.error(error);
  }
};

const countReviews = (appID) => reviews.filter((r) => r.appID === appID).length;
const findReviews = (appID) => reviews.filter((r) => r.appID === appID);

const findUserReview = (appID, currentUser, itemID) =>
  reviews.find(
    (review) =>
      review.appID === appID &&
      review.user.email === currentUser &&
      review.itemID === itemID
  );

const findAllItemReviews = (itemID, appID) => {
  const itemReviews = reviews.filter(
    (r) => r.itemID === itemID && r.appID === appID
  );
  const ratings = itemReviews.map((r) => r.rating);
  const total =
    ratings.length > 1
      ? ratings.reduce((p, n) => p + n)
      : ratings.length === 1
      ? ratings[0]
      : 0;
  const adv = total / ratings.length;
  return {
    itemID,
    average: adv || 0,
    reviews: itemReviews,
  };
};

const findReviewById = (id) => reviews.find((r) => r.id === id);

const addReview = (currentUser, appID, itemID, rating, comment) => {
  if (!currentUser) {
    throw new Error(
      "A user must be logged in to add a review. Check http headers and make sure 'user-email' is getting set upstream."
    );
  }

  if (!appID) {
    throw new Error(
      "appID not found! Check http headers and make sure 'app-id' is getting set upstream."
    );
  }

  if (itemID.indexOf(":") != -1) {
    throw new Error("Invalid itemID. The itemID cannot contain ':' collins.");
  }

  const newReview = {
    id: `review:${appID}:${currentUser}:${itemID}`,
    appID,
    itemID,
    rating,
    comment,
    created: new Date().toISOString(),
    user: { email: currentUser },
  };

  saveReviews([...reviews, newReview]);
  return newReview;
};

module.exports = {
  countReviews,
  findReviews,
  findUserReview,
  findAllItemReviews,
  findReviewById,
  addReview,
};
