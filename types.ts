export interface ProductionRecord {
  country: string;
  year: number;
  subcommodity: string;
  quantity: number | null;
  source: 'BGS' | 'USGS';
}

export interface TradeRecord {
  country: string;
  year: number;
  subcommodity: string;
  flow: 'Export' | 'Import';
  quantity: number | null;
  value: number | null; // in 1000 USD
}

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export enum View {
  PRODUCTION = 'Production',
  TRADE = 'Trade',
  MATERIAL_FLOW = 'Material Flow',
}
