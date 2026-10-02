export interface WatchGallery {
  front: string;
  side: string;
  back: string;
  movement: string;
  detail: string;
  lifestyle?: string;
}

export interface WatchTechnicalSpecs {
  reference: string;
  caseMaterial: string;
  diameter: string;
  thickness: string;
  movement: string;
  frequency: string;
  jewels: string;
  powerReserve: string;
  waterResistance: string;
  crystal: string;
  strap: string;
  clasp: string;
  finishing: string;
}

export interface Watch {
  id: string;
  name: string;
  subtitle: string;
  collection: string;
  tagline: string;
  description: string;
  priceFormatted: string;
  priceCHF: string;
  heroImage: string;
  movementImage: string;
  galleryImages: WatchGallery;
  specs: WatchTechnicalSpecs;
  chapterHighlights: {
    number: string;
    title: string;
    subtitle: string;
    detail: string;
  }[];
}
