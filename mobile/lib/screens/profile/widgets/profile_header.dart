import 'package:flutter/material.dart';
import '../../../models/profile_model.dart';

class ProfileHeader extends StatelessWidget {
  final ProfileData profile;
  final bool isEditing;
  final bool isUpdating;
  final VoidCallback? onPhotoTap;

  const ProfileHeader({
    super.key,
    required this.profile,
    required this.isEditing,
    required this.isUpdating,
    this.onPhotoTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: isDark 
                ? Colors.black.withOpacity(0.3) 
                : Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Stack(
            children: [
              CircleAvatar(
                radius: 60,
                backgroundColor: Colors.grey[300],
                backgroundImage: profile.profileImage != null 
                    ? NetworkImage(profile.profileImage!) 
                    : null,
                child: profile.profileImage == null
                    ? Text(
                        profile.fullName.isNotEmpty 
                            ? profile.fullName[0].toUpperCase() 
                            : 'U',
                        style: const TextStyle(
                          fontSize: 40,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      )
                    : null,
              ),
              if (isEditing)
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: GestureDetector(
                    onTap: onPhotoTap,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: Colors.blue,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isUpdating ? Icons.hourglass_empty : Icons.camera_alt,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            profile.fullName,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            profile.email,
            style: TextStyle(
              fontSize: 16,
              color: isDark ? Colors.grey[400] : Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }
}
