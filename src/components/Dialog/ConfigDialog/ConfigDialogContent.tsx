import { Column, Columns, Stack } from "@neurotech/elements";
import { useState } from "react";
import { Status } from "../../../utilities/s3";
import { S3Config } from "../../../utilities/store";
import { Input } from "../../Input";
import { HorizontalRule } from "../Dialog";

interface ConfigDialogContentProps {
  s3config: S3Config;
  setS3config: (s3config: S3Config) => void;
}

const messages: Record<Status, string> = {
  idle: "Waiting for input.",
  uploading: "↑ Backing up to S3 bucket...",
  downloading: "↓ Restoring from S3 bucket...",
  testing: "Testing connection to S3 bucket...",
  "connection-test-success": "✔ Successfully connected to S3 bucket.",
  "connection-test-failed": "✖ Failed to connect to S3 bucket!",
  "backup-success": "✔ Backup complete.",
  "backup-failed": "✖ Backup failed!",
  "restore-success": "✔ Restore complete.",
  "restore-failed": "✖ Restore failed!",
};

export const ConfigDialogContent = ({
  s3config,
  setS3config,
}: ConfigDialogContentProps) => {
  const [s3Status, setS3Status] = useState<Status>("idle");

  return (
    <Stack>
      <Columns>
        <Column columnWidth={"50%"}>
          <Stack flexGrow={1}>
            <Input
              onChange={(value) =>
                setS3config({ ...s3config, bucketName: value })
              }
              label={"S3 Bucket Name"}
              value={s3config.bucketName || ""}
            />
            <Input
              onChange={(value) =>
                setS3config({ ...s3config, awsRegion: value })
              }
              label={"AWS Region"}
              value={s3config.awsRegion || ""}
            />
          </Stack>
        </Column>
        <Column columnWidth={"50%"}>
          <Stack flexGrow={1}>
            <Input
              onChange={(value) =>
                setS3config({ ...s3config, accessKeyId: value })
              }
              label={"Access Key ID"}
              type={"password"}
              value={s3config.accessKeyId || ""}
            />
            <Input
              onChange={(value) =>
                setS3config({ ...s3config, secretAccessKey: value })
              }
              label={"Secret Access Key"}
              type={"password"}
              value={s3config.secretAccessKey || ""}
            />
          </Stack>
        </Column>
      </Columns>
      <HorizontalRule />
      <Stack>
        <button
          onClick={async () => {
            setS3Status("uploading");
            await window.Main.s3Backup();
            setS3Status("backup-success");
          }}
        >
          {"Backup"}
        </button>
        <button
          onClick={async () => {
            setS3Status("downloading");
            await window.Main.s3Restore();
            setS3Status("restore-success");
          }}
        >
          {"Restore"}
        </button>
        {messages[s3Status]}
      </Stack>
    </Stack>
  );
};
