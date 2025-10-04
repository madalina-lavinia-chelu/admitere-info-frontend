"use client";

//
import { useState, useEffect, useCallback } from "react";
import { getCurrentUserRequest } from "@/requests/auth/auth.requests";

import { useAppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slices/auth";

import { getSession, setSession } from "./utils";
import Loading from "@/components/loading";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AppFirstLogic({ children }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      const accessToken = getSession();

      if (accessToken) {
        setSession(accessToken);

        const response = await getCurrentUserRequest();

        if (response.error) {
          throw new Error(response.message);
        }

        dispatch(setUser(response.user));
        setLoading(false);
      } else {
        dispatch(setUser(null));
        setLoading(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setUser(null));
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return <Loading />;
  }

  return children;
}
