import { SoundEntity } from "../App";

export interface TabEntity {
  id: string;
  name: string;
  sequence: number;
  sounds: SoundEntity[];
}

export interface Store {
  activeTab: string;
  rate: number;
  tabs: TabEntity[];
  volume: number;
}

export const storeDefaults: Store = {
  activeTab: "",
  rate: 1,
  tabs: [],
  volume: 1,
};

export const getStore = async () => await window.Main.store.get();

export const setStore = async (store: Store) =>
  await window.Main.store.set(store);
