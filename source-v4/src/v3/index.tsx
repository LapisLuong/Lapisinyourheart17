import React from "react";
import {
  Composition,
  registerRoot,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import { FallSenseCinematicIntroV3 } from "./Intro";
import { v3 } from "./config";
const gate = delayRender("V3 local Vietnamese typography");
Promise.all([
  new FontFace(
    "Noto",
    `url(${staticFile("fonts/NotoSans-Regular.ttf")})`,
  ).load(),
  new FontFace("Noto", `url(${staticFile("fonts/NotoSans-Bold.ttf")})`, {
    weight: "700",
  }).load(),
]).then((fonts) => {
  fonts.forEach((f) =>
    (document.fonts as FontFaceSet & { add: (f: FontFace) => void }).add(f),
  );
  continueRender(gate);
});
const Root: React.FC = () => (
  <Composition
    id="FallSenseCinematicIntroV3"
    component={FallSenseCinematicIntroV3}
    durationInFrames={v3.duration}
    fps={v3.fps}
    width={v3.width}
    height={v3.height}
  />
);
registerRoot(Root);
