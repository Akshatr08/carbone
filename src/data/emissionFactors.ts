/**
 * Emission factors in kgCO2e per unit.
 * Sources: IPCC AR6, India CEA grid factor 2023, DEFRA 2023.
 */

export const TRANSPORT_FACTORS = {
  car_petrol: 0.192,
  car_diesel: 0.171,
  car_electric: 0.054,
  flight_short: 0.255,
  flight_long: 0.195,
  metro: 0.031,
  bus: 0.089,
  bike: 0,
  walk: 0,
} as const;

export const ENERGY_FACTORS = {
  electricity: 0.82, // per kWh — India CEA grid factor
  lpg: 2.98, // per kg
  natural_gas: 2.04, // per m³
} as const;

export const FOOD_FACTORS = {
  meat_heavy: 7.19,
  mixed: 4.67,
  vegetarian: 3.81,
  vegan: 2.89,
} as const;

export const SHOPPING_FACTORS = {
  clothing: 0.034, // per ₹1000
  electronics: 0.045,
  general: 0.012,
} as const;

export const FREQUENCY_MULTIPLIER = {
  daily: 30,
  weekly: 4.33,
  monthly: 1,
} as const;

export const BENCHMARKS = {
  indiaMonthly: 158, // 1.9 t/yr ÷ 12
  globalMonthly: 392, // 4.7 t/yr ÷ 12
  parisMonthly: 167, // 2.0 t/yr ÷ 12
} as const;

export type TransportMode = keyof typeof TRANSPORT_FACTORS;
export type EnergyType = keyof typeof ENERGY_FACTORS;
export type DietType = keyof typeof FOOD_FACTORS;
export type ShoppingCategory = keyof typeof SHOPPING_FACTORS;
export type Frequency = keyof typeof FREQUENCY_MULTIPLIER;
