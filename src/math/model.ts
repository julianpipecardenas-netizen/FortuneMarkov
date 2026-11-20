export type Matrix2 = [[number, number], [number, number]]
export type Distribution = [number, number]

export const cumulativeEstimate = (probability: number, attempts: number) => {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new RangeError('La probabilidad debe estar entre 0 y 1.')
  }
  if (!Number.isInteger(attempts) || attempts < 0) {
    throw new RangeError('Los intentos deben ser un entero no negativo.')
  }
  return 1 - Math.pow(1 - probability, attempts)
}

export const twoStateMatrix = (probability: number): Matrix2 => {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new RangeError('La probabilidad debe estar entre 0 y 1.')
  }
  return [[1 - probability, probability], [0, 1]]
}

export const multiplyMatrix = (a: Matrix2, b: Matrix2): Matrix2 => [
  [
    a[0][0] * b[0][0] + a[0][1] * b[1][0],
    a[0][0] * b[0][1] + a[0][1] * b[1][1],
  ],
  [
    a[1][0] * b[0][0] + a[1][1] * b[1][0],
    a[1][0] * b[0][1] + a[1][1] * b[1][1],
  ],
]

export const matrixPower = (matrix: Matrix2, exponent: number): Matrix2 => {
  if (!Number.isInteger(exponent) || exponent < 0) {
    throw new RangeError('El exponente debe ser un entero no negativo.')
  }
  let result: Matrix2 = [[1, 0], [0, 1]]
  let base = matrix
  let n = exponent
  while (n > 0) {
    if (n % 2 === 1) result = multiplyMatrix(result, base)
    base = multiplyMatrix(base, base)
    n = Math.floor(n / 2)
  }
  return result
}

export const distributionAfterSteps = (
  probability: number,
  steps: number,
): Distribution => {
  const power = matrixPower(twoStateMatrix(probability), steps)
  const initial: Distribution = [1, 0]
  return [
    initial[0] * power[0][0] + initial[1] * power[1][0],
    initial[0] * power[0][1] + initial[1] * power[1][1],
  ]
}
