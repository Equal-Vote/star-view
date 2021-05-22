import React, { Component } from "react";
import StarRatings from "react-ratings-declarative";

export default class Rating extends Component {
  render() {
    // aggregateRating = 2.35;
    return (
      <div className="tight">
        <StarRatings
          rating={this.props.rating}
          widgetDimensions="1.52em"
          widgetSpacings="0px"
          widgetRatedColors="#f9a602"
        >
          <StarRatings.Widget />
          <StarRatings.Widget />
          <StarRatings.Widget />
          <StarRatings.Widget />
          <StarRatings.Widget />
        </StarRatings>
      </div>
    );
  }
}
