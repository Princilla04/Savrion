const { Storage } = require('@google-cloud/storage');

let storageClient;

/** Returns the configured Cloud Storage bucket, or null when local development is in use. */
const getBucket = () => {
  if (!process.env.GCS_BUCKET_NAME) return null;
  if (!storageClient) storageClient = new Storage();
  return storageClient.bucket(process.env.GCS_BUCKET_NAME);
};

/** Uploads an admin media file to Cloud Storage and returns its public asset URL. */
const uploadToCloudStorage = async (file) => {
  const bucket = getBucket();
  if (!bucket) return null;

  const objectName = `uploads/savrion-${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  const cloudFile = bucket.file(objectName);

  await new Promise((resolve, reject) => {
    const stream = cloudFile.createWriteStream({
      resumable: false,
      metadata: { contentType: file.mimetype, cacheControl: 'public, max-age=31536000, immutable' }
    });
    stream.on('error', reject);
    stream.on('finish', resolve);
    stream.end(file.buffer);
  });

  const baseUrl = (process.env.GCS_PUBLIC_BASE_URL || `https://storage.googleapis.com/${bucket.name}`).replace(/\/$/, '');
  return `${baseUrl}/${objectName}`;
};

module.exports = { getBucket, uploadToCloudStorage };
