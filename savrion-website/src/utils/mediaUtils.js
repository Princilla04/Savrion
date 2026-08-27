export const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('https://')) return url;

  let path = url;
  if (path.includes('/uploads/')) {
    path = '/uploads/' + path.split('/uploads/')[1];
  }

  if (path.startsWith('/')) {
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'https://savrion-website.onrender.com';
    return `${serverUrl}${path}`;
  }

  return path;
};
