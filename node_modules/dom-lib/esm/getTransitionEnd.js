import getTransitionProperties from "./getTransitionProperties.js";
export default function getTransitionEnd() {
  return getTransitionProperties().end;
}