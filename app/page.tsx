"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function Home() {
  const [types, setTypes] = useState([""]);
  const [mics, setMics] = useState([""]);
  const [filteredStocks, setFilteredStocks] = useState<any[]>([]);
  const [filteredCount, setFilteredCount] = useState<number | null>(null);

  const handleAddType = () => {
    setTypes([...types, ""]);
  };

  const handleAddMic = () => {
    setMics([...mics, ""]);
  };

  const handleTypeChange = (index: number, value: string) => {
    const newTypes = [...types];
    newTypes[index] = value;
    setTypes(newTypes);
  };

  const handleMicChange = (index: number, value: string) => {
    const newMics = [...mics];
    newMics[index] = value;
    setMics(newMics);
  };

  const handleRunFilter = async () => {
    const response = await fetch("/api/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        types: types.filter((t) => t),
        mics: mics.filter((m) => m),
      }),
    });

    const data = await response.json();
    setFilteredStocks(data);
    setFilteredCount(data.length);
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(filteredStocks, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_stocks.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Stock Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              {types.map((type, index) => (
                <div key={`type-${index}`} className="flex items-center gap-2">
                  <Input
                    value={type}
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                    placeholder="e.g., Common Stock"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddType}
                className="mt-2"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Type
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">MIC</label>
              {mics.map((mic, index) => (
                <div key={`mic-${index}`} className="flex items-center gap-2">
                  <Input
                    value={mic}
                    onChange={(e) => handleMicChange(index, e.target.value)}
                    placeholder="e.g., XNYS"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddMic}
                className="mt-2"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add MIC
              </Button>
            </div>

            <Button onClick={handleRunFilter} className="w-full">
              Run Filter
            </Button>

            {filteredCount !== null && (
              <div className="text-center text-sm text-gray-500">
                <p>{filteredCount} stocks filtered.</p>
                {filteredCount > 0 && (
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    className="mt-4"
                  >
                    Download JSON
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}