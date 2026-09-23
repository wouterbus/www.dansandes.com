'use client'

import {useEffect, useState} from 'react'
import {getSplashHasFinished, onSplashFinished} from './splash'

export function useSplashComplete(): boolean {
  const [splashComplete, setSplashComplete] = useState(
    () => typeof window !== 'undefined' && getSplashHasFinished(),
  )

  useEffect(() => {
    if (getSplashHasFinished()) {
      setSplashComplete(true)
      return
    }

    return onSplashFinished(() => setSplashComplete(true))
  }, [])

  return splashComplete
}
