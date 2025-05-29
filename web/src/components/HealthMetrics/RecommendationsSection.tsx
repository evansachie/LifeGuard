import React from 'react';

interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

interface FormData {
  gender: string;
  age: string | number;
  height: string | number;
  weight: string | number;
  activityLevel: string;
  goal: string;
}

interface RecommendationsSectionProps {
  macros: Macros;
  formData: FormData;
  isDarkMode: boolean;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ macros, formData, isDarkMode }) => {
  // Generate recommendations based on form data
  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    const age = Number(formData.age);
    const goal = formData.goal;
    const activityLevel = formData.activityLevel;

    if (goal === 'lose') {
      recommendations.push('Focus on a calorie deficit of 500-750 calories per day for sustainable weight loss.');
      recommendations.push('Prioritize protein intake to preserve muscle mass during weight loss.');
      recommendations.push('Include both cardio and strength training in your workout routine.');
    } else if (goal === 'gain') {
      recommendations.push('Aim for a calorie surplus of 300-500 calories per day for lean muscle gain.');
      recommendations.push('Focus on progressive overload in your strength training to stimulate muscle growth.');
      recommendations.push('Consider splitting your protein intake across 4-5 meals throughout the day.');
    } else {
      recommendations.push('Continue with your current calorie intake to maintain your weight.');
      recommendations.push('Focus on nutrient-dense foods to optimize your health.');
      recommendations.push('Balance your workout routine with both cardio and strength training.');
    }

    if (age > 50) {
      recommendations.push('Include additional calcium and vitamin D for bone health.');
      recommendations.push('Consider adding more anti-inflammatory foods to your diet.');
    }

    if (activityLevel === 'sedentary') {
      recommendations.push('Try to incorporate more movement throughout your day.');
      recommendations.push('Consider starting with short walks or gentle exercises to build consistency.');
    } else if (activityLevel === 'veryActive') {
      recommendations.push('Ensure adequate recovery between intense workouts to prevent overtraining.');
      recommendations.push('Consider including electrolyte replenishment for longer training sessions.');
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="recommendations-section">
      <h3>Personalized Recommendations</h3>
      <ul className={`recommendations-list ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {recommendations.map((recommendation, index) => (
          <li key={index}>{recommendation}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationsSection;
