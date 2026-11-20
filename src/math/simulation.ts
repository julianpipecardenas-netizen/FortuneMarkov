export type RandomSource = () => number

export type SimulationResult = {
  attemptsPerSequence: number
  sequenceCount: number
  acquiredSequences: number
  frequency: number
  theoreticalEstimate: number
}

export const simulateReward = (
  probability: number,
  attemptsPerSequence: number,
  sequenceCount: number,
  random: RandomSource = Math.random,
): SimulationResult => {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new RangeError('La probabilidad debe estar entre 0 y 1.')
  }
  if (
    !Number.isInteger(attemptsPerSequence) ||
    attemptsPerSequence < 1 ||
    !Number.isInteger(sequenceCount) ||
    sequenceCount < 1
  ) {
    throw new RangeError('Los controles de simulación deben ser enteros positivos.')
  }

  let acquiredSequences = 0
  for (let sequence = 0; sequence < sequenceCount; sequence += 1) {
    let acquired = false
    for (let attempt = 0; attempt < attemptsPerSequence; attempt += 1) {
      if (random() < probability) {
        acquired = true
        break
      }
    }
    if (acquired) acquiredSequences += 1
  }

  return {
    attemptsPerSequence,
    sequenceCount,
    acquiredSequences,
    frequency: acquiredSequences / sequenceCount,
    theoreticalEstimate: 1 - Math.pow(1 - probability, attemptsPerSequence),
  }
}
