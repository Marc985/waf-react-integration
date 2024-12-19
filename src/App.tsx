import React, { useState } from "react";
import CaptchaComponent from "./components/CaptchaComponent";

const App: React.FC = () => {
    const [number, setNumber] = useState<number | "">("");
    const [output, setOutput] = useState<string>("");
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [captchaRequired, setCaptchaRequired] = useState<boolean>(false);

    const apiUrl: string = "https://api.prod.jcloudify.com/whoami";

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (typeof number === "string" || number < 1 || number > 1000) {
            alert("Please enter a number between 1 and 1000.");
            return;
        }

        setIsRunning(true);
        setOutput("");
        setCaptchaRequired(false); // Reset captcha flag

        for (let i = 1; i <= number; i++) {
            try {
                const response = await fetch(apiUrl);

                if (response.ok && response.status === 403) {
                    setOutput((prev) => prev + `${i}. Forbidden\n`);
                } else if (response.status === 405) {
                    // Si la réponse est 405, activer le captcha
                    setOutput((prev) => prev + `${i}. Captcha required, stopping the sequence.\n`);
                    setCaptchaRequired(true); // Afficher le captcha
                    break; // Arrêter la séquence
                } else {
                    setOutput((prev) => prev + `${i}. Forbidden (other)\n`);
                }
            } catch (error) {
                setOutput((prev) => prev + `${i}. Error: ${error instanceof Error ? error.message : "Unknown error"}\n`);
            }

            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        }

        if (!captchaRequired) {
            setOutput((prev) => prev + "Sequence complete!");
        }
        
        setIsRunning(false);
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", margin: "2em" }}>
            <h1>Generate Forbidden Sequence</h1>
            {!isRunning && (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="numberInput">Enter a number (1-1000):</label>
                    <input
                        type="number"
                        id="numberInput"
                        value={number}
                        onChange={(e) => setNumber(e.target.value === "" ? "" : parseInt(e.target.value))}
                        min="1"
                        max="1000"
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            <pre
                style={{
                    marginTop: "1em",
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                    background: "#f9f9f9",
                    padding: "1em",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                }}
            >
                {output}
            </pre>
            {captchaRequired && <CaptchaComponent />} {/* Afficher le composant captcha si nécessaire */}
        </div>
    );
};

export default App;
