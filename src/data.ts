// one row per country: students enrolled in the course's first cohort (countries with 3 or more)
export type Region =
  | "Europe"
  | "North America"
  | "Asia"
  | "Oceania"
  | "Latin America";

export type Country = {
  country: string;
  region: Region;
  students: number;
};

// fixed legend order, most students first; color is assigned by this order and never cycled
export const regions: Region[] = [
  "Europe",
  "North America",
  "Asia",
  "Oceania",
  "Latin America",
];

export const data: Country[] = [
  { country: "United States", region: "North America", students: 68 },
  { country: "France", region: "Europe", students: 21 },
  { country: "United Kingdom", region: "Europe", students: 21 },
  { country: "Germany", region: "Europe", students: 20 },
  { country: "Switzerland", region: "Europe", students: 13 },
  { country: "Spain", region: "Europe", students: 10 },
  { country: "Netherlands", region: "Europe", students: 9 },
  { country: "India", region: "Asia", students: 9 },
  { country: "Singapore", region: "Asia", students: 8 },
  { country: "Ireland", region: "Europe", students: 8 },
  { country: "Sweden", region: "Europe", students: 7 },
  { country: "Australia", region: "Oceania", students: 7 },
  { country: "Canada", region: "North America", students: 6 },
  { country: "Finland", region: "Europe", students: 5 },
  { country: "Mexico", region: "Latin America", students: 4 },
  { country: "Brazil", region: "Latin America", students: 4 },
  { country: "Saudi Arabia", region: "Asia", students: 3 },
  { country: "Romania", region: "Europe", students: 3 },
  { country: "Philippines", region: "Asia", students: 3 },
  { country: "New Zealand", region: "Oceania", students: 3 },
];
