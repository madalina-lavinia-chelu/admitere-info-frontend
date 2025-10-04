const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  APP: "/",
};

export const paths = {
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/signup`,
    passwordRecovery: `${ROOTS.AUTH}/reset-password`,
    resetPassword: `${ROOTS.AUTH}/reset-password`,
    verifyEmail: `${ROOTS.AUTH}/verify-email`,
  },
  app: {
    root: ROOTS.APP,
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
    user: {
      list: `${ROOTS.DASHBOARD}/user/list`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      edit: (id: number | string) => `${ROOTS.DASHBOARD}/user/edit/${id}`,
    },
    question: {
      list: `${ROOTS.DASHBOARD}/question/list`,
      new: `${ROOTS.DASHBOARD}/question/new`,
      edit: (id: number | string) => `${ROOTS.DASHBOARD}/question/edit/${id}`,
      answer: `${ROOTS.DASHBOARD}/question/answer`,
      preview: (id: number | string) =>
        `${ROOTS.DASHBOARD}/question/preview/${id}`,
    },
    feedback: {
      list: `${ROOTS.DASHBOARD}/feedback/list`,
      report: `${ROOTS.DASHBOARD}/feedback/report`,
    },
    attributes: `${ROOTS.DASHBOARD}/attributes`,
    stats: `${ROOTS.DASHBOARD}/stats`,
    history: `${ROOTS.DASHBOARD}/history`,
    subscription: `${ROOTS.DASHBOARD}/subscription`,
    profile: `${ROOTS.DASHBOARD}/profile`,
  },
  subscription: {
    success: "/subscription/success",
    cancel: "/subscription/cancel",
  },
};
