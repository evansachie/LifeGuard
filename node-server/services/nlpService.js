const natural = require('natural');

class NLPService {
  constructor() {
    // Initialize natural language processing tools
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
    
    // Define command patterns and their intents
    this.commandPatterns = {
      emergency: {
        keywords: ['emergency', 'help', 'urgent', 'alert', 'sos', 'danger', 'crisis'],
        intent: 'emergency',
        priority: 'high',
        actions: ['send_alert', 'call_emergency', 'notify_contacts']
      },
      health: {
        keywords: ['health', 'vitals', 'status', 'condition', 'symptoms', 'pain', 'sick'],
        intent: 'health_status',
        priority: 'medium',
        actions: ['show_health_data', 'check_vitals', 'health_report']
      },
      location: {
        keywords: ['location', 'where', 'position', 'address', 'coordinates'],
        intent: 'location',
        priority: 'medium',
        actions: ['get_location', 'share_location', 'find_nearby']
      },
      device: {
        keywords: ['device', 'bluetooth', 'connect', 'disconnect', 'pair', 'sensor'],
        intent: 'device_control',
        priority: 'low',
        actions: ['connect_device', 'disconnect_device', 'scan_devices']
      },
      medication: {
        keywords: ['medication', 'medicine', 'pills', 'drugs', 'prescription', 'dose'],
        intent: 'medication',
        priority: 'medium',
        actions: ['show_medications', 'medication_reminder', 'add_medication']
      },
      navigation: {
        keywords: ['go', 'navigate', 'open', 'show', 'display', 'switch'],
        intent: 'navigation',
        priority: 'low',
        actions: ['navigate_to', 'open_screen', 'change_view']
      }
    };

    // Emergency contact patterns
    this.contactPatterns = {
      call: ['call', 'phone', 'ring', 'dial'],
      text: ['text', 'message', 'sms', 'send message'],
      email: ['email', 'send email', 'mail']
    };
  }

  /**
   * Process voice command and extract intent, entities, and actions
   * @param {string} command - The voice command text
   * @param {Object} context - Additional context (user data, device status, etc.)
   * @returns {Object} - Processed command with intent and actions
   */
  processCommand(command, context = {}) {
    if (!command || typeof command !== 'string') {
      return this.createErrorResponse('Invalid command input');
    }

    const normalizedCommand = command.toLowerCase().trim();
    const tokens = this.tokenizer.tokenize(normalizedCommand);
    const intentResult = this.extractIntent(normalizedCommand, tokens);
    const entities = this.extractEntities(normalizedCommand, tokens);
    const actions = this.determineActions(intentResult.intent, entities, context);
    const confidence = this.calculateConfidence(intentResult, entities, actions);
    
    return {
      success: true,
      originalCommand: command,
      normalizedCommand,
      intent: intentResult.intent,
      confidence: confidence,
      entities: entities,
      actions: actions,
      priority: intentResult.priority,
      timestamp: new Date().toISOString(),
      context: context
    };
  }

  /**
   * Extract intent from command using keyword matching and pattern recognition
   */
  extractIntent(command, tokens) {
    let bestMatch = { intent: 'unknown', confidence: 0, priority: 'low' };
    
    for (const [intentName, pattern] of Object.entries(this.commandPatterns)) {
      const matchScore = this.calculateKeywordMatch(command, pattern.keywords);
      
      if (matchScore > bestMatch.confidence) {
        bestMatch = {
          intent: intentName,
          confidence: matchScore,
          priority: pattern.priority
        };
      }
    }

    // Special handling for emergency keywords
    if (this.isEmergencyCommand(command)) {
      return {
        intent: 'emergency',
        confidence: 1.0,
        priority: 'high'
      };
    }

    return bestMatch;
  }

