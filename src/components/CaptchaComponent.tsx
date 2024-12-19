import React, { useEffect } from "react";

// Déclarer les types pour les scripts AWS
declare global {
  interface Window {
    AwsWafCaptcha?: {
      renderCaptcha: (
        container: HTMLElement,
        options: {
          apiKey: string;
          onSuccess: (wafToken: string) => void;
          onError: (error: unknown) => void;
        }
      ) => void;
    };
  }
}

const CaptchaComponent: React.FC = () => {
  useEffect(() => {
    // Charger les scripts nécessaires
    const captchaScript = document.createElement("script");
                        //<script type="text/javascript" src="https://a0a9f3ba7ca1.eu-west-3.captcha-sdk.awswaf.com/a0a9f3ba7ca1/jsapi.js" defer></script>
    captchaScript.src = "https://b82b1763d1c3.ef7ef6cc.eu-west-3.captcha.awswaf.com/b82b1763d1c3/jsapi.js";
    captchaScript.type = "text/javascript";
    captchaScript.defer = true;

    document.head.appendChild(captchaScript);

    return () => {
      // Nettoyer les scripts au démontage du composant
      document.head.removeChild(captchaScript);
    };
  }, []);
  

  const showCaptcha = () => {
    const apiKey = import.meta.env.VITE_WAF_API
    
    if (!apiKey) {
      console.error("API Key manquante. Assurez-vous qu'elle est définie dans .env.");
      return;
    }


    const container = document.getElementById("my-captcha-container");

    if (window.AwsWafCaptcha && container) {
      window.AwsWafCaptcha.renderCaptcha(container, {
        apiKey: apiKey,
        onSuccess: captchaExampleSuccessFunction,
        onError: captchaExampleErrorFunction,
      });
    } else {
      console.error("Captcha SDK ou conteneur non trouvé");
    }
  };

  const captchaExampleSuccessFunction = (wafToken: string) => {
    console.log("WAF Token:", wafToken);

    // Utiliser le token pour authentifier ou valider l'utilisateur
    fetch("...WAF-protected URL...", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: wafToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const captchaExampleErrorFunction = (error: unknown) => {
    console.error("Captcha Error:", error);
  };

  return (
    <div>
      <div id="my-captcha-container" style={{ marginBottom: "20px" }}>
        {/* Conteneur du captcha */}
      </div>
      <button onClick={showCaptcha}>Show My Captcha</button>
    </div>
  );
};


export default CaptchaComponent;
