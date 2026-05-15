import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type S3RuntimeConfig = {
  region?: string;
  bucket?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  presignedUrlExpiresSeconds?: string | number;
};

type S3ResolvedConfig = {
  region: string;
  bucket: string;
  presignedUrlExpiresSeconds: number;
  clientConfig: S3ClientConfig;
};

const toInt = (value: unknown, fallback: number): number => {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const resolveS3Config = (
  config: S3RuntimeConfig,
): S3ResolvedConfig | null => {
  const region = String(config.region ?? "").trim();
  const bucket = String(config.bucket ?? "").trim();
  const accessKeyId = String(config.accessKeyId ?? "").trim();
  const secretAccessKey = String(config.secretAccessKey ?? "").trim();
  const endpoint = String(config.endpoint ?? "").trim();

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    return null;
  }

  const presignedUrlExpiresSeconds = Math.min(
    Math.max(toInt(config.presignedUrlExpiresSeconds, 60 * 60 * 24 * 7), 60),
    60 * 60 * 24 * 7,
  );

  const clientConfig: S3ClientConfig = {
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    ...(endpoint ? { endpoint } : null),
  };

  return {
    region,
    bucket,
    presignedUrlExpiresSeconds,
    clientConfig,
  };
};

export const getS3Client = (
  config: S3RuntimeConfig,
): {
  client: S3Client;
  bucket: string;
  presignedUrlExpiresSeconds: number;
} | null => {
  const resolved = resolveS3Config(config);
  if (!resolved) {
    return null;
  }

  return {
    client: new S3Client(resolved.clientConfig),
    bucket: resolved.bucket,
    presignedUrlExpiresSeconds: resolved.presignedUrlExpiresSeconds,
  };
};

export const uploadBufferToS3 = async (options: {
  client: S3Client;
  bucket: string;
  key: string;
  buffer: Buffer;
  contentType?: string;
}): Promise<{ key: string }> => {
  const bucket = String(options.bucket ?? "").trim();
  const key = String(options.key ?? "").trim();
  if (!bucket || !key) {
    throw new Error("Missing S3 bucket/key");
  }

  await options.client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: options.buffer,
      ContentType: options.contentType || "application/octet-stream",
    }),
  );

  return { key };
};

export const getPresignedViewUrl = async (options: {
  client: S3Client;
  bucket: string;
  key: string;
  expiresInSeconds: number;
}): Promise<string> => {
  const bucket = String(options.bucket ?? "").trim();
  const key = String(options.key ?? "").trim();
  if (!bucket || !key) {
    throw new Error("Missing S3 bucket/key");
  }

  return await getSignedUrl(
    options.client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    {
      expiresIn: options.expiresInSeconds,
    },
  );
};
