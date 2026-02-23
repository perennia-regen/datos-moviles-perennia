import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useEducador() {
  const [educadorId, setEducadorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      supabase
        .from("educadores")
        .select("id_educador")
        .eq("auth_user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setEducadorId(data.id_educador);
          setLoading(false);
        });
    });
  }, []);

  return { educadorId, loading };
}
