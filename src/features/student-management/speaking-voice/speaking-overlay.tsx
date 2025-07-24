'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { generateQuestion } from '@/services/generate-question';
import { makeAnswerMoreCorrectfully } from '@/services/make-answer-more-correctfully';
import { gradeAnswer } from '@/services/grade-answer';
import { useCreateSpeakingScoreMutation } from './api.speaking';
import { toast } from 'sonner';

interface SpeakingOverlayProps {
  onClose: () => void;
}

type SpeakingPhase = 'initial' | 'speaking' | 'readyToRecord' | 'recording' | 'result';

const COUNTDOWN_DURATION = 30; // seconds
const MAX_RETRIES = 2;

export function SpeakingOverlay({ onClose }: SpeakingOverlayProps) {
  const [phase, setPhase] = useState<SpeakingPhase>('initial');
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [retriesLeft, setRetriesLeft] = useState(MAX_RETRIES);
  const [recordedText, setRecordedText] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [loadingAIGeneratedText, setLoadingAIGeneratedText] = useState(false);
  const [loadingGradedText, setLoadingGradedText] = useState(false);
  const [target_text, setTargetText] = useState('');

  const [createSpeakingScore] = useCreateSpeakingScoreMutation();

  console.log('target_text :>> ', target_text);

  useEffect(() => {
    const fetchingTargetText = async () => {
      setLoadingAIGeneratedText(true);
      const question = await generateQuestion();
      setTargetText(question);
      setLoadingAIGeneratedText(false);
    };
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices(); // Gọi luôn 1 lần khi mount
    }
    fetchingTargetText();
  }, []);

  const handleDone = async () => {
    const toastId = toast.loading('Grading your speech...');
    try {
      setLoadingGradedText(true);
      const res = await makeAnswerMoreCorrectfully(target_text, recordedText ?? '');
      const result = await gradeAnswer(target_text, res);
      console.log('res :>> ', result);
      await createSpeakingScore({
        question: target_text,
        answer: recordedText ?? '',
        score: Number(result),
      }).unwrap();
      toast.success('Your speech has been graded successfully!', {
        id: toastId,
      });
      onClose();
    } catch {
      toast.error('Failed to grade your speech. Please try again.', {
        id: toastId,
      });
    } finally {
      setLoadingGradedText(false);
    }
  };

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = useCallback((duration: number, onComplete: () => void) => {
    setCountdown(duration);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const speakText = useCallback(() => {
    if (!target_text) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(target_text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance error:', event);
        setIsSpeaking(false);
      };

      const selectedVoice =
        voices.find(
          (v) => v.lang === 'en-US' && v.name.includes('Microsoft Zira - English (United States)'),
        ) || voices[0];

      if (selectedVoice) {
        console.log('selectedVoice :>> ', selectedVoice);
        utterance.voice = selectedVoice;
      } else {
        console.warn('No matching voice found. Using default.');
      }
      window.speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
    } else {
      console.warn('Web Speech API (SpeechSynthesis) not supported in this browser.');
      setIsSpeaking(false);
      setPhase('readyToRecord');
    }
  }, [target_text]);

  const startSpeakingPhase = useCallback(() => {
    if (!target_text) return;
    setPhase('speaking');
    speakText();
    startCountdown(COUNTDOWN_DURATION, () => {
      setPhase('readyToRecord');
    });
  }, [speakText, startCountdown, target_text]);

  const startRecording = useCallback(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.continuous = true;

      recognition.onstart = () => {
        setRecordedText(null);
        setPhase('recording');
        startCountdown(COUNTDOWN_DURATION, () => {
          recognition.stop();
        });
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setRecordedText(transcript);
      };

      recognition.onerror = (event) => {
        console.error('SpeechRecognition error:', event.error);
        setPhase('result'); // Move to result phase even on error
        setRecordedText('Error during recording or no speech detected.');
      };

      recognition.onend = () => {
        setPhase('result');
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      console.warn('Web Speech API (SpeechRecognition) not supported in this browser.');
      setPhase('result');
      setRecordedText('Speech recording not supported in your browser.');
    }
  }, [startCountdown]);

  const skipSpeakingPhase = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (utteranceRef.current && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setPhase('readyToRecord');
    setCountdown(0); // Reset countdown for visual consistency
  }, []);

  const handleRetry = useCallback(() => {
    if (retriesLeft > 0) {
      setRetriesLeft((prev) => prev - 1);
      setRecordedText(null);
      setPhase('initial'); // Go back to initial to allow re-listening
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (utteranceRef.current && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [retriesLeft]);

  useEffect(() => {
    if (!target_text) return;
    // Cleanup on unmount
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (utteranceRef.current && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [target_text]);

  const renderContent = () => {
    switch (phase) {
      case 'initial':
        return (
          <Button
            onClick={startSpeakingPhase}
            className="w-48 h-48 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          >
            {loadingAIGeneratedText ? 'Loading...' : 'Start'}
          </Button>
        );
      case 'speaking':
        return (
          <div className="flex flex-col items-center gap-8">
            <div className="text-6xl font-bold text-blue-600">{countdown}</div>
            {/* <p className="text-2xl text-gray-700 text-center max-w-2xl px-4">{target_text}</p> */}
            <div className="flex items-center gap-2 text-gray-500">
              <Volume2 className="w-6 h-6" />
              <span>Listening...</span>
            </div>
            <Progress
              value={(countdown / COUNTDOWN_DURATION) * 100}
              className="w-3/4 max-w-md h-2 bg-blue-200"
            />
            <Button
              onClick={skipSpeakingPhase}
              disabled={isSpeaking} // Disable if text is still being spoken
              className="mt-4 px-8 py-4 text-lg flex items-center gap-2"
            >
              Reply Now
            </Button>
          </div>
        );
      case 'readyToRecord':
        return (
          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-4">
              <Button
                onClick={handleRetry}
                disabled={retriesLeft === 0}
                className="px-8 py-4 text-lg bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retry ({retriesLeft})
              </Button>
              <Button
                onClick={startRecording}
                className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </Button>
            </div>
          </div>
        );
      case 'recording':
        return (
          <div className="flex flex-col items-center gap-8">
            <div className="text-6xl font-bold text-green-600">{countdown}</div>
            <p className="text-2xl text-gray-700 text-center max-w-2xl px-4">Speak now...</p>
            <div className="flex items-center gap-2 text-gray-500">
              <Mic className="w-6 h-6 animate-pulse" />
              <span>Recording...</span>
            </div>
            <Progress
              value={(countdown / COUNTDOWN_DURATION) * 100}
              className="w-3/4 max-w-md h-2 bg-green-200"
            />
            <Button
              onClick={() => {
                if (recognitionRef.current) {
                  recognitionRef.current.stop();
                  setPhase('result');
                }
              }}
              className="mt-4 px-8 py-4 text-lg bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center gap-2"
            >
              Stop Recording
            </Button>
          </div>
        );
      case 'result':
        return (
          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-4">
              <Button
                onClick={handleRetry}
                disabled={retriesLeft === 0}
                className="px-8 py-4 text-lg bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retry ({retriesLeft})
              </Button>
              <Button
                onClick={handleDone}
                isLoading={loadingGradedText}
                className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                Done
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-white text-gray-900">
      {renderContent()}
      <p className="absolute bottom-4 text-sm text-gray-400">
        Note: This feature uses Web Speech API, which may require microphone permission and internet
        connection. Browser support may vary.
      </p>
    </div>
  );
}
