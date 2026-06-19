import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Ambient sound engine using Web Audio API.
 * Generates noise types and filtered natural sounds — zero external files.
 *
 * Sound types:
 *   'white'  — flat spectrum (hiss)
 *   'pink'   — 1/f spectrum (deeper, like waterfall)
 *   'brown'  — 1/f² spectrum (deep rumble)
 *   'rain'   — pink noise + highpass + subtle modulation
 *   'campfire' — brown noise + crackle bursts + low-mid emphasis
 */

const SOUNDS = {
  white: { label: 'White Noise', icon: '⊿' },
  pink:  { label: 'Pink Noise',  icon: '≈' },
  brown: { label: 'Brown Noise', icon: '≋' },
  rain:  { label: 'Rain',       icon: '🌧' },
  fire:  { label: 'Campfire',   icon: '🔥' },
}

function buildNoiseBuffer(ctx, type, duration = 4) {
  const sr = ctx.sampleRate
  const len = sr * duration
  const buf = ctx.createBuffer(1, len, sr)
  const data = buf.getChannelData(0)

  // Pink/brown use accumulators
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  let lastBrown = 0

  for (let i = 0; i < len; i++) {
    let white = Math.random() * 2 - 1
    let sample

    if (type === 'white') {
      sample = white * 0.3
    } else if (type === 'pink') {
      // Paul Kellet's pink noise algorithm
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      sample = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    } else {
      // Brown noise: integrate white noise
      lastBrown = (lastBrown + 0.02 * white) / 1.02
      sample = lastBrown * 1.5
    }

    data[i] = Math.max(-1, Math.min(1, sample))
  }
  return buf
}

export default function useAudio() {
  const [active, setActive] = useState(null) // which sound is playing
  const ctxRef = useRef(null)
  const sourceRef = useRef(null)
  const gainRef = useRef(null)

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop() } catch {}
      sourceRef.current = null
    }
    if (gainRef.current) {
      gainRef.current.disconnect()
      gainRef.current = null
    }
    setActive(null)
  }, [])

  const play = useCallback((type) => {
    const ctx = ensureCtx()
    // Stop current before starting new
    if (sourceRef.current) {
      try { sourceRef.current.stop() } catch {}
      sourceRef.current = null
    }
    if (gainRef.current) {
      gainRef.current.disconnect()
      gainRef.current = null
    }

    // Build source
    let source
    if (type === 'rain') {
      // Rain: pink noise → highpass filter → gentle amp modulation
      const buf = buildNoiseBuffer(ctx, 'pink', 4)
      source = ctx.createBufferSource()
      source.buffer = buf
      source.loop = true

      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 800
      hp.Q.value = 0.5

      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 6000
      lp.Q.value = 0.5

      const gain = ctx.createGain()
      gain.gain.value = 0.25

      // Slow gain wobble for rain texture
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.3
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.08
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)
      lfo.start()

      source.connect(hp)
      hp.connect(lp)
      lp.connect(gain)
      gain.connect(ctx.destination)
      gainRef.current = gain
    } else if (type === 'fire') {
      // Campfire: brown noise → low-mid emphasis + occasional crackle bursts
      const buf = buildNoiseBuffer(ctx, 'brown', 4)
      source = ctx.createBufferSource()
      source.buffer = buf
      source.loop = true

      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 450
      lp.Q.value = 0.7

      // Amp modulation to simulate flicker
      const gain = ctx.createGain()
      gain.gain.value = 0.3

      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.15
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.12
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)
      lfo.start()

      // Crackle: periodic sharper noise bursts
      const crackleBuf = buildNoiseBuffer(ctx, 'white', 1)
      const crackleSrc = ctx.createBufferSource()
      crackleSrc.buffer = crackleBuf
      crackleSrc.loop = true
      const crackleGain = ctx.createGain()
      crackleGain.gain.value = 0.06
      const crackleMod = ctx.createOscillator()
      crackleMod.frequency.value = 2.5
      const crackleModGain = ctx.createGain()
      crackleModGain.gain.value = 0.04
      crackleMod.connect(crackleModGain)
      crackleModGain.connect(crackleGain.gain)
      crackleMod.start()
      crackleSrc.connect(crackleGain)
      crackleGain.connect(ctx.destination)

      source.connect(lp)
      lp.connect(gain)
      gain.connect(ctx.destination)
      gainRef.current = gain
    } else {
      // Pure noise: white/pink/brown
      const buf = buildNoiseBuffer(ctx, type, 4)
      source = ctx.createBufferSource()
      source.buffer = buf
      source.loop = true

      const gain = ctx.createGain()
      gain.gain.value = type === 'brown' ? 0.35 : 0.2
      source.connect(gain)
      gain.connect(ctx.destination)
      gainRef.current = gain
    }

    source.start(0)
    sourceRef.current = source
    setActive(type)
  }, [ensureCtx])

  const toggle = useCallback((type) => {
    if (active === type) {
      stop()
    } else {
      play(type)
    }
  }, [active, play, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try { sourceRef.current.stop() } catch {}
      }
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close().catch(() => {})
      }
    }
  }, [])

  return { active, sounds: SOUNDS, play, stop, toggle }
}
