"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Tree } from "@phosphor-icons/react";
import SourcesSection from "@/components/sources-section";
import ChaptersSection from "@/components/chapters-section";

export default function AttributesManagement() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="sources" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Surse
          </TabsTrigger>
          <TabsTrigger value="chapters" className="flex items-center gap-2">
            <Tree className="h-4 w-4" />
            Capitole
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sources" className="space-y-6">
          <SourcesSection />
        </TabsContent>
        <TabsContent value="chapters" className="space-y-6">
          <ChaptersSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
