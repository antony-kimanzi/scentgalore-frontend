/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useGoogleLogin.tsx
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";

interface GoogleCredentialResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

interface UseGoogleLoginOptions {
  onSuccess?: (userData: any) => void;
  onError?: (error: Error) => void;
  mode?: "signin" | "signup"; // Add mode parameter
}

export const useGoogleLogin = (options: UseGoogleLoginOptions = {}) => {
  const { googleLogin } = useAuth();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { mode = "signin", onSuccess, onError } = options;

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Google script");
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializeGoogle = useCallback(() => {
    if (!isScriptLoaded || !window.google?.accounts?.id) return false;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("Google Client ID not found in env");
      return false;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: GoogleCredentialResponse) => {
          if (!response.credential) {
            console.error("No credential received");
            onError?.(new Error("No credential received"));
            alert(
              `Google ${mode === "signin" ? "Sign In" : "Sign Up"} failed. Please try again.`
            );
            return;
          }

          try {
            const result = await googleLogin({ token: response.credential });
            onSuccess?.(result);
          } catch (error) {
            console.error(`Google ${mode} failed:`, error);
            onError?.(error as Error);
            alert(
              `${mode === "signin" ? "Sign in" : "Sign up"} failed. Please try again.`
            );
          }
        },
        auto_select: false,
        cancel_on_tap_outside: false,
        context: mode, // Use the mode here
        ux_mode: "popup",
      });

      return true;
    } catch (error) {
      console.error(`Google ${mode} initialization error:`, error);
      return false;
    }
  }, [isScriptLoaded, googleLogin, mode, onSuccess, onError]);

  const renderGoogleButton = useCallback(
    (elementId: string, buttonText: string = "signin_with") => {
      if (!isScriptLoaded || !window.google?.accounts?.id) {
        return;
      }

      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`Element #${elementId} not found`);
        return;
      }

      // Clear element
      element.innerHTML = "";

      // Initialize
      const initialized = initializeGoogle();
      if (!initialized) return;

      try {
        window.google.accounts.id.renderButton(element, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: buttonText, // Customize button text
          shape: "rectangular",
          width: 500,
        });
      } catch (error) {
        console.error("Failed to render button:", error);
      }
    },
    [isScriptLoaded, initializeGoogle]
  );

  const triggerOneTap = useCallback(() => {
    if (!isScriptLoaded || !window.google?.accounts?.id) {
      console.error("Google not loaded");
      return;
    }

    const initialized = initializeGoogle();
    if (!initialized) return;

    try {
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error("Google One Tap failed:", error);
      alert("One Tap not available. Please use the Google button.");
    }
  }, [isScriptLoaded, initializeGoogle, mode]);

  return {
    isScriptLoaded,
    initializeGoogle,
    renderGoogleButton,
    triggerOneTap,
  };
};
