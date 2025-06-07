import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import '../../providers/profile_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/profile_model.dart';
import 'widgets/profile_header.dart';
import 'widgets/personal_info_form.dart';
import 'widgets/physical_info_section.dart';
import 'widgets/emergency_contacts_section.dart';
import 'widgets/delete_account_section.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isEditing = false;
  final _formKey = GlobalKey<FormState>();
  
  final _fullNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _bioController = TextEditingController();
  final _ageController = TextEditingController();
  final _weightController = TextEditingController();
  final _heightController = TextEditingController();
  
  String? _selectedGender;
  bool _hasPopulatedFields = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  void _loadData() {
    final profileProvider = Provider.of<ProfileProvider>(context, listen: false);
    profileProvider.loadProfile();
    profileProvider.loadEmergencyContacts();
  }

  void _populateFields(ProfileData profile) {
    if (_hasPopulatedFields) return; // Prevent multiple population
    
    setState(() {
      _fullNameController.text = profile.fullName;
      _phoneController.text = profile.phone ?? '';
      _bioController.text = profile.bio ?? '';
      _ageController.text = profile.age?.toString() ?? '';
      _weightController.text = profile.weight?.toString() ?? '';
      _heightController.text = profile.height?.toString() ?? '';
      _selectedGender = profile.gender;
      _hasPopulatedFields = true;
    });
  }

  void _handleEditToggle() {
    setState(() {
      _isEditing = !_isEditing;
      if (_isEditing) {
        final profile = Provider.of<ProfileProvider>(context, listen: false).profileData;
        if (profile != null) {
          _populateFields(profile);
        }
      }
    });
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    final profileProvider = Provider.of<ProfileProvider>(context, listen: false);
    final currentProfile = profileProvider.profileData;
    
    if (currentProfile == null) return;

    final updatedProfile = currentProfile.copyWith(
      fullName: _fullNameController.text.trim(),
      phone: _phoneController.text.trim(),
      bio: _bioController.text.trim(),
      age: int.tryParse(_ageController.text.trim()),
      weight: double.tryParse(_weightController.text.trim()),
      height: double.tryParse(_heightController.text.trim()),
      gender: _selectedGender,
    );

    final success = await profileProvider.updateProfile(updatedProfile);
    
    if (success) {
      setState(() {
        _isEditing = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully!')),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(profileProvider.error ?? 'Failed to update profile')),
        );
      }
    }
  }

  void _handleCancel() {
    setState(() {
      _isEditing = false;
    });
  }

  Future<void> _showPhotoOptions() async {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Take Photo'),
              onTap: () {
                Navigator.pop(context);
                _handlePhotoUpload(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Choose from Gallery'),
              onTap: () {
                Navigator.pop(context);
                _handlePhotoUpload(ImageSource.gallery);
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.delete, color: Colors.red),
              title: const Text('Remove Photo', style: TextStyle(color: Colors.red)),
              onTap: () {
                Navigator.pop(context);
                _handlePhotoDelete();
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handlePhotoUpload(ImageSource source) async {
    final profileProvider = Provider.of<ProfileProvider>(context, listen: false);
    final success = await profileProvider.uploadPhoto(source);
    
    if (success) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Photo updated successfully!')),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(profileProvider.error ?? 'Failed to update photo')),
        );
      }
    }
  }

  Future<void> _handlePhotoDelete() async {
    final profileProvider = Provider.of<ProfileProvider>(context, listen: false);
    final success = await profileProvider.deletePhoto();
    
    if (success) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Photo removed successfully!')),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(profileProvider.error ?? 'Failed to remove photo')),
        );
      }
    }
  }

  Future<void> _handleDeleteAccount() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Account'),
        content: const Text(
          'Are you sure you want to delete your account? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final profileProvider = Provider.of<ProfileProvider>(context, listen: false);
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      
      final success = await profileProvider.deleteAccount();
      
      if (success) {
        await authProvider.logout();
        if (mounted) {
          Navigator.of(context).pushNamedAndRemoveUntil('/', (route) => false);
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(profileProvider.error ?? 'Failed to delete account')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        foregroundColor: isDark ? Colors.white : Colors.black,
        elevation: 0,
        actions: [
          if (!_isEditing)
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: _handleEditToggle,
            ),
        ],
      ),
      body: Consumer<ProfileProvider>(
        builder: (context, profileProvider, child) {
          if (profileProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final profile = profileProvider.profileData;
          if (profile == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Failed to load profile'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loadData,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          // Populate fields when profile data is available and not yet populated
          if (!_hasPopulatedFields) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              _populateFields(profile);
            });
          }

          return Form(
            key: _formKey,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  ProfileHeader(
                    profile: profile,
                    isEditing: _isEditing,
                    isUpdating: profileProvider.isUpdating,
                    onPhotoTap: _isEditing ? _showPhotoOptions : null,
                  ),
                  const SizedBox(height: 24),
                  
                  PersonalInfoForm(
                    fullNameController: _fullNameController,
                    phoneController: _phoneController,
                    bioController: _bioController,
                    email: profile.email,
                    isEditing: _isEditing,
                  ),
                  const SizedBox(height: 24),
                  
                  PhysicalInfoSection(
                    ageController: _ageController,
                    weightController: _weightController,
                    heightController: _heightController,
                    selectedGender: _selectedGender,
                    onGenderChanged: (value) => setState(() => _selectedGender = value),
                    isEditing: _isEditing,
                  ),
                  const SizedBox(height: 24),
                  
                  EmergencyContactsSection(
                    contacts: profileProvider.emergencyContacts,
                    isLoading: profileProvider.contactsLoading,
                  ),
                  const SizedBox(height: 24),
                  
                  DeleteAccountSection(
                    onDeleteAccount: _handleDeleteAccount,
                    isLoading: profileProvider.isUpdating,
                  ),
                  
                  if (_isEditing) ...[
                    const SizedBox(height: 32),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: profileProvider.isUpdating ? null : _handleSave,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: profileProvider.isUpdating
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : const Text('Save Changes'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: profileProvider.isUpdating ? null : _handleCancel,
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: const Text('Cancel'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _phoneController.dispose();
    _bioController.dispose();
    _ageController.dispose();
    _weightController.dispose();
    _heightController.dispose();
    super.dispose();
  }
}
