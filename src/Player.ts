import { Howl } from "howler";

export const createPlayer = (url: string, id: string, setCurrentSound: any) => {
  return new Howl({
    onend: () => setCurrentSound(""),
    onplay: () => setCurrentSound(id),
    onstop: () => setCurrentSound(""),
    rate: 1,
    src: `howl-loader://${url}`,
    volume: 0.1,
  });
};
