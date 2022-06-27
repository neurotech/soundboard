import { Howl } from "howler";

export const createPlayer = (
  url: string,
  id: string,
  setCurrentSound: any,
  volume?: number,
  rate?: number
) => {
  const store = window.Main.store;

  return new Howl({
    onend: () => setCurrentSound(""),
    onplay: () => setCurrentSound(id),
    onstop: () => setCurrentSound(""),
    rate: rate || store.get().rate,
    src: `howl-loader://${url}`,
    volume: volume || store.get().volume,
  });
};
