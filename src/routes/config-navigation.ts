"use client";

import {
  User,
  WarningCircle,
  ListChecks,
  ChartPie,
  Clock,
  ShoppingCart,
  UserCircleGear,
  ChatCircleText,
  Desktop,
  Calculator,
  Atom,
  ClipboardText,
} from "@phosphor-icons/react";
import { paths } from "./paths";
import { PERMISSIONS } from "@/utils/permissions.utils";

const data = {
  navMain: [
    {
      title: "Grile",
      url: paths.dashboard.question.list,
      icon: ListChecks,
      permission: PERMISSIONS.ADMIN,
    },
    {
      title: "Utilizatori",
      url: paths.dashboard.user.list,
      icon: User,
      permission: PERMISSIONS.ADMIN,
    },
    {
      title: "Feedback",
      url: paths.dashboard.feedback.list,
      icon: ChatCircleText,
      permission: PERMISSIONS.ADMIN,
    },
    {
      title: "Atribute",
      url: paths.dashboard.attributes,
      icon: ClipboardText,
      permission: PERMISSIONS.ADMIN,
    },
    {
      title: "Informatică",
      url: `${paths.dashboard.question.answer}?chapter=info`,
      icon: Desktop,
      permission: PERMISSIONS.MEMBER,
    },
    {
      title: "Matematică",
      url: `${paths.dashboard.question.answer}?chapter=matematica`,
      icon: Calculator,
      permission: PERMISSIONS.MEMBER,
    },
    {
      title: "Fizică",
      url: `${paths.dashboard.question.answer}?chapter=fizica`,
      icon: Atom,
      permission: PERMISSIONS.MEMBER,
    },
    {
      title: "Statistici",
      url: paths.dashboard.stats,
      icon: ChartPie,
      permission: PERMISSIONS.MEMBER,
    },
    {
      title: "Istoric",
      url: paths.dashboard.history,
      icon: Clock,
      permission: PERMISSIONS.MEMBER,
    },
    {
      title: "Abonament",
      url: paths.dashboard.subscription,
      icon: ShoppingCart,
      permission: PERMISSIONS.MEMBER,
    },
    {
      title: "Profil",
      url: paths.dashboard.profile,
      icon: UserCircleGear,
      permission: null,
    },
    {
      title: "Raportare/Feedback",
      url: paths.dashboard.feedback.report,
      icon: WarningCircle,
      permission: PERMISSIONS.MEMBER,
    },
  ],
};

export default data;
