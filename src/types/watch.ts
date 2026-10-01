export interface WatchConfig {
  caseFinish: 'raw-titanium' | 'monolithic-dlc';
  strap: 'vulcanized-rubber' | 'stitched-suede' | 'titanium-mesh';
  engraving: string;
}

export interface SpecificationItem {
  label: string;
  value: string;
  metric?: string;
  notes?: string;
}

export type ViewAngle = 'dial' | 'profile' | 'movement';
