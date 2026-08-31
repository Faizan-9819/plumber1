import type { CSSProperties } from "react";

const IMAGE_BASE = {
  plumberSink: "https://plus.unsplash.com/premium_photo-1750594941294-91dcf3896ad5",
  boiler: "https://plus.unsplash.com/premium_photo-1750594940949-6cd512242c62",
  showerHead: "https://plus.unsplash.com/premium_photo-1750594940960-0c1790168431",
  pipeFitting: "https://plus.unsplash.com/premium_photo-1750594942711-58fa23b80518",
  pipeFusion: "https://plus.unsplash.com/premium_photo-1750594941733-778d58dca208",
  faucet: "https://plus.unsplash.com/premium_photo-1750594940989-5c93275f7b64",
  fixtures: "https://plus.unsplash.com/premium_photo-1750594942743-1abf9da981f7",
  toolbox: "https://plus.unsplash.com/premium_photo-1750594942636-1aad593584d8",
  youngPlumber: "https://plus.unsplash.com/premium_photo-1663013675008-bd5a7898ac4f",
  lieke: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
} as const;

export type ImageId = keyof typeof IMAGE_BASE;

export function imageUrl(id: ImageId, width = 900, height = 700) {
  return `${IMAGE_BASE[id]}?auto=format&fit=crop&w=${width}&h=${height}&q=72`;
}

export function coverStyle(id: ImageId, width = 900, height = 700): CSSProperties {
  return {
    backgroundImage: `url("${imageUrl(id, width, height)}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
