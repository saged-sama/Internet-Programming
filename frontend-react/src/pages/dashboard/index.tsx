import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardRoute } from "../../lib/auth";

export default function DashboardIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(getDashboardRoute(), { replace: true });
  }, [navigate]);
  return null;
}
