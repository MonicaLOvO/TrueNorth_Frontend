"use client";

import DecisionChat from "@/components/DecisionChat";
import { useParams } from "next/navigation";

export default function CategoryChatPage() {
  const params = useParams();
  const slug = (params?.slug as string) || undefined;

  return <DecisionChat slug={slug} />;
}