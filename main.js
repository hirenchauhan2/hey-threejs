import './style.css';

import { spinning3DCube } from './js/spinning-cube';
import { drawLines } from './js/draw-lines';
import { runPlaneGeometry } from './js/plane-geometry';

// add tutorial progress here and mark isCurrent to the current tutorial,
// add the tutorial's code in js/tutorial-title.js file
// last active tutorial will be shown on page.
const tutorialsMap = {
  spinningCube: {
    isCurrent: false,
    func: spinning3DCube,
  },
  drawLines: {
    isCurrent: false,
    func: drawLines,
  },
  planeGeometry: {
    isCurrent: true,
    func: runPlaneGeometry,
  },
};

function main() {
  const tutorialsKeys = Object.keys(tutorialsMap);
  let currentTutorial;
  let currentTutorialTitle;

  tutorialsKeys.forEach(tutorialKey => {
    const tutorial = tutorialsMap[tutorialKey];
    if (tutorial.isCurrent) {
      currentTutorial = tutorial;
      currentTutorialTitle=tutorialKey;
    }
  });

  if (currentTutorial) {
    console.log('Running tutorial', currentTutorialTitle);
    currentTutorial.func();
  } else {
    console.log('Noc current tutorial found.. Maybe all done?');
  }
}

main();