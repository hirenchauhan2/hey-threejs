import './style.css';

import { spinning3DCube } from './js/spinning-cube';

// add tutorial progress here and mark isCurrent to the current tutorial,
// add the tutorial's code in js/tutorial-title.js file
// last active tutorial will be shown on page.
const tutorialsMap = {
  spinningCube: {
    isCurrent: true,
    func: spinning3DCube,
  },
};

function main() {
  console.log('Running tutorial');
  const tutorialsKeys = Object.keys(tutorialsMap);
  let currentTutorial;

  tutorialsKeys.forEach(tutorialKey => {
    const tutorial = tutorialsMap[tutorialKey];
    if (tutorial.isCurrent) {
      currentTutorial = tutorial;
    }
  });

  if (currentTutorial) {
    currentTutorial.func();
  } else {
    console.log('Noc current tutorial found.. Maybe all done?');
  }
}

main();