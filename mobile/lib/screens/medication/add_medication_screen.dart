import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/medication_provider.dart';
import '../../models/medication.dart';

class AddMedicationScreen extends StatefulWidget {
  final Medication? medication;
  
  const AddMedicationScreen({super.key, this.medication});

  @override
  State<AddMedicationScreen> createState() => _AddMedicationScreenState();
}

class _AddMedicationScreenState extends State<AddMedicationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _dosageController = TextEditingController();
  final _notesController = TextEditingController();
  
  String _frequency = 'daily';
  List<String> _times = [];
  DateTime _startDate = DateTime.now();
  DateTime? _endDate;
  bool _active = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.medication != null) {
      _populateFields();
    }
  }

  void _populateFields() {
    final med = widget.medication!;
    _nameController.text = med.name;
    _dosageController.text = med.dosage;
    _notesController.text = med.notes ?? '';
    _frequency = med.frequency;
    _times = List.from(med.times);
    _startDate = med.startDateTime ?? DateTime.now();
    _endDate = med.endDateTime;
    _active = med.active;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.medication == null ? 'Add Medication' : 'Edit Medication'),
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        foregroundColor: isDark ? Colors.white : Colors.black,
        elevation: 0,
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildBasicInfo(isDark),
              const SizedBox(height: 20),
              _buildScheduleInfo(isDark),
              const SizedBox(height: 20),
              _buildTimesSection(isDark),
              const SizedBox(height: 20),
              _buildDatesSection(isDark),
              const SizedBox(height: 20),
              _buildNotesSection(isDark),
              const SizedBox(height: 20),
              _buildActiveToggle(isDark),
              const SizedBox(height: 32),
              _buildSaveButton(isDark),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBasicInfo(bool isDark) {
    return Card(
      color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Basic Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Medication Name',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.medication),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter medication name';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _dosageController,
              decoration: InputDecoration(
                labelText: 'Dosage (e.g., 100mg, 1 tablet)',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.local_pharmacy),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter dosage';
                }
                return null;
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScheduleInfo(bool isDark) {
    return Card(
      color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Schedule',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black,
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _frequency,
              decoration: InputDecoration(
                labelText: 'Frequency',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.schedule),
              ),
              items: const [
                DropdownMenuItem(value: 'daily', child: Text('Daily')),
                DropdownMenuItem(value: 'weekly', child: Text('Weekly')),
                DropdownMenuItem(value: 'monthly', child: Text('Monthly')),
                DropdownMenuItem(value: 'as needed', child: Text('As Needed')),
              ],
              onChanged: (value) {
                setState(() {
                  _frequency = value!;
                  _times.clear(); // Clear times when frequency changes
                });
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimesSection(bool isDark) {
    return Card(
      color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Times',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),
                IconButton(
                  onPressed: _addTime,
                  icon: const Icon(Icons.add),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            if (_times.isEmpty)
              Text(
                'No times added yet. Tap + to add a time.',
                style: TextStyle(
                  color: isDark ? Colors.grey[400] : Colors.grey[600],
                ),
              )
            else
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _times.asMap().entries.map((entry) {
                  final index = entry.key;
                  final time = entry.value;
                  return Chip(
                    label: Text(time),
                    onDeleted: () {
                      setState(() {
                        _times.removeAt(index);
                      });
                    },
                    backgroundColor: Colors.blue.withOpacity(0.1),
                    deleteIconColor: Colors.blue,
                  );
                }).toList(),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDatesSection(bool isDark) {
    return Card(
      color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Duration',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black,
              ),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.calendar_today),
              title: const Text('Start Date'),
              subtitle: Text(_formatDate(_startDate)),
              onTap: () => _selectStartDate(context),
              contentPadding: EdgeInsets.zero,
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.event),
              title: const Text('End Date (Optional)'),
              subtitle: Text(_endDate != null ? _formatDate(_endDate!) : 'No end date'),
              onTap: () => _selectEndDate(context),
              trailing: _endDate != null
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        setState(() {
                          _endDate = null;
                        });
                      },
                    )
                  : null,
              contentPadding: EdgeInsets.zero,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotesSection(bool isDark) {
    return Card(
      color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Notes',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _notesController,
              decoration: InputDecoration(
                labelText: 'Additional notes (optional)',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.note),
              ),
              maxLines: 3,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActiveToggle(bool isDark) {
    return Card(
      color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const Icon(Icons.toggle_on),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Active Medication',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: isDark ? Colors.white : Colors.black,
                    ),
                  ),
                  Text(
                    'Enable reminders and tracking',
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            Switch(
              value: _active,
              onChanged: (value) {
                setState(() {
                  _active = value;
                });
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSaveButton(bool isDark) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _saveMedication,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF4285F4),
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: _isLoading
            ? const CircularProgressIndicator(color: Colors.white)
            : Text(
                widget.medication == null ? 'Add Medication' : 'Update Medication',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
      ),
    );
  }

  void _addTime() async {
    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    
    if (time != null) {
      final timeString = time.format(context);
      if (!_times.contains(timeString)) {
        setState(() {
          _times.add(timeString);
          _times.sort(); // Sort times chronologically
        });
      }
    }
  }

  void _selectStartDate(BuildContext context) async {
    final date = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    
    if (date != null) {
      setState(() {
        _startDate = date;
      });
    }
  }

  void _selectEndDate(BuildContext context) async {
    final date = await showDatePicker(
      context: context,
      initialDate: _endDate ?? _startDate.add(const Duration(days: 30)),
      firstDate: _startDate,
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
    );
    
    if (date != null) {
      setState(() {
        _endDate = date;
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  void _saveMedication() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_times.isEmpty && _frequency != 'as needed') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please add at least one time for the medication'),
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final medication = Medication(
        id: widget.medication?.id ?? '',
        name: _nameController.text.trim(),
        dosage: _dosageController.text.trim(),
        frequency: _frequency,
        times: _times,
        startDate: _startDate.toIso8601String(),
        endDate: _endDate?.toIso8601String(),
        notes: _notesController.text.trim().isEmpty 
            ? null 
            : _notesController.text.trim(),
        active: _active,
      );

      final provider = context.read<MedicationProvider>();
      bool success;
      
      if (widget.medication == null) {
        success = await provider.addMedication(medication);
      } else {
        success = await provider.updateMedication(medication);
      }

      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              widget.medication == null 
                  ? 'Medication added successfully' 
                  : 'Medication updated successfully'
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.error ?? 'Failed to save medication'),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _dosageController.dispose();
    _notesController.dispose();
    super.dispose();
  }
}
