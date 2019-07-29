import { createSelector } from "reselect";
import { connect } from "react-redux";

const getAllParentFactors = state => {
  const allFactors = Object.values(
    state.undoableData.present.factors.factorsById
  );
  // get only the top-level parents.
  const topParents = allFactors.filter(factor => {
    return factor.parentFactorID === null;
  });
  return topParents;
};

const getAllOptionIDs = state => {
  return state.undoableData.present.options.data.map(option => option.id);
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

    // For each option, get the scores multiplied by the weightage.
    optionIDs.forEach(optionID => {
      const totalScoreForOption = parentFactors.reduce((total, factor) => {
        const factorOptionScore = factor.optionScores[optionID];
        const factorWeightage = factor.weightage;
        const factorWeightedScore = (factorOptionScore * factorWeightage) / 100;
        return factorWeightedScore + total;
      }, 0);
      finalOptionScores[optionID] = totalScoreForOption;
    });
    return finalOptionScores;
  }
);

export const connectFinalOptionScores = dstKey => {
  return connect(state => {
    return { [dstKey]: getFinalOptionScores(state) };
  });
};
