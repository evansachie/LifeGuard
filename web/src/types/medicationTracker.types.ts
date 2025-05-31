export interface Medication {
  Id: string;
  Name: string;
  Dosage: string;
  Frequency: 'daily' | 'weekly' | 'monthly';
  Time: string[];
  StartDate: string;
  EndDate?: string | null;
  Notes?: string;
  Active: boolean;
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  times: string[];
  startDate: string;
  endDate: string;
  notes: string;
  active: boolean;
}

export interface MedicationData {
  Id?: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  times: string[];
  startDate: string;
  endDate: string | null;
  notes: string;
  active: boolean;
}

export interface MedicationSearchItem {
  id: string;
  brandName: string;
  genericName: string;
  form: string;
  strength: string;
  indications?: string;
  [key: string]: unknown;
}

export interface MedicationSearchProps {
  value: string;
  onChange: (name: string, medication?: MedicationSearchItem) => void;
  isDarkMode: boolean;
}

export interface FiltersType {
  status: string;
  frequency: string;
  timeOfDay: string;
}

export interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (query: string) => void;
  filters: FiltersType;
  onFilterChange: (filterType: string, value: string) => void;
  isDarkMode: boolean;
}

export interface MedicationCardProps {
  medication: Medication;
  onTrackDose: (id: string, taken: boolean) => void;
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
  isDarkMode: boolean;
  index: number;
}

export interface MedicationListProps {
  medications: Medication[];
  loading: boolean;
  onTrackDose: (id: string, taken: boolean) => void;
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
  isDarkMode: boolean;
}

export interface MedicationStatsProps {
  complianceRate: number | null;
  medications: Medication[];
  isDarkMode: boolean;
}

export interface AddMedicationFormProps {
  onSubmit: (data: MedicationData) => void;
  isDarkMode: boolean;
  initialData?: Medication | null;
}

export interface NotificationPreferencesProps {
  isDarkMode: boolean;
  onClose: () => void;
}

export interface PreferencesState {
  emailNotifications: boolean;
  reminderLeadTime: number;
}

export interface DoseTrackingData {
  medicationId: string;
  status: 'taken' | 'missed';
  timestamp: string;
}

export interface ComplianceData {
  rate: number;
  dosesTaken: number;
  dosesMissed: number;
  totalDoses: number;
}

export interface MedicationHistoryItem {
  id: string;
  medicationId: string;
  medicationName: string;
  status: 'taken' | 'missed';
  timestamp: string;
}

export interface SelectedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  times: string[];
  startDate: string;
  endDate: string | null;
  notes: string;
  active: boolean;
}

export interface FormData {
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  times: string[];
  startDate: string;
  endDate: string;
  notes: string;
  active: boolean;
}
