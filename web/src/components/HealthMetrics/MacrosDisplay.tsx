interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

interface MacrosDisplayProps {
  macros: Macros | null;
}

const MacrosDisplay = ({ macros }: MacrosDisplayProps) => {
  if (!macros) return null;

  return (
    <div className="macros-section">
      <h3>Daily Macro Nutrients</h3>
      <div className="macros-grid">
        <div className="macro-card">
          <h4>Protein</h4>
          <p>{macros.protein}g</p>
        </div>
        <div className="macro-card">
          <h4>Carbs</h4>
          <p>{macros.carbs}g</p>
        </div>
        <div className="macro-card">
          <h4>Fat</h4>
          <p>{macros.fat}g</p>
        </div>
      </div>
    </div>
  );
};

export default MacrosDisplay;
