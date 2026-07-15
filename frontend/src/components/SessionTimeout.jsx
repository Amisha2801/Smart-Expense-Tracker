import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const INACTIVITY_LIMIT = 30 * 60 * 1000;

function SessionTimeout() {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const logoutUser = () => {
      localStorage.removeItem("token");
      navigate("/login", {
        replace: true,
        state: {
          message: "You were logged out after 30 minutes of inactivity.",
        },
      });
    };

    const resetTimer = () => {
      if (!localStorage.getItem("token")) {
        return;
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutUser, INACTIVITY_LIMIT);
    };

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeoutId);

      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, [navigate]);

  return null;
}

export default SessionTimeout;