import { useState } from "react";
import { TagPerformanceChart } from "../components/analytics/TagPerformanceChart";
import { TagAssignmentPanel } from "../components/tags/TagAssignmentPanel";
import { TagDimensionManager } from "../components/tags/TagDimensionManager";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export const TagDemo = () => {
  const [selectedMediaId, setSelectedMediaId] = useState<string>("demo-media-1");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Enhanced Content Tagging System</h1>
        <p className="text-gray-600">
          Multi-dimensional tagging system for content organization and analytics
        </p>
      </div>

      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="management">Tag Management</TabsTrigger>
          <TabsTrigger value="assignment">Tag Assignment</TabsTrigger>
          <TabsTrigger value="analytics">Tag Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dimension & Tag Management</CardTitle>
              <CardDescription>
                Create and manage tag dimensions and their associated tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagDimensionManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tag Assignment Demo</CardTitle>
              <CardDescription>
                Assign tags to media content across different dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Demo Media ID:</label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedMediaId === "demo-media-1" ? "default" : "outline"}
                    onClick={() => setSelectedMediaId("demo-media-1")}
                  >
                    Media 1
                  </Button>
                  <Button
                    variant={selectedMediaId === "demo-media-2" ? "default" : "outline"}
                    onClick={() => setSelectedMediaId("demo-media-2")}
                  >
                    Media 2
                  </Button>
                  <Button
                    variant={selectedMediaId === "demo-media-3" ? "default" : "outline"}
                    onClick={() => setSelectedMediaId("demo-media-3")}
                  >
                    Media 3
                  </Button>
                </div>
              </div>
              <TagAssignmentPanel mediaId={selectedMediaId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tag Performance Analytics</CardTitle>
              <CardDescription>Analyze tag performance and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <TagPerformanceChart />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✅ Multi-dimensional tag classification</li>
                  <li>✅ Hierarchical tag relationships</li>
                  <li>✅ Performance analytics integration</li>
                  <li>✅ Tag correlation analysis</li>
                  <li>✅ Confidence scoring</li>
                  <li>✅ Audit trail for tag assignments</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Content Theme:</strong> Lingerie, Yoga, Cosplay, etc.
                  </li>
                  <li>
                    <strong>Content Modality:</strong> Thirst Trap, Tease, TikTok Style, etc.
                  </li>
                  <li>
                    <strong>Timing & Pacing:</strong> Slow Build, Quick Reveal, etc.
                  </li>
                  <li>
                    <strong>Explicitness Level:</strong> SFW, Suggestive, Explicit, etc.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
