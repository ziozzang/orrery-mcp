export const COORDINATE_STEP = 0.0001

const COORDINATE_DECIMALS = 4
const COORDINATE_SCALE = 10 ** COORDINATE_DECIMALS
const COORDINATE_DRAFT_PATTERN = /^-?(?:\d+)?(?:\.\d*)?$/

export function isCoordinateDraft(value: string): boolean {
  return COORDINATE_DRAFT_PATTERN.test(value)
}

export function parseCoordinateDraft(value: string): number | null {
  if (!isCoordinateDraft(value)) return null
  if (value === '' || value === '-' || value === '.' || value === '-.') return null

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeCoordinate(value: number): number {
  const rounded = Math.round(value * COORDINATE_SCALE) / COORDINATE_SCALE
  return Object.is(rounded, -0) ? 0 : rounded
}

export function formatCoordinate(value: number): string {
  return normalizeCoordinate(value).toFixed(COORDINATE_DECIMALS).replace(/\.?0+$/, '')
}

export function stepCoordinate(value: number, direction: 1 | -1): number {
  return normalizeCoordinate(value + direction * COORDINATE_STEP)
}
