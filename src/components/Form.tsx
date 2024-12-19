import React, { useState } from "react";

type FormProps = {
  className?: string; // Classe CSS personnalisable
  onSubmit: (value: number) => void; // Fonction appelée lors de la soumission
};

const NumberInputForm: React.FC<FormProps> = ({ className, onSubmit }) => {
  const [number, setNumber] = useState<number | "">("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value, 10) <= 1000)) {
      setNumber(value === "" ? "" : parseInt(value, 10));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (number !== "") {
      onSubmit(number);
      setNumber(""); // Réinitialise le champ après soumission
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <label htmlFor="numberInput">Entrez un nombre entre 1 et 1,000 :</label>
      <input
        id="numberInput"
        type="number"
        value={number}
        onChange={handleInputChange}
        min="1"
        max="1000"
        required
      />
      <button type="submit">Envoyer</button>
    </form>
  );
};

export default NumberInputForm;
