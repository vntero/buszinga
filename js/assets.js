const makeImg = src => {
  const img = new Image();
  img.src = src;
  return img;
};

export const images = {
  bg: makeImg('./Images/sun-and-clouds.png'),
  road: makeImg('./Images/road.png'),
  mountain: makeImg('./Images/mountain.png'),
  bigMountain: makeImg('./Images/big-mountain.png'),
  bus: makeImg('./Images/bus.png'),
  bushes: makeImg('./Images/bushes.png'),
  trees: makeImg('./Images/trees.png'),
  carOne: makeImg('./Images/car-one.png'),
  carTwo: makeImg('./Images/car-two.png'),
  carThree: makeImg('./Images/car-three.png'),
  carFour: makeImg('./Images/car-four.png'),
  truckOne: makeImg('./Images/truck-one.png'),
  truckTwo: makeImg('./Images/truck-two.png'),
  truckThree: makeImg('./Images/truck-three.png'),
  truckA: makeImg('./Images/truck-ambulance.png'),
  charger: makeImg('./Images/charger.png'),
};

export const sounds = {
  soundtrack: new Audio('./Sound/soundtrack.mp3'),
  scoreUp: new Audio('./Sound/score.mp3'),
  crash: new Audio('./Sound/crash.mp3'),
  youlose: new Audio('./Sound/youlose.mp3'),
  youwin: new Audio('./Sound/youwin.mp3'),
};

sounds.soundtrack.volume = 0.1;
sounds.scoreUp.volume = 0.6;
sounds.crash.volume = 0.3;
sounds.youlose.volume = 0.1;
sounds.youwin.volume = 0.5;

export function buildCharacters() {
  const { carOne, carTwo, carThree, carFour, truckOne, truckTwo, truckThree, truckA, charger } =
    images;
  return [truckOne, truckA, truckTwo, truckThree, charger, carOne, carTwo, carThree, carFour].map(
    img => ({
      img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      isCharger: img === charger,
    }),
  );
}

export function loadAssets() {
  return Promise.all(
    Object.values(images).map(
      img =>
        new Promise((resolve, reject) => {
          if (img.complete && img.naturalWidth > 0) return resolve();
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener(
            'error',
            () => reject(new Error(`Failed to load ${img.src}`)),
            { once: true },
          );
        }),
    ),
  );
}
