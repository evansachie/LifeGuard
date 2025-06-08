class ProfileData {
  final String id;
  final String fullName;
  final String email;
  final String? phone;
  final String? bio;
  final int? age;
  final String? gender;
  final double? weight;
  final double? height;
  final String? profileImage;

  ProfileData({
    required this.id,
    required this.fullName,
    required this.email,
    this.phone,
    this.bio,
    this.age,
    this.gender,
    this.weight,
    this.height,
    this.profileImage,
  });

  factory ProfileData.fromJson(Map<String, dynamic> json) {
    return ProfileData(
      id: json['id']?.toString() ?? '',
      fullName: json['fullName']?.toString() ?? json['userName']?.toString() ?? json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? json['phoneNumber']?.toString(),
      bio: json['bio']?.toString(),
      age: _parseIntSafely(json['age']),
      gender: json['gender']?.toString(),
      weight: _parseDoubleSafely(json['weight']),
      height: _parseDoubleSafely(json['height']),
      profileImage: json['profileImage']?.toString(),
    );
  }

  static int? _parseIntSafely(dynamic value) {
    if (value == null) return null;
    if (value is int) return value;
    if (value is String) {
      return int.tryParse(value);
    }
    if (value is double) return value.toInt();
    return null;
  }

  static double? _parseDoubleSafely(dynamic value) {
    if (value == null) return null;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) {
      return double.tryParse(value);
    }
    return null;
  }

  Map<String, dynamic> toJson() {
    return {
      'Email': email,
      'Age': age,
      'Gender': gender ?? '',
      'Weight': weight?.round(),
      'Height': height?.round(),
      'PhoneNumber': phone ?? '',
      'Bio': bio ?? '',
      'ProfileImage': profileImage,
    };
  }

  ProfileData copyWith({
    String? id,
    String? fullName,
    String? email,
    String? phone,
    String? bio,
    int? age,
    String? gender,
    double? weight,
    double? height,
    String? profileImage,
  }) {
    return ProfileData(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      bio: bio ?? this.bio,
      age: age ?? this.age,
      gender: gender ?? this.gender,
      weight: weight ?? this.weight,
      height: height ?? this.height,
      profileImage: profileImage ?? this.profileImage,
    );
  }
}

class EmergencyContact {
  final int id;
  final String name;
  final String phone;
  final String? email;
  final String? relationship;

  EmergencyContact({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    this.relationship,
  });

  factory EmergencyContact.fromJson(Map<String, dynamic> json) {
    return EmergencyContact(
      id: json['Id'] ?? json['id'] ?? 0,
      name: json['Name'] ?? json['name'] ?? '',
      phone: json['Phone'] ?? json['phone'] ?? '',
      email: json['Email'] ?? json['email'],
      relationship: json['Relationship'] ?? json['relationship'],
    );
  }
}
