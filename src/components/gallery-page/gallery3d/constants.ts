// Shared architectural dimensions & palette for the 360° Contemporary Exhibition Gallery
// Coordinate system: floor at y = 0, room centered at [0, 0, 0].

export const GALLERY_DIMS = {
  outerRadius: 10.0, // 20 m outer diameter
  innerRadius: 9.76, // 19.52 m inner diameter
  wallThickness: 0.24,
  wallHeight: 3.8,
  floorThickness: 0.25,
  ceilingHeight: 3.8,
  trackRingRadius: 6.0, // 12 m track ring diameter
  skylightRadius: 2.5, // 5 m central skylight diameter
  seatingOuterRadius: 2.5, // 5 m central seating diameter
  seatingInnerRadius: 1.15, // central circular planter radius
  seatingHeight: 0.55,
  frameMountRadius: 9.69, // flush mounting plane on inner curved bay (R=9.76)
} as const;

export const GALLERY_PALETTE = {
  mainWall: "#C8BBAA",
  secondaryWall: "#D8C4A5",
  recessedBay: "#DDD1C0",
  darkBronze: "#49372D",
  champagneBronze: "#9A7E62",
  walnut: "#553B2B",
  marbleFloor: "#A9A39B",
  seating: "#B7A99A",
  seatingPlinth: "#3A2D24",
  warmLed: "#FFF0D6",
  warmLedEmissive: "#FFE4B5",
  matBoard: "#F4EFE8",
} as const;

export interface CameraStop {
  id: string;
  label: string;
  progressLabel: string;
  /** Azimuth angle in radians around Y axis; 0 faces -Z (Main Achievement). */
  angle: number;
  /** Camera orbit radius from center. */
  radius: number;
  /** Camera height. */
  height: number;
  /** Look-at target radius toward the wall. */
  lookRadius: number;
  /** Look-at target height. */
  lookHeight: number;
}

// 6-stage guided museum journey (0% -> 100%)
export const CAMERA_STOPS: CameraStop[] = [
  {
    id: "opening",
    label: "Main Exhibition",
    progressLabel: "0%",
    angle: 0,
    radius: 6.2,
    height: 1.55,
    lookRadius: 9.4,
    lookHeight: 1.75,
  },
  {
    id: "awards",
    label: "Awards & Recognition",
    progressLabel: "20%",
    angle: 1.34,
    radius: 5.9,
    height: 1.55,
    lookRadius: 9.5,
    lookHeight: 1.75,
  },
  {
    id: "events",
    label: "Events & Celebrations",
    progressLabel: "40%",
    angle: 2.74,
    radius: 6.1,
    height: 1.55,
    lookRadius: 9.5,
    lookHeight: 1.75,
  },
  {
    id: "community",
    label: "Community & Sports",
    progressLabel: "60%",
    angle: -2.17,
    radius: 5.9,
    height: 1.55,
    lookRadius: 9.5,
    lookHeight: 1.75,
  },
  {
    id: "media",
    label: "Media & Press",
    progressLabel: "80%",
    angle: -1.14,
    radius: 5.7,
    height: 1.55,
    lookRadius: 9.5,
    lookHeight: 1.75,
  },
  {
    id: "panoramic",
    label: "Panoramic View",
    progressLabel: "100%",
    angle: 0.12,
    radius: 7.5,
    height: 1.95,
    lookRadius: 6.5,
    lookHeight: 1.45,
  },
];
