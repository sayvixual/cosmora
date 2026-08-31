import React from "react";
import { notFound } from "next/navigation";
import { getDestinationBySlug } from "@/lib/data/mock/destinations";
import { DestinationHero } from "@/features/destinations/components/DestinationHero";
import { DestinationInfo } from "@/features/destinations/components/DestinationInfo";
import { ActivityList } from "@/features/destinations/components/ActivityList";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DestinationDetailPage({ params }: DestinationPageProps) {
  const resolvedParams = await params;
  const destination = getDestinationBySlug(resolvedParams.slug);

  if (!destination) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <DestinationHero destination={destination} />
      
      <main className="container mx-auto px-6 lg:px-12">
        <DestinationInfo destination={destination} />
        <ActivityList activities={destination.activities} />
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: DestinationPageProps) {
  const resolvedParams = await params;
  const destination = getDestinationBySlug(resolvedParams.slug);
  
  if (!destination) {
    return { title: "Destination Not Found" };
  }

  return {
    title: `${destination.name} | COSMORA Destinations`,
    description: destination.description,
  };
}
