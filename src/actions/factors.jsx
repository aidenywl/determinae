export const CREATE_BUBBLE = "factors.CREATE_BUBBLE";

export const createBubble = (x, y) => {
  const positionPayload = {
    x,
    y
  };
  return {
    type: CREATE_BUBBLE,
    position: positionPayload
  };
};
