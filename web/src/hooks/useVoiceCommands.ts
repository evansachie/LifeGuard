import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useBLE } from '../contexts/BLEContext';
import { useEmergencyContacts } from './useEmergencyContacts';
import { API_ENDPOINTS } from '../utils/api';

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

// Type assertions for speech recognition
const getSpeechRecognition = (): (new () => SpeechRecognitionType) | null => {
  return (
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionType })
      .SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionType })
      .webkitSpeechRecognition ||
    null
  );
};

export interface VoiceCommand {
  id: string;
  keywords: string[];
  action: () => void;
  description: string;
  category: 'emergency' | 'health' | 'navigation' | 'device' | 'general';
}

interface VoiceCommandsResult {
  isListening: boolean;
  isSupported: boolean;
  lastCommand: string | null;
  toggleListening: () => void;
  stopListening: () => void;
  registerCommand: (command: VoiceCommand) => void;
  unregisterCommand: (commandId: string) => void;
  getAvailableCommands: () => VoiceCommand[];
}

export function useVoiceCommands(): VoiceCommandsResult {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [commands, setCommands] = useState<Map<string, VoiceCommand>>(new Map());
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);
  const [lastExecutionTime, setLastExecutionTime] = useState<number>(0);

  const speechRecognitionRef = useRef<SpeechRecognitionType | null>(null);
  const navigate = useNavigate();
  const { bleDevice, connectToDevice, disconnectDevice } = useBLE();
  const { sendEmergencyAlert } = useEmergencyContacts();

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionConstructor = getSpeechRecognition();
    if (SpeechRecognitionConstructor) {
      speechRecognitionRef.current = new SpeechRecognitionConstructor();
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.continuous = true;
        speechRecognitionRef.current.interimResults = true;
        speechRecognitionRef.current.lang = 'en-US';

        speechRecognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[event.results.length - 1][0].transcript
            .toLowerCase()
            .trim();

          if (event.results[event.results.length - 1].isFinal) {
            console.log('Voice command detected:', transcript);
            setLastCommand(transcript);
          }
        };

        speechRecognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          if (event.error !== 'no-speech') {
            toast.error(`Voice recognition error: ${event.error}`);
          }
          setIsListening(false);
        };

        speechRecognitionRef.current.onend = () => {
          setIsListening(false);
        };

        setIsSupported(true);
      }
    }
  }, []);

  // Emergency command handler
  const handleEmergencyCommand = useCallback(async (transcript?: string) => {
    try {
      let location = 'Location not available';
      try {
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos),
              (error) => reject(error),
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
              }
            );
          });
          const { latitude, longitude } = position.coords;
          location = `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
        }
      } catch (geoError) {
        console.warn('Could not get location for emergency:', geoError);
      }

      // Send voice command to backend for processing
      const response = await fetch(API_ENDPOINTS.VOICE_COMMANDS.EMERGENCY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          command: transcript || 'emergency',
          location: location,
          medicalInfo: 'Voice-activated emergency alert',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Emergency alert processed successfully');
        console.log('Emergency command result:', result);
      } else {
        throw new Error('Failed to process emergency command');
      }
    } catch (error) {
      console.error('Error handling emergency command:', error);
      toast.error('Failed to process emergency command');
    }
  }, []);

  // Health status command handler
  const handleHealthCommand = useCallback(
    (transcript?: string) => {
      if (window.location.pathname === '/dashboard') {
        return;
      }

      if (!transcript || transcript.includes('status') || transcript.includes('vitals')) {
        navigate('/dashboard');
      }
    },
    [navigate]
  );

  // Medication command handler
  const handleMedicationCommand = useCallback(() => {
    if (window.location.pathname === '/medications') {
      return;
    }

    navigate('/medications');
  }, [navigate]);

  // Location command handler
  const handleLocationCommand = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = `Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          toast.info(location);

          // Copy to clipboard
          navigator.clipboard.writeText(location);
        },
        () => {
          toast.error('Unable to get location');
        }
      );
    } else {
      toast.error('Location services not available');
    }
  }, []);

  // Execute actions from backend
  const executeBackendAction = useCallback(
    async (action: string | { type: string; [key: string]: unknown }) => {
      try {
        let actionType: string;
        let actionData: Record<string, unknown> = {};

        if (typeof action === 'string') {
          actionType = action;
        } else {
          actionType = action.type;
          actionData = action;
        }

        console.log('Executing action:', actionType, actionData);

        switch (actionType) {
          case 'send_alert':
          case 'immediate_alert':
            try {
              await sendEmergencyAlert();
              toast.success('Emergency alert sent!');
            } catch (error) {
              console.error('Failed to send emergency alert:', error);
              toast.error(
                'Failed to send emergency alert. Please check your emergency contacts configuration.'
              );
            }
            break;

          case 'call_emergency':
            console.log('Calling emergency services...'); // just a mock implementation lmao

            break;

          case 'notify_contacts':
            // Notify emergency contacts
            try {
              await sendEmergencyAlert();
            } catch (error) {
              console.error('Failed to notify emergency contacts:', error);
              toast.error(
                'Failed to notify emergency contacts. Please check your emergency contacts configuration.'
              );
            }
            break;

          case 'get_sensor_data':
            // Trigger BLE data refresh
            if (bleDevice) {
              console.log('Requesting sensor data from BLE device');
            } else {
              console.log('No BLE device connected');
            }
            break;

          case 'connect_device':
            try {
              await connectToDevice();
            } catch (error) {
              toast.error('Please click to connect device manually (requires user gesture)');
            }
            break;

          case 'disconnect_device':
            if (bleDevice) {
              await disconnectDevice(bleDevice.id);
            } else {
              console.log('No device connected');
            }
            break;

          case 'navigate_to': {
            const target = (actionData.target as string) || 'dashboard';
            navigate(`/${target}`);
            break;
          }

          case 'show_medications':
            navigate('/medications');
            break;

          case 'show_health_status':
            navigate('/dashboard');
            break;

          case 'show_emergency_contacts':
            navigate('/emergency-contacts');
            break;

          case 'get_location':
            handleLocationCommand();
            break;

          default:
            console.log('Unknown action type:', actionType);
            toast.info(`Action '${actionType}' not yet implemented`);
        }
      } catch (error) {
        console.error('Error executing backend action:', error);
        toast.error('Failed to execute action');
      }
    },
    [
      sendEmergencyAlert,
      bleDevice,
      connectToDevice,
      disconnectDevice,
      navigate,
      handleLocationCommand,
    ]
  );

  // Handle local fallback when backend is unavailable
  const handleLocalFallback = useCallback(
    (transcript: string) => {
      if (
        transcript.includes('emergency') ||
        transcript.includes('help') ||
        transcript.includes('urgent') ||
        transcript.includes('alert')
      ) {
        handleEmergencyCommand(transcript);
      } else if (
        transcript.includes('health') ||
        transcript.includes('status') ||
        transcript.includes('vitals')
      ) {
        handleHealthCommand(transcript);
      } else if (
        transcript.includes('medication') ||
        transcript.includes('medicine') ||
        transcript.includes('pills')
      ) {
        handleMedicationCommand();
      } else if (transcript.includes('location') || transcript.includes('where')) {
        handleLocationCommand();
      } else {
        console.log('No matching voice command found for:', transcript);
        toast.info('Command not recognized. Say "help" for available commands.');
      }
    },
    [handleEmergencyCommand, handleHealthCommand, handleMedicationCommand, handleLocationCommand]
  );

  // Process voice commands
  const processVoiceCommand = useCallback(
    async (transcript: string) => {
      setLastCommand(transcript);

      // Debounce mechanism - prevent duplicate execution within 2 seconds
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutionTime;
      const isDuplicateCommand =
        lastExecutedCommand === transcript && timeSinceLastExecution < 2000;

      if (isDuplicateCommand) {
        console.log('Duplicate command ignored:', transcript);
        return;
      }

      // First try local command matching for immediate actions (except emergency)
      if (
        !transcript.includes('emergency') &&
        !transcript.includes('help') &&
        !transcript.includes('alert')
      ) {
        for (const [commandId, command] of commands) {
          const isMatch = command.keywords.some((keyword) =>
            transcript.includes(keyword.toLowerCase())
          );

          if (isMatch) {
            console.log(`Executing local voice command: ${commandId}`);
            setLastExecutedCommand(transcript);
            setLastExecutionTime(now);
            // Only show toast for emergency commands
            if (commandId === 'emergency') {
              toast.success(`Executing: ${command.description}`);
            }
            command.action();
            return;
          }
        }
      }

      // If no local match, send to backend for NLP processing
      try {
        const response = await fetch(API_ENDPOINTS.VOICE_COMMANDS.PROCESS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            command: transcript,
            context: {
              platform: 'web',
              timestamp: new Date().toISOString(),
              bleDevice: bleDevice?.id || null,
            },
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Voice command processed by backend:', result);

          // Update execution tracking
          setLastExecutedCommand(transcript);
          setLastExecutionTime(now);

          // Execute actions based on backend response
          if (result.actions && result.actions.length > 0) {
            console.log('Processing actions:', result.actions);
            for (const action of result.actions) {
              try {
                await executeBackendAction(action);
              } catch (error) {
                console.error('Error executing action:', action, error);
              }
            }
          }

          // Only show toast for emergency intents
          if (result.intent === 'emergency') {
            toast.success(`Command processed: ${result.intent}`);
          }
        } else {
          // Fallback to local processing
          handleLocalFallback(transcript);
        }
      } catch (error) {
        console.error('Error processing voice command with backend:', error);
        // Fallback to local processing
        handleLocalFallback(transcript);
      }
    },
    [
      commands,
      bleDevice,
      executeBackendAction,
      handleLocalFallback,
      lastExecutedCommand,
      lastExecutionTime,
    ]
  );

  // Process voice commands when lastCommand changes
  useEffect(() => {
    if (lastCommand) {
      const timeoutId = setTimeout(() => {
        processVoiceCommand(lastCommand);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [lastCommand, processVoiceCommand]);

  // Voice command management
  const registerCommand = useCallback((command: VoiceCommand) => {
    setCommands((prev) => new Map(prev.set(command.id, command)));
  }, []);

  const unregisterCommand = useCallback((commandId: string) => {
    setCommands((prev) => {
      const newCommands = new Map(prev);
      newCommands.delete(commandId);
      return newCommands;
    });
  }, []);

  const getAvailableCommands = useCallback(() => {
    return Array.from(commands.values());
  }, [commands]);

  // Voice control functions
  const toggleListening = useCallback(() => {
    if (!speechRecognitionRef.current) {
      toast.error('Voice commands are not supported in your browser.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      toast.info('Voice commands stopped');
    } else {
      speechRecognitionRef.current.start();
      setIsListening(true);
      toast.info('Voice commands active - say "help" for available commands');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (speechRecognitionRef.current && isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Register default commands on mount
  useEffect(() => {
    const defaultCommands: VoiceCommand[] = [
      {
        id: 'emergency',
        keywords: ['emergency', 'help', 'urgent', 'alert'],
        action: () => handleEmergencyCommand(),
        description: 'Trigger emergency alert',
        category: 'emergency',
      },
      {
        id: 'health-status',
        keywords: ['health status', 'vitals', 'health data', 'show health'],
        action: () => handleHealthCommand(),
        description: 'Show health status',
        category: 'health',
      },
      {
        id: 'location',
        keywords: ['location', 'where am i', 'my location', 'current location'],
        action: () => handleLocationCommand(),
        description: 'Get current location',
        category: 'general',
      },
      {
        id: 'connect-device',
        keywords: ['connect device', 'connect bluetooth', 'pair device'],
        action: () => connectToDevice(),
        description: 'Connect BLE device',
        category: 'device',
      },
      {
        id: 'disconnect-device',
        keywords: ['disconnect device', 'disconnect bluetooth'],
        action: () => bleDevice && disconnectDevice(bleDevice.id),
        description: 'Disconnect BLE device',
        category: 'device',
      },
      {
        id: 'dashboard',
        keywords: ['dashboard', 'home', 'main screen'],
        action: () => navigate('/dashboard'),
        description: 'Go to dashboard',
        category: 'navigation',
      },
      {
        id: 'medications',
        keywords: ['medications', 'pills', 'medicine'],
        action: () => handleMedicationCommand(),
        description: 'Go to medications',
        category: 'navigation',
      },
      {
        id: 'emergency-contacts',
        keywords: ['contacts', 'emergency contacts', 'emergency list'],
        action: () => navigate('/emergency-contacts'),
        description: 'Go to emergency contacts',
        category: 'navigation',
      },
    ];

    defaultCommands.forEach((command) => registerCommand(command));
  }, [
    navigate,
    connectToDevice,
    disconnectDevice,
    bleDevice,
    handleEmergencyCommand,
    handleHealthCommand,
    handleMedicationCommand,
    handleLocationCommand,
    registerCommand,
  ]);

  return {
    isListening,
    isSupported,
    lastCommand,
    toggleListening,
    stopListening,
    registerCommand,
    unregisterCommand,
    getAvailableCommands,
  };
}
