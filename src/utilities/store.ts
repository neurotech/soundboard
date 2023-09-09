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
  lastBackupDate?: string;
}

export interface S3Config {
  bucketName: string;
  awsRegion: string;
  accessKeyId: string;
  secretAccessKey: string;
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

export const s3StoreDefaults: S3Config = {
  bucketName: "",
  awsRegion: "",
  accessKeyId: "",
  secretAccessKey: "",
};

export const getStore = async () => await window.Main.store.get();

export const setStore = async (store: Store) =>
  await window.Main.store.set(store);
