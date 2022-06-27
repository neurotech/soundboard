import shortUUID from "short-uuid";
import { SoundEntity } from "../App";

export interface TabEntity {
  id: string;
  name: string;
  sequence: number;
  sounds: SoundEntity[];
}

export interface Store {
  activeTab: string;
  lastColorSelected: string;
  rate: number;
  tabs: TabEntity[];
  volume: number;
}

const defaultTabID = shortUUID.generate();

export const storeDefaults: Store = {
  activeTab: defaultTabID,
  lastColorSelected: "red",
  rate: 1,
  tabs: [
    {
      id: defaultTabID,
      name: "My First Tab",
      sequence: 0,
      sounds: [],
    },
  ],
  volume: 1,
};

export const getStore = async () => await window.Main.store.get();

export const setStore = async (store: Store) =>
  await window.Main.store.set(store);
