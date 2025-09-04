"use client"

import { useState, useEffect, useCallback } from "react"

interface UseTTSOptions {
  enabled: boolean
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice | null
}

export function useTextToSpeech(options: UseTTSOptions = { enabled: false }) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()
      speechSynthesis.addEventListener("voiceschanged", loadVoices)

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      }
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !options.enabled || !text.trim()) return

      // Cancel any ongoing speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Set voice properties
      utterance.rate = options.rate || 1
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1

      if (options.voice) {
        utterance.voice = options.voice
      } else {
        // Try to find a good default voice (prefer English)
        const englishVoice =
          voices.find((voice) => voice.lang.startsWith("en") && voice.default) ||
          voices.find((voice) => voice.lang.startsWith("en"))

        if (englishVoice) {
          utterance.voice = englishVoice
        }
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        setCurrentUtterance(null)
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        setCurrentUtterance(null)
      }

      setCurrentUtterance(utterance)
      speechSynthesis.speak(utterance)
    },
    [isSupported, options, voices],
  )

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentUtterance(null)
    }
  }, [isSupported])

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause()
    }
  }, [isSupported, isSpeaking])

  const resume = useCallback(() => {
    if (isSupported) {
      speechSynthesis.resume()
    }
  }, [isSupported])

  return {
    isSupported,
    isSpeaking,
    voices,
    speak,
    stop,
    pause,
    resume,
  }
}
