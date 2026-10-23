export interface ChartEntry {
  name: string | number,
  [k: string]: string | number,
}

export interface ChartAnnotation {
  value: number,
  label: string
}
