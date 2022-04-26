import StarRatings from "react-star-ratings";

export const ShowAverage = (p) => {
  if (p && p.ratings) {
    let ratingsArray = p && p.ratings;
    let total = [];
    let length = ratingsArray.length;
    console.log(length);

    ratingsArray.map((r) => total.push(r.star));
    let totalReduced = total.reduce((p, n) => p + n, 0);
    console.log(totalReduced);
    let highest = length * 5;
    console.log(highest);

    let result = (totalReduced * 5) / highest;
    console.log(result);
    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRatings
            starDimension="20px"
            starSpacing="2px"
            starRatedColor="red"
            rating={result}
            editing={false}
          ></StarRatings>{" "}
          ({p.ratings.length})
        </span>
      </div>
    );
  }
};