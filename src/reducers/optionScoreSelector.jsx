import { createSelector } from "reselect";
import { connect } from "react-redux";

const getAllParentFactors = state => {
  const allFactors = Object.values(state.factors.present.factorsById);
  // get only the top-level parents.
  const topParents = allFactors.filter(factor => {
    return factor.parentFactorID === null;
  });
  return topParents;
};

const getAllOptionIDs = state => {
  return state.options.data.map(option => option.id);
};

/**
 * Reselector to compute the resultant scores from all the factor node structures.
 *
 * Returns a object of optionID - final score key-value pairs.
 */
const getFinalOptionScores = createSelector(
  [getAllParentFactors, getAllOptionIDs],
  (parentFactors, optionIDs) => {
    const finalOptionScores = {};
    optionIDs.forEach(optionID => {
      const scoreForOption = parentFactors.reduce((total, factor) => {
        return factor.optionScores[optionID] + total;
      }, 0);
      finalOptionScores[optionID] = scoreForOption;
    });
    return finalOptionScores;
  }
);

export const connectFinalOptionScores = dstKey => {
  return connect(state => {
    return { [dstKey]: getFinalOptionScores(state) };
  });
};
