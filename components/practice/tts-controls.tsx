"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Volume2, VolumeX, Settings, Play, Pause, Square } from "lucide-react"

interface TTSControlsProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
  isSpeaking: boolean
  onSpeak: () => void
  onStop: () => void
  onPause: () => void
  onResume: () => void
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void
  rate: number
  onRateChange: (rate: number) => void
  pitch: number
  onPitchChange: (pitch: number) => void
  volume: number
  onVolumeChange: (volume: number) => void
}

export function TTSControls({
  isEnabled,
  onToggle,
  isSpeaking,
  onSpeak,
  onStop,
  onPause,
  onResume,
  voices,
  selectedVoice,
  onVoiceChange,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
  volume,
  onVolumeChange,
}: TTSControlsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      {/* TTS Toggle */}
      <div className="flex items-center gap-2">
        <Switch id="tts-enabled" checked={isEnabled} onCheckedChange={onToggle} />
        <Label htmlFor="tts-enabled" className="sr-only">
          Enable Text-to-Speech
        </Label>
        {isEnabled ? (
          <Volume2 className="w-4 h-4 text-primary" />
        ) : (
          <VolumeX className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {isEnabled && (
        <>
          {/* Playback Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onSpeak} disabled={isSpeaking}>
              <Play className="w-4 h-4" />
            </Button>

            {isSpeaking && (
              <>
                <Button variant="ghost" size="sm" onClick={onPause}>
                  <Pause className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onStop}>
                  <Square className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Settings */}
          <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium">Speech Settings</h4>

                  {/* Voice Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm">Voice</Label>
                    <Select
                      value={selectedVoice?.name || ""}
                      onValueChange={(value) => {
                        const voice = voices.find((v) => v.name === value) || null
                        onVoiceChange(voice)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices
                          .filter((voice) => voice.lang.startsWith("en"))
                          .map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rate */}
                  <div className="space-y-2">
                    <Label className="text-sm">Speed: {rate.toFixed(1)}x</Label>
                    <Slider
                      value={[rate]}
                      onValueChange={([value]) => onRateChange(value)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Pitch */}
                  <div className="space-y-2">
                    <Label className="text-sm">Pitch: {pitch.toFixed(1)}</Label>
                    <Slider
                      value={[pitch]}
                      onValueChange={([value]) => onPitchChange(value)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Volume */}
                  <div className="space-y-2">
                    <Label className="text-sm">Volume: {Math.round(volume * 100)}%</Label>
                    <Slider
                      value={[volume]}
                      onValueChange={([value]) => onVolumeChange(value)}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  )
}
