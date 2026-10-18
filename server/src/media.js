// Media services: Unsplash/Pexels API for imagery & YouTube Data API for educational videos
// Includes resilient fallbacks to ensure the UI always displays rich visual content even if API keys are omitted.

export async function fetchCropImage(cropName, defaultUrl) {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  const pexelsKey = process.env.PEXELS_API_KEY;

  if (unsplashKey) {
    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cropName + " agriculture crop field")}&per_page=1&orientation=landscape`;
      const res = await fetch(url, { headers: { Authorization: `Client-ID ${unsplashKey}` } });
      if (res.ok) {
        const data = await res.json();
        const photo = data?.results?.[0];
        if (photo?.urls?.regular) {
          return {
            source: "Unsplash API",
            imageUrl: photo.urls.regular,
            credit: photo.user?.name || "Unsplash Creator",
            link: photo.links?.html
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  if (pexelsKey) {
    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(cropName + " farming")}&per_page=1&orientation=landscape`;
      const res = await fetch(url, { headers: { Authorization: pexelsKey } });
      if (res.ok) {
        const data = await res.json();
        const photo = data?.photos?.[0];
        if (photo?.src?.large) {
          return {
            source: "Pexels API",
            imageUrl: photo.src.large,
            credit: photo.photographer || "Pexels Creator",
            link: photo.url
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  return {
    source: "Unsplash Curated CDN",
    imageUrl: defaultUrl,
    credit: "Unsplash Agricultural Collection"
  };
}

export async function fetchCropTutorialVideo(cropName, defaultVideo) {
  const youtubeKey = process.env.YOUTUBE_API_KEY;

  if (youtubeKey) {
    try {
      const query = `${cropName} crop farming cultivation guide tutorial package of practices`;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${youtubeKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const item = data?.items?.[0];
        if (item?.id?.videoId) {
          return {
            source: "YouTube Data API v3",
            youtubeId: item.id.videoId,
            title: item.snippet?.title || `${cropName} Cultivation Guide`,
            channel: item.snippet?.channelTitle || "Agricultural Extension"
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  return {
    source: "Curated Educational Extension Video",
    youtubeId: defaultVideo?.youtubeId || "uC2Y19j-z1w",
    title: defaultVideo?.title || `${cropName} Package of Practices & Cultivation Guide`,
    channel: defaultVideo?.channel || "Agricultural Extension Network"
  };
}
