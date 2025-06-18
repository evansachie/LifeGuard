class Medication {
  final String id;
  final String name;
  final String dosage;
  final String frequency;
  final List<String> times;
  final String? startDate;
  final String? endDate;
  final String? notes;
  final bool active;
  final String? dosesTaken;
  final String? totalDoses;

  Medication({
    required this.id,
    required this.name,
    required this.dosage,
    required this.frequency,
    required this.times,
    this.startDate,
    this.endDate,
    this.notes,
    required this.active,
    this.dosesTaken,
    this.totalDoses,
  });

  factory Medication.fromJson(Map<String, dynamic> json) {
    // print('Parsing medication JSON: $json');
    
    List<String> timesList = [];
    if (json['Time'] != null) {
      if (json['Time'] is List) {
        timesList = List<String>.from(json['Time']);
      } else if (json['Time'] is String) {
        timesList = [json['Time']];
      }
    }

    return Medication(
      id: json['Id']?.toString() ?? '',
      name: json['Name'] ?? '',
      dosage: json['Dosage'] ?? '',
      frequency: json['Frequency'] ?? '',
      times: timesList,
      startDate: json['StartDate'],
      endDate: json['EndDate'],
      notes: json['Notes'],
      active: json['Active'] ?? true,
      dosesTaken: json['doses_taken']?.toString(),
      totalDoses: json['total_doses']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'Id': id,
      'Name': name,
      'Dosage': dosage,
      'Frequency': frequency,
      'Time': times,
      'StartDate': startDate,
      'EndDate': endDate,
      'Notes': notes,
      'Active': active,
      'doses_taken': dosesTaken,
      'total_doses': totalDoses,
    };
  }

  Medication copyWith({
    String? id,
    String? name,
    String? dosage,
    String? frequency,
    List<String>? times,
    String? startDate,
    String? endDate,
    String? notes,
    bool? active,
    String? dosesTaken,
    String? totalDoses,
  }) {
    return Medication(
      id: id ?? this.id,
      name: name ?? this.name,
      dosage: dosage ?? this.dosage,
      frequency: frequency ?? this.frequency,
      times: times ?? this.times,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      notes: notes ?? this.notes,
      active: active ?? this.active,
      dosesTaken: dosesTaken ?? this.dosesTaken,
      totalDoses: totalDoses ?? this.totalDoses,
    );
  }

  @override
  String toString() {
    return 'Medication(id: $id, name: $name, dosage: $dosage, frequency: $frequency, times: $times, startDate: $startDate, endDate: $endDate, notes: $notes, active: $active, dosesTaken: $dosesTaken, totalDoses: $totalDoses)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    
    return other is Medication &&
      other.id == id &&
      other.name == name &&
      other.dosage == dosage &&
      other.frequency == frequency &&
      _listEquals(other.times, times) &&
      other.startDate == startDate &&
      other.endDate == endDate &&
      other.notes == notes &&
      other.active == active &&
      other.dosesTaken == dosesTaken &&
      other.totalDoses == totalDoses;
  }

  @override
  int get hashCode {
    return id.hashCode ^
      name.hashCode ^
      dosage.hashCode ^
      frequency.hashCode ^
      times.hashCode ^
      startDate.hashCode ^
      endDate.hashCode ^
      notes.hashCode ^
      active.hashCode ^
      dosesTaken.hashCode ^
      totalDoses.hashCode;
  }

  bool _listEquals(List<String> a, List<String> b) {
    if (a.length != b.length) return false;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }

  // Helper methods
  bool get isActive => active;
  
  bool get hasEndDate => endDate != null && endDate!.isNotEmpty;
  
  int get dailyDoses => times.length;
  
  String get displayName => name.isEmpty ? 'Unnamed Medication' : name;
  
  String get fullDescription => '$name ($dosage) - $frequency';
  
  DateTime? get startDateTime {
    if (startDate == null || startDate!.isEmpty) return null;
    try {
      return DateTime.parse(startDate!);
    } catch (e) {
      return null;
    }
  }
  
  DateTime? get endDateTime {
    if (endDate == null || endDate!.isEmpty) return null;
    try {
      return DateTime.parse(endDate!);
    } catch (e) {
      return null;
    }
  }
  
  bool get isExpired {
    final end = endDateTime;
    if (end == null) return false;
    return DateTime.now().isAfter(end);
  }
  
  bool get isActiveToday {
    if (!active) return false;
    if (isExpired) return false;
    
    final start = startDateTime;
    if (start == null) return true;
    
    return DateTime.now().isAfter(start) || 
           DateTime.now().isAtSameMomentAs(start);
  }
}
