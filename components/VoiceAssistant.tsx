
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, Tool } from "@google/genai";
import { Mic, X, Loader, Volume2, Globe, Sparkles, Lightbulb, Thermometer, CheckCircle, Navigation } from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { Tab } from '../types';

interface VoiceAssistantProps {
  onClose: () => void;
  onNavigate: (tab: Tab) => void;
}

// --- TOOL DEFINITIONS ---
const controlRoomFunction: FunctionDeclaration = {
  name: 'controlRoom',
  description: 'Control room settings like lights, temperature, or curtains.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      device: { type: Type.STRING, description: 'The device to control: "lights", "ac", "curtains"' },
      action: { type: Type.STRING, description: 'The action: "on", "off", "set", "open", "close"' },
      value: { type: Type.NUMBER, description: 'Value for temperature if applicable' }
    },
    required: ['device', 'action']
  }
};

const getHotelInfoFunction: FunctionDeclaration = {
  name: 'getHotelInfo',
  description: 'Get information about hotel amenities or status.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: { type: Type.STRING, description: 'What info is needed: "wifi", "pool_hours", "checkout_time"' }
    },
    required: ['query']
  }
};

const navigateAppFunction: FunctionDeclaration = {
    name: 'navigateApp',
    description: 'Navigate the user to a specific section of the app (Dashboard, Dining, Activities, etc).',
    parameters: {
        type: Type.OBJECT,
        properties: {
            tab: { type: Type.STRING, description: 'The tab to navigate to. Options: "DASHBOARD", "DINING", "ACTIVITIES", "CLEANING", "CONCIERGE", "RECEPTION"' }
        },
        required: ['tab']
    }
};

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose, onNavigate }) => {
  const { menuItems, activities, bookings, deviceRoomNumber } = useSystem();
  
  const [status, setStatus] = useState<'CONNECTING' | 'LISTENING' | 'SPEAKING' | 'ERROR'>('CONNECTING');
  const [volume, setVolume] = useState(0); 
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const [errorMsg, setErrorMsg] = useState('');
  
  // New States for "Wow" Effect
  const [transcription, setTranscription] = useState<{user: string, ai: string}>({ user: '', ai: '' });
  const [activeAction, setActiveAction] = useState<{icon: any, label: string} | null>(null);

  // --- AUDIO HELPERS ---
  function base64ToUint8Array(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // --- MOCK FUNCTION HANDLERS ---
  const handleToolCall = (fc: any): any => {
      console.log("Tool Call Triggered:", fc.name, fc.args);
      
      if (fc.name === 'navigateApp') {
          const { tab } = fc.args;
          // Trigger Navigation
          onNavigate(tab as Tab);
          
          setActiveAction({ icon: Navigation, label: `Navigating to ${tab}` });
          setTimeout(() => setActiveAction(null), 3000);
          
          return { result: `Navigated user to ${tab} screen successfully.` };
      }

      if (fc.name === 'controlRoom') {
          const { device, action, value } = fc.args;
          // Visual Feedback
          if (device === 'lights') setActiveAction({ icon: Lightbulb, label: `${action === 'on' ? 'Turning On' : 'Turning Off'} Lights` });
          if (device === 'ac') setActiveAction({ icon: Thermometer, label: `Setting Temp to ${value || 22}°` });
          
          // Clear action after delay
          setTimeout(() => setActiveAction(null), 3000);
          return { result: "ok, device updated" };
      }

      if (fc.name === 'getHotelInfo') {
          const { query } = fc.args;
          if (query === 'wifi') return { result: "Wifi: Nomada_Guest, Pass: luxury2024" };
          if (query === 'pool_hours') return { result: "Pool open 6am to 10pm" };
          return { result: "Info retrieved" };
      }
      
      return { result: "unknown tool" };
  }

  // --- CONNECT & STREAM ---
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let isMounted = true;

    // Build Dynamic Context
    const activeBooking = bookings.find(b => b.roomNumber === deviceRoomNumber && b.status === 'CHECKED_IN');
    const guestName = activeBooking ? activeBooking.guest.fullName : "Guest";
    const menuContext = menuItems.slice(0, 15).map(i => `${i.title} (${i.price})`).join(', ');
    const activityContext = activities.slice(0, 5).map(a => `${a.title} ($${a.price})`).join(', ');

    const startSession = async () => {
      try {
        if (!process.env.API_KEY) throw new Error("API_KEY is missing");

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isMounted) return;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass({ sampleRate: 24000 });
        await ctx.resume();
        audioContextRef.current = ctx;
        
        const inputCtx = new AudioContextClass({ sampleRate: 16000 });
        await inputCtx.resume();
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
            // Enable Transcriptions
            inputAudioTranscription: {}, 
            outputAudioTranscription: {},
            
            // Add Tools
            tools: [{ functionDeclarations: [controlRoomFunction, getHotelInfoFunction, navigateAppFunction] }],
            
            systemInstruction: `You are the "Nomada Live Guide".
            
            CONTEXT:
            - User: ${guestName} staying in Room ${deviceRoomNumber}.
            - Location: Tangier, Morocco.
            - Current Menu: ${menuContext}.
            - Available Activities: ${activityContext}.

            CAPABILITIES:
            1. NAVIGATION: If the user asks to see the menu, go to the spa, or open activities, USE the "navigateApp" tool.
               - Dining/Food -> navigateApp(tab: "DINING")
               - Activities/Tours -> navigateApp(tab: "ACTIVITIES")
               - Cleaning/Housekeeping -> navigateApp(tab: "CLEANING")
               - Concierge/Chat -> navigateApp(tab: "CONCIERGE")
               - Reception/Bill -> navigateApp(tab: "RECEPTION")
            
            2. ROOM CONTROL: If user says "Turn on lights", CALL "controlRoom".
            
            3. INFO: If user asks for Wifi, CALL "getHotelInfo".

            BEHAVIOR:
            - Be sophisticated, concise, and helpful.
            - If you use a tool to navigate, tell the user "I'm taking you there now" or "Here is the menu".
            `,
          },
          callbacks: {
            onopen: () => {
              if (!isMounted) return;
              setStatus('LISTENING');
              
              const source = inputCtx.createMediaStreamSource(stream);
              const processor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
                if (!isMounted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Volume Meter
                let sum = 0;
                for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(Math.min(rms * 10, 1));

                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    let s = Math.max(-1, Math.min(1, inputData[i]));
                    pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                const base64Audio = arrayBufferToBase64(pcmData.buffer);
                
                sessionPromise.then(session => {
                    session.sendRealtimeInput({
                        media: { mimeType: 'audio/pcm;rate=16000', data: base64Audio }
                    });
                }).catch(e => console.error(e));
              };

              source.connect(processor);
              processor.connect(inputCtx.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
              if (!isMounted) return;
              
              // 1. Handle Tool Calls (The "Brain")
              if (msg.toolCall) {
                  const functionResponses = msg.toolCall.functionCalls.map(fc => {
                      const result = handleToolCall(fc);
                      return {
                          id: fc.id,
                          name: fc.name,
                          response: result
                      };
                  });
                  
                  sessionPromise.then(session => {
                      session.sendToolResponse({ functionResponses });
                  });
              }

              // 2. Handle Transcriptions (The "Subtitles")
              if (msg.serverContent?.inputTranscription) {
                 setTranscription(prev => ({ ...prev, user: msg.serverContent?.inputTranscription?.text || '' }));
              }
              if (msg.serverContent?.outputTranscription) {
                 // Append to existing AI text for smoother flow or replace
                 setTranscription(prev => ({ ...prev, ai: prev.ai + (msg.serverContent?.outputTranscription?.text || '') }));
              }
              
              if (msg.serverContent?.turnComplete) {
                  // Optional: Clear AI text on turn complete or keep it until next turn
                  // setTranscription(prev => ({ ...prev, ai: '' })); 
              }

              // 3. Handle Audio (The "Voice")
              const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audioData) {
                setStatus('SPEAKING');
                const pcmBytes = base64ToUint8Array(audioData);
                const float32Data = new Float32Array(pcmBytes.length / 2);
                const dataView = new DataView(pcmBytes.buffer);
                for (let i = 0; i < float32Data.length; i++) {
                    const int16 = dataView.getInt16(i * 2, true);
                    float32Data[i] = int16 / 32768.0;
                }

                const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
                audioBuffer.copyToChannel(float32Data, 0);

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                
                const currentTime = ctx.currentTime;
                if (nextStartTimeRef.current < currentTime) nextStartTimeRef.current = currentTime;
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                
                sourcesRef.current.add(source);
                source.onended = () => {
                    sourcesRef.current.delete(source);
                    if (sourcesRef.current.size === 0) setStatus('LISTENING');
                };
              }
              
              if (msg.serverContent?.interrupted) {
                  sourcesRef.current.forEach(s => s.stop());
                  sourcesRef.current.clear();
                  nextStartTimeRef.current = 0;
                  setTranscription({ user: '', ai: '' }); // Clear text on interrupt
                  setStatus('LISTENING');
              }
            },
            onclose: () => console.log("Session closed"),
            onerror: (e) => {
                console.error("Session Error", e);
                setStatus('ERROR');
                setErrorMsg('Connection error.');
            }
          }
        });
        
        cleanup = () => {
            isMounted = false;
            sessionPromise.then(s => s.close()).catch(() => {});
            stream.getTracks().forEach(t => t.stop());
            inputCtx.close();
            ctx.close();
        };

      } catch (err: any) {
        if (isMounted) {
            setStatus('ERROR');
            setErrorMsg(err.message || 'Connection failed.');
        }
      }
    };

    startSession();
    return () => { if (cleanup) cleanup(); };
  }, [menuItems, activities, bookings, deviceRoomNumber]); // Dependencies to rebuild context if critical data changes

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in">
        
        <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
        >
            <X size={32} />
        </button>

        <div className="flex flex-col items-center justify-center w-full max-w-2xl p-8">
            
            {/* Status & Branding */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <Sparkles size={16} className="text-gold-400" />
                    <span className="text-white font-serif text-lg tracking-wide">Nomada Live Guide</span>
                    <Sparkles size={16} className="text-gold-400" />
                </div>
                <h2 className="text-gold-400 font-bold uppercase tracking-[0.3em] text-sm animate-pulse">
                    {status === 'CONNECTING' && 'Connecting...'}
                    {status === 'LISTENING' && 'Listening...'}
                    {status === 'SPEAKING' && 'Speaking...'}
                    {status === 'ERROR' && 'Offline'}
                </h2>
            </div>

            {/* Visualizer Orb */}
            <div className="relative flex items-center justify-center mb-10 h-48 w-48">
                {/* Action Feedback Overlay (Wow Effect) */}
                {activeAction && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full animate-fade-in-up">
                        <div className="text-center">
                            <activeAction.icon size={32} className="text-gold-400 mx-auto mb-1" />
                            <span className="text-[10px] font-bold uppercase text-white tracking-widest">{activeAction.label}</span>
                        </div>
                    </div>
                )}

                {/* Core Orb */}
                <div 
                    className={`w-32 h-32 rounded-full transition-all duration-100 z-10 flex items-center justify-center border-2
                        ${status === 'ERROR' ? 'bg-red-500/20 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]' : ''}
                        ${status === 'CONNECTING' ? 'bg-gray-800 border-gray-600 animate-pulse' : ''}
                        ${status === 'LISTENING' ? 'bg-gradient-to-br from-blue-900/80 to-teal-900/80 border-teal-400 shadow-[0_0_60px_rgba(45,212,191,0.4)]' : ''}
                        ${status === 'SPEAKING' ? 'bg-gradient-to-br from-gold-500/80 to-orange-900/80 border-gold-400 shadow-[0_0_80px_rgba(251,191,36,0.6)]' : ''}
                    `}
                    style={{
                        transform: `scale(${1 + (volume * 0.8)})` 
                    }}
                >
                    {status === 'CONNECTING' && <Loader className="animate-spin text-white" size={24} />}
                    {status === 'LISTENING' && <Mic className="text-white drop-shadow-md" size={32} />}
                    {status === 'SPEAKING' && <Volume2 className="text-white drop-shadow-md" size={32} />}
                    {status === 'ERROR' && <X className="text-white" size={32} />}
                </div>

                {/* Ambient Rings */}
                <div className={`absolute inset-0 rounded-full border border-gold-400/20 scale-125 ${status === 'SPEAKING' ? 'animate-ping opacity-30' : 'opacity-0'}`} />
                <div className={`absolute inset-0 rounded-full border border-teal-400/20 scale-150 ${status === 'LISTENING' ? 'animate-pulse opacity-30' : 'opacity-0'}`} />
            </div>

            {/* --- LIVE TRANSCRIPTION (SUBTITLES) --- */}
            <div className="w-full min-h-[100px] flex flex-col justify-end space-y-4">
                
                {/* User Speech */}
                {transcription.user && (
                    <div className="flex justify-end animate-fade-in-up">
                        <p className="text-right text-gray-400 text-lg font-light leading-tight max-w-[80%]">
                            "{transcription.user}"
                        </p>
                    </div>
                )}

                {/* AI Speech */}
                {transcription.ai && (
                    <div className="flex justify-start animate-fade-in-up">
                        <p className="text-left text-white text-xl font-serif italic leading-tight max-w-[90%]">
                            {transcription.ai}
                        </p>
                    </div>
                )}

                {/* Default Hint */}
                {!transcription.user && !transcription.ai && status !== 'ERROR' && (
                    <div className="text-center opacity-50 animate-pulse">
                        <p className="text-sm text-gray-500 uppercase tracking-widest">Try saying...</p>
                        <p className="text-white font-serif text-lg mt-1">"Take me to dining" or "Show me the spa"</p>
                    </div>
                )}

                {status === 'ERROR' && (
                     <p className="text-red-400 font-bold text-center">{errorMsg || "Connection failed."}</p>
                )}
            </div>

            <div className="flex justify-center gap-2 mt-8">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1 border border-white/5">
                    <Globe size={10} /> Auto-Translate
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1 border border-white/5">
                    <Lightbulb size={10} /> Room Control
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1 border border-white/5">
                    <Navigation size={10} /> App Navigation
                </span>
            </div>

        </div>
    </div>
  );
};

export default VoiceAssistant;
