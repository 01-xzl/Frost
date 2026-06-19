import { useState, useRef, useCallback, useEffect } from 'react'

const FOCUS_MINUTES = 25
const BREAK_MINUTES = 5
const STATES = { IDLE: 'idle', RUNNING: 'running', PAUSED: 'paused' }

const workerCode = `
let timerId = null
let endAt = null

self.onmessage = (e) => {
  const { type, duration } = e.data
  if (type === 'start') {
    endAt = Date.now() + duration
    if (timerId) clearInterval(timerId)
    timerId = setInterval(() => {
      const remaining = Math.max(0, endAt - Date.now())
      self.postMessage({ type: 'tick', remaining })
      if (remaining <= 0) {
        clearInterval(timerId)
        timerId = null
        self.postMessage({ type: 'done' })
      }
    }, 200)
  }
  if (type === 'stop') {
    if (timerId) { clearInterval(timerId); timerId = null }
    endAt = null
  }
}
`

function createWorker() {
  const blob = new Blob([workerCode], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

export default function useTimer(onSessionEnd) {
  const [state, setState] = useState(STATES.IDLE)
  const [mode, setMode] = useState('focus')
  const [remaining, setRemaining] = useState(FOCUS_MINUTES * 60_000)
  const [totalDuration, setTotalDuration] = useState(FOCUS_MINUTES * 60_000)
  const workerRef = useRef(null)

  // Refs so worker onmessage always calls latest handlers
  const modeRef = useRef(mode)
  modeRef.current = mode
  const stateRef = useRef(state)
  stateRef.current = state
  const onSessionEndRef = useRef(onSessionEnd)
  onSessionEndRef.current = onSessionEnd

  // Setup worker once on mount — onmessage reads from refs
  useEffect(() => {
    const worker = createWorker()
    worker.onmessage = (e) => {
      const { type, remaining: ms } = e.data
      if (type === 'tick') {
        setRemaining(ms)
      }
      if (type === 'done') {
        const currentMode = modeRef.current
        setState(STATES.IDLE)
        const nextMode = currentMode === 'focus' ? 'break' : 'focus'
        setMode(nextMode)
        setRemaining(nextMode === 'focus' ? FOCUS_MINUTES * 60_000 : BREAK_MINUTES * 60_000)
        setTotalDuration(nextMode === 'focus' ? FOCUS_MINUTES * 60_000 : BREAK_MINUTES * 60_000)
        onSessionEndRef.current?.(currentMode)
      }
    }
    workerRef.current = worker
    return () => {
      worker.terminate()
    }
  }, [])

  const start = useCallback(() => {
    const worker = workerRef.current
    if (!worker) return
    worker.postMessage({ type: 'start', duration: remaining })
    setState(STATES.RUNNING)
  }, [remaining])

  const pause = useCallback(() => {
    workerRef.current?.postMessage({ type: 'stop' })
    setState(STATES.PAUSED)
  }, [])

  const reset = useCallback(() => {
    workerRef.current?.postMessage({ type: 'stop' })
    setState(STATES.IDLE)
    setMode('focus')
    setRemaining(FOCUS_MINUTES * 60_000)
    setTotalDuration(FOCUS_MINUTES * 60_000)
  }, [])

  const skip = useCallback(() => {
    workerRef.current?.postMessage({ type: 'stop' })
    const nextMode = modeRef.current === 'focus' ? 'break' : 'focus'
    setState(STATES.IDLE)
    setMode(nextMode)
    setRemaining(nextMode === 'focus' ? FOCUS_MINUTES * 60_000 : BREAK_MINUTES * 60_000)
    setTotalDuration(nextMode === 'focus' ? FOCUS_MINUTES * 60_000 : BREAK_MINUTES * 60_000)
  }, [])

  const progress = 1 - remaining / (totalDuration || 1)

  return {
    state,
    mode,
    remaining,
    duration: totalDuration,
    progress,
    isRunning: state === STATES.RUNNING,
    isPaused: state === STATES.PAUSED,
    isIdle: state === STATES.IDLE,
    start,
    pause,
    reset,
    skip,
  }
}
