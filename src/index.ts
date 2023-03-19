#!/usr/bin/env node
import prompts from '@clack/prompts'
import { sleep } from './utils/sleep'
import type { Duration, Period } from './lib/types'

const startTimer = async (
  focusPeriod: Period,
  breakPeriod: Period,
  rounds: number
) => {
  for (let i = 0; i < rounds; i++) {
    console.log(`Starting focus period (${i + 1}/${rounds})...`)
    await runPeriod(
      focusPeriod.duration,
      `Focus (${focusPeriod.duration / 60} minutes)`
    )
    console.log('Focus period ended.')

    console.log(`Starting break period (${i + 1}/${rounds})...`)
    await runPeriod(
      breakPeriod.duration,
      `Break (${breakPeriod.duration / 60} minutes)`
    )
    console.log('Break period ended.')
  }
}

const runPeriod = async (duration: number, periodName: string) => {
  const start = new Date().getTime()
  const end = start + duration * 1000

  while (new Date().getTime() < end) {
    const remaining = end - new Date().getTime()
    const percentComplete = (1 - remaining / (duration * 1000)) * 100
    const progress =
      '[' +
      '#'.repeat(Math.floor(percentComplete / 10)) +
      '-'.repeat(Math.floor((100 - percentComplete) / 10)) +
      ']'

    process.stdout.write(
      `\r${periodName}: ${progress} ${Math.ceil(
        remaining / 1000
      )}s remaining...`
    )
    await sleep(1000)
  }

  process.stdout.write('\n')
}

const durations: Duration[] = [
  { label: '1 minutes', value: 1 },
  { label: '10 minutes', value: 10 },
  { label: '15 minutes', value: 15 },
  { label: '20 minutes', value: 20 },
  { label: '25 minutes', value: 25 },
  { label: '30 minutes', value: 30 },
]

const main = async () => {
  prompts.intro('⏳ Welcome to pomocli!')

  const focusDuration = (await prompts.select({
    message: 'Select focus duration:',
    options: durations,
  })) as number

  const breakDuration = (await prompts.select({
    message: 'Select break duration:',
    options: durations,
  })) as number

  const rounds = await prompts.text({
    message: 'How many rounds do you want to do?',
    initialValue: '4',
    validate: (value) =>
      !value
        ? 'Value is required'
        : isNaN(parseInt(value)) || parseInt(value) <= 0
          ? 'Value must be a positive number'
          : undefined,
  })

  console.clear()

  await startTimer(
    { name: 'Focus', duration: focusDuration * 60 },
    { name: 'Break', duration: breakDuration * 60 },
    Number(rounds)
  )

  prompts.outro("🎉 You've got it!")
}

main().catch(console.error)