  /**
   * Extract entities from command (names, numbers, locations, etc.)
   */
  extractEntities(command, tokens) {
    const entities = {
      contacts: [],
      numbers: [],
      locations: [],
      medications: [],
      time: null,
      urgency: 'normal'
    };

    // Extract contact names (simple pattern matching)
    const contactPatterns = [
      /call\s+(\w+)/i,
      /text\s+(\w+)/i,
      /email\s+(\w+)/i,
      /contact\s+(\w+)/i
    ];

    contactPatterns.forEach(pattern => {
      const match = command.match(pattern);
      if (match) {
        entities.contacts.push({
          name: match[1],
          action: pattern.source.split('\\s+')[0].replace(/[()]/g, '')
        });
      }
    });

    // Extract numbers (phone numbers, quantities, etc.)
    const numberPattern = /\b\d{3,}\b/g;
    const numbers = command.match(numberPattern);
    if (numbers) {
      entities.numbers = numbers.map(num => ({
        value: num,
        type: num.length >= 10 ? 'phone' : 'quantity'
      }));
    }

    // Extract urgency indicators
    const urgencyKeywords = ['urgent', 'asap', 'immediately', 'now', 'quickly'];
    if (urgencyKeywords.some(keyword => command.includes(keyword))) {
      entities.urgency = 'high';
    }

    // Extract time references
    const timePatterns = [
      /(\d+)\s*(minute|min|hour|hr)s?/i,
      /(morning|afternoon|evening|night)/i,
      /(today|tomorrow|yesterday)/i
    ];

    timePatterns.forEach(pattern => {
      const match = command.match(pattern);
      if (match) {
        entities.time = match[0];
      }
    });

    return entities;
  }

  /**
   * Determine actions based on intent and entities
   */
  determineActions(intent, entities, context) {
    const actions = [];
    const pattern = this.commandPatterns[intent];

    if (!pattern) {
      return actions;
    }

    // Add base actions for the intent
    actions.push(...pattern.actions);

    // Add specific actions based on entities
    if (entities.contacts.length > 0) {
      entities.contacts.forEach(contact => {
        actions.push({
          type: contact.action,
          target: contact.name,
          priority: entities.urgency
        });
      });
    }

    // Add emergency-specific actions
    if (intent === 'emergency') {
      actions.push({
        type: 'send_alert',
        priority: 'high',
        include_location: true,
        include_medical_info: true
      });
    }

    // Add health-specific actions
    if (intent === 'health_status') {
      actions.push({
        type: 'get_sensor_data',
        include_vitals: true,
        include_environmental: true
      });
    }

    return actions;
  }

  /**
   * Calculate keyword match score
   */
  calculateKeywordMatch(command, keywords) {
    let matchCount = 0;
    const totalKeywords = keywords.length;

    keywords.forEach(keyword => {
      if (command.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    });

    return matchCount / totalKeywords;
  }

  /**
   * Check if command is an emergency
   */
  isEmergencyCommand(command) {
    const emergencyKeywords = ['emergency', 'help', 'urgent', 'sos', 'danger', 'crisis'];
    return emergencyKeywords.some(keyword => 
      command.toLowerCase().includes(keyword)
    );
  }

  /**
   * Calculate overall confidence score
   */
  calculateConfidence(intentResult, entities, actions) {
    let confidence = intentResult.confidence;

    // Boost confidence if entities were found
    if (entities.contacts.length > 0 || entities.numbers.length > 0) {
      confidence += 0.2;
    }

    // Boost confidence if multiple actions are available
    if (actions.length > 1) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Create error response
   */
  createErrorResponse(message) {
    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process emergency command with high priority
   */
  processEmergencyCommand(command, userContext) {
    const result = this.processCommand(command, userContext);
    
    if (result.success) {
      result.priority = 'high';
      result.emergency = true;
      result.actions.unshift({
        type: 'immediate_alert',
        priority: 'critical',
        timestamp: new Date().toISOString()
      });
    }

    return result;
  }

  /**
   * Get available commands for help system
   */
  getAvailableCommands() {
    const commands = [];
    
    for (const [intentName, pattern] of Object.entries(this.commandPatterns)) {
      commands.push({
        intent: intentName,
        keywords: pattern.keywords,
        description: this.getIntentDescription(intentName),
        priority: pattern.priority,
        actions: pattern.actions
      });
    }

    return commands;
  }

  /**
   * Get human-readable description for intent
   */
  getIntentDescription(intent) {
    const descriptions = {
      emergency: 'Trigger emergency alerts and contact emergency services',
      health: 'Check health status, vitals, and medical information',
      location: 'Get current location and share position',
      device: 'Control Bluetooth devices and sensors',
      medication: 'Manage medications and reminders',
      navigation: 'Navigate between app screens and features'
    };

    return descriptions[intent] || 'Unknown command type';
  }
}

module.exports = NLPService;
