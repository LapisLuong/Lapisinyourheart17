import React from "react";
import {
  Composition,
  registerRoot,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import { FallSenseCinematicIntroV4 } from "./Intro";
import { v4 } from "./config";
const gate = delayRender("V4 local Vietnamese typography");
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
    id="FallSenseCinematicIntroV4"
    component={FallSenseCinematicIntroV4}
    durationInFrames={v4.duration}
    fps={v4.fps}
    width={v4.width}
    height={v4.height}
  />
);
registerRoot(Root);
