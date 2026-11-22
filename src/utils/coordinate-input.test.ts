import { describe, expect, it } from 'vitest'
import {
  COORDINATE_STEP,
  formatCoordinate,
  isCoordinateDraft,
  parseCoordinateDraft,
  stepCoordinate,
} from './coordinate-input.ts'

describe('coordinate input helpers', () => {
  it('accepts partial drafts needed while typing negative decimals', () => {
    expect(isCoordinateDraft('')).toBe(true)
    expect(isCoordinateDraft('-')).toBe(true)
    expect(isCoordinateDraft('.')).toBe(true)
    expect(isCoordinateDraft('-.')).toBe(true)
    expect(isCoordinateDraft('-123.4567')).toBe(true)
  })

  it('rejects malformed drafts', () => {
    expect(isCoordinateDraft('--1')).toBe(false)
    expect(isCoordinateDraft('1-2')).toBe(false)
    expect(isCoordinateDraft('12.3.4')).toBe(false)
    expect(isCoordinateDraft('abc')).toBe(false)
  })

  it('parses complete drafts and keeps partial drafts unresolved', () => {
    expect(parseCoordinateDraft('-')).toBeNull()
    expect(parseCoordinateDraft('-.')).toBeNull()
    expect(parseCoordinateDraft('-123')).toBe(-123)
    expect(parseCoordinateDraft('123.')).toBe(123)
    expect(parseCoordinateDraft('-.5')).toBe(-0.5)
  })

  it('formats values without trailing zeros', () => {
    expect(formatCoordinate(37.5665)).toBe('37.5665')
    expect(formatCoordinate(126.978)).toBe('126.978')
    expect(formatCoordinate(-0.00004)).toBe('0')
  })

  it('steps values in 0.0001 increments without floating-point noise', () => {
    expect(stepCoordinate(126.978, 1)).toBe(126.978 + COORDINATE_STEP)
    expect(stepCoordinate(-0.0001, 1)).toBe(0)
    expect(stepCoordinate(37.5665, -1)).toBe(37.5664)
  })
})
