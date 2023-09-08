import {
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  GetObjectCommand,
  ListObjectsCommand,
  ObjectIdentifier,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { join } from "path";
import { Readable } from "stream";
import { S3Config } from "./store";

export type Status =
  | "idle"
  | "uploading"
  | "downloading"
  | "testing"
  | "connection-test-success"
  | "connection-test-failed"
  | "backup-success"
  | "backup-failed"
  | "restore-success"
  | "restore-failed";

const getClient = (config: S3Config) =>
  new S3Client({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: config.awsRegion,
  });

const upload = async (
  config: S3Config,
  configDirectory: string,
  soundsDirectory: string
) => {
  try {
    const client = getClient(config);
    const configFile = "config.json";
    const configFileBody = fs.readFileSync(join(configDirectory, configFile));
    const soundList = fs.readdirSync(soundsDirectory);
    const files = soundList.map((sound: string) => {
      const fileBody = fs.readFileSync(join(soundsDirectory, sound));
      return {
        Bucket: config.bucketName,
        Key: `sounds/${sound}`,
        Body: fileBody,
      };
    });

    files.push({
      Bucket: config.bucketName,
      Key: configFile,
      Body: configFileBody,
    });

    const done = Promise.all(
      files.map((file) =>
        client
          .send(new PutObjectCommand(file))
          .then((response: PutObjectCommandOutput) => {
            const status = response.$metadata.httpStatusCode;
            if (status === 200) {
              console.info(`Uploaded: ${file.Key}`);
            } else {
              console.warn(`Error uploading: ${file.Key}`);
            }
          })
          .catch((error) => console.error(error))
      )
    );

    return done;
  } catch (error) {
    console.error(error);
  }
};

export const backup = async (
  config: S3Config,
  configDirectory: string,
  soundsDirectory: string
) => {
  try {
    const client = getClient(config);
    const listParams = {
      Bucket: config.bucketName,
    };
    const listCommand = new ListObjectsCommand(listParams);
    const files = await client.send(listCommand);

    if (files.Contents) {
      const deleteParams: DeleteObjectsCommandInput = {
        Bucket: config.bucketName,

        Delete: {
          Objects: files.Contents as ObjectIdentifier[],
        },
      };
      const deleteCommand = new DeleteObjectsCommand(deleteParams);
      const deleteResponse = await client.send(deleteCommand);
      const status = deleteResponse.$metadata.httpStatusCode;

      if (status === 200 && deleteParams.Delete?.Objects) {
        console.log(
          `Cleared ${deleteParams.Delete.Objects.length} files from the S3 bucket.`
        );
      } else {
        console.warn(`Error clearing files from the S3 bucket.`);
      }
    } else {
      console.warn("There are no files to clear from the S3 bucket.");
    }

    await upload(config, configDirectory, soundsDirectory);
  } catch (error) {
    console.error(error);
  }
};

export const restore = async (
  config: S3Config,
  configDirectory: string,
  soundsDirectory: string
) => {
  const client = getClient(config);

  fs.rmdirSync(soundsDirectory, { recursive: true });
  fs.mkdirSync(soundsDirectory, { recursive: true });

  const listParams = {
    Bucket: config.bucketName,
  };
  const listCommand = new ListObjectsCommand(listParams);
  const files = await client.send(listCommand);

  if (files.Contents) {
    const downloadOperation = Promise.all(
      files.Contents.map((param) =>
        client
          .send(
            new GetObjectCommand({ Bucket: config.bucketName, Key: param.Key })
          )
          .then((res) => {
            if (param.Key) {
              const body = res.Body as Readable;
              const fileStream = fs.createWriteStream(
                join(configDirectory, param.Key)
              );
              body.pipe(fileStream);

              fileStream.on("finish", () =>
                console.log("Restored: " + param.Key)
              );
            }
          })
          .catch((error) => {
            console.error(error);
          })
      )
    );

    return downloadOperation;
  }
};
