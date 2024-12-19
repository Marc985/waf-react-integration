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

interface CaptchaComponentProps {
  onCaptchaSuccess: (wafToken: string) => void;
}

const CaptchaComponent: React.FC<CaptchaComponentProps> = ({ onCaptchaSuccess }) => {
  useEffect(() => {
    const captchaScript = document.createElement("script");
    captchaScript.src = "https://b82b1763d1c3.ef7ef6cc.eu-west-3.captcha.awswaf.com/b82b1763d1c3/jsapi.js";
    captchaScript.type = "text/javascript";
    captchaScript.defer = true;

    document.head.appendChild(captchaScript);

    return () => {
      document.head.removeChild(captchaScript);
    };
  }, []);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WAF_API;

    const container = document.getElementById("my-captcha-container");

    if (window.AwsWafCaptcha && container) {
      window.AwsWafCaptcha.renderCaptcha(container, {
        apiKey: apiKey,
        onSuccess: onCaptchaSuccess, // Passer la fonction de rappel ici
        onError: (error: unknown) => {
          console.error("Captcha Error:", error);
        },
      });
    } else {
      console.error("Captcha SDK ou conteneur non trouvé");
    }
  }, [onCaptchaSuccess]); // S'assurer que la fonction est mise à jour

  return (
    <div>
      <div id="my-captcha-container" style={{ marginBottom: "20px" }}></div>
    </div>
  );
};

export default CaptchaComponent;
