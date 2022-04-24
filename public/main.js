// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper();
const messagesAndGiftsArr = [];
const animatedGiftsArr = [];

const runner = () => {
  const myInterval = setInterval(() => {
    if (animatedGiftsArr.length !== 0 && !isAnimatingGiftUI() && !isPossiblyAnimatingGift()) {
      animateGift(animatedGiftsArr.shift());
    }
    if (messagesAndGiftsArr.length !== 0) {
      const now = new Date().getTime();
      const itemTime = new Date(messagesAndGiftsArr[0].timestamp).getTime();
      if (now-itemTime < 20000) {
        addMessage(messagesAndGiftsArr.shift());
      } else {
        messagesAndGiftsArr.unshift();
      }
    }
  }, 500);
  return myInterval;
}

let interval = runner();

api.setEventHandler((events) => {
  // ...
  for (let index = 0; index < events.length; index++) {
    const firstId = events.findIndex(x => x.id === events[index].id);
    if (index > firstId) continue;
    if (events[index].type === API_EVENT_TYPE.ANIMATED_GIFT) {
      if (isAnimatingGiftUI()) {
        animatedGiftsArr.push(events[index]);
      } else {
        clearInterval(interval);
        animatedGiftsArr.push(events[index]);
        interval = runner();
      }
    } else {
      messagesAndGiftsArr.push(events[index]);
    }
  }
})



// NOTE: UI helper methods from `dom_updates` are already imported above.
